#!/usr/bin/env node
/**
 * Design Token Scanner
 * 
 * Scans the codebase for hardcoded values that should use design tokens.
 * Run: npx tsx scripts/scan-hardcoded-values.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Finding {
  file: string;
  line: number;
  column: number;
  value: string;
  context: string;
  suggestion: string;
  severity: 'error' | 'warning' | 'info';
}

const findings: Finding[] = [];

function normalizeForMatch(p: string): string {
  return p.replace(/\\/g, '/').toLowerCase();
}

// Patterns to detect
const patterns = {
  // Hardcoded hex colors
  // Avoid false positives like "#456" in plain text by only matching:
  // - 3-digit hex with at least one A-F letter, OR
  // - common grayscale shorthands (#000, #fff, #ccc), OR
  // - 6/8 digit hex (kept permissive for now)
  hexColor:
    /#(?:000|fff|ccc|(?:[a-fA-F][0-9a-fA-F]{2}|[0-9a-fA-F][a-fA-F][0-9a-fA-F]|[0-9a-fA-F]{2}[a-fA-F])|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,

  // RGB/RGBA without var()
  rgbColor: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,

  // HSL without var() - but allow hsl(var(--...))
  hslColorHardcoded: /hsl\(\s*\d+\s*,?\s*\d+%?\s*,?\s*\d+%?\s*\)/g,

  // Tailwind gray scales
  tailwindGray: /\b(gray|slate|zinc|neutral|stone)-(50|100|200|300|400|500|600|700|800|900)\b/g,

  // Hardcoded spacing
  hardcodedMaxWidth: /\bmax-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b/g,

  // Hardcoded durations
  hardcodedDuration: /\bduration-(75|100|150|200|300|500|700|1000)\b/g,

  // Hardcoded opacity
  hardcodedOpacity: /\bopacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)\b/g,

  // Inline styles with colors
  inlineStyleColor: /style=["'][^"']*(?:color|background|border)[^"']*["']/g,
};

// Files/directories to skip
const skipPatterns = [
  /node_modules/,
  /\.next/,
  /\.git/,
  /dist/,
  /build/,
  /\.cursor/,
  /scripts\/scan-hardcoded-values\.ts/i, // skip self
  /lib\/design-tokens\.ts/i, // skip token definition
  /\.test\./,
  /\.spec\./,
  /package-lock\.json/,
  /yarn\.lock/,
  /pnpm-lock\.yaml/,
];

// File extensions to scan
const scanExtensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];

function shouldSkip(filePath: string): boolean {
  const normalized = normalizeForMatch(filePath);
  return skipPatterns.some(pattern => pattern.test(normalized));
}

function scanFile(filePath: string): void {
  if (shouldSkip(filePath)) return;

  const ext = path.extname(filePath);
  if (!scanExtensions.includes(ext)) return;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;

      // Check for hex colors
      let match;
      while ((match = patterns.hexColor.exec(line)) !== null) {
        const value = match[0];
        // Skip if it's in a comment or already using a CSS var
        if (line.includes('var(--') || line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue;
        }

        findings.push({
          file: filePath,
          line: lineNum,
          column: match.index,
          value,
          context: line.trim(),
          suggestion: 'Use hsl(var(--primary)), hsl(var(--foreground)), or other design tokens',
          severity: 'error',
        });
      }

      // Check for RGB colors
      patterns.rgbColor.lastIndex = 0;
      while ((match = patterns.rgbColor.exec(line)) !== null) {
        if (line.includes('var(--') || line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue;
        }

        findings.push({
          file: filePath,
          line: lineNum,
          column: match.index,
          value: match[0],
          context: line.trim(),
          suggestion: 'Use hsl(var(--...)) design tokens instead of rgb()',
          severity: 'error',
        });
      }

      // Check for hardcoded HSL (not using var)
      patterns.hslColorHardcoded.lastIndex = 0;
      while ((match = patterns.hslColorHardcoded.exec(line)) !== null) {
        // Skip if it's already using var() or in a comment
        if (line.includes('var(--') || line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue;
        }

        findings.push({
          file: filePath,
          line: lineNum,
          column: match.index,
          value: match[0],
          context: line.trim(),
          suggestion: 'Use hsl(var(--...)) with design tokens instead of hardcoded HSL',
          severity: 'warning',
        });
      }

      // Check for Tailwind gray scales
      patterns.tailwindGray.lastIndex = 0;
      while ((match = patterns.tailwindGray.exec(line)) !== null) {
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue;
        }

        findings.push({
          file: filePath,
          line: lineNum,
          column: match.index,
          value: match[0],
          context: line.trim(),
          suggestion: 'Use bg-muted, text-muted-foreground, or other semantic tokens',
          severity: 'warning',
        });
      }

      // Check for hardcoded max-width
      patterns.hardcodedMaxWidth.lastIndex = 0;
      while ((match = patterns.hardcodedMaxWidth.exec(line)) !== null) {
        const value = match[0];
        if (value === 'max-w-7xl' || value === 'max-w-4xl') {
          findings.push({
            file: filePath,
            line: lineNum,
            column: match.index,
            value,
            context: line.trim(),
            suggestion: value === 'max-w-7xl'
              ? 'Use var(--layout-container-max)'
              : 'Use var(--layout-container-narrow)',
            severity: 'info',
          });
        }
      }

      // Check for hardcoded durations
      patterns.hardcodedDuration.lastIndex = 0;
      while ((match = patterns.hardcodedDuration.exec(line)) !== null) {
        const value = match[0];
        let suggestion = '';

        if (value === 'duration-150' || value === 'duration-200') {
          suggestion = 'Use var(--ax-motion-fast)';
        } else if (value === 'duration-300') {
          suggestion = 'Use var(--ax-motion-base)';
        } else if (value === 'duration-500') {
          suggestion = 'Use var(--ax-motion-slow)';
        }

        if (suggestion) {
          findings.push({
            file: filePath,
            line: lineNum,
            column: match.index,
            value,
            context: line.trim(),
            suggestion,
            severity: 'info',
          });
        }
      }
    });
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error);
  }
}

function scanDirectory(dir: string): void {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (shouldSkip(fullPath)) continue;

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
}

function generateReport(): void {
  console.log('\n🔍 Design Token Compliance Scan\n');
  console.log('═'.repeat(80));

  if (findings.length === 0) {
    console.log('\n✅ No hardcoded values found! Codebase is using design tokens correctly.\n');
    return;
  }

  // Group by severity
  const errors = findings.filter(f => f.severity === 'error');
  const warnings = findings.filter(f => f.severity === 'warning');
  const info = findings.filter(f => f.severity === 'info');

  console.log(`\n📊 Summary:`);
  console.log(`   🔴 Errors:   ${errors.length} (must fix)`);
  console.log(`   🟡 Warnings: ${warnings.length} (should fix)`);
  console.log(`   🔵 Info:     ${info.length} (nice to fix)`);
  console.log(`   📝 Total:    ${findings.length}\n`);

  // Group by file
  const byFile = findings.reduce((acc, finding) => {
    if (!acc[finding.file]) acc[finding.file] = [];
    acc[finding.file].push(finding);
    return acc;
  }, {} as Record<string, Finding[]>);

  // Print findings by file
  Object.entries(byFile).forEach(([file, fileFindings]) => {
    console.log(`\n📄 ${file}`);
    console.log('─'.repeat(80));

    fileFindings.forEach(finding => {
      const icon = finding.severity === 'error' ? '🔴' : finding.severity === 'warning' ? '🟡' : '🔵';
      console.log(`\n  ${icon} Line ${finding.line}:${finding.column}`);
      console.log(`     Found: ${finding.value}`);
      console.log(`     Context: ${finding.context.substring(0, 100)}${finding.context.length > 100 ? '...' : ''}`);
      console.log(`     💡 ${finding.suggestion}`);
    });
  });

  console.log('\n' + '═'.repeat(80));
  console.log('\n📚 Resources:');
  console.log('   • Design tokens: lib/design-tokens.ts');
  console.log('   • CSS source: app/globals.css');
  console.log('   • Documentation: .dev-docs/PROJECT-SPEC.md\n');
}

// Main execution
const rootDir = path.resolve(__dirname, '..');
console.log(`Scanning ${rootDir}...\n`);

// Scan key directories
const dirsToScan = ['app', 'components', 'lib'];

dirsToScan.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

generateReport();

// Exit with error code if there are errors
if (findings.some(f => f.severity === 'error')) {
  process.exit(1);
}
