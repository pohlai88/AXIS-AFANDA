#!/usr/bin/env node
/**
 * Design Token Auto-Fixer
 * 
 * Automatically fixes hardcoded values to use design tokens.
 * Run: npx tsx scripts/fix-hardcoded-values.ts [--dry-run]
 */

import * as fs from 'fs';
import * as path from 'path';

interface Fix {
  file: string;
  line: number;
  original: string;
  replacement: string;
  reason: string;
}

const fixes: Fix[] = [];
const dryRun = process.argv.includes('--dry-run');

// Replacement mappings
const replacements = {
  // Max width containers
  'max-w-7xl': {
    replacement: 'max-w-[var(--layout-container-max)]',
    reason: 'Use layout token for consistent container width',
  },
  'max-w-4xl': {
    replacement: 'max-w-[var(--layout-container-narrow)]',
    reason: 'Use layout token for narrow container width',
  },

  // Durations
  'duration-150': {
    replacement: 'duration-[var(--ax-motion-fast)]',
    reason: 'Use motion token for fast transitions',
  },
  'duration-200': {
    replacement: 'duration-[var(--ax-motion-fast)]',
    reason: 'Use motion token for fast transitions',
  },
  'duration-300': {
    replacement: 'duration-[var(--ax-motion-base)]',
    reason: 'Use motion token for base transitions',
  },
  'duration-500': {
    replacement: 'duration-[var(--ax-motion-slow)]',
    reason: 'Use motion token for slow transitions',
  },

  // Gray scales to semantic tokens
  'bg-gray-50': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'bg-gray-100': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'bg-gray-200': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'text-gray-300': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },
  'text-gray-400': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },
  'text-gray-500': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },
  'text-gray-600': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },
  'text-gray-700': { replacement: 'text-foreground', reason: 'Use semantic foreground text' },
  'text-gray-900': { replacement: 'text-foreground', reason: 'Use semantic foreground text' },
  'border-gray-200': { replacement: 'border-border', reason: 'Use semantic border' },
  'border-gray-300': { replacement: 'border-border', reason: 'Use semantic border' },

  // Slate variants
  'bg-slate-50': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'text-slate-500': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },

  // Zinc variants
  'bg-zinc-50': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'text-zinc-500': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },

  // Neutral variants
  'bg-neutral-50': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'text-neutral-500': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },

  // Stone variants
  'bg-stone-50': { replacement: 'bg-muted', reason: 'Use semantic muted background' },
  'text-stone-500': { replacement: 'text-muted-foreground', reason: 'Use semantic muted text' },
};

// Hex color replacements (context-sensitive)
const hexColorReplacements: Record<string, { replacement: string; reason: string }> = {
  '#fff': { replacement: 'hsl(var(--background))', reason: 'Use semantic background color' },
  '#ffffff': { replacement: 'hsl(var(--background))', reason: 'Use semantic background color' },
  '#FFFFFF': { replacement: 'hsl(var(--background))', reason: 'Use semantic background color' },
  '#000': { replacement: 'hsl(var(--foreground))', reason: 'Use semantic foreground color' },
  '#000000': { replacement: 'hsl(var(--foreground))', reason: 'Use semantic foreground color' },
  '#ccc': { replacement: 'hsl(var(--border))', reason: 'Use semantic border color' },
  '#cccccc': { replacement: 'hsl(var(--border))', reason: 'Use semantic border color' },

  // Gold colors (confetti, etc.)
  '#D4AF37': { replacement: 'hsl(var(--primary))', reason: 'Use primary gold token' },
  '#FFD700': { replacement: 'hsl(var(--primary))', reason: 'Use primary gold token' },
  '#FFA500': { replacement: 'hsl(var(--primary) / 0.8)', reason: 'Use primary gold with opacity' },
};

// Files to skip
const skipFiles = [
  /node_modules/,
  /\.next/,
  /\.git/,
  /dist/,
  /build/,
  /scripts\/fix-hardcoded-values\.ts/,
  /lib\/design-tokens\.ts/,
  /app\/globals\.css/,
  /\.test\./,
  /\.spec\./,
  // Skip blocks - they're reference implementations
  /lib\/ui\/Blocks-shadcn/,
];

function shouldSkip(filePath: string): boolean {
  return skipFiles.some(pattern => pattern.test(filePath));
}

function fixFile(filePath: string): void {
  if (shouldSkip(filePath)) return;

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let lineOffset = 0;

    const lines = content.split('\n');
    const newLines = [...lines];

    lines.forEach((line, lineIndex) => {
      const lineNum = lineIndex + 1;
      let modifiedLine = line;
      let wasModified = false;

      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
        return;
      }

      // Fix Tailwind class replacements
      Object.entries(replacements).forEach(([pattern, { replacement, reason }]) => {
        if (modifiedLine.includes(pattern)) {
          const regex = new RegExp(`\\b${pattern}\\b`, 'g');
          if (regex.test(modifiedLine)) {
            modifiedLine = modifiedLine.replace(regex, replacement);
            wasModified = true;
            fixes.push({
              file: filePath,
              line: lineNum,
              original: pattern,
              replacement,
              reason,
            });
          }
        }
      });

      // Fix hex colors
      Object.entries(hexColorReplacements).forEach(([hex, { replacement, reason }]) => {
        if (modifiedLine.includes(hex)) {
          // Only replace if not in a comment and not already using var()
          if (!modifiedLine.includes('var(--')) {
            modifiedLine = modifiedLine.replace(new RegExp(hex, 'g'), replacement);
            wasModified = true;
            fixes.push({
              file: filePath,
              line: lineNum,
              original: hex,
              replacement,
              reason,
            });
          }
        }
      });

      if (wasModified) {
        newLines[lineIndex] = modifiedLine;
      }
    });

    const newContent = newLines.join('\n');

    if (newContent !== originalContent) {
      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      }
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
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
        const ext = path.extname(fullPath);
        if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
          fixFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
}

function generateReport(): void {
  console.log('\n🔧 Design Token Auto-Fixer\n');
  console.log('═'.repeat(80));

  if (dryRun) {
    console.log('\n🔍 DRY RUN MODE - No files will be modified\n');
  }

  if (fixes.length === 0) {
    console.log('\n✅ No fixes needed! Codebase is already compliant.\n');
    return;
  }

  console.log(`\n📊 Summary: ${fixes.length} fixes ${dryRun ? 'would be' : 'were'} applied\n`);

  // Group by file
  const byFile = fixes.reduce((acc, fix) => {
    if (!acc[fix.file]) acc[fix.file] = [];
    acc[fix.file].push(fix);
    return acc;
  }, {} as Record<string, Fix[]>);

  // Print fixes by file
  Object.entries(byFile).forEach(([file, fileFixes]) => {
    console.log(`\n📄 ${file}`);
    console.log('─'.repeat(80));
    console.log(`   ${fileFixes.length} fix(es)\n`);

    fileFixes.forEach(fix => {
      console.log(`   Line ${fix.line}:`);
      console.log(`     ❌ ${fix.original}`);
      console.log(`     ✅ ${fix.replacement}`);
      console.log(`     💡 ${fix.reason}\n`);
    });
  });

  console.log('═'.repeat(80));

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to apply these fixes\n');
  } else {
    console.log('\n✅ Fixes applied successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Review the changes with git diff');
    console.log('   2. Test your application');
    console.log('   3. Run: npx tsx scripts/scan-hardcoded-values.ts');
    console.log('   4. Commit the changes\n');
  }
}

// Main execution
const rootDir = path.resolve(__dirname, '..');
console.log(`${dryRun ? 'Scanning' : 'Fixing'} ${rootDir}...\n`);

// Fix key directories
const dirsToFix = ['app', 'components'];

dirsToFix.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

generateReport();
