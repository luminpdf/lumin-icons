import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";

// Define types and constants directly to avoid dependency issues
export enum IconStyle {
  REGULAR = "regular",
  THIN = "thin",
  LIGHT = "light",
  BOLD = "bold",
  FILL = "fill",
  DUOTONE = "duotone",
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ASSETS_PATH = path.join(__dirname, "../core/assets");
export const DEFS_PATH = path.join(__dirname, "../src/defs");
export const CSR_PATH = path.join(__dirname, "../src/csr");
export const SSR_PATH = path.join(__dirname, "../src/ssr");
export const INDEX_PATH = path.join(__dirname, "../src/index.ts");
export const WEIGHTS = [
  IconStyle.REGULAR,
  IconStyle.THIN,
  IconStyle.LIGHT,
  IconStyle.BOLD,
  IconStyle.FILL,
  IconStyle.DUOTONE,
] as const;

// Simplified for custom icon addition - no aliases needed
export const ALIASES: Record<string, string> = {};

export type AssetMap = Record<
  string,
  Record<IconStyle, { preview: string; jsx: string }>
>;

export function readAssetsFromDisk(): AssetMap {
  const assetsFolder = fs.readdirSync(ASSETS_PATH, "utf-8");

  const icons: AssetMap = {};

  assetsFolder.forEach((weight) => {
    if (!fs.lstatSync(path.join(ASSETS_PATH, weight)).isDirectory()) return;

    if (!WEIGHTS.includes(weight as IconStyle)) {
      console.error(`${chalk.inverse.red(" ERR ")} Bad folder name ${weight}`);
      process.exit(1);
    }

    const files = fs.readdirSync(path.join(ASSETS_PATH, weight));
    files.forEach((filename) => {
      let name: string;
      const nameParts = filename.split(".svg")[0].split("-");
      if (nameParts[nameParts.length - 1] === weight) {
        name = nameParts.slice(0, -1).join("-");
      } else {
        name = nameParts.join("-");
      }

      if (!icons[name]) {
        // @ts-ignore
        icons[name] = {};
      }
      const filepath = path.join(ASSETS_PATH, weight, filename);
      const file = fs.readFileSync(filepath).toString("utf-8");
      icons[name][weight] = {
        preview: generatePreview(file),
        jsx: transformJSX(file),
      };
    });
  });

  return icons;
}

function generatePreview(contents: string) {
  const preview = contents.replace(
    /<svg.*?>/g,
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="#000"><rect width="256" height="256" fill="#FFF" rx="40" ry="40"/>`
  );
  return Buffer.from(preview).toString("base64");
}

function transformJSX(contents: string) {
  return contents
    .replace(/^.*<\?xml.*?\>/g, "")
    .replace(/<svg.*?>/g, "")
    .replace(/<\/svg>/g, "")
    .replace(
      /<rect width="25[\d,\.]+" height="25[\d,\.]+" fill="none".*?\/>/g,
      ""
    )
    .replace(/<title.*?/, "")
    .replace(/"#0+"/g, "{color}")
    .replace(/currentColor/g, "{color}")
    .replace(/fill\-rule/g, "fillRule")
    .replace(/stroke-linecap/g, "strokeLinecap")
    .replace(/stroke-linejoin/g, "strokeLinejoin")
    .replace(/stroke-width/g, "strokeWidth")
    .replace(/stroke-miterlimit/g, "strokeMiterlimit");
}

export function verifyIcons(icons: AssetMap) {
  let fails = 0;

  Object.entries(icons).forEach(([name, icon]) => {
    const weightsPresent = Object.keys(icon);

    if (
      !(
        weightsPresent.length === 6 &&
        weightsPresent.every(
          (w) => WEIGHTS.includes(w as IconStyle) && !!icon[w]
        )
      )
    ) {
      fails++;

      console.error(
        `${chalk.inverse.red(" FAIL ")} ${name} is missing weights`
      );
      console.group();
      console.error(WEIGHTS.filter((w) => !Object.keys(icon).includes(w)));
      console.groupEnd();
    }
  });

  return fails === 0;
}
