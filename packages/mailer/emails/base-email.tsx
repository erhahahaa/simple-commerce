import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

// ============================================================================
// Design Tokens - Matching React Native App Theme
// ============================================================================

/**
 * Color palette matching the native app theme
 * Based on the gradient-background.tsx and app styling
 */
export const colors = {
	// Primary accent color (blue-500)
	primary: "#3b82f6",
	primaryHover: "#2563eb",
	primaryLight: "#eff6ff",

	// Header colors (dark theme gradient tones)
	headerBg: "#1a1a2e",
	headerText: "#ffffff",
	headerTextMuted: "rgba(255, 255, 255, 0.7)",

	// Body and container
	bodyBg: "#f9fafb",
	containerBg: "#ffffff",

	// Footer
	footerBg: "#f3f4f6",

	// Text colors
	textPrimary: "#111827",
	textSecondary: "#374151",
	textMuted: "#6b7280",
	textLight: "#9ca3af",

	// Borders and dividers
	border: "#e5e7eb",
	borderLight: "#f3f4f6",

	// Status colors
	success: "#10b981",
	warning: "#f59e0b",
	danger: "#ef4444",

	// Misc
	white: "#ffffff",
	black: "#000000",
} as const;

/**
 * Typography settings with system font stack for maximum email client compatibility
 */
export const typography = {
	fontFamily:
		"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
	monoFontFamily:
		"ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",

	// Font sizes
	xs: "12px",
	sm: "14px",
	base: "16px",
	lg: "18px",
	xl: "20px",
	"2xl": "24px",
	"3xl": "30px",
	"4xl": "36px",

	// Line heights
	lineHeightTight: "1.25",
	lineHeightNormal: "1.5",
	lineHeightRelaxed: "1.625",

	// Font weights
	normal: "400",
	medium: "500",
	semibold: "600",
	bold: "700",
} as const;

/**
 * Spacing scale (in pixels)
 */
export const spacing = {
	0: "0",
	1: "4px",
	2: "8px",
	3: "12px",
	4: "16px",
	5: "20px",
	6: "24px",
	8: "32px",
	10: "40px",
	12: "48px",
	16: "64px",
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
	none: "0",
	sm: "4px",
	md: "8px",
	lg: "12px",
	xl: "16px",
	full: "9999px",
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Merges multiple style objects, with later styles overriding earlier ones
 */
function mergeStyles(
	...styles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
	return styles.reduce<React.CSSProperties>((acc, style) => {
		if (style) {
			Object.assign(acc, style);
		}
		return acc;
	}, {});
}

// ============================================================================
// Base Mail Context
// ============================================================================

interface BaseMailContextValue {
	preview?: string;
}

const BaseMailContext = React.createContext<BaseMailContextValue>({});

// ============================================================================
// Base Mail Root
// ============================================================================

interface BaseMailProps {
	children: React.ReactNode;
	preview?: string;
	lang?: string;
}

export function BaseMail({ children, preview, lang = "en" }: BaseMailProps) {
	return (
		<BaseMailContext.Provider value={{ preview }}>
			<Html lang={lang}>{children}</Html>
		</BaseMailContext.Provider>
	);
}

// ============================================================================
// Base Mail Head
// ============================================================================

interface BaseMailHeadProps {
	children?: React.ReactNode;
}

export function BaseMailHead({ children }: BaseMailHeadProps) {
	const { preview } = React.useContext(BaseMailContext);

	return (
		<>
			<Head>{children}</Head>
			{preview && <Preview>{preview}</Preview>}
		</>
	);
}

// ============================================================================
// Base Mail Body
// ============================================================================

interface BaseMailBodyProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailBodyStyles: React.CSSProperties = {
	backgroundColor: colors.bodyBg,
	fontFamily: typography.fontFamily,
	margin: 0,
	padding: 0,
	WebkitFontSmoothing: "antialiased",
	MozOsxFontSmoothing: "grayscale",
};

export function BaseMailBody({ children, style }: BaseMailBodyProps) {
	return <Body style={mergeStyles(baseMailBodyStyles, style)}>{children}</Body>;
}

// ============================================================================
// Base Mail Container
// ============================================================================

interface BaseMailContainerProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailContainerStyles: React.CSSProperties = {
	margin: "32px auto",
	maxWidth: "600px",
	backgroundColor: colors.containerBg,
	borderRadius: borderRadius.lg,
	overflow: "hidden",
	boxShadow:
		"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
};

export function BaseMailContainer({ children, style }: BaseMailContainerProps) {
	return (
		<Container style={mergeStyles(baseMailContainerStyles, style)}>
			{children}
		</Container>
	);
}

// ============================================================================
// Base Mail Header
// ============================================================================

interface BaseMailHeaderProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailHeaderStyles: React.CSSProperties = {
	backgroundColor: colors.headerBg,
	padding: `${spacing[6]} ${spacing[8]}`,
	textAlign: "center" as const,
};

export function BaseMailHeader({ children, style }: BaseMailHeaderProps) {
	return (
		<Section style={mergeStyles(baseMailHeaderStyles, style)}>
			{children}
		</Section>
	);
}

// ============================================================================
// Base Mail Content
// ============================================================================

interface BaseMailContentProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailContentStyles: React.CSSProperties = {
	padding: `${spacing[6]} ${spacing[8]}`,
};

export function BaseMailContent({ children, style }: BaseMailContentProps) {
	return (
		<Section style={mergeStyles(baseMailContentStyles, style)}>
			{children}
		</Section>
	);
}

// ============================================================================
// Base Mail Footer
// ============================================================================

interface BaseMailFooterProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailFooterStyles: React.CSSProperties = {
	backgroundColor: colors.footerBg,
	padding: `${spacing[6]} ${spacing[8]}`,
	textAlign: "center" as const,
};

export function BaseMailFooter({ children, style }: BaseMailFooterProps) {
	return (
		<Section style={mergeStyles(baseMailFooterStyles, style)}>
			{children}
		</Section>
	);
}

// ============================================================================
// Base Mail Title
// ============================================================================

interface BaseMailTitleProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
	as?: "h1" | "h2" | "h3";
}

const titleStyles: Record<"h1" | "h2" | "h3", React.CSSProperties> = {
	h1: {
		fontSize: typography["3xl"],
		fontWeight: typography.bold,
		color: colors.textPrimary,
		margin: `0 0 ${spacing[4]} 0`,
		lineHeight: typography.lineHeightTight,
	},
	h2: {
		fontSize: typography["2xl"],
		fontWeight: typography.bold,
		color: colors.textPrimary,
		margin: `0 0 ${spacing[3]} 0`,
		lineHeight: typography.lineHeightTight,
	},
	h3: {
		fontSize: typography.xl,
		fontWeight: typography.semibold,
		color: colors.textPrimary,
		margin: `0 0 ${spacing[2]} 0`,
		lineHeight: typography.lineHeightTight,
	},
};

export function BaseMailTitle({
	children,
	style,
	as = "h1",
}: BaseMailTitleProps) {
	return (
		<Heading as={as} style={mergeStyles(titleStyles[as], style)}>
			{children}
		</Heading>
	);
}

// ============================================================================
// Base Mail Text
// ============================================================================

interface BaseMailTextProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
	muted?: boolean;
}

const baseMailTextStyles: React.CSSProperties = {
	fontSize: typography.base,
	color: colors.textSecondary,
	lineHeight: typography.lineHeightRelaxed,
	margin: `0 0 ${spacing[4]} 0`,
};

const baseMailTextMutedStyles: React.CSSProperties = {
	...baseMailTextStyles,
	fontSize: typography.sm,
	color: colors.textMuted,
};

export function BaseMailText({ children, style, muted }: BaseMailTextProps) {
	const defaultStyles = muted ? baseMailTextMutedStyles : baseMailTextStyles;
	return <Text style={mergeStyles(defaultStyles, style)}>{children}</Text>;
}

// ============================================================================
// Base Mail Button
// ============================================================================

interface BaseMailButtonProps {
	children: React.ReactNode;
	href: string;
	style?: React.CSSProperties;
	variant?: "primary" | "secondary" | "outline";
}

const buttonBaseStyles: React.CSSProperties = {
	display: "inline-block",
	padding: `${spacing[3]} ${spacing[6]}`,
	fontSize: typography.base,
	fontWeight: typography.semibold,
	textDecoration: "none",
	textAlign: "center" as const,
	borderRadius: borderRadius.md,
	cursor: "pointer",
};

const buttonVariantStyles: Record<
	"primary" | "secondary" | "outline",
	React.CSSProperties
> = {
	primary: {
		backgroundColor: colors.primary,
		color: colors.white,
		border: "none",
	},
	secondary: {
		backgroundColor: colors.textMuted,
		color: colors.white,
		border: "none",
	},
	outline: {
		backgroundColor: colors.white,
		color: colors.primary,
		border: `2px solid ${colors.primary}`,
	},
};

export function BaseMailButton({
	children,
	href,
	style,
	variant = "primary",
}: BaseMailButtonProps) {
	return (
		<Button
			href={href}
			style={mergeStyles(buttonBaseStyles, buttonVariantStyles[variant], style)}
		>
			{children}
		</Button>
	);
}

// ============================================================================
// Base Mail Link
// ============================================================================

interface BaseMailLinkProps {
	children: React.ReactNode;
	href: string;
	style?: React.CSSProperties;
}

const baseMailLinkStyles: React.CSSProperties = {
	color: colors.primary,
	textDecoration: "underline",
};

export function BaseMailLink({ children, href, style }: BaseMailLinkProps) {
	return (
		<Link href={href} style={mergeStyles(baseMailLinkStyles, style)}>
			{children}
		</Link>
	);
}

// ============================================================================
// Base Mail Image
// ============================================================================

interface BaseMailImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	style?: React.CSSProperties;
}

const baseMailImageStyles: React.CSSProperties = {
	maxWidth: "100%",
	height: "auto",
	display: "block",
};

export function BaseMailImage({
	src,
	alt,
	width,
	height,
	style,
}: BaseMailImageProps) {
	return (
		<Img
			src={src}
			alt={alt}
			width={width}
			height={height}
			style={mergeStyles(baseMailImageStyles, style)}
		/>
	);
}

// ============================================================================
// Base Mail Divider
// ============================================================================

interface BaseMailDividerProps {
	style?: React.CSSProperties;
}

const baseMailDividerStyles: React.CSSProperties = {
	margin: `${spacing[6]} 0`,
	borderTop: `1px solid ${colors.border}`,
	borderBottom: "none",
	borderLeft: "none",
	borderRight: "none",
};

export function BaseMailDivider({ style }: BaseMailDividerProps) {
	return <Hr style={mergeStyles(baseMailDividerStyles, style)} />;
}

// ============================================================================
// Base Mail Section
// ============================================================================

interface BaseMailSectionProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export function BaseMailSection({ children, style }: BaseMailSectionProps) {
	return <Section style={style}>{children}</Section>;
}

// ============================================================================
// Base Mail Row
// ============================================================================

interface BaseMailRowProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export function BaseMailRow({ children, style }: BaseMailRowProps) {
	return <Row style={style}>{children}</Row>;
}

// ============================================================================
// Base Mail Column
// ============================================================================

interface BaseMailColumnProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export function BaseMailColumn({ children, style }: BaseMailColumnProps) {
	return <Column style={style}>{children}</Column>;
}

// ============================================================================
// Additional Utility Components
// ============================================================================

/**
 * Centered text wrapper for headers and footers
 */
interface BaseMailCenterProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailCenterStyles: React.CSSProperties = {
	textAlign: "center" as const,
};

export function BaseMailCenter({ children, style }: BaseMailCenterProps) {
	return (
		<Section style={mergeStyles(baseMailCenterStyles, style)}>
			{children}
		</Section>
	);
}

/**
 * Code/monospace text for things like verification codes
 */
interface BaseMailCodeProps {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

const baseMailCodeStyles: React.CSSProperties = {
	fontFamily: typography.monoFontFamily,
	fontSize: typography["2xl"],
	fontWeight: typography.bold,
	letterSpacing: "4px",
	backgroundColor: colors.footerBg,
	padding: `${spacing[4]} ${spacing[6]}`,
	borderRadius: borderRadius.md,
	display: "inline-block",
	color: colors.textPrimary,
};

export function BaseMailCode({ children, style }: BaseMailCodeProps) {
	return <Text style={mergeStyles(baseMailCodeStyles, style)}>{children}</Text>;
}

/**
 * Logo component with standardized styling
 */
interface BaseMailLogoProps {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
	style?: React.CSSProperties;
}

const baseMailLogoStyles: React.CSSProperties = {
	margin: "0 auto",
	display: "block",
};

export function BaseMailLogo({
	src,
	alt = "Logo",
	width = 120,
	height,
	style,
}: BaseMailLogoProps) {
	return (
		<Img
			src={src}
			alt={alt}
			width={width}
			height={height}
			style={mergeStyles(baseMailLogoStyles, style)}
		/>
	);
}
