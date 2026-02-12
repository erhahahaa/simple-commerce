#!/usr/bin/env bun
/**
 * Generate PDF from all documentation files
 * Reads navigation.json to determine correct order
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mdToPdf } from "md-to-pdf";

const docsDir = "./docs";
const outputPath = "./simple-commerce-documentation.pdf";

// Read navigation.json to get file order
const navData = JSON.parse(
	readFileSync(join(docsDir, "navigation.json"), "utf-8"),
);

let combinedMarkdown = "# Simple Commerce Documentation\n\n---\n\n";

// Process files in order defined by navigation.json
for (const section of navData.sections) {
	// Add section header
	combinedMarkdown += `\n---\n\n# ${section.title}\n\n---\n\n`;

	for (const fileInfo of section.files) {
		const filePath = join(docsDir, section.id, `${fileInfo.id}.md`);
		try {
			const content = readFileSync(filePath, "utf-8");
			combinedMarkdown += `\n\n${content}\n\n---\n\n`;
			console.log(`✓ Added: ${section.id}/${fileInfo.id}.md`);
		} catch (err) {
			console.warn(`✗ Missing: ${filePath}`, err);
		}
	}
}

// Also add README.md at the beginning
const readmePath = join(docsDir, "README.md");
try {
	const readmeContent = readFileSync(readmePath, "utf-8");
	combinedMarkdown =
		"# Table of Contents\n\n* Simple Commerce Documentation Overview\n* Meta Documentation\n* Overview\n* Getting Started\n* Architecture\n* Database\n* API Reference\n* Mobile Screens\n* Integrations\n* Configuration\n* Development\n* Deployment\n* Guides\n\n---\n\n" +
		combinedMarkdown;
	console.log("✓ Added: README.md");
} catch (err) {
	console.warn("✗ Missing: README.md", err);
}

// Write temporary combined markdown
const tempMdPath = "./.temp-combined-docs.md";
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
				headerTemplate: `<div style="font-size: 9px; margin-left: 20px; width: 100%;">Simple Commerce Documentation</div>`,
				footerTemplate: `<div style="font-size: 9px; margin-left: 20px; width: 100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
			},
		},
	);

	console.log("\n✅ PDF generated successfully!");
	console.log(`📄 Output: ${outputPath}`);
	console.log("\nTo regenerate: bun run docs:pdf");

	// cleanup temporary file

	if (await Bun.file(tempMdPath).exists()) {
		Bun.file(tempMdPath).delete();
	}
} catch (error) {
	console.error("\n❌ Error generating PDF:", error);
	process.exit(1);
}
