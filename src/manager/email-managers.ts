import {emailAdapter} from "../adapter/email-adapter";
import {UserAccountType} from "../types/user-types";

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
        const subject = "password recovery";
        const message: string = `PR`;
        return await emailAdapter.sendEmail(user.accountData.email, subject, message);
    }
}