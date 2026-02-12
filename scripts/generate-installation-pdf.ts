#!/usr/bin/env bun
/**
 * Generate PDF from installation/setup documentation
 * Combines all getting-started guides into one PDF
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mdToPdf } from "md-to-pdf";

const docsDir = "./docs";
const outputPath = "./simple-commerce-installation-guide.pdf";

// Installation guide files in order
const installationFiles = [
	{ id: "01-prerequisites", title: "Prerequisites" },
	{ id: "02-installation", title: "Installation" },
	{ id: "03-environment-setup", title: "Environment Setup" },
	{ id: "04-database-setup", title: "Database Setup" },
	{ id: "05-running-locally", title: "Running Locally" },
	{ id: "06-mobile-app-setup", title: "Mobile App Setup" },
];

let combinedMarkdown = `# Simple Commerce Installation Guide

> Complete setup and installation guide for Simple Commerce

---

## Table of Contents

`;

// Add TOC
for (const file of installationFiles) {
	combinedMarkdown += `* ${file.title}\n`;
}

combinedMarkdown += "\n---\n\n";

// Process files in order
for (const fileInfo of installationFiles) {
	const filePath = join(docsDir, "02-getting-started", `${fileInfo.id}.md`);
	try {
		const content = readFileSync(filePath, "utf-8");
		combinedMarkdown += `\n\n${content}\n\n---\n\n`;
		console.log(`✓ Added: ${fileInfo.id}.md`);
	} catch (err) {
		console.warn(`✗ Missing: ${filePath}`, err);
	}
}

// Write temporary combined markdown
const tempMdPath = "./.temp-installation-docs.md";
writeFileSync(tempMdPath, combinedMarkdown);

console.log("\nGenerating PDF...");

// Convert to PDF
try {
	await mdToPdf(
		{ path: tempMdPath },
		{
			dest: outputPath,
			launch_options: {
				executablePath: "/usr/bin/chromium",
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			},
			pdf_options: {
				format: "A4",
				margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
				printBackground: true,
				headerTemplate: `<div style="font-size: 9px; margin-left: 20px; width: 100%;">Simple Commerce - Installation Guide</div>`,
				footerTemplate: `<div style="font-size: 9px; margin-left: 20px; width: 100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
			},
		},
	);

	console.log("\n✅ Installation guide PDF generated successfully!");
	console.log(`📄 Output: ${outputPath}`);
	console.log("\nTo regenerate: bun run docs:pdf:install");

	// cleanup temporary file
	if (await Bun.file(tempMdPath).exists()) {
		Bun.file(tempMdPath).delete();
	}
} catch (error) {
	console.error("\n❌ Error generating PDF:", error);
	process.exit(1);
}
