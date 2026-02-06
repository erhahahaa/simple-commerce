export const passwordRequirements = [
	{ regex: /.{8,}/, label: "At least 8 characters" },
	{ regex: /[A-Z]/, label: "One uppercase letter" },
	{ regex: /[a-z]/, label: "One lowercase letter" },
	{ regex: /[0-9]/, label: "One number" },
	{ regex: /[^A-Za-z0-9]/, label: "One special character" },
] as const;

export function validatePassword(password: string) {
	return passwordRequirements.filter((req) => req.regex.test(password));
}
