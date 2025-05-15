#!/usr/bin/env node

import { setFileMode, setFileModes, GhmodError } from '../index';

function printUsage() {
  console.log('Usage: ghmod <mode> <file> [file2 file3 ...]');
  console.log('  mode: Octal mode (e.g., 755)');
  console.log('  file: Path to file(s) to modify');
  console.log('\nOptions:');
  console.log('  -v, --verbose    Show verbose output');
  console.log('  -h, --help       Show this help message');
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printUsage();
  }

  const verbose = args.includes('-v') || args.includes('--verbose');
  const filteredArgs = args.filter(arg => !arg.startsWith('-'));

  if (filteredArgs.length < 2) {
    console.error('Error: Mode and at least one file path are required');
    printUsage();
  }

  const mode = filteredArgs[0];
  const files = filteredArgs.slice(1);

  try {
    if (files.length === 1) {
      setFileMode(files[0], mode, { verbose });
    } else {
      setFileModes(files, mode, { verbose });
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