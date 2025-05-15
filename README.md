# ghmod

A chmod-like interface for changing file permissions in Git repositories on Windows.

## Installation

```bash
npm install -g ghmod
```

## Usage

```bash
ghmod <mode> <file> [file2 file3 ...] [git-options]
```

### Arguments

- `mode`: Mode can be either:
  - Octal mode (e.g., 755)
  - Symbolic mode: +x (make executable) or -x (make non-executable)
- `file`: Path to file(s) to modify
- `git-options`: Any additional options will be passed to `git update-index`

### Options

- `-v, --verbose`: Show verbose output
- `-h, --help`: Show help message

### Examples

Make a file executable (using octal mode):
```bash
ghmod 755 script.sh
```

Make a file executable (using symbolic mode):
```bash
ghmod +x script.sh
```

Make a file non-executable (using symbolic mode):
```bash
ghmod -x script.sh
```

Make a file non-executable (using octal mode):
```bash
ghmod 644 script.sh
```

Make multiple files executable:
```bash
ghmod +x script1.sh script2.sh
```

Add a file to Git index and make it executable:
```bash
ghmod +x script.sh --add
```

Force update and refresh the index:
```bash
ghmod +x script.sh --force --refresh
```

## API

You can also use ghmod programmatically in your Node.js projects:

```typescript
import { setFileMode, setFileModes } from 'ghmod';

// Change mode of a single file (using octal mode)
setFileMode('script.sh', '755');

// Change mode of a single file (using symbolic mode)
setFileMode('script.sh', '+x');

// Change mode of multiple files
setFileModes(['script1.sh', 'script2.sh'], '+x');

// With options
setFileMode('script.sh', '+x', {
  verbose: true,
  gitOptions: ['--add', '--force']
});
```

## How it Works

ghmod translates Unix-style chmod commands into Git index commands. It uses `git update-index --chmod` to modify the executable bit of files in the Git repository.

- Mode `755` or `+x` (rwxr-xr-x) sets the file as executable
- Mode `644` or `-x` (rw-r--r--) sets the file as non-executable

Any additional options passed to ghmod will be forwarded to the underlying `git update-index` command, allowing you to use all Git options directly.

## License

MIT