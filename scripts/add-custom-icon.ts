#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { fileURLToPath } from "node:url";

import {
  CSR_PATH,
  SSR_PATH,
  DEFS_PATH,
  INDEX_PATH,
  WEIGHTS,
  AssetMap,
  readAssetsFromDisk,
} from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom assets path for user-added icons (not core submodule)
const CUSTOM_ASSETS_PATH = path.join(__dirname, "../src/assets");

interface ProcessedIcon {
  name: string;
  weight: string;
  svgContent: string;
  jsxContent: string;
}

const REQUIRED_WEIGHTS = [
  "regular",
  "thin",
  "light",
  "bold",
  "fill",
  "duotone",
];

// Simple argument parsing (avoiding commander dependency issues)
const args = process.argv.slice(2);
const options = {
  folder: "",
  icon: "",
  name: "",
  dryRun: false,
  overwrite: false,
  help: false,
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  // Handle --flag=value format
  if (arg.includes("=")) {
    const [flag, value] = arg.split("=", 2);
    switch (flag) {
      case "--folder":
      case "-f":
        options.folder = value || "";
        break;
      case "--icon":
      case "-i":
        options.icon = value || "";
        break;
      case "--name":
      case "-n":
        options.name = value || "";
        break;
    }
    continue;
  }

  // Handle --flag value format
  switch (arg) {
    case "--folder":
    case "-f":
      options.folder = args[++i] || "";
      break;
    case "--icon":
    case "-i":
      options.icon = args[++i] || "";
      break;
    case "--name":
    case "-n":
      options.name = args[++i] || "";
      break;
    case "--dry-run":
      options.dryRun = true;
      break;
    case "--overwrite":
      options.overwrite = true;
      break;
    case "--help":
    case "-h":
      options.help = true;
      break;
  }
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error.message);
  process.exit(1);
});

async function main() {
  if (options.help) {
    showHelp();
    return;
  }

  if (!options.folder && !options.icon) {
    console.error(chalk.red("Error: Please specify either --folder or --icon"));
    showHelp();
    return;
  }

  if (options.icon && !options.name) {
    console.error(chalk.red("Error: --name is required when using --icon"));
    process.exit(1);
  }

  console.log(chalk.blue("🎨 Adding custom icons to the library..."));

  // Get existing icons to avoid conflicts
  const existingIcons = readAssetsFromDisk();

  let customIcons: ProcessedIcon[] = [];

  if (options.folder) {
    customIcons = await processFolder(options.folder);
  } else if (options.icon) {
    customIcons = await processSingleFile(options.icon, options.name);
  }

  // Validate icons
  const validatedIcons = validateIcons(customIcons, existingIcons);

  if (validatedIcons.length === 0) {
    console.log(chalk.yellow("No valid icons to process."));
    return;
  }

  if (options.dryRun) {
    previewChanges(validatedIcons);
    return;
  }

  // Process icons
  await addIconsToLibrary(validatedIcons);

  console.log(chalk.green("✅ Custom icons added successfully!"));
  console.log(
    chalk.yellow("💡 Run 'npm run assemble' to generate React components.")
  );
}

function showHelp() {
  console.log(`
${chalk.blue("Add Custom Icons Script")}

Usage:
  tsx scripts/add-custom-icon.ts [options]
  npm run add-icon -- [options]
  npm run add-icon:preview -- [options]

Options:
  -f, --folder <path>    Path to folder containing SVG files
  -i, --icon <path>      Path to individual SVG file  
  -n, --name <name>      Custom name for the icon (required for single file)
  --dry-run             Preview changes without writing files
  --overwrite           Overwrite existing icons (use with caution)
  -h, --help            Show this help message

Argument Formats:
  --folder ./my-icons       (space-separated)
  --folder=./my-icons       (equals-separated)

${chalk.yellow("Special Naming Conventions:")}
  lm-3-squares.svg          → ThreeSquares
  lm-2-lines.svg            → TwoLines  
  3d-cube.svg               → ThreeDCube
  Numbers 0-20 are converted to words automatically.

${chalk.blue("Assets Storage:")}
  Custom icons are saved to src/assets/ (not core/assets)

Direct Script Examples:
  tsx scripts/add-custom-icon.ts --folder ./my-custom-icons
  tsx scripts/add-custom-icon.ts --folder=~/Downloads/icons
  tsx scripts/add-custom-icon.ts --icon ./star.svg --name custom-star

NPM Script Examples:
  npm run add-icon -- --folder ./my-custom-icons
  npm run add-icon -- --folder=~/Downloads/icons
  npm run add-icon:preview -- --folder ./my-icons
  npm run add-icon:preview -- --icon=./star.svg --name=custom-star

Note: When using npm scripts, use '--' to pass arguments to the script.
`);
}

async function processFolder(folderPath: string): Promise<ProcessedIcon[]> {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Folder not found: ${folderPath}`);
  }

  const files = fs.readdirSync(folderPath);
  const svgFiles = files.filter((file) => file.endsWith(".svg"));

  if (svgFiles.length === 0) {
    throw new Error("No SVG files found in the specified folder");
  }

  console.log(chalk.blue(`Found ${svgFiles.length} SVG files`));

  const processedIcons: ProcessedIcon[] = [];

  for (const file of svgFiles) {
    const filePath = path.join(folderPath, file);
    const { name, weight } = parseFileName(file);

    try {
      const svgContent = fs.readFileSync(filePath, "utf-8");
      const validatedSvg = await validateSvgContent(svgContent, name, weight);
      const jsxContent = transformSvgToJsx(validatedSvg);

      processedIcons.push({
        name,
        weight,
        svgContent: validatedSvg,
        jsxContent,
      });

      console.log(chalk.green(`✓ Processed ${file}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠ Skipped ${file}: ${error.message}`));
    }
  }

  return processedIcons;
}

async function processSingleFile(
  filePath: string,
  iconName: string
): Promise<ProcessedIcon[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  if (!filePath.endsWith(".svg")) {
    throw new Error("File must be an SVG");
  }

  const svgContent = fs.readFileSync(filePath, "utf-8");
  const weight = "regular"; // Default weight for single files

  const validatedSvg = await validateSvgContent(svgContent, iconName, weight);
  const jsxContent = transformSvgToJsx(validatedSvg);

  return [
    {
      name: iconName,
      weight,
      svgContent: validatedSvg,
      jsxContent,
    },
  ];
}

function parseFileName(filename: string): { name: string; weight: string } {
  const nameWithoutExt = filename.replace(".svg", "");
  const parts = nameWithoutExt.split("-");

  // Check if last part is a weight
  const lastPart = parts[parts.length - 1];
  if (REQUIRED_WEIGHTS.includes(lastPart)) {
    const iconName = parts.slice(0, -1).join("-");
    return {
      name: iconName,
      weight: lastPart,
    };
  }

  return {
    name: nameWithoutExt,
    weight: "regular",
  };
}

async function validateSvgContent(
  svgContent: string,
  iconName: string,
  weight: string
): Promise<string> {
  try {
    // Basic SVG validation
    if (!svgContent.includes("<svg") || !svgContent.includes("</svg>")) {
      throw new Error("Not a valid SVG file");
    }

    // Validate viewBox - use 24x24 for custom icons instead of 256x256
    const customViewBox = "0 0 24 24";
    const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
    if (!viewBoxMatch || viewBoxMatch[1] !== customViewBox) {
      console.log(
        chalk.yellow(
          `⚠ ${iconName}-${weight}: Adjusting viewBox to "${customViewBox}"`
        )
      );
      if (viewBoxMatch) {
        svgContent = svgContent.replace(
          /viewBox="[^"]*"/,
          `viewBox="${customViewBox}"`
        );
      } else {
        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          `<svg$1 viewBox="${customViewBox}">`
        );
      }
    }

    // Ensure currentColor is used
    if (!svgContent.includes("currentColor") && !svgContent.includes("#000")) {
      console.log(
        chalk.yellow(`⚠ ${iconName}-${weight}: Adding fill="currentColor"`)
      );
      svgContent = svgContent.replace(
        /<svg([^>]*)>/,
        '<svg$1 fill="currentColor">'
      );
    }

    return svgContent;
  } catch (error) {
    throw new Error(`Invalid SVG: ${error.message}`);
  }
}

function transformSvgToJsx(svgContent: string): string {
  return svgContent
    .replace(/^.*<\?xml.*?\>/g, "")
    .replace(/<svg.*?>/g, "")
    .replace(/<\/svg>/g, "")
    .replace(
      /<rect width="25[\d,\.]+" height="25[\d,\.]+" fill="none".*?\/>/g,
      ""
    )
    .replace(/<title.*?\/>/g, "")
    .replace(/"#0+"/g, "{color}")
    .replace(/currentColor/g, "{color}")
    .replace(/fill\-rule/g, "fillRule")
    .replace(/stroke-linecap/g, "strokeLinecap")
    .replace(/stroke-linejoin/g, "strokeLinejoin")
    .replace(/stroke-width/g, "strokeWidth")
    .replace(/stroke-miterlimit/g, "strokeMiterlimit");
}

function validateIcons(
  processedIcons: ProcessedIcon[],
  existingIcons: AssetMap
): ProcessedIcon[] {
  const iconGroups: Record<string, ProcessedIcon[]> = {};

  // Group by icon name
  processedIcons.forEach((icon) => {
    if (!iconGroups[icon.name]) {
      iconGroups[icon.name] = [];
    }
    iconGroups[icon.name].push(icon);
  });

  const validIcons: ProcessedIcon[] = [];

  Object.entries(iconGroups).forEach(([iconName, icons]) => {
    // Check if icon already exists
    if (existingIcons[iconName] && !options.overwrite) {
      console.log(
        chalk.yellow(
          `⚠ Skipping ${iconName}: already exists (use --overwrite to replace)`
        )
      );
      return;
    }

    const weights = icons.map((i) => i.weight);
    const missingWeights = REQUIRED_WEIGHTS.filter((w) => !weights.includes(w));

    if (missingWeights.length > 0 && weights.length > 1) {
      console.log(
        chalk.yellow(
          `⚠ ${iconName}: Missing weights: ${missingWeights.join(", ")}`
        )
      );
      console.log(
        chalk.blue(`💡 Will create placeholder weights for missing variants`)
      );
    }

    validIcons.push(...icons);
  });

  return validIcons;
}

function previewChanges(icons: ProcessedIcon[]) {
  console.log(chalk.blue("\n📋 Preview of changes:"));

  const iconGroups: Record<string, string[]> = {};
  icons.forEach((icon) => {
    if (!iconGroups[icon.name]) {
      iconGroups[icon.name] = [];
    }
    iconGroups[icon.name].push(icon.weight);
  });

  Object.entries(iconGroups).forEach(([name, weights]) => {
    console.log(chalk.green(`  ✓ ${name} (${weights.join(", ")})`));
  });

  console.log(chalk.blue("\nFiles that would be created:"));
  Object.keys(iconGroups).forEach((name) => {
    const pascalName = pascalize(name);
    console.log(`  📁 src/assets/{weight}/${name}-{weight}.svg`);
    console.log(`  📄 src/defs/${pascalName}.tsx`);
    console.log(`  📄 src/csr/${pascalName}.tsx`);
    console.log(`  📄 src/ssr/${pascalName}.tsx`);
  });
}

async function addIconsToLibrary(icons: ProcessedIcon[]) {
  console.log(chalk.blue("📁 Adding SVG assets to src/assets..."));

  // Group icons by name
  const iconGroups: Record<string, ProcessedIcon[]> = {};
  icons.forEach((icon) => {
    if (!iconGroups[icon.name]) {
      iconGroups[icon.name] = [];
    }
    iconGroups[icon.name].push(icon);
  });

  // Add SVG files to src/assets
  for (const [iconName, iconWeights] of Object.entries(iconGroups)) {
    for (const weight of REQUIRED_WEIGHTS) {
      const weightDir = path.join(CUSTOM_ASSETS_PATH, weight);

      // Ensure weight directory exists
      if (!fs.existsSync(weightDir)) {
        fs.mkdirSync(weightDir, { recursive: true });
      }

      const iconData = iconWeights.find((i) => i.weight === weight);
      const filename =
        weight === "regular" ? `${iconName}.svg` : `${iconName}-${weight}.svg`;
      const filePath = path.join(weightDir, filename);

      if (iconData) {
        fs.writeFileSync(filePath, iconData.svgContent);
        console.log(chalk.green(`  ✓ ${filename}`));
      } else {
        // Create placeholder if missing
        const fallbackIcon = iconWeights[0]; // Use first available weight as fallback
        if (fallbackIcon) {
          fs.writeFileSync(filePath, fallbackIcon.svgContent);
          console.log(
            chalk.yellow(
              `  ⚠ ${filename} (using ${fallbackIcon.weight} as fallback)`
            )
          );
        }
      }
    }
  }

  console.log(chalk.blue("⚡ Generating React components..."));

  // Generate components for new icons only
  await generateCustomComponents(Object.keys(iconGroups));

  console.log(chalk.blue("📝 Updating exports..."));
  await updateExports(Object.keys(iconGroups));
}

async function generateCustomComponents(iconNames: string[]) {
  for (const iconName of iconNames) {
    const pascalName = pascalize(iconName);

    // Read the icon data from src/assets instead of core/assets
    const iconData: Record<string, { jsx: string; preview: string }> = {};

    for (const weight of REQUIRED_WEIGHTS) {
      const weightDir = path.join(CUSTOM_ASSETS_PATH, weight);
      const filename =
        weight === "regular" ? `${iconName}.svg` : `${iconName}-${weight}.svg`;
      const filePath = path.join(weightDir, filename);

      if (fs.existsSync(filePath)) {
        const svgContent = fs.readFileSync(filePath, "utf-8");
        iconData[weight] = {
          jsx: transformSvgToJsx(svgContent),
          preview: generatePreview(svgContent),
        };
      }
    }

    // Generate defs file
    const defString = `/* GENERATED FILE */
import * as React from "react";
import type { ReactElement } from "react";
import { IconWeight } from "../lib";

export default new Map<IconWeight, ReactElement>([
${Object.entries(iconData)
  .map(([weight, { jsx }]) => `  ["${weight}", <>${jsx.trim()}</>]`)
  .join(",\n")}
]);
`;

    // Generate documentation comment
    const doc = `
/**
 * ${REQUIRED_WEIGHTS.map((weight) =>
   iconData[weight]
     ? `@${weight} ![img](data:image/svg+xml;base64,${iconData[weight].preview})`
     : `@${weight} (missing)`
 ).join("\n * ")}
 */`;

    // Generate CSR component (reverted: no Icon postfix)
    const csrString = `/* GENERATED FILE */
import * as React from "react";
import type { Icon } from "../lib/types";
import IconBase from "../lib/IconBase";
import weights from "../defs/${pascalName}";

${doc}
const I: Icon = React.forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} viewBox="0 0 24 24" />
));

I.displayName = "${pascalName}Icon";

export const ${pascalName} = I;
export { I as ${pascalName}Icon };
`;

    // Generate SSR component (reverted: no Icon postfix)
    const ssrString = `/* GENERATED FILE */
import * as React from "react";
import type { Icon } from "../lib/types";
import SSRBase from "../lib/SSRBase";
import weights from "../defs/${pascalName}";

${doc}
const I: Icon = React.forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} weights={weights} viewBox="0 0 24 24" />
));

I.displayName = "${pascalName}Icon";

export const ${pascalName} = I;
export { I as ${pascalName}Icon };
`;

    // Write files
    try {
      fs.writeFileSync(path.join(DEFS_PATH, `${pascalName}.tsx`), defString);
      fs.writeFileSync(path.join(CSR_PATH, `${pascalName}.tsx`), csrString);
      fs.writeFileSync(path.join(SSR_PATH, `${pascalName}.tsx`), ssrString);

      console.log(chalk.green(`  ✓ Generated components for ${pascalName}`));
    } catch (error) {
      console.error(
        chalk.red(`  ✗ Failed to generate ${pascalName}: ${error.message}`)
      );
    }
  }
}

function generatePreview(svgContent: string): string {
  const preview = svgContent.replace(
    /<svg.*?>/g,
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000"><rect width="24" height="24" fill="#FFF" rx="4" ry="4"/>`
  );
  return Buffer.from(preview).toString("base64");
}

async function updateExports(newIconNames: string[]) {
  if (newIconNames.length === 0) return;

  // Read existing exports
  const existingIndex = fs.readFileSync(INDEX_PATH, "utf-8");
  const existingSSRIndex = fs.readFileSync(
    path.join(SSR_PATH, "index.ts"),
    "utf-8"
  );

  // Add new exports
  let updatedIndex = existingIndex;
  let updatedSSRIndex = existingSSRIndex;

  for (const iconName of newIconNames) {
    const pascalName = pascalize(iconName);
    const csrExport = `export * from "./csr/${pascalName}";\n`;
    const ssrExport = `export * from "./${pascalName}";\n`;

    if (!updatedIndex.includes(csrExport)) {
      updatedIndex += csrExport;
    }

    if (!updatedSSRIndex.includes(ssrExport)) {
      updatedSSRIndex += ssrExport;
    }
  }

  // Write updated exports
  fs.writeFileSync(INDEX_PATH, updatedIndex);
  fs.writeFileSync(path.join(SSR_PATH, "index.ts"), updatedSSRIndex);

  console.log(
    chalk.green(`  ✓ Updated exports for ${newIconNames.length} icons`)
  );
}

// Number to word mapping for icon names
const NUMBER_TO_WORD_MAP: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
  "10": "Ten",
  "11": "Eleven",
  "12": "Twelve",
  "13": "Thirteen",
  "14": "Fourteen",
  "15": "Fifteen",
  "16": "Sixteen",
  "17": "Seventeen",
  "18": "Eighteen",
  "19": "Nineteen",
  "20": "Twenty",
  "21": "TwentyOne",
  "22": "TwentyTwo",
  "23": "TwentyThree",
  "24": "TwentyFour",
  "25": "TwentyFive",
  "30": "Thirty",
  "50": "Fifty",
  "100": "OneHundred",
  // Add more as needed
};

function normalizeIconName(name: string): string {
  // Remove common prefixes
  let normalized = name;

  // Remove "lm-" prefix if present
  if (normalized.startsWith("lm-")) {
    normalized = normalized.substring(3);
  }

  // Handle special cases and convert numbers to words
  const parts = normalized.split("-");
  const convertedParts = parts.map((part) => {
    // Check if the part is a number
    if (/^\d+$/.test(part)) {
      return NUMBER_TO_WORD_MAP[part] || part; // Use word if available, otherwise keep number
    }

    // Handle mixed alphanumeric (like "3d" -> "ThreeD")
    if (/^\d+[a-z]+$/i.test(part)) {
      const match = part.match(/^(\d+)([a-z]+)$/i);
      if (match) {
        const [, number, letters] = match;
        const numberWord = NUMBER_TO_WORD_MAP[number] || number;
        return numberWord + letters.charAt(0).toUpperCase() + letters.slice(1);
      }
    }

    return part;
  });

  return convertedParts.join("-");
}

function pascalize(str: string): string {
  // First normalize the name to handle special cases
  const normalized = normalizeIconName(str);

  return normalized
    .split("-")
    .map((substr) => substr.replace(/^\w/, (c) => c.toUpperCase()))
    .join("");
}
