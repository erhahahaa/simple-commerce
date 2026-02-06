import {
	BaseMail,
	BaseMailBody,
	BaseMailButton,
	BaseMailCenter,
	BaseMailContainer,
	BaseMailContent,
	BaseMailDivider,
	BaseMailFooter,
	BaseMailHead,
	BaseMailHeader,
	BaseMailLink,
	BaseMailText,
	BaseMailTitle,
	colors,
	spacing,
} from "./base-email";

interface ResetPasswordProps {
	/**
	 * The user's name to personalize the email
	 */
	name?: string;
	/**
	 * The password reset link
	 */
	resetLink: string;
	/**
	 * How long the reset link is valid for (e.g., "1 hour", "24 hours")
	 * @default "1 hour"
	 */
	expiresIn?: string;
}

export default function ResetPassword({
	name,
	resetLink = "https://example.com/reset-password?token=xxx",
	expiresIn = "1 hour",
}: ResetPasswordProps) {
	const previewText = "Reset your Simple Commerce password";

	return (
		<BaseMail preview={previewText}>
			<BaseMailHead>
				<title>Reset Your Password</title>
			</BaseMailHead>
			<BaseMailBody>
				<BaseMailContainer>
					{/* Header */}
					<BaseMailHeader>
						<BaseMailTitle
							style={{
								color: colors.headerText,
								margin: 0,
								fontSize: "24px",
							}}
						>
							Simple Commerce
						</BaseMailTitle>
					</BaseMailHeader>

					{/* Content */}
					<BaseMailContent>
						<BaseMailTitle as="h2">Reset Your Password</BaseMailTitle>

						<BaseMailText>{name ? `Hi ${name},` : "Hi there,"}</BaseMailText>

						<BaseMailText>
							We received a request to reset the password for your Simple
							Commerce account. Click the button below to create a new password:
						</BaseMailText>

						{/* CTA Button */}
						<BaseMailCenter
							style={{
								padding: `${spacing[6]} 0`,
							}}
						>
							<BaseMailButton href={resetLink}>Reset Password</BaseMailButton>
						</BaseMailCenter>

						<BaseMailText>
							This link will expire in{" "}
							<strong style={{ color: colors.textPrimary }}>{expiresIn}</strong>
							. If you didn't request a password reset, you can safely ignore
							this email. Your password will remain unchanged.
						</BaseMailText>

						<BaseMailText>
							<strong>Note:</strong> This password reset link is intended for
							use with the Simple Commerce mobile app. If you're using a desktop
							or laptop, please use the mobile device to open the link.
						</BaseMailText>

						<BaseMailDivider />

						{/* Fallback link */}
						<BaseMailText muted>
							If the button above doesn't work, copy and paste this link into
							your browser:
						</BaseMailText>
						<BaseMailText
							style={{
								wordBreak: "break-all",
								fontSize: "14px",
								color: colors.primary,
								backgroundColor: colors.footerBg,
								padding: spacing[3],
								borderRadius: "4px",
							}}
						>
							{resetLink}
						</BaseMailText>
					</BaseMailContent>

					{/* Footer */}
					<BaseMailFooter>
						<BaseMailText
							muted
							style={{
								margin: 0,
								marginBottom: spacing[2],
							}}
						>
							This email was sent by Simple Commerce.
						</BaseMailText>
						<BaseMailText
							muted
							style={{
								margin: 0,
							}}
						>
							If you have any questions, contact us at{" "}
							<BaseMailLink href="mailto:support@simplecommerce.com">
								support@simplecommerce.com
							</BaseMailLink>
						</BaseMailText>
					</BaseMailFooter>
				</BaseMailContainer>

				{/* Security notice outside container */}
				<BaseMailCenter
					style={{
						padding: `${spacing[4]} ${spacing[8]}`,
						maxWidth: "600px",
						margin: "0 auto",
					}}
				>
					<BaseMailText
						muted
						style={{
							fontSize: "12px",
							margin: 0,
						}}
					>
						For security reasons, this password reset link will expire in{" "}
						{expiresIn}. Never share this link with anyone. Simple Commerce will
						never ask for your password via email.
					</BaseMailText>
				</BaseMailCenter>
			</BaseMailBody>
		</BaseMail>
	);
}
