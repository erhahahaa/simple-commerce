import { env } from "@simple-commerce/env/server";
import { Resend } from "resend";
import ResetPasswordEmail from "../emails/reset-password";

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

interface Mailer {
	send: (props: SendMailProps) => Promise<void>;
	sendResetPasswordEmail: (props: SendResetPasswordEmailProps) => Promise<void>;
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

	return {
		send,
		sendResetPasswordEmail,
	};
}

export const mailer = createMailer();
