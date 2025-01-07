const { ts, version, TimestampError } = require("./Timestamper");

function showHelp() {
  console.log(`
Timestamper v${version}
  Usage: ts [options]

  Options:
    -v         version
    -l         locale to use for formatting the date/time. e.g. 'en' or 'fa' (default = en).
    -o         output file name where the result will be saved. default is info.json.
    -t         template file.
    -f         format string to use for formatting the date/time. default is "YYYYMMDDHHmm".
    -i         inline template string.
    -so        skip generating output file.

  Examples:
    ts
    ts -l en -o result.json -t template.txt -f YYYYMMDDHHmmss
    ts -l fa -o result.json -i "{ hash: '{ts}' }"
    `);
}

function TimestamperCLI(args) {
  try {
    if (args.includes("--help") || args.includes("-?") || args.includes("/?")) {
      showHelp();

      return;
    }

    const result = ts(args);

    if (result.success) {
      if (result.options.version !== true) {
        console.log(`File ${result.options.outputFileName} generated at ${result.options.outPutFilePath}`);
      }
    } else {
      if (result.err) {
        throw result.err;
      } else {
        throw new TimestampError(result.state, result.message);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

module.exports = TimestamperCLI;
