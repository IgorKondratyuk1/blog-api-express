import mongoose, {Model} from "mongoose";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns";
import {HydratedUser, PasswordRecoveryType, UserAccountDbMethodsType, UserAccountDbType} from "./UserTypes";
import {passwordRecoverySchema} from "./PasswordRecoverySchema";
import {emailConfirmationSchema} from "./EmailConfirmationSchema";
import {accountSchema} from "./AccountSchema";
import bcrypt from "bcrypt";

type UserModel = Model<UserAccountDbType, {}, UserAccountDbMethodsType> & {
    createInstance(login: string, email: string, passwordHash: string, isConfirmed: boolean): Promise<HydratedUser>,
    generatePasswordHash(password: string): Promise<string>
}

export const userSchema = new mongoose.Schema<UserAccountDbType, UserModel, UserAccountDbMethodsType>({
    id: { type: String },
    accountData: { type: accountSchema },
    emailConfirmation: { type: emailConfirmationSchema },
    passwordRecovery: { type: passwordRecoverySchema },
    createdAt: Date,
    updatedAt: Date
},{timestamps: true, optimisticConcurrency: true});

// Methods
userSchema.method("canBeConfirmed", function canBeConfirmed(code: string) {
    const user = this as UserAccountDbType & UserAccountDbMethodsType;
    return user.emailConfirmation.confirmationCode === code && new Date(this.emailConfirmation.expirationDate) > new Date();
});

userSchema.method("confirm", function confirm(code: string) {
    const user = this as UserAccountDbType & UserAccountDbMethodsType;
    if (user.emailConfirmation.isConfirmed) throw new Error("User is already confirmed");
    if (user.canBeConfirmed(code)) user.emailConfirmation.isConfirmed = true;
});

userSchema.method("isPasswordCorrect", async function isPasswordCorrect(password: string) {
    const user = this as UserAccountDbType & UserAccountDbMethodsType;
    return await bcrypt.compare(password, user.accountData.passwordHash);
});

userSchema.method("setEmailConfirmationCode", function setEmailConfirmationCode(code: string) {
    const user = this as UserAccountDbType & UserAccountDbMethodsType;
    if (user.emailConfirmation.isConfirmed) throw new Error("Can not set new confirmation code, if code was confirmed");
    user.emailConfirmation.confirmationCode = code;
});

userSchema.method("setPassword", async function setPassword(newPassword: string): Promise<void> {
    const user = this as UserAccountDbType & UserAccountDbMethodsType;

    if (user.passwordRecovery && user.passwordRecovery.isUsed) throw new Error("Password recovery object is not created or already used");
    if (!user.passwordRecovery?.expirationDate || new Date(user.passwordRecovery.expirationDate) < new Date()) throw new Error("Password recovery date have expired or not created");

    const newPasswordHash: string = await User.generatePasswordHash(newPassword);
    user.accountData.passwordHash = newPasswordHash;
});

userSchema.method("createNewPasswordRecoveryCode", async function createNewPasswordRecoveryCode() {
    const user = this as UserAccountDbType & UserAccountDbMethodsType;
    const recoveryData: PasswordRecoveryType = {
        recoveryCode: uuidv4(),
        expirationDate: add(new Date(), {
            hours: 1
        }).toISOString(),
        isUsed: false
    };

    user.passwordRecovery = recoveryData;
});

// Static
userSchema.static("generatePasswordHash", async function generatePasswordHash(password: string) {
    const passwordSalt: string = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, passwordSalt);
});

userSchema.static('createInstance', async function createInstance(login: string, email: string, password: string, isConfirmed: boolean = false) {
    const passwordHash: string = await this.generatePasswordHash(password);

    const newUser = new User({
        id: uuidv4(),
        accountData: {
            login,
            email,
            passwordHash,
            createdAt: (new Date()).toISOString()
        },
        emailConfirmation: {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1
            }).toISOString(),
            isConfirmed: isConfirmed
        },
        passwordRecovery: {}
    });

    return this.create(newUser);
});

export const User = mongoose.model<UserAccountDbType, UserModel>('User', userSchema);