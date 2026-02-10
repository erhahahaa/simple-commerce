import { env } from "@simple-commerce/env/server";
import { Resend } from "resend";
import PasswordResetConfirmationEmail from "../emails/password-reset-confirmation";
import ResetPasswordEmail from "../emails/reset-password";
import VerifyEmailTemplate from "../emails/verify-email";

interface SendMailProps {
	from: string;
	to: string;
	subject: string;
	html?: string;
	text?: string;
	react?: React.ReactNode;
}

interface SendResetPasswordEmailProps {
	to: string;
	name?: string;
	token: string;
	expiresIn?: string;
}

interface SendPasswordResetConfirmationProps {
	to: string;
	name?: string;
}

interface SendVerificationEmailProps {
	to: string;
	name?: string;
	token: string;
}

interface Mailer {
	send: (props: SendMailProps) => Promise<void>;
	sendResetPasswordEmail: (props: SendResetPasswordEmailProps) => Promise<void>;
	sendPasswordResetConfirmation: (
		props: SendPasswordResetConfirmationProps,
	) => Promise<void>;
	sendVerificationEmail: (props: SendVerificationEmailProps) => Promise<void>;
}

function createMailer(): Mailer {
	const client = new Resend(env.RESEND_API_KEY);

	async function send({ from, to, subject, html, react, text }: SendMailProps) {
		try {
			await client.emails.send({
				from,
				to,
				subject,
				html,
				react,
				text,
			});
		} catch (error) {
			console.error("Error sending email:", error);
			throw error;
		}
	}

	async function sendResetPasswordEmail({
		to,
		name,
		token,
		expiresIn,
	}: SendResetPasswordEmailProps) {
		const resetLink = `${env.BETTER_AUTH_URL}/app/reset-password?token=${token}`;
		const react = (
			<ResetPasswordEmail
				name={name}
				resetLink={resetLink}
				expiresIn={expiresIn}
			/>
		);

		await send({
			from: "[DEMO] Simple Commerce Reset Password <demo-sc-reset-password@info.zenta.dev>",
			to: to,
			subject: "Reset Your Password",
			react,
		});
	}

	async function sendPasswordResetConfirmation({
		to,
		name,
	}: SendPasswordResetConfirmationProps) {
		const react = <PasswordResetConfirmationEmail name={name} />;

		await send({
			from: "[DEMO] Simple Commerce <demo-sc-notifications@info.zenta.dev>",
			to: to,
			subject: "Your Password Has Been Reset",
			react,
		});
	}

	async function sendVerificationEmail({
		to,
		name,
		token,
	}: SendVerificationEmailProps) {
		const verificationLink = `${env.BETTER_AUTH_URL}/app/verify-email?token=${token}`;
		const react = (
			<VerifyEmailTemplate
				name={name}
				verificationLink={verificationLink}
				expiresIn="24 hours"
			/>
		);

		await send({
			from: "[DEMO] Simple Commerce <demo-sc-verification@info.zenta.dev>",
			to: to,
			subject: "Verify Your Email Address",
			react,
		});
	}

	return {
		send,
		sendResetPasswordEmail,
		sendPasswordResetConfirmation,
		sendVerificationEmail,
	};
}

export const mailer = createMailer();
