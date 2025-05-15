# ghmod

A chmod-like interface for changing file permissions in Git repositories on Windows.

## Installation

```bash
npm install -g ghmod
```

## Usage

```bash
ghmod <mode> <file> [file2 file3 ...]
```

### Arguments

- `mode`: Octal mode (e.g., 755)
- `file`: Path to file(s) to modify

### Options

- `-v, --verbose`: Show verbose output
- `-h, --help`: Show help message

### Examples

Make a file executable:
```bash
ghmod 755 script.sh
```

Make multiple files executable:
```bash
ghmod 755 script1.sh script2.sh
```

Make a file non-executable:
```bash
ghmod 644 file.txt
```

## API

You can also use ghmod programmatically in your Node.js projects:

```typescript
import { setFileMode, setFileModes } from 'ghmod';

// Change mode of a single file
setFileMode('script.sh', '755');

// Change mode of multiple files
setFileModes(['script1.sh', 'script2.sh'], '755');

// With options
setFileMode('script.sh', '755', { verbose: true });
```

## How it Works

ghmod translates Unix-style chmod commands into Git index commands. It uses `git update-index --chmod` to modify the executable bit of files in the Git repository.

- Mode `755` (rwxr-xr-x) sets the file as executable
- Mode `644` (rw-r--r--) sets the file as non-executable

## License

MIT