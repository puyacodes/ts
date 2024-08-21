# Timestamper

Timestamper is a Node.js library and CLI tool that provides timestamp functionality and supports custom templates for its output file. It allows you to easily add a timestamp to a JSON file or any other file format based on a template.

## Features

- **Add Timestamp**: Automatically add a timestamp to a specified output file.
- **Custom Templates**: Use custom templates for the output file.
- **Locale Support**: Supports different locales for timestamp formatting (e.g., `en`, `fa`).
- **CLI and Programmatic Use**: Can be used as a command-line tool or imported as a module in your Node.js projects.

## Installation

You can install Timestamper globally for CLI use or locally in your project.

### Global Installation

Install globally to use the `ts` command:

```bash
npm install -g @puya/ts
```

### Local Installation

Install locally in your project:

```bash
npm install @puya/ts
```

## Usage

### CLI

Once installed globally, you can use the `ts` command in your terminal.

```bash
ts [options]
```

#### Options

- `-l [locale]`: The locale to use for formatting the date/time. Default is `en`.
- `-o [outputfile]`: The name of the output file where the result will be saved. Default is `info.json`.
- `-t [template]`: The path to a template file.
- `-f [format]`: The format string to use for formatting the date/time. Default is `YYYYMMDDHHmm`.
- `-i [inline-template]`: Inline template string.

#### Examples

1. Add a timestamp using the default settings:

   ```bash
   ts
   ```

2. Add a timestamp to a custom output file with a specific format:

   ```bash
   ts -l en -o result.json -f YYYYMMDDHHmmss
   ```

3. Use a custom template file:

   ```bash
   ts -l fa -o result.json -t template.txt
   ```

4. Use an inline template:

   ```bash
   ts -l fa -o result.json -i "{ test: '{ts}' }"
   ```

5. Get help:

   ```bash
   ts --help
   ```

### Programmatic Use

You can also use Timestamper as a module in your Node.js projects.

```javascript
const { ts, version, TimestampError } = require('ts');

const result = timestamper({
    locale: 'en',
    outputFileName: 'result.json',
    template: '{ "ts": "{ts}" }',
    format: 'YYYYMMDDHHmmss',
});

if (result.success) {
    console.log('Timestamp generated successfully:', result.output);
} else {
    console.error('Failed to generate timestamp:', result.err);
}
```
