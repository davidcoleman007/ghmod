import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

export interface GhmodOptions {
  recursive?: boolean;
  verbose?: boolean;
}

export class GhmodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GhmodError';
  }
}

export function parseMode(mode: string): number {
  // Handle symbolic mode (e.g., +x, -x, =x)
  if (mode.startsWith('+') || mode.startsWith('-') || mode.startsWith('=')) {
    throw new GhmodError('Symbolic mode not supported. Please use octal mode (e.g., 755)');
  }

  // Parse octal mode
  const modeNum = parseInt(mode, 8);
  if (isNaN(modeNum) || modeNum < 0 || modeNum > 777) {
    throw new GhmodError('Invalid mode. Please use a valid octal number (0-777)');
  }

  return modeNum;
}

export function setFileMode(filePath: string, mode: string | number, options: GhmodOptions = {}): void {
  const resolvedPath = resolve(filePath);

  if (!existsSync(resolvedPath)) {
    throw new GhmodError(`File not found: ${resolvedPath}`);
  }

  const modeNum = typeof mode === 'string' ? parseMode(mode) : mode;

  // Convert mode to git format
  // Git uses 100755 for executable files and 100644 for non-executable files
  const gitMode = modeNum & 0o111 ? '100755' : '100644';

  try {
    // Update the git index with the new mode
    execSync(`git update-index --chmod=${gitMode} "${resolvedPath}"`, { stdio: 'inherit' });

    if (options.verbose) {
      console.log(`Changed mode of ${resolvedPath} to ${modeNum.toString(8)}`);
    }
  } catch (error) {
    throw new GhmodError(`Failed to change mode: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function setFileModes(filePaths: string[], mode: string | number, options: GhmodOptions = {}): void {
  filePaths.forEach(filePath => setFileMode(filePath, mode, options));
}