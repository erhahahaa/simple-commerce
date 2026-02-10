import {
	BaseMail,
	BaseMailBody,
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

interface PasswordResetConfirmationProps {
	/**
	 * The user's name to personalize the email
	 */
	name?: string;
}

export default function PasswordResetConfirmation({
	name,
}: PasswordResetConfirmationProps) {
	const previewText = "Your Simple Commerce password has been reset";

	return (
		<BaseMail preview={previewText}>
			<BaseMailHead>
				<title>Password Reset Successful</title>
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
						<BaseMailTitle as="h2">Password Reset Successful</BaseMailTitle>

						<BaseMailText>{name ? `Hi ${name},` : "Hi there,"}</BaseMailText>

						<BaseMailText>
							Your password for your Simple Commerce account has been
							successfully reset. You can now sign in with your new password.
						</BaseMailText>

						{/* Success indicator */}
						<BaseMailCenter
							style={{
								padding: `${spacing[6]} 0`,
							}}
						>
							<BaseMailText
								style={{
									display: "inline-block",
									backgroundColor: "#dcfce7",
									color: "#166534",
									padding: `${spacing[4]} ${spacing[6]}`,
									borderRadius: "8px",
									fontWeight: 600,
									fontSize: "16px",
									margin: 0,
								}}
							>
								Password Updated Successfully
							</BaseMailText>
						</BaseMailCenter>

						<BaseMailText>
							<strong>Didn't make this change?</strong> If you did not reset
							your password, please contact our support team immediately. Your
							account may have been compromised.
						</BaseMailText>

						<BaseMailDivider />

						{/* Security tips */}
						<BaseMailText
							style={{
								fontWeight: 600,
								color: colors.textPrimary,
								marginBottom: spacing[2],
							}}
						>
							Security Tips:
						</BaseMailText>
						<BaseMailText muted>
							- Use a unique password that you don't use for other accounts
							<br />- Never share your password with anyone
							<br />- Enable two-factor authentication for added security
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
							If you have any questions or concerns, contact us at{" "}
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
						This is an automated security notification. Simple Commerce will
						never ask for your password via email. If you receive suspicious
						emails claiming to be from us, please report them.
					</BaseMailText>
				</BaseMailCenter>
			</BaseMailBody>
		</BaseMail>
	);
}
