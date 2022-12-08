import {UserAccountType} from "../types/userTypes";
import {emailAdapter} from "../adapter/emailAdapter";

export const emailManager = {
    async sendEmailConfirmationMessage(user: UserAccountType) {
        const subject = "Email Confirmation";
        const code = user.emailConfirmation.confirmationCode;

        const message: string = `
            <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
            </p>`;
        return await emailAdapter.sendEmail(user.accountData.email, subject, message);
    },
    async sendPasswordRecoveryMessage(user: UserAccountType) {
        const subject = "Password recovery";
        const message: string = `
           <h1>Password recovery</h1>
           <p>To finish password recovery please follow the link below:
              <a href='https://somesite.com/password-recovery?recoveryCode=${user.passwordRecovery.recoveryCode}'>recovery password</a>
          </p>`;
        return await emailAdapter.sendEmail(user.accountData.email, subject, message);
    }
}