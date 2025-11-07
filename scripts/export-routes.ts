#!/usr/bin/env tsx
/**
 * Export Routes Script
 *
 * Generates routes.json from the centralized route manifest for CI/CD validation.
 * This script reads the routes.manifest.ts file and exports a JSON representation
 * of all application routes for automated testing, documentation, and linting.
 *
 * Usage:
 *   npm run export:routes
 *   pnpm export:routes
 *
 * Output:
 *   dist/routes.json - Complete route manifest in JSON format
 */

import { ROUTES, RouteManifest } from "../client/routes.manifest";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";

interface RouteExport {
  version: string;
  generatedAt: string;
  summary: {
    total: number;
    public: number;
    guest: number;
    protected: number;
    creator: number;
    dynamic: number;
  };
  routes: typeof ROUTES;
}

function main() {
  console.log("🚀 Exporting route manifest...\n");

  // Prepare export data
  const exportData: RouteExport = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    summary: {
      total: RouteManifest.count(),
      public: RouteManifest.public().length,
      guest: RouteManifest.guest().length,
      protected: RouteManifest.protected().length,
      creator: RouteManifest.creator().length,
      dynamic: RouteManifest.dynamic().length,
    },
    routes: ROUTES,
  };

  // Create output directory
  const outputPath = resolve(process.cwd(), "dist/routes.json");
  const outputDir = dirname(outputPath);

  try {
    mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }

  // Write JSON file
  try {
    writeFileSync(outputPath, JSON.stringify(exportData, null, 2), "utf8");
    console.log(`✅ Successfully wrote: ${outputPath}\n`);
  } catch (error) {
    console.error("❌ Failed to write routes.json:", error);
    process.exit(1);
  }

  // Print summary
  console.log("📊 Route Summary:");
  console.log(`   Total routes: ${exportData.summary.total}`);
  console.log(`   Public: ${exportData.summary.public}`);
  console.log(`   Guest-only: ${exportData.summary.guest}`);
  console.log(`   Protected: ${exportData.summary.protected}`);
  console.log(`   Creator-only: ${exportData.summary.creator}`);
  console.log(`   Dynamic: ${exportData.summary.dynamic}`);
  console.log("\n✨ Export complete!");

  // Validate route structure
  console.log("\n🔍 Validating route structure...");
  let validationErrors = 0;

  ROUTES.forEach((route, index) => {
    // Check required fields
    if (!route.path) {
      console.error(`❌ Route ${index}: Missing path`);
      validationErrors++;
    }
    if (!route.name) {
      console.error(`❌ Route ${index}: Missing name`);
      validationErrors++;
    }
    if (!route.access) {
      console.error(`❌ Route ${index}: Missing access level`);
      validationErrors++;
    }

    // Check access level is valid
    const validAccessLevels = ["public", "guest", "protected", "creator"];
    if (route.access && !validAccessLevels.includes(route.access)) {
      console.error(`❌ Route ${route.path}: Invalid access level "${route.access}"`);
      validationErrors++;
    }

    // Check dynamic routes have parameters
    if (route.dynamic && !route.path.includes(":")) {
      console.error(`❌ Route ${route.path}: Marked as dynamic but has no parameters`);
      validationErrors++;
    }
  });

  if (validationErrors === 0) {
    console.log("✅ All routes passed validation");
  } else {
    console.error(`\n❌ Found ${validationErrors} validation error(s)`);
    process.exit(1);
  }

  console.log("\n🎉 Route export and validation complete!");
}

// Run the script
main();
