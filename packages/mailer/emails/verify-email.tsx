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

interface VerifyEmailProps {
	/**
	 * The user's name to personalize the email
	 */
	name?: string;
	/**
	 * The email verification link
	 */
	verificationLink: string;
	/**
	 * How long the verification link is valid for (e.g., "24 hours")
	 * @default "24 hours"
	 */
	expiresIn?: string;
}

export default function VerifyEmail({
	name,
	verificationLink = "https://example.com/verify-email?token=xxx",
	expiresIn = "24 hours",
}: VerifyEmailProps) {
	const previewText = "Verify your Simple Commerce email address";

	return (
		<BaseMail preview={previewText}>
			<BaseMailHead>
				<title>Verify Your Email</title>
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
						<BaseMailTitle as="h2">Verify Your Email Address</BaseMailTitle>

						<BaseMailText>{name ? `Hi ${name},` : "Hi there,"}</BaseMailText>

						<BaseMailText>
							Thanks for signing up for Simple Commerce! Please verify your
							email address by clicking the button below:
						</BaseMailText>

						{/* CTA Button */}
						<BaseMailCenter
							style={{
								padding: `${spacing[6]} 0`,
							}}
						>
							<BaseMailButton href={verificationLink}>
								Verify Email Address
							</BaseMailButton>
						</BaseMailCenter>

						<BaseMailText>
							This link will expire in{" "}
							<strong style={{ color: colors.textPrimary }}>{expiresIn}</strong>
							. If you didn't create an account with Simple Commerce, you can
							safely ignore this email.
						</BaseMailText>

						<BaseMailText>
							<strong>Note:</strong> This verification link is intended for use
							with the Simple Commerce mobile app. If you're using a desktop or
							laptop, please use your mobile device to open the link.
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
							{verificationLink}
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
						For security reasons, this verification link will expire in{" "}
						{expiresIn}. Never share this link with anyone. Simple Commerce will
						never ask for your password via email.
					</BaseMailText>
				</BaseMailCenter>
			</BaseMailBody>
		</BaseMail>
	);
}
