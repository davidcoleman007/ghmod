#!/usr/bin/env node

import { setFileMode, setFileModes, GhmodError } from '../index';

function printUsage() {
  console.log('Usage: ghmod <mode> <file> [file2 file3 ...] [git-options]');
  console.log('  mode: Octal mode (e.g., 755)');
  console.log('  file: Path to file(s) to modify');
  console.log('\nOptions:');
  console.log('  -v, --verbose    Show verbose output');
  console.log('  -h, --help       Show this help message');
  console.log('\nGit Options:');
  console.log('  Any additional options will be passed to git update-index');
  console.log('\nExamples:');
  console.log('  ghmod 755 script.sh --add --force');
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printUsage();
  }

  const verbose = args.includes('-v') || args.includes('--verbose');

  // Collect git options (any unknown options)
  const gitOptions: string[] = [];
  const knownOptions = ['-v', '--verbose', '-h', '--help'];

  // Filter out known options and collect git options
  const filteredArgs = args.filter(arg => {
    if (knownOptions.includes(arg)) {
      return false;
    }
    if (arg.startsWith('-')) {
      gitOptions.push(arg);
      return false;
    }
    return true;
  });

  if (filteredArgs.length < 2) {
    console.error('Error: Mode and at least one file path are required');
    printUsage();
  }

  const mode = filteredArgs[0];
  const files = filteredArgs.slice(1);

  try {
    if (files.length === 1) {
      setFileMode(files[0], mode, { verbose, gitOptions });
    } else {
      setFileModes(files, mode, { verbose, gitOptions });
    }
  } catch (error) {
    if (error instanceof GhmodError) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    process.exit(1);
  }
}

main();