const path = require("path");
const fs = require("fs");
const moment = require("jalali-moment");
const _package = require('./package.json');

const version = _package.version;

let default_options = {
  locale: "en",
  outputFileName: "info.json",
  outPutFilePath: path.join(process.cwd(), "info.json"),
  template: "{ \"ts\": \"{ts}\" }",
  templatePath: "",
  format: "YYYYMMDDHHmm",
  inlineTemplate: "",
  hasInlineTemplate: false,
  skipOutput: false
};

class TimestampError extends Error {
  constructor(state, message) {
    super();

    this.state = state;
    this.message = message;
  }
}

function start(args) {
  const result = {}

  try {
    const options = Array.isArray(args) ? parseArguments(args) : args;

    if (args.length !== 0) {
      result.state = validateOptions(Object.assign(default_options, options));
    } else {
      result.state = "successful";
    }

    if (result.state === "successful") {
      result.options = Object.assign(default_options, options);

      if (default_options.version === true) {
        console.log(version);
      } else {

        const ts = generateTimestamp(options.locale, options.format);
        const data = generateData(ts, result.options);

        if (!options.skipOutput) {
          writeOutput(data, result.options.outPutFilePath);
        }

        result.data = data;
      }

      result.success = true;
    }
  } catch (ex) {
    if (ex instanceof TimestampError) {
      result.state = ex.state;
    }

    result.err = ex;
    result.success = false;
  }

  return result;
}

function parseArguments(args) {
  if (args.length === 0) {
    return default_options;
  }

  let i = 0;

  do {
    switch (args[i]) {
      case '-o':
        default_options.outputFileName = args[i + 1];
        default_options.outPutFilePath = default_options.outputFileName
          ? path.isAbsolute(default_options.outputFileName)
            ? default_options.outputFileName
            : path.join(process.cwd(), default_options.outputFileName)
          : undefined;
        i += 2;
        break;
      case '-t':
        default_options.template = args[i + 1];
        default_options.templatePath = default_options.template
          ? path.isAbsolute(default_options.template)
            ? default_options.template
            : path.join(process.cwd(), default_options.template)
          : undefined;
        i += 2;
        break;
      case '-l':
        default_options.locale = args[i + 1];
        i += 2;
        break;
      case '-f':
        default_options.format = args[i + 1];
        i += 2;
        break;
      case '-so':
        default_options.skipOutput = true;
        i++;
        break;
      case '-i':
        default_options.inlineTemplate = args[i + 1];
        default_options.template = default_options.inlineTemplate;
        default_options.hasInlineTemplate = true;
        i += 2;
        break;
      case '-v':
        default_options.version = true;
        i++;
        break;
      default:
        throw new Error(`Invalid argument provided: ${args[i]}`);
    }
  } while (i < args.length);

  return default_options;
}

function validateOptions(options) {
  // const fileRegex = /^[\w,-]+\.[A-Za-z]{1,15}$/;

  if (options.version !== true) {
    if (options.skipOutput && !options.outPutFilePath) {
      throw new TimestampError("output_confusion", `Please make up your mind buddy. Do you want me to generate the output for you or not?`);
    }

    Object.entries(options).forEach(([key, value]) => {
      if (value === undefined) {
        throw new TimestampError(`${key}_required`, `${key} is required after -${key.slice(0, 1)}`);
      }
    });

    // if (!fileRegex.test(path.basename(options.outPutFilePath))) {
    //   throw new TimestampError("invalid_filename", `Please enter a valid file name.`);
    // }

    if (options.templatePath && !fs.existsSync(options.templatePath)) {
      throw new TimestampError("template_not_exists", `Template file does not exist.`);
    }

    if (!isValidDateFormat(options.format)) {
      throw new TimestampError("invalid_format", `Please enter a valid format.`);
    }

    if (options.inlineTemplate !== "") {
      options.hasInlineTemplate = true;
    }

    if (options.hasInlineTemplate && options.inlineTemplate === "") {
      throw new TimestampError("invalid_inline_template", `Please provide a valid inline template.`);
    }

    if (options.templatePath && options.inlineTemplate != "") {
      throw new TimestampError("extra_template", `You can use only one template.`);
    }
  }

  return "successful";
}

function generateTimestamp(locale, format) {
  return moment().locale(locale).format(format);
}

function generateData(ts, { template, templatePath, inlineTemplate, hasInlineTemplate }) {
  let data;

  if (hasInlineTemplate) {
    data = inlineTemplate;
  } else if (templatePath) {
    try {
      data = fs.readFileSync(templatePath, { encoding: "utf8" });
    } catch (error) {
      throw new TimestampError("failed_to_read_file", `Failed to read template file at ${templatePath}`);
    }
  } else {
    data = template;
  }

  if (!data.includes("{ts}")) {
    throw new TimestampError("{ts}_placeholder_not_found", `Template does not contain {ts} placeholder.`);
  }

  return data.replace(/{ts}/g, ts);
}

function writeOutput(data, outPutFilePath) {
  fs.writeFileSync(outPutFilePath, data);
}

function isValidDateFormat(format) {
  try {
    moment().format(format);
    return true;
  } catch {
    return false;
  }
}

module.exports.ts = start;
module.exports.version = version;
module.exports.TimestampError = TimestampError;
