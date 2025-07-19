#!/usr/bin/env tsx

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";

interface PublishOptions {
  tag?: string;
  dryRun?: boolean;
  skipTests?: boolean;
  skipBuild?: boolean;
}

class Publisher {
  private packageJsonPath = resolve(process.cwd(), "package.json");

  private getPackageInfo() {
    if (!existsSync(this.packageJsonPath)) {
      throw new Error("package.json not found");
    }

    const packageJson = JSON.parse(readFileSync(this.packageJsonPath, "utf-8"));
    return {
      name: packageJson.name,
      version: packageJson.version,
      private: packageJson.private,
    };
  }

  private executeCommand(command: string, description: string) {
    console.log(chalk.blue(`\n📦 ${description}...`));
    try {
      execSync(command, { stdio: "inherit" });
      console.log(chalk.green(`✅ ${description} completed successfully`));
    } catch (error) {
      console.error(chalk.red(`❌ ${description} failed`));
      throw error;
    }
  }

  private checkGitStatus() {
    try {
      const status = execSync("git status --porcelain", { encoding: "utf-8" });
      if (status.trim()) {
        console.log(chalk.yellow("⚠️  Warning: You have uncommitted changes:"));
        console.log(status);
        console.log(
          chalk.yellow("Consider committing your changes before publishing.")
        );
      }
    } catch (error) {
      console.log(chalk.yellow("⚠️  Could not check git status"));
    }
  }

  private checkNpmAuth() {
    try {
      execSync("npm whoami", { stdio: "pipe" });
      console.log(chalk.green("✅ npm authentication verified"));
    } catch (error) {
      throw new Error("❌ Not authenticated with npm. Run 'npm login' first.");
    }
  }

  private checkDistExists() {
    const distPath = resolve(process.cwd(), "dist");
    if (!existsSync(distPath)) {
      throw new Error("❌ dist folder not found. Run 'npm run build' first.");
    }
    console.log(chalk.green("✅ dist folder exists"));
  }

  async publish(options: PublishOptions = {}) {
    const {
      tag = "latest",
      dryRun = false,
      skipTests = false,
      skipBuild = false,
    } = options;

    try {
      console.log(chalk.magenta("🚀 Starting publish process...\n"));

      // Get package info
      const packageInfo = this.getPackageInfo();
      console.log(
        chalk.cyan(`📋 Package: ${packageInfo.name}@${packageInfo.version}`)
      );

      if (packageInfo.private) {
        throw new Error(
          "❌ Cannot publish private package. Set 'private: false' in package.json"
        );
      }

      // Pre-publish checks
      console.log(chalk.yellow("\n🔍 Running pre-publish checks..."));

      this.checkGitStatus();

      if (!dryRun) {
        this.checkNpmAuth();
      }

      // Run tests
      if (!skipTests) {
        this.executeCommand("npm run test", "Running tests");
      }

      // Build
      if (!skipBuild) {
        this.executeCommand("npm run build", "Building package");
      }

      this.checkDistExists();

      // Publish
      const publishCommand = dryRun
        ? "npm publish --dry-run"
        : `npm publish --tag ${tag}`;

      const publishDescription = dryRun
        ? "Running publish dry-run"
        : `Publishing to npm with tag '${tag}'`;

      this.executeCommand(publishCommand, publishDescription);

      if (!dryRun) {
        console.log(
          chalk.green.bold(
            `\n🎉 Successfully published ${packageInfo.name}@${packageInfo.version} to npm!`
          )
        );
        console.log(
          chalk.cyan(`📦 Install with: npm install ${packageInfo.name}`)
        );
        console.log(
          chalk.cyan(
            `🔗 View on npm: https://www.npmjs.com/package/${packageInfo.name}`
          )
        );
      } else {
        console.log(chalk.green.bold("\n✅ Dry run completed successfully!"));
        console.log(
          chalk.yellow("Use --publish flag to actually publish to npm")
        );
      }
    } catch (error) {
      console.error(chalk.red.bold("\n💥 Publish failed!"));
      console.error(
        chalk.red(error instanceof Error ? error.message : String(error))
      );
      process.exit(1);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);

  const options: PublishOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--dry-run":
      case "--dry":
        options.dryRun = true;
        break;
      case "--tag":
        options.tag = args[++i];
        break;
      case "--skip-tests":
        options.skipTests = true;
        break;
      case "--skip-build":
        options.skipBuild = true;
        break;
      case "--help":
      case "-h":
        console.log(`
${chalk.cyan.bold("📦 Lumin Icons Publisher")}

Usage: tsx scripts/publish.ts [options]

Options:
  --dry-run, --dry      Run publish in dry-run mode (no actual publish)
  --tag <tag>          Publish with specific npm tag (default: latest)
  --skip-tests         Skip running tests before publish
  --skip-build         Skip building before publish
  --help, -h           Show this help message

Examples:
  tsx scripts/publish.ts --dry-run          # Test the publish process
  tsx scripts/publish.ts --tag beta         # Publish as beta version
  tsx scripts/publish.ts --skip-tests       # Skip tests (not recommended)
        `);
        process.exit(0);
      default:
        console.error(chalk.red(`Unknown option: ${arg}`));
        console.log("Use --help to see available options");
        process.exit(1);
    }
  }

  const publisher = new Publisher();
  await publisher.publish(options);
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { Publisher };
