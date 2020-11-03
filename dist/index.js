module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3379:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

const core = __webpack_require__(2738);
const {avfs} = __webpack_require__(5164);

global.logger = core;

avfs.setRenderLayout(core.getInput('render-layout')).diff(
  core.getInput('read-path'),
  core.getInput('brace-expansion'),
  core.getInput('ignore-files'),
  core.getInput('ignore-directories')
).then(resolve => {
  this.exitCode = core.ExitCode.Success;
  global.logger.info(resolve.diff);
  return resolve.diff;
}, error => {
  this.exitCode = core.ExitCode.Failure;
  if (error.name && error.message) {
    global.logger.setFailed(`error message: ${error.message}`);
  }

  return error.message;
}).then(output => {
  global.logger.setOutput(output);
  return this.exitCode;
});


/***/ }),

/***/ 2679:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(2881);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2738:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(2679);
const file_command_1 = __webpack_require__(4648);
const utils_1 = __webpack_require__(2881);
const os = __importStar(__webpack_require__(2087));
const path = __importStar(__webpack_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 4648:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(5747));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(2881);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 2881:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5118:
/***/ ((module) => {

"use strict";


module.exports = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ 8537:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __webpack_require__(4915);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 6271:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ArraySpeciesCreate = __webpack_require__(4103);
var FlattenIntoArray = __webpack_require__(6433);
var Get = __webpack_require__(1302);
var ToInteger = __webpack_require__(8941);
var ToLength = __webpack_require__(5192);
var ToObject = __webpack_require__(7157);

module.exports = function flat() {
	var O = ToObject(this);
	var sourceLen = ToLength(Get(O, 'length'));

	var depthNum = 1;
	if (arguments.length > 0 && typeof arguments[0] !== 'undefined') {
		depthNum = ToInteger(arguments[0]);
	}

	var A = ArraySpeciesCreate(O, 0);
	FlattenIntoArray(A, O, sourceLen, 0, depthNum);
	return A;
};


/***/ }),

/***/ 3989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var define = __webpack_require__(2952);
var callBind = __webpack_require__(3518);

var implementation = __webpack_require__(6271);
var getPolyfill = __webpack_require__(2485);
var polyfill = getPolyfill();
var shim = __webpack_require__(1286);

var boundFlat = callBind(polyfill);

define(boundFlat, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = boundFlat;


/***/ }),

/***/ 2485:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(6271);

module.exports = function getPolyfill() {
	return Array.prototype.flat || implementation;
};


/***/ }),

/***/ 1286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var define = __webpack_require__(2952);
var getPolyfill = __webpack_require__(2485);

module.exports = function shimFlat() {
	var polyfill = getPolyfill();
	define(
		Array.prototype,
		{ flat: polyfill },
		{ flat: function () { return Array.prototype.flat !== polyfill; } }
	);
	return polyfill;
};


/***/ }),

/***/ 5466:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stringify = __webpack_require__(2751);
const compile = __webpack_require__(1824);
const expand = __webpack_require__(9890);
const parse = __webpack_require__(4427);

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

module.exports = braces;


/***/ }),

/***/ 1824:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fill = __webpack_require__(7845);
const utils = __webpack_require__(9857);

const compile = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      let range = fill(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

module.exports = compile;


/***/ }),

/***/ 4091:
/***/ ((module) => {

"use strict";


module.exports = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};


/***/ }),

/***/ 9890:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fill = __webpack_require__(7845);
const stringify = __webpack_require__(2751);
const utils = __webpack_require__(9857);

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;


/***/ }),

/***/ 4427:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stringify = __webpack_require__(2751);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __webpack_require__(4091);

/**
 * parse
 */

const parse = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;
  let memo = {};

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;


/***/ }),

/***/ 2751:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const utils = __webpack_require__(9857);

module.exports = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};



/***/ }),

/***/ 9857:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};


/***/ }),

/***/ 1728:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Wcwidth = __webpack_require__(7776);

module.exports = function (input, breakAtLength) {

  var str = input.toString();
  var charArr = [].concat(_toConsumableArray(str));
  var index = 0;
  var indexOfLastFitChar = 0;
  var fittableLength = 0;

  while (charArr.length > 0) {

    var char = charArr.shift();
    var currentLength = fittableLength + Wcwidth(char);

    if (currentLength <= breakAtLength) {
      indexOfLastFitChar = index;
      fittableLength = currentLength;
      index++;
    } else {
      break;
    }
  }

  //break after this character
  return indexOfLastFitChar;
};
//# sourceMappingURL=main.js.map


/***/ }),

/***/ 5024:
/***/ ((module) => {

"use strict";


const preserveCamelCase = input => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < input.length; i++) {
		const c = input[i];

		if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
			input = input.slice(0, i) + '-' + input.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
			input = input.slice(0, i - 1) + '-' + input.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = c.toLowerCase() === c;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = c.toUpperCase() === c;
		}
	}

	return input;
};

module.exports = (input, options) => {
	options = Object.assign({
		pascalCase: false
	}, options);

	const postProcess = x => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	if (input.length === 1) {
		return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
	}

	if (/^[a-z\d]+$/.test(input)) {
		return postProcess(input);
	}

	const hasUpperCase = input !== input.toLowerCase();

	if (hasUpperCase) {
		input = preserveCamelCase(input);
	}

	input = input
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

	return postProcess(input);
};


/***/ }),

/***/ 4478:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ansiStyles = __webpack_require__(8537);
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(2494);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(7362);

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = __webpack_require__(2016);
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

module.exports = chalk;


/***/ }),

/***/ 2016:
/***/ ((module) => {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

module.exports = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMessage);
	}

	return chunks.join('');
};


/***/ }),

/***/ 7362:
/***/ ((module) => {

"use strict";


const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};


/***/ }),

/***/ 5555:
/***/ ((module) => {

var clone = (function() {
'use strict';

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/
function clone(parent, circular, depth, prototype) {
  var filter;
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    filter = circular.filter;
    circular = circular.circular
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      if (Buffer.allocUnsafe) {
        // Node.js >= 4.5.0
        child = Buffer.allocUnsafe(parent.length);
      } else {
        // Older Node.js versions
        child = new Buffer(parent.length);
      }
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
};
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
};
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
};
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
};
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if ( true && module.exports) {
  module.exports = clone;
}


/***/ }),

/***/ 2123:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(288);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 4915:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const conversions = __webpack_require__(2123);
const route = __webpack_require__(6879);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 6879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const conversions = __webpack_require__(2123);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 288:
/***/ ((module) => {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 8304:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Generated by CoffeeScript 2.3.2
  // # CSV Generator

  // Please look at the [documentation](https://csv.js.org/generate/) for additional information.
var Generator, stream, util,
  indexOf = [].indexOf;

stream = __webpack_require__(2413);

util = __webpack_require__(1669);

// ## Usage  

// Stream API, for maximum of power:

// `generate([options])`

// Callback approach, for ease of use:

// `generate([options], callback)`

// ## Source Code
module.exports = function() {
  var callback, data, generator, options;
  if (arguments.length === 2) {
    options = arguments[0];
    callback = arguments[1];
  } else if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      options = {};
      callback = arguments[0];
    } else {
      options = arguments[0];
    }
  } else if (arguments.length === 0) {
    options = {};
  }
  generator = new Generator(options);
  if (callback) {
    data = [];
    generator.on('readable', function() {
      var d, results;
      results = [];
      while (d = generator.read()) {
        results.push(data.push(d));
      }
      return results;
    });
    generator.on('error', callback);
    generator.on('end', function() {
      if (!generator.options.objectMode) {
        if (generator.options.encoding) {
          data = data.join('');
        } else {
          data = Buffer.concat(data);
        }
      }
      return callback(null, data);
    });
  }
  return generator;
};

// ## `Generator([options])`

// Feel free to ask for new features and to participate by writting issues and preparing push requests.

// Options are documented [here](http://csv.js.org/generate/options/).
Generator = function(options = {}) {
  var accepted_header_types, base, base1, base10, base11, base2, base3, base4, base5, base6, base7, base8, base9, i, j, k, len, ref, v;
  if (options.high_water_mark) {
    // Convert Stream Readable options if underscored
    options.highWaterMark = options.high_water_mark;
  }
  if (options.object_mode) {
    options.objectMode = options.object_mode;
  }
  // Call parent constructor
  stream.Readable.call(this, options);
  // Clone and camelize options
  this.options = {};
  for (k in options) {
    v = options[k];
    this.options[Generator.camelize(k)] = v;
  }
  // Normalize options
  if ((base = this.options).columns == null) {
    base.columns = 8;
  }
  if ((base1 = this.options).delimiter == null) {
    base1.delimiter = ',';
  }
  if ((base2 = this.options).duration == null) {
    base2.duration = null;
  }
  if ((base3 = this.options).encoding == null) {
    base3.encoding = null;
  }
  if ((base4 = this.options).end == null) {
    base4.end = null;
  }
  if ((base5 = this.options).eof == null) {
    base5.eof = false;
  }
  if ((base6 = this.options).fixedSize == null) {
    base6.fixedSize = false;
  }
  if ((base7 = this.options).length == null) {
    base7.length = -1;
  }
  if ((base8 = this.options).maxWordLength == null) {
    base8.maxWordLength = 16;
  }
  if ((base9 = this.options).rowDelimiter == null) {
    base9.rowDelimiter = '\n';
  }
  if ((base10 = this.options).seed == null) {
    base10.seed = false;
  }
  if ((base11 = this.options).sleep == null) {
    base11.sleep = 0;
  }
  if (this.options.eof === true) {
    // Default values
    this.options.eof = this.options.rowDelimiter;
  }
  // State
  this._ = {
    start_time: this.options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0
  };
  if (typeof this.options.columns === 'number') {
    this.options.columns = new Array(this.options.columns);
  }
  accepted_header_types = Object.keys(Generator).filter(function(t) {
    return t !== 'super_' && t !== 'camelize';
  });
  ref = this.options.columns;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    v = ref[i];
    if (v == null) {
      v = 'ascii';
    }
    if (typeof v === 'string') {
      if (indexOf.call(accepted_header_types, v) < 0) {
        throw Error(`Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`);
      }
      this.options.columns[i] = Generator[v];
    }
  }
  return this;
};

util.inherits(Generator, stream.Readable);

module.exports.Generator = Generator;

// ## `Generator.prototype.random()`

// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
Generator.prototype.random = function() {
  if (this.options.seed) {
    return this.options.seed = this.options.seed * Math.PI * 100 % 100 / 100;
  } else {
    return Math.random();
  }
};

// ## `Generator.prototype.end()`

// Stop the generation.
Generator.prototype.end = function() {
  return this.push(null);
};

// ## `Generator.prototype._read(size)`

// Put new data into the read queue.
Generator.prototype._read = function(size) {
  var column, data, header, j, l, len, len1, len2, len3, length, line, lineLength, m, n, ref;
  // Already started
  data = [];
  length = this._.fixed_size_buffer.length;
  if (length) {
    data.push(this._.fixed_size_buffer);
  }
  while (true) {
    // Time for some rest: flush first and stop later
    if ((this._.count_created === this.options.length) || (this.options.end && Date.now() > this.options.end) || (this.options.duration && Date.now() > this._.start_time + this.options.duration)) {
      // Flush
      if (data.length) {
        if (this.options.objectMode) {
          for (j = 0, len = data.length; j < len; j++) {
            line = data[j];
            this.__push(line);
          }
        } else {
          this.__push(data.join('') + (this.options.eof ? this.options.eof : ''));
        }
      }
      // Stop
      return this.push(null);
    }
    // Create the line
    line = [];
    ref = this.options.columns;
    for (l = 0, len1 = ref.length; l < len1; l++) {
      header = ref[l];
      // Create the field
      line.push(`${header(this)}`);
    }
    // Obtain line length
    if (this.options.objectMode) {
      lineLength = 0;
      for (m = 0, len2 = line.length; m < len2; m++) {
        column = line[m];
        lineLength += column.length;
      }
    } else {
      // Stringify the line
      line = `${(this._.count_created === 0 ? '' : this.options.rowDelimiter)}${line.join(this.options.delimiter)}`;
      lineLength = line.length;
    }
    this._.count_created++;
    if (length + lineLength > size) {
      if (this.options.objectMode) {
        data.push(line);
        for (n = 0, len3 = data.length; n < len3; n++) {
          line = data[n];
          this.__push(line);
        }
      } else {
        if (this.options.fixedSize) {
          this._.fixed_size_buffer = line.substr(size - length);
          data.push(line.substr(0, size - length));
        } else {
          data.push(line);
        }
        this.__push(data.join(''));
      }
      break;
    }
    length += lineLength;
    data.push(line);
  }
};

// ## `Generator.prototype._read(size)`

// Put new data into the read queue.
Generator.prototype.__push = function(record) {
  this._.count_written++;
  if (this.options.sleep > 0) {
    return setTimeout(() => {
      return this.push(record);
    }, this.options.sleep);
  } else {
    return this.push(record);
  }
};

// ## `Generator.ascii(gen)`

// Generate an ASCII value.
Generator.ascii = function(gen) {
  var _, char, column, j, nb_chars, ref;
  // Column
  column = [];
  nb_chars = Math.ceil(gen.random() * gen.options.maxWordLength);
  for (_ = j = 0, ref = nb_chars; (0 <= ref ? j < ref : j > ref); _ = 0 <= ref ? ++j : --j) {
    char = Math.floor(gen.random() * 32);
    column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)));
  }
  return column.join('');
};

// ## `Generator.ascii(gen)`

// Generate an integer value.
Generator.int = function(gen) {
  return Math.floor(gen.random() * Math.pow(2, 52));
};

// ## `Generator.bool(gen)`

// Generate an boolean value.
Generator.bool = function(gen) {
  return Math.floor(gen.random() * 2);
};

// ## `Generator.camelize`
Generator.camelize = function(str) {
  return str.replace(/_([a-z])/gi, function(_, match, index) {
    return match.toUpperCase();
  });
};


/***/ }),

/***/ 48:
/***/ ((module) => {



class ResizeableBuffer{
  constructor(size=100){
    this.size = size
    this.length = 0
    this.buf = Buffer.alloc(size)
  }
  prepend(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    const buf = this.clone()
    this.buf[0] = val
    buf.copy(this.buf,1, 0, length)
  }
  append(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    this.buf[length] = val
  }
  clone(){
    return Buffer.from(this.buf.slice(0, this.length))
  }
  resize(){
    const length = this.length
    this.size = this.size * 2
    const buf = Buffer.alloc(this.size)
    this.buf.copy(buf,0, 0, length)
    this.buf = buf
  }
  toString(){
    return this.buf.slice(0, this.length).toString()
  }
  toJSON(){
    return this.toString()
  }
  reset(){
    this.length = 0
  }
}

module.exports = ResizeableBuffer


/***/ }),

/***/ 6549:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/*
CSV Parse

Please look at the [project documentation](https://csv.js.org/parse/) for
additional information.
*/

const { Transform } = __webpack_require__(2413)
const ResizeableBuffer = __webpack_require__(48)

const tab = 9
const nl = 10
const np = 12
const cr = 13
const space = 32
const bom_utf8 = Buffer.from([239, 187, 191])

class Parser extends Transform {
  constructor(opts = {}){
    super({...{readableObjectMode: true}, ...opts})
    const options = {}
    // Merge with user options
    for(let opt in opts){
      options[underscore(opt)] = opts[opt]
    }
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false
    }else if(options.bom !== true){
      throw new CsvError('CSV_INVALID_OPTION_BOM', [
        'Invalid option bom:', 'bom must be true,',
        `got ${JSON.stringify(options.bom)}`
      ])
    }
    // Normalize option `cast`
    let fnCastField = null
    if(options.cast === undefined || options.cast === null || options.cast === false || options.cast === ''){
      options.cast = undefined
    }else if(typeof options.cast === 'function'){
      fnCastField = options.cast
      options.cast = true
    }else if(options.cast !== true){
      throw new CsvError('CSV_INVALID_OPTION_CAST', [
        'Invalid option cast:', 'cast must be true or a function,',
        `got ${JSON.stringify(options.cast)}`
      ])
    }
    // Normalize option `cast_date`
    if(options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === ''){
      options.cast_date = false
    }else if(options.cast_date === true){
      options.cast_date = function(value){
        const date = Date.parse(value)
        return !isNaN(date) ? new Date(date) : value
      }
    }else if(typeof options.cast_date !== 'function'){
      throw new CsvError('CSV_INVALID_OPTION_CAST_DATE', [
        'Invalid option cast_date:', 'cast_date must be true or a function,',
        `got ${JSON.stringify(options.cast_date)}`
      ])
    }
    // Normalize option `columns`
    let fnFirstLineToHeaders = null
    if(options.columns === true){
      // Fields in the first line are converted as-is to columns
      fnFirstLineToHeaders = undefined
    }else if(typeof options.columns === 'function'){
      fnFirstLineToHeaders = options.columns
      options.columns = true
    }else if(Array.isArray(options.columns)){
      options.columns = normalizeColumnsArray(options.columns)
    }else if(options.columns === undefined || options.columns === null || options.columns === false){
      options.columns = false
    }else{
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS', [
        'Invalid option columns:',
        'expect an object, a function or true,',
        `got ${JSON.stringify(options.columns)}`
      ])
    }
    // Normalize option `columns_duplicates_to_array`
    if(options.columns_duplicates_to_array === undefined || options.columns_duplicates_to_array === null || options.columns_duplicates_to_array === false){
      options.columns_duplicates_to_array = false
    }else if(options.columns_duplicates_to_array !== true){
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY', [
        'Invalid option columns_duplicates_to_array:',
        'expect an boolean,',
        `got ${JSON.stringify(options.columns_duplicates_to_array)}`
      ])
    }
    // Normalize option `comment`
    if(options.comment === undefined || options.comment === null || options.comment === false || options.comment === ''){
      options.comment = null
    }else{
      if(typeof options.comment === 'string'){
        options.comment = Buffer.from(options.comment)
      }
      if(!Buffer.isBuffer(options.comment)){
        throw new CsvError('CSV_INVALID_OPTION_COMMENT', [
          'Invalid option comment:',
          'comment must be a buffer or a string,',
          `got ${JSON.stringify(options.comment)}`
        ])
      }
    }
    // Normalize option `delimiter`
    const delimiter_json = JSON.stringify(options.delimiter)
    if(!Array.isArray(options.delimiter)) options.delimiter = [options.delimiter]
    if(options.delimiter.length === 0){
      throw new CsvError('CSV_INVALID_OPTION_DELIMITER', [
        'Invalid option delimiter:',
        'delimiter must be a non empty string or buffer or array of string|buffer,',
        `got ${delimiter_json}`
      ])
    }
    options.delimiter = options.delimiter.map(function(delimiter){
      if(delimiter === undefined || delimiter === null || delimiter === false){
        return Buffer.from(',')
      }
      if(typeof delimiter === 'string'){
        delimiter = Buffer.from(delimiter)
      }
      if( !Buffer.isBuffer(delimiter) || delimiter.length === 0){
        throw new CsvError('CSV_INVALID_OPTION_DELIMITER', [
          'Invalid option delimiter:',
          'delimiter must be a non empty string or buffer or array of string|buffer,',
          `got ${delimiter_json}`
        ])
      }
      return delimiter
    })
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === true){
      options.escape = Buffer.from('"')
    }else if(typeof options.escape === 'string'){
      options.escape = Buffer.from(options.escape)
    }else if (options.escape === null || options.escape === false){
      options.escape = null
    }
    if(options.escape !== null){
      if(!Buffer.isBuffer(options.escape)){
        throw new Error(`Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`)
      }else if(options.escape.length !== 1){
        throw new Error(`Invalid Option Length: escape must be one character, got ${options.escape.length}`)
      }else{
        options.escape = options.escape[0]
      }
    }
    // Normalize option `from`
    if(options.from === undefined || options.from === null){
      options.from = 1
    }else{
      if(typeof options.from === 'string' && /\d+/.test(options.from)){
        options.from = parseInt(options.from)
      }
      if(Number.isInteger(options.from)){
        if(options.from < 0){
          throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`)
        }
      }else{
        throw new Error(`Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`)
      }
    }
    // Normalize option `from_line`
    if(options.from_line === undefined || options.from_line === null){
      options.from_line = 1
    }else{
      if(typeof options.from_line === 'string' && /\d+/.test(options.from_line)){
        options.from_line = parseInt(options.from_line)
      }
      if(Number.isInteger(options.from_line)){
        if(options.from_line <= 0){
          throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`)
        }
      }else{
        throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`)
      }
    }
    // Normalize option `info`
    if(options.info === undefined || options.info === null || options.info === false){
      options.info = false
    }else if(options.info !== true){
      throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`)
    }
    // Normalize option `max_record_size`
    if(options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false){
      options.max_record_size = 0
    }else if(Number.isInteger(options.max_record_size) && options.max_record_size >= 0){
      // Great, nothing to do
    }else if(typeof options.max_record_size === 'string' && /\d+/.test(options.max_record_size)){
      options.max_record_size = parseInt(options.max_record_size)
    }else{
      throw new Error(`Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`)
    }
    // Normalize option `objname`
    if(options.objname === undefined || options.objname === null || options.objname === false){
      options.objname = undefined
    }else if(Buffer.isBuffer(options.objname)){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty buffer`)
      }
      options.objname = options.objname.toString()
    }else if(typeof options.objname === 'string'){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty string`)
      }
      // Great, nothing to do
    }else{
      throw new Error(`Invalid Option: objname must be a string or a buffer, got ${options.objname}`)
    }
    // Normalize option `on_record`
    if(options.on_record === undefined || options.on_record === null){
      options.on_record = undefined
    }else if(typeof options.on_record !== 'function'){
      throw new CsvError('CSV_INVALID_OPTION_ON_RECORD', [
        'Invalid option `on_record`:',
        'expect a function,',
        `got ${JSON.stringify(options.on_record)}`
      ])
    }
    // Normalize option `quote`
    if(options.quote === null || options.quote === false || options.quote === ''){
      options.quote = null
    }else{
      if(options.quote === undefined || options.quote === true){
        options.quote = Buffer.from('"')
      }else if(typeof options.quote === 'string'){
        options.quote = Buffer.from(options.quote)
      }
      if(!Buffer.isBuffer(options.quote)){
        throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`)
      }else if(options.quote.length !== 1){
        throw new Error(`Invalid Option Length: quote must be one character, got ${options.quote.length}`)
      }else{
        options.quote = options.quote[0]
      }
    }
    // Normalize option `raw`
    if(options.raw === undefined || options.raw === null || options.raw === false){
      options.raw = false
    }else if(options.raw !== true){
      throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`)
    }
    // Normalize option `record_delimiter`
    if(!options.record_delimiter){
      options.record_delimiter = []
    }else if(!Array.isArray(options.record_delimiter)){
      options.record_delimiter = [options.record_delimiter]
    }
    options.record_delimiter = options.record_delimiter.map( function(rd){
      if(typeof rd === 'string'){
        rd = Buffer.from(rd)
      }
      return rd
    })
    // Normalize option `relax`
    if(typeof options.relax === 'boolean'){
      // Great, nothing to do
    }else if(options.relax === undefined || options.relax === null){
      options.relax = false
    }else{
      throw new Error(`Invalid Option: relax must be a boolean, got ${JSON.stringify(options.relax)}`)
    }
    // Normalize option `relax_column_count`
    if(typeof options.relax_column_count === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count === undefined || options.relax_column_count === null){
      options.relax_column_count = false
    }else{
      throw new Error(`Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`)
    }
    if(typeof options.relax_column_count_less === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count_less === undefined || options.relax_column_count_less === null){
      options.relax_column_count_less = false
    }else{
      throw new Error(`Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`)
    }
    if(typeof options.relax_column_count_more === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count_more === undefined || options.relax_column_count_more === null){
      options.relax_column_count_more = false
    }else{
      throw new Error(`Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`)
    }
    // Normalize option `skip_empty_lines`
    if(typeof options.skip_empty_lines === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_empty_lines === undefined || options.skip_empty_lines === null){
      options.skip_empty_lines = false
    }else{
      throw new Error(`Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`)
    }
    // Normalize option `skip_lines_with_empty_values`
    if(typeof options.skip_lines_with_empty_values === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_lines_with_empty_values === undefined || options.skip_lines_with_empty_values === null){
      options.skip_lines_with_empty_values = false
    }else{
      throw new Error(`Invalid Option: skip_lines_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_lines_with_empty_values)}`)
    }
    // Normalize option `skip_lines_with_error`
    if(typeof options.skip_lines_with_error === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_lines_with_error === undefined || options.skip_lines_with_error === null){
      options.skip_lines_with_error = false
    }else{
      throw new Error(`Invalid Option: skip_lines_with_error must be a boolean, got ${JSON.stringify(options.skip_lines_with_error)}`)
    }
    // Normalize option `rtrim`
    if(options.rtrim === undefined || options.rtrim === null || options.rtrim === false){
      options.rtrim = false
    }else if(options.rtrim !== true){
      throw new Error(`Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`)
    }
    // Normalize option `ltrim`
    if(options.ltrim === undefined || options.ltrim === null || options.ltrim === false){
      options.ltrim = false
    }else if(options.ltrim !== true){
      throw new Error(`Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`)
    }
    // Normalize option `trim`
    if(options.trim === undefined || options.trim === null || options.trim === false){
      options.trim = false
    }else if(options.trim !== true){
      throw new Error(`Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`)
    }
    // Normalize options `trim`, `ltrim` and `rtrim`
    if(options.trim === true && opts.ltrim !== false){
      options.ltrim = true
    }else if(options.ltrim !== true){
      options.ltrim = false
    }
    if(options.trim === true && opts.rtrim !== false){
      options.rtrim = true
    }else if(options.rtrim !== true){
      options.rtrim = false
    }
    // Normalize option `to`
    if(options.to === undefined || options.to === null){
      options.to = -1
    }else{
      if(typeof options.to === 'string' && /\d+/.test(options.to)){
        options.to = parseInt(options.to)
      }
      if(Number.isInteger(options.to)){
        if(options.to <= 0){
          throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`)
        }
      }else{
        throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`)
      }
    }
    // Normalize option `to_line`
    if(options.to_line === undefined || options.to_line === null){
      options.to_line = -1
    }else{
      if(typeof options.to_line === 'string' && /\d+/.test(options.to_line)){
        options.to_line = parseInt(options.to_line)
      }
      if(Number.isInteger(options.to_line)){
        if(options.to_line <= 0){
          throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`)
        }
      }else{
        throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`)
      }
    }
    this.info = {
      comment_lines: 0,
      empty_lines: 0,
      invalid_field_length: 0,
      lines: 1,
      records: 0
    }
    this.options = options
    this.state = {
      bomSkipped: false,
      castField: fnCastField,
      commenting: false,
      enabled: options.from_line === 1,
      escaping: false,
      escapeIsQuote: options.escape === options.quote,
      expectedRecordLength: options.columns === null ? 0 : options.columns.length,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      info: Object.assign({}, this.info),
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max(...options.record_delimiter.map( (v) => v.length)),
      trimChars: [Buffer.from(' ')[0], Buffer.from('\t')[0]],
      wasQuoting: false,
      wasRowDelimiter: false
    }
  }
  // Implementation of `Transform._transform`
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(buf, false)
    if(err !== undefined){
      this.state.stop = true
    }
    callback(err)
  }
  // Implementation of `Transform._flush`
  _flush(callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(undefined, true)
    callback(err)
  }
  // Central parser implementation
  __parse(nextBuf, end){
    const {bom, comment, escape, from_line, info, ltrim, max_record_size, quote, raw, relax, rtrim, skip_empty_lines, to, to_line} = this.options
    let {record_delimiter} = this.options
    const {bomSkipped, previousBuf, rawBuffer, escapeIsQuote} = this.state
    let buf
    if(previousBuf === undefined){
      if(nextBuf === undefined){
        // Handle empty string
        this.push(null)
        return
      }else{
        buf = nextBuf
      }
    }else if(previousBuf !== undefined && nextBuf === undefined){
      buf = previousBuf
    }else{
      buf = Buffer.concat([previousBuf, nextBuf])
    }
    // Handle UTF BOM
    if(bomSkipped === false){
      if(bom === false){
        this.state.bomSkipped = true
      }else if(buf.length < 3){
        // No enough data
        if(end === false){
          // Wait for more data
          this.state.previousBuf = buf
          return
        }
        // skip BOM detect because data length < 3
      }else{
        if(bom_utf8.compare(buf, 0, 3) === 0){
          // Skip BOM
          buf = buf.slice(3)
        }
        this.state.bomSkipped = true
      }
    }
    const bufLen = buf.length
    let pos
    for(pos = 0; pos < bufLen; pos++){
      // Ensure we get enough space to look ahead
      // There should be a way to move this out of the loop
      if(this.__needMoreData(pos, bufLen, end)){
        break
      }
      if(this.state.wasRowDelimiter === true){
        this.info.lines++
        if(info === true && this.state.record.length === 0 && this.state.field.length === 0 && this.state.wasQuoting === false){
          this.state.info = Object.assign({}, this.info)
        }
        this.state.wasRowDelimiter = false
      }
      if(to_line !== -1 && this.info.lines > to_line){
        this.state.stop = true
        this.push(null)
        return
      }
      // Auto discovery of record_delimiter, unix, mac and windows supported
      if(this.state.quoting === false && record_delimiter.length === 0){
        const record_delimiterCount = this.__autoDiscoverRowDelimiter(buf, pos)
        if(record_delimiterCount){
          record_delimiter = this.options.record_delimiter
        }
      }
      const chr = buf[pos]
      if(raw === true){
        rawBuffer.append(chr)
      }
      if((chr === cr || chr === nl) && this.state.wasRowDelimiter === false ){
        this.state.wasRowDelimiter = true
      }
      // Previous char was a valid escape char
      // treat the current char as a regular char
      if(this.state.escaping === true){
        this.state.escaping = false
      }else{
        // Escape is only active inside quoted fields
        // We are quoting, the char is an escape chr and there is a chr to escape
        if(escape !== null && this.state.quoting === true && chr === escape && pos + 1 < bufLen){
          if(escapeIsQuote){
            if(buf[pos+1] === quote){
              this.state.escaping = true
              continue
            }
          }else{
            this.state.escaping = true
            continue
          }
        }
        // Not currently escaping and chr is a quote
        // TODO: need to compare bytes instead of single char
        if(this.state.commenting === false && chr === quote){
          if(this.state.quoting === true){
            const nextChr = buf[pos+1]
            const isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr)
            // const isNextChrComment = nextChr === comment
            const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos+1, nextChr)
            const isNextChrDelimiter = this.__isDelimiter(nextChr, buf, pos+1)
            const isNextChrRowDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRowDelimiter(buf, pos+1) : this.__isRecordDelimiter(nextChr, buf, pos+1)
            // Escape a quote
            // Treat next char as a regular character
            // TODO: need to compare bytes instead of single char
            if(escape !== null && chr === escape && nextChr === quote){
              pos++
            }else if(!nextChr || isNextChrDelimiter || isNextChrRowDelimiter || isNextChrComment || isNextChrTrimable){
              this.state.quoting = false
              this.state.wasQuoting = true
              continue
            }else if(relax === false){
              const err = this.__error(
                new CsvError('CSV_INVALID_CLOSING_QUOTE', [
                  'Invalid Closing Quote:',
                  `got "${String.fromCharCode(nextChr)}"`,
                  `at line ${this.info.lines}`,
                  'instead of delimiter, row delimiter, trimable character',
                  '(if activated) or comment',
                ], this.__context())
              )
              if(err !== undefined) return err
            }else{
              this.state.quoting = false
              this.state.wasQuoting = true
              // continue
              this.state.field.prepend(quote)
            }
          }else{
            if(this.state.field.length !== 0){
              // In relax mode, treat opening quote preceded by chrs as regular
              if( relax === false ){
                const err = this.__error(
                  new CsvError('INVALID_OPENING_QUOTE', [
                    'Invalid Opening Quote:',
                    `a quote is found inside a field at line ${this.info.lines}`,
                  ], this.__context(), {
                    field: this.state.field,
                  })
                )
                if(err !== undefined) return err
              }
            }else{
              this.state.quoting = true
              continue
            }
          }
        }
        if(this.state.quoting === false){
          let recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos)
          if(recordDelimiterLength !== 0){
            // Do not emit comments which take a full line
            const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0)
            if(skipCommentLine){
              this.info.comment_lines++
              // Skip full comment line
            }else{
              // Skip if line is empty and skip_empty_lines activated
              if(skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0){
                this.info.empty_lines++
                pos += recordDelimiterLength - 1
                continue
              }
              // Activate records emition if above from_line
              if(this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1: 0 ) >= from_line){
                this.state.enabled = true
                this.__resetField()
                this.__resetRow()
                pos += recordDelimiterLength - 1
                continue
              }else{
                const errField = this.__onField()
                if(errField !== undefined) return errField
                const errRecord = this.__onRow()
                if(errRecord !== undefined) return errRecord
              }
              if(to !== -1 && this.info.records >= to){
                this.state.stop = true
                this.push(null)
                return
              }
            }
            this.state.commenting = false
            pos += recordDelimiterLength - 1
            continue
          }
          if(this.state.commenting){
            continue
          }
          const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr)
          if(commentCount !== 0){
            this.state.commenting = true
            continue
          }
          let delimiterLength = this.__isDelimiter(chr, buf, pos)
          if(delimiterLength !== 0){
            const errField = this.__onField()
            if(errField !== undefined) return errField
            pos += delimiterLength - 1
            continue
          }
        }
      }
      if(this.state.commenting === false){
        if(max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size){
          const err = this.__error(
            new CsvError('CSV_MAX_RECORD_SIZE', [
              'Max Record Size:',
              'record exceed the maximum number of tolerated bytes',
              `of ${max_record_size}`,
              `at line ${this.info.lines}`,
            ], this.__context())
          )
          if(err !== undefined) return err
        }
      }

      const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr)
      // rtrim in non quoting is handle in __onField
      const rappend = rtrim === false || this.state.wasQuoting === false
      if( lappend === true && rappend === true ){
        this.state.field.append(chr)
      }else if(rtrim === true && !this.__isCharTrimable(chr)){
        const err = this.__error(
          new CsvError('CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE', [
            'Invalid Closing Quote:',
            'found non trimable byte after quote',
            `at line ${this.info.lines}`,
          ], this.__context())
        )
        if(err !== undefined) return err
      }
    }
    if(end === true){
      // Ensure we are not ending in a quoting state
      if(this.state.quoting === true){
        const err = this.__error(
          new CsvError('CSV_QUOTE_NOT_CLOSED', [
            'Quote Not Closed:',
            `the parsing is finished with an opening quote at line ${this.info.lines}`,
          ], this.__context())
        )
        if(err !== undefined) return err
      }else{
        // Skip last line if it has no characters
        if(this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0){
          const errField = this.__onField()
          if(errField !== undefined) return errField
          const errRecord = this.__onRow()
          if(errRecord !== undefined) return errRecord
        }else if(this.state.wasRowDelimiter === true){
          this.info.empty_lines++
        }else if(this.state.commenting === true){
          this.info.comment_lines++
        }
      }
    }else{
      this.state.previousBuf = buf.slice(pos)
    }
    if(this.state.wasRowDelimiter === true){
      this.info.lines++
      this.state.wasRowDelimiter = false
    }
  }
  // Helper to test if a character is a space or a line delimiter
  __isCharTrimable(chr){
    return chr === space || chr === tab || chr === cr || chr === nl || chr === np
  }
  __onRow(){
    const {columns, columns_duplicates_to_array, info, from, relax_column_count, relax_column_count_less, relax_column_count_more, raw, skip_lines_with_empty_values} = this.options
    const {enabled, record} = this.state
    if(enabled === false){
      return this.__resetRow()
    }
    // Convert the first line into column names
    const recordLength = record.length
    if(columns === true){
      if(isRecordEmpty(record)){
        this.__resetRow()
        return
      }
      return this.__firstLineToColumns(record)
    }
    if(columns === false && this.info.records === 0){
      this.state.expectedRecordLength = recordLength
    }
    if(recordLength !== this.state.expectedRecordLength){
      if(relax_column_count === true || 
        (relax_column_count_less === true && recordLength < this.state.expectedRecordLength) ||
        (relax_column_count_more === true && recordLength > this.state.expectedRecordLength) ){
        this.info.invalid_field_length++
      }else{
        if(columns === false){
          const err = this.__error(
            new CsvError('CSV_INCONSISTENT_RECORD_LENGTH', [
              'Invalid Record Length:',
              `expect ${this.state.expectedRecordLength},`,
              `got ${recordLength} on line ${this.info.lines}`,
            ], this.__context(), {
              record: record,
            })
          )
          if(err !== undefined) return err
        }else{
          const err = this.__error(
            // CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS
            new CsvError('CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH', [
              'Invalid Record Length:',
              `columns length is ${columns.length},`, // rename columns
              `got ${recordLength} on line ${this.info.lines}`,
            ], this.__context(), {
              record: record,
            })
          )
          if(err !== undefined) return err
        }
      }
    }
    if(skip_lines_with_empty_values === true){
      if(isRecordEmpty(record)){
        this.__resetRow()
        return
      }
    }
    if(this.state.recordHasError === true){
      this.__resetRow()
      this.state.recordHasError = false
      return
    }
    this.info.records++
    if(from === 1 || this.info.records >= from){
      if(columns !== false){
        const obj = {}
        // Transform record array to an object
        for(let i = 0, l = record.length; i < l; i++){
          if(columns[i] === undefined || columns[i].disabled) continue
          // obj[columns[i].name] = record[i]
          // Turn duplicate columns into an array
          if (columns_duplicates_to_array === true && obj[columns[i].name]) {
            if (Array.isArray(obj[columns[i].name])) {
              obj[columns[i].name] = obj[columns[i].name].concat(record[i])
            } else {
              obj[columns[i].name] = [obj[columns[i].name], record[i]]
            }
          } else {
            obj[columns[i].name] = record[i]
          }
        }
        const {objname} = this.options
        if(objname === undefined){
          if(raw === true || info === true){
            const err = this.__push(Object.assign(
              {record: obj},
              (raw === true ? {raw: this.state.rawBuffer.toString()}: {}),
              (info === true ? {info: this.state.info}: {})
            ))
            if(err){
              return err
            }
          }else{
            const err = this.__push(obj)
            if(err){
              return err
            }
          }
        }else{
          if(raw === true || info === true){
            const err = this.__push(Object.assign(
              {record: [obj[objname], obj]},
              raw === true ? {raw: this.state.rawBuffer.toString()}: {},
              info === true ? {info: this.state.info}: {}
            ))
            if(err){
              return err
            }
          }else{
            const err = this.__push([obj[objname], obj])
            if(err){
              return err
            }
          }
        }
      }else{
        if(raw === true || info === true){
          const err = this.__push(Object.assign(
            {record: record},
            raw === true ? {raw: this.state.rawBuffer.toString()}: {},
            info === true ? {info: this.state.info}: {}
          ))
          if(err){
            return err
          }
        }else{
          const err = this.__push(record)
          if(err){
            return err
          }
        }
      }
    }
    this.__resetRow()
  }
  __firstLineToColumns(record){
    const {firstLineToHeaders} = this.state
    try{
      const headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record)
      if(!Array.isArray(headers)){
        return this.__error(
          new CsvError('CSV_INVALID_COLUMN_MAPPING', [
            'Invalid Column Mapping:',
            'expect an array from column function,',
            `got ${JSON.stringify(headers)}`
          ], this.__context(), {
            headers: headers,
          })
        )
      }
      const normalizedHeaders = normalizeColumnsArray(headers)
      this.state.expectedRecordLength = normalizedHeaders.length
      this.options.columns = normalizedHeaders
      this.__resetRow()
      return
    }catch(err){
      return err
    }
  }
  __resetRow(){
    if(this.options.raw === true){
      this.state.rawBuffer.reset()
    }
    this.state.record = []
    this.state.record_length = 0
  }
  __onField(){
    const {cast, rtrim, max_record_size} = this.options
    const {enabled, wasQuoting} = this.state
    // Short circuit for the from_line options
    if(enabled === false){ /* this.options.columns !== true && */
      return this.__resetField()
    }
    let field = this.state.field.toString()
    if(rtrim === true && wasQuoting === false){
      field = field.trimRight()
    }
    if(cast === true){
      const [err, f] = this.__cast(field)
      if(err !== undefined) return err
      field = f
    }
    this.state.record.push(field)
    // Increment record length if record size must not exceed a limit
    if(max_record_size !== 0 && typeof field === 'string'){
      this.state.record_length += field.length
    }
    this.__resetField()
  }
  __resetField(){
    this.state.field.reset()
    this.state.wasQuoting = false
  }
  __push(record){
    const {on_record} = this.options
    if(on_record !== undefined){
      const context = this.__context()
      try{
        record = on_record.call(null, record, context)
      }catch(err){
        return err
      }
      if(record === undefined || record === null){ return }
    }
    this.push(record)
  }
  // Return a tuple with the error and the casted value
  __cast(field){
    const {columns, relax_column_count} = this.options
    const isColumns = Array.isArray(columns)
    // Dont loose time calling cast
    // because the final record is an object
    // and this field can't be associated to a key present in columns
    if( isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length ){
      return [undefined, undefined]
    }
    const context = this.__context()
    if(this.state.castField !== null){
      try{
        return [undefined, this.state.castField.call(null, field, context)]
      }catch(err){
        return [err]
      }
    }
    if(this.__isFloat(field)){
      return [undefined, parseFloat(field)]
    }else if(this.options.cast_date !== false){
      return [undefined, this.options.cast_date.call(null, field, context)]
    }
    return [undefined, field]
  }
  // Keep it in case we implement the `cast_int` option
  // __isInt(value){
  //   // return Number.isInteger(parseInt(value))
  //   // return !isNaN( parseInt( obj ) );
  //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
  // }
  __isFloat(value){
    return (value - parseFloat( value ) + 1) >= 0 // Borrowed from jquery
  }
  __compareBytes(sourceBuf, targetBuf, pos, firtByte){
    if(sourceBuf[0] !== firtByte) return 0
    const sourceLength = sourceBuf.length
    for(let i = 1; i < sourceLength; i++){
      if(sourceBuf[i] !== targetBuf[pos+i]) return 0
    }
    return sourceLength
  }
  __needMoreData(i, bufLen, end){
    if(end){
      return false
    }
    const {comment, delimiter} = this.options
    const {quoting, recordDelimiterMaxLength} = this.state
    const numOfCharLeft = bufLen - i - 1
    const requiredLength = Math.max(
      // Skip if the remaining buffer smaller than comment
      comment ? comment.length : 0,
      // Skip if the remaining buffer smaller than row delimiter
      recordDelimiterMaxLength,
      // Skip if the remaining buffer can be row delimiter following the closing quote
      // 1 is for quote.length
      quoting ? (1 + recordDelimiterMaxLength) : 0,
      // Skip if the remaining buffer can be delimiter
      delimiter.length,
      // Skip if the remaining buffer can be escape sequence
      // 1 is for escape.length
      1
    )
    return numOfCharLeft < requiredLength
  }
  __isDelimiter(chr, buf, pos){
    const {delimiter} = this.options
    loop1: for(let i = 0; i < delimiter.length; i++){
      const del = delimiter[i]
      if(del[0] === chr){
        for(let j = 1; j < del.length; j++){
          if(del[j] !== buf[pos+j]) continue loop1
        }
        return del.length
      }
    }
    return 0
  }
  __isRecordDelimiter(chr, buf, pos){
    const {record_delimiter} = this.options
    const recordDelimiterLength = record_delimiter.length
    loop1: for(let i = 0; i < recordDelimiterLength; i++){
      const rd = record_delimiter[i]
      const rdLength = rd.length
      if(rd[0] !== chr){
        continue
      }
      for(let j = 1; j < rdLength; j++){
        if(rd[j] !== buf[pos+j]){
          continue loop1
        }
      }
      return rd.length
    }
    return 0
  }
  __autoDiscoverRowDelimiter(buf, pos){
    const chr = buf[pos]
    if(chr === cr){
      if(buf[pos+1] === nl){
        this.options.record_delimiter.push(Buffer.from('\r\n'))
        this.state.recordDelimiterMaxLength = 2
        return 2
      }else{
        this.options.record_delimiter.push(Buffer.from('\r'))
        this.state.recordDelimiterMaxLength = 1
        return 1
      }
    }else if(chr === nl){
      this.options.record_delimiter.push(Buffer.from('\n'))
      this.state.recordDelimiterMaxLength = 1
      return 1
    }
    return 0
  }
  __error(msg){
    const {skip_lines_with_error} = this.options
    const err = typeof msg === 'string' ? new Error(msg) : msg
    if(skip_lines_with_error){
      this.state.recordHasError = true
      this.emit('skip', err)
      return undefined
    }else{
      return err
    }
  }
  __context(){
    const {columns} = this.options
    const isColumns = Array.isArray(columns)
    return {
      column: isColumns === true ?
        ( columns.length > this.state.record.length ?
          columns[this.state.record.length].name :
          null
        ) :
        this.state.record.length,
      empty_lines: this.info.empty_lines,
      header: columns === true,
      index: this.state.record.length,
      invalid_field_length: this.info.invalid_field_length,
      quoting: this.state.wasQuoting,
      lines: this.info.lines,
      records: this.info.records
    }
  }
}

const parse = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ])
    }
  }
  const parser = new Parser(options)
  if(callback){
    const records = options === undefined || options.objname === undefined ? [] : {}
    parser.on('readable', function(){
      let record
      while((record = this.read()) !== null){
        if(options === undefined || options.objname === undefined){
          records.push(record)
        }else{
          records[record[0]] = record[1]
        }
      }
    })
    parser.on('error', function(err){
      callback(err, undefined, parser.info)
    })
    parser.on('end', function(){
      callback(undefined, records, parser.info)
    })
  }
  if(data !== undefined){
    // Give a chance for events to be registered later
    if(typeof setImmediate === 'function'){
      setImmediate(function(){
        parser.write(data)
        parser.end()
      })
    }else{
      parser.write(data)
      parser.end()
    }
  }
  return parser
}

class CsvError extends Error {
  constructor(code, message, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ')
    super(message)
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError)
    }
    this.code = code
    for(const context of contexts){
      for(const key in context){
        const value = context[key]
        this[key] = Buffer.isBuffer(value) ? value.toString() : value == null ? value : JSON.parse(JSON.stringify(value))
      }
    }
  }
}

parse.Parser = Parser

parse.CsvError = CsvError

module.exports = parse

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase()
  })
}

const isObject = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj))
}

const isRecordEmpty = function(record){
  return record.every( (field) => field == null || field.toString && field.toString().trim() === '' )
}

const normalizeColumnsArray = function(columns){
  const normalizedColumns = [];
  for(let i = 0, l = columns.length; i < l; i++){
    const column = columns[i]
    if(column === undefined || column === null || column === false){
      normalizedColumns[i] = { disabled: true }
    }else if(typeof column === 'string'){
      normalizedColumns[i] = { name: column }
    }else if(isObject(column)){
      if(typeof column.name !== 'string'){
        throw new CsvError('CSV_OPTION_COLUMNS_MISSING_NAME', [
          'Option columns missing name:',
          `property "name" is required at position ${i}`,
          'when column is an object literal'
        ])
      }
      normalizedColumns[i] = column
    }else{
      throw new CsvError('CSV_INVALID_COLUMN_DEFINITION', [
        'Invalid column definition:',
        'expect a string or a literal object,',
        `got ${JSON.stringify(column)} at position ${i}`
      ])
    }
  }
  return normalizedColumns;
}


/***/ }),

/***/ 6318:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/*
CSV Stringify

Please look at the [project documentation](https://csv.js.org/stringify/) for
additional information.
*/

const { Transform } = __webpack_require__(2413)
const bom_utf8 = Buffer.from([239, 187, 191])

class Stringifier extends Transform {
  constructor(opts = {}){
    super({...{writableObjectMode: true}, ...opts})
    const options = {}
    let err
    // Merge with user options
    for(let opt in opts){
      options[underscore(opt)] = opts[opt]
    }
    if(err = this.normalize(options)) throw err
    switch(options.record_delimiter){
      case 'auto':
        options.record_delimiter = null
        break
      case 'unix':
        options.record_delimiter = "\n"
        break
      case 'mac':
        options.record_delimiter = "\r"
        break
      case 'windows':
        options.record_delimiter = "\r\n"
        break
      case 'ascii':
        options.record_delimiter = "\u001e"
        break
      case 'unicode':
        options.record_delimiter = "\u2028"
        break
    }
    // Expose options
    this.options = options
    // Internal state
    this.state = {
      stop: false
    }
    // Information
    this.info = {
      records: 0
    }
    this
  }
  normalize(options){
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false
    }else if(options.bom !== true){
      return new CsvError('CSV_OPTION_BOOLEAN_INVALID_TYPE', [
        'option `bom` is optional and must be a boolean value,',
        `got ${JSON.stringify(options.bom)}`
      ])
    }
    // Normalize option `delimiter`
    if(options.delimiter === undefined || options.delimiter === null){
      options.delimiter = ','
    }else if(Buffer.isBuffer(options.delimiter)){
      options.delimiter = options.delimiter.toString()
    }else if(typeof options.delimiter !== 'string'){
      return new CsvError('CSV_OPTION_DELIMITER_INVALID_TYPE', [
        'option `delimiter` must be a buffer or a string,',
        `got ${JSON.stringify(options.delimiter)}`
      ])
    }
    // Normalize option `quote`
    if(options.quote === undefined || options.quote === null){
      options.quote = '"'
    }else if(options.quote === true){
      options.quote = '"'
    }else if(options.quote === false){
      options.quote = ''
    }else if (Buffer.isBuffer(options.quote)){
      options.quote = options.quote.toString()
    }else if(typeof options.quote !== 'string'){
      return new CsvError('CSV_OPTION_QUOTE_INVALID_TYPE', [
        'option `quote` must be a boolean, a buffer or a string,',
        `got ${JSON.stringify(options.quote)}`
      ])
    }
    // Normalize option `quoted`
    if(options.quoted === undefined || options.quoted === null){
      options.quoted = false
    }else{
      // todo
    }
    // Normalize option `quoted_empty`
    if(options.quoted_empty === undefined || options.quoted_empty === null){
      options.quoted_empty = undefined
    }else{
      // todo
    }
    // Normalize option `quoted_match`
    if(options.quoted_match === undefined || options.quoted_match === null || options.quoted_match === false){
      options.quoted_match = null
    }else if(!Array.isArray(options.quoted_match)){
      options.quoted_match = [options.quoted_match]
    }
    if(options.quoted_match){
      for(let quoted_match of options.quoted_match){
        const isString = typeof quoted_match === 'string'
        const isRegExp = quoted_match instanceof RegExp
        if(!isString && !isRegExp){
          return Error(`Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`)
        }
      }
    }
    // Normalize option `quoted_string`
    if(options.quoted_string === undefined || options.quoted_string === null){
      options.quoted_string = false
    }else{
      // todo
    }
    // Normalize option `eof`
    if(options.eof === undefined || options.eof === null){
      options.eof = true
    }else{
      // todo
    }
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === null){
      options.escape = '"'
    }else if(Buffer.isBuffer(options.escape)){
      options.escape = options.escape.toString()
    }else if(typeof options.escape !== 'string'){
      return Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`)
    }
    if (options.escape.length > 1){
      return Error(`Invalid Option: escape must be one character, got ${options.escape.length} characters`)
    }
    // Normalize option `header`
    if(options.header === undefined || options.header === null){
      options.header = false
    }else{
      // todo
    }
    // Normalize option `columns`
    options.columns = this.normalize_columns(options.columns)
    // Normalize option `quoted`
    if(options.quoted === undefined || options.quoted === null){
      options.quoted = false
    }else{
      // todo
    }
    // Normalize option `cast`
    if(options.cast === undefined || options.cast === null){
      options.cast = {}
    }else{
      // todo
    }
    // Normalize option cast.bigint
    if(options.cast.bigint === undefined || options.cast.bigint === null){
      // Cast boolean to string by default
      options.cast.bigint = value => '' + value
    }
    // Normalize option cast.boolean
    if(options.cast.boolean === undefined || options.cast.boolean === null){
      // Cast boolean to string by default
      options.cast.boolean = value => value ? '1' : ''
    }
    // Normalize option cast.date
    if(options.cast.date === undefined || options.cast.date === null){
      // Cast date to timestamp string by default
      options.cast.date = value => '' + value.getTime()
    }
    // Normalize option cast.number
    if(options.cast.number === undefined || options.cast.number === null){
      // Cast number to string using native casting by default
      options.cast.number = value => '' + value
    }
    // Normalize option cast.object
    if(options.cast.object === undefined || options.cast.object === null){
      // Stringify object as JSON by default
      options.cast.object = value => JSON.stringify(value)
    }
    // Normalize option cast.string
    if(options.cast.string === undefined || options.cast.string === null){
      // Leave string untouched
      options.cast.string = function(value){return value}
    }
    // Normalize option `record_delimiter`
    if(options.record_delimiter === undefined || options.record_delimiter === null){
      options.record_delimiter = '\n'
    }else if(Buffer.isBuffer(options.record_delimiter)){
      options.record_delimiter = options.record_delimiter.toString()
    }else if(typeof options.record_delimiter !== 'string'){
      return Error(`Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(options.record_delimiter)}`)
    }
  }
  _transform(chunk, encoding, callback){
    if(this.state.stop === true){
      return
    }
    // Chunk validation
    if(!Array.isArray(chunk) && typeof chunk !== 'object'){
      this.state.stop = true
      return callback(Error(`Invalid Record: expect an array or an object, got ${JSON.stringify(chunk)}`))
    }
    // Detect columns from the first record
    if(this.info.records === 0){
      if(Array.isArray(chunk)){
        if(this.options.header === true && !this.options.columns){
          this.state.stop = true
          return callback(Error('Undiscoverable Columns: header option requires column option or object records'))
        }
      }else if(this.options.columns === undefined || this.options.columns === null){
        this.options.columns = this.normalize_columns(Object.keys(chunk))
      }
    }
    // Emit the header
    if(this.info.records === 0){
      this.bom()
      this.headers()
    }
    // Emit and stringify the record if an object or an array
    try{
      this.emit('record', chunk, this.info.records)
    }catch(err){
      this.state.stop = true
      return this.emit('error', err)
    }
    // Convert the record into a string
    if(this.options.eof){
      chunk = this.stringify(chunk)
      if(chunk === undefined){
        return
      }else{
        chunk = chunk + this.options.record_delimiter
      }
    }else{
      chunk = this.stringify(chunk)
      if(chunk === undefined){
        return
      }else{
        if(this.options.header || this.info.records){
          chunk = this.options.record_delimiter + chunk
        }
      }
    }
    // Emit the csv
    this.info.records++
    this.push(chunk)
    callback()
    null
  }
  _flush(callback){
    if(this.info.records === 0){
      this.bom()
      this.headers()
    }
    callback()
    null
  }
  stringify(chunk, chunkIsHeader=false){
    if(typeof chunk !== 'object'){
      return chunk
    }
    const {columns, header} = this.options
    const record = []
    // Record is an array
    if(Array.isArray(chunk)){
      // We are getting an array but the user has specified output columns. In
      // this case, we respect the columns indexes
      if(columns){
        chunk.splice(columns.length)
      }
      // Cast record elements
      for(let i=0; i<chunk.length; i++){
        const field = chunk[i]
        const [err, value] = this.__cast(field, {
          index: i, column: i, records: this.info.records, header: chunkIsHeader
        })
        if(err){
          this.emit('error', err)
          return
        }
        record[i] = [value, field]
      }
    // Record is a literal object
    }else{
      if(columns){
        for(let i=0; i<columns.length; i++){
          const field = get(chunk, columns[i].key)
          const [err, value] = this.__cast(field, {
            index: i, column: columns[i].key, records: this.info.records, header: chunkIsHeader
          })
          if(err){
            this.emit('error', err)
            return
          }
          record[i] = [value, field]
        }
      }else{
        for(let column of chunk){
          const field = chunk[column]
          const [err, value] = this.__cast(field, {
            index: i, column: columns[i].key, records: this.info.records, header: chunkIsHeader
          })
          if(err){
            this.emit('error', err)
            return
          }
          record.push([value, field])
        }
      }
    }
    let csvrecord = ''
    for(let i=0; i<record.length; i++){
      let options, err
      let [value, field] = record[i]
      if(typeof value === "string"){
        options = this.options
      }else if(isObject(value)){
        // let { value, ...options } = value
        options = value
        value = options.value
        delete options.value
        if(typeof value !== "string" && value !== undefined && value !== null){
          this.emit("error", Error(`Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`))
          return
        }
        options = {...this.options, ...options}
        if(err = this.normalize(options)){
          this.emit("error", err)
          return
        }
      }else if(value === undefined || value === null){
        options = this.options
      }else{
        this.emit("error", Error(`Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`))
        return
      }
      const {delimiter, escape, quote, quoted, quoted_empty, quoted_string, quoted_match, record_delimiter} = options
      if(value){
        if(typeof value !== 'string'){
          this.emit("error", Error(`Formatter must return a string, null or undefined, got ${JSON.stringify(value)}`))
          return null
        }
        const containsdelimiter = delimiter.length && value.indexOf(delimiter) >= 0
        const containsQuote = (quote !== '') && value.indexOf(quote) >= 0
        const containsEscape = value.indexOf(escape) >= 0 && (escape !== quote)
        const containsRecordDelimiter = value.indexOf(record_delimiter) >= 0
        const quotedString = quoted_string && typeof field === 'string'
        let quotedMatch = quoted_match && quoted_match.filter( quoted_match => {
          if(typeof quoted_match === 'string'){
            return value.indexOf(quoted_match) !== -1
          }else{
            return quoted_match.test(value)
          }
        })
        quotedMatch = quotedMatch && quotedMatch.length > 0
        const shouldQuote = containsQuote === true || containsdelimiter || containsRecordDelimiter || quoted || quotedString || quotedMatch
        if(shouldQuote === true && containsEscape === true){
          const regexp = escape === '\\'
          ? new RegExp(escape + escape, 'g')
          : new RegExp(escape, 'g')
          value = value.replace(regexp, escape + escape)
        }
        if(containsQuote === true){
          const regexp = new RegExp(quote,'g')
          value = value.replace(regexp, escape + quote)
        }
        if(shouldQuote === true){
          value = quote + value + quote
        }
        csvrecord += value
      }else if(quoted_empty === true || (field === '' && quoted_string === true && quoted_empty !== false)){
        csvrecord += quote + quote
      }
      if(i !== record.length - 1){
        csvrecord += delimiter
      }
    }
    return csvrecord
  }
  bom(){
    if(this.options.bom !== true){
      return
    }
    this.push(bom_utf8)
  }
  headers(){
    if(this.options.header === false){
      return
    }
    if(this.options.columns === undefined){
      return
    }
    let headers = this.options.columns.map(column => column.header)
    if(this.options.eof){
      headers = this.stringify(headers, true) + this.options.record_delimiter
    }else{
      headers = this.stringify(headers)
    }
    this.push(headers)
  }
  __cast(value, context){
    const type = typeof value
    try{
      if(type === 'string'){ // Fine for 99% of the cases
        return [undefined, this.options.cast.string(value, context)]
      }else if(type === 'bigint'){
        return [undefined, this.options.cast.bigint(value, context)]
      }else if(type === 'number'){
        return [undefined, this.options.cast.number(value, context)]
      }else if(type === 'boolean'){
        return [undefined, this.options.cast.boolean(value, context)]
      }else if(value instanceof Date){
        return [undefined, this.options.cast.date(value, context)]
      }else if(type === 'object' && value !== null){
        return [undefined, this.options.cast.object(value, context)]
      }else{
        return [undefined, value, value]
      }
    }catch(err){
      return [err]
    }
  }
  normalize_columns(columns){
    if(columns === undefined || columns === null){
      return undefined
    }
    if(typeof columns !== 'object'){
      throw Error('Invalid option "columns": expect an array or an object')
    }
    if(!Array.isArray(columns)){
      const newcolumns = []
      for(let k in columns){
        newcolumns.push({
          key: k,
          header: columns[k]
        })
      }
      columns = newcolumns
    }else{
      const newcolumns = []
      for(let column of columns){
        if(typeof column === 'string'){
          newcolumns.push({
            key: column,
            header: column
          })
        }else if(typeof column === 'object' && column !== undefined && !Array.isArray(column)){
          if(!column.key){
            throw Error('Invalid column definition: property "key" is required')
          }
          if(column.header === undefined){
            column.header = column.key
          }
          newcolumns.push(column)
        }else{
          throw Error('Invalid column definition: expect a string or an object')
        }
      }
      columns = newcolumns
    }
    return columns
  }
}

const stringify = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (Array.isArray(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ])
    }
  }
  const stringifier = new Stringifier(options)
  if(callback){
    const chunks = []
    stringifier.on('readable', function(){
      let chunk
      while((chunk = this.read()) !== null){
        chunks.push(chunk)
      }
    })
    stringifier.on('error', function(err){
      callback(err)
    })
    stringifier.on('end', function(){
      callback(undefined, chunks.join(''))
    })
  }
  if(data !== undefined){
    // Give a chance for events to be registered later
    if(typeof setImmediate === 'function'){
      setImmediate(function(){
        for(let record of data){
          stringifier.write(record)
        }
        stringifier.end()
      })
    }else{
      for(let record of data){
        stringifier.write(record)
      }
      stringifier.end()
    }
  }
  return stringifier
}

class CsvError extends Error {
  constructor(code, message, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ')
    super(message)
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError)
    }
    this.code = code
    for(const context of contexts){
      for(const key in context){
        const value = context[key]
        this[key] = Buffer.isBuffer(value) ? value.toString() : value == null ? value : JSON.parse(JSON.stringify(value))
      }
    }
  }
}

stringify.Stringifier = Stringifier

stringify.CsvError = CsvError

module.exports = stringify

const isObject = function(obj){
  return typeof obj === 'object' && obj !== null && ! Array.isArray(obj)
}

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase()
  })
}

// Lodash implementation of `get`

const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
, 'g')
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
const reIsPlainProp = /^\w*$/
const getTag = function(value){
  if(!value)
    value === undefined ? '[object Undefined]' : '[object Null]'
  return Object.prototype.toString.call(value)
}
const isKey = function(value, object){
  if(Array.isArray(value)){
    return false
  }
  const type = typeof value
  if(type === 'number' || type === 'symbol' || type === 'boolean' || !value || isSymbol(value)){
    return true
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
}
const isSymbol = function(value){
  const type = typeof value
  return type === 'symbol' || (type === 'object' && value && getTag(value) === '[object Symbol]')
}
const stringToPath = function(string){
  const result = []
  if(string.charCodeAt(0) === charCodeOfDot){
    result.push('')
  }
  string.replace(rePropName, function(match, expression, quote, subString){
    let key = match
    if(quote){
      key = subString.replace(reEscapeChar, '$1')
    }else if(expression){
      key = expression.trim()
    }
    result.push(key)
  })
  return result
}
const castPath = function(value, object){
  if(Array.isArray(value)){
    return value
  } else {
    return isKey(value, object) ? [value] : stringToPath(value)
  }
}
const toKey = function(value){
  if(typeof value === 'string' || isSymbol(value))
    return value
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}
const get = function(object, path){
  path = castPath(path, object)
  let index = 0
  const length = path.length
  while(object != null && index < length){
    object = object[toKey(path[index++])]
  }
  return (index && index === length) ? object : undefined
}


/***/ }),

/***/ 629:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// Alias to the ES6 modules exposing the stream and callback APIs

module.exports = {
  generate: __webpack_require__(8304),
  parse: __webpack_require__(6549),
  transform: __webpack_require__(9963),
  stringify: __webpack_require__(6318)
}


/***/ }),

/***/ 7325:
/***/ ((module) => {

"use strict";

module.exports = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	sep = typeof sep === 'undefined' ? '_' : sep;

	return str
		.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
		.toLowerCase();
};


/***/ }),

/***/ 6490:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var clone = __webpack_require__(5555);

module.exports = function(options, defaults) {
  options = options || {};

  Object.keys(defaults).forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      options[key] = clone(defaults[key]);
    }
  });

  return options;
};

/***/ }),

/***/ 2952:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keys = __webpack_require__(3772);
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;


/***/ }),

/***/ 2646:
/***/ ((module) => {

"use strict";


module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ 4103:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Array = GetIntrinsic('%Array%');
var $species = GetIntrinsic('%Symbol.species%', true);
var $TypeError = GetIntrinsic('%TypeError%');

var Get = __webpack_require__(1302);
var IsArray = __webpack_require__(1863);
var IsConstructor = __webpack_require__(1853);
var IsInteger = __webpack_require__(8750);
var Type = __webpack_require__(6890);

// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate

module.exports = function ArraySpeciesCreate(originalArray, length) {
	if (!IsInteger(length) || length < 0) {
		throw new $TypeError('Assertion failed: length must be an integer >= 0');
	}
	var len = length === 0 ? 0 : length;
	var C;
	var isArray = IsArray(originalArray);
	if (isArray) {
		C = Get(originalArray, 'constructor');
		// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
		// if (IsConstructor(C)) {
		// 	if C is another realm's Array, C = undefined
		// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
		// }
		if ($species && Type(C) === 'Object') {
			C = Get(C, $species);
			if (C === null) {
				C = void 0;
			}
		}
	}
	if (typeof C === 'undefined') {
		return $Array(len);
	}
	if (!IsConstructor(C)) {
		throw new $TypeError('C must be a constructor');
	}
	return new C(len); // Construct(C, len);
};



/***/ }),

/***/ 4568:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);
var callBound = __webpack_require__(5948);

var $apply = GetIntrinsic('%Reflect.apply%', true) || callBound('%Function.prototype.apply%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-call

module.exports = function Call(F, V) {
	var args = arguments.length > 2 ? arguments[2] : [];
	return $apply(F, V, args);
};


/***/ }),

/***/ 5102:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var DefineOwnProperty = __webpack_require__(9568);

var FromPropertyDescriptor = __webpack_require__(7757);
var OrdinaryGetOwnProperty = __webpack_require__(6863);
var IsDataDescriptor = __webpack_require__(1528);
var IsExtensible = __webpack_require__(3732);
var IsPropertyKey = __webpack_require__(5221);
var SameValue = __webpack_require__(4504);
var Type = __webpack_require__(6890);

// https://www.ecma-international.org/ecma-262/6.0/#sec-createdataproperty

module.exports = function CreateDataProperty(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var oldDesc = OrdinaryGetOwnProperty(O, P);
	var extensible = !oldDesc || IsExtensible(O);
	var immutable = oldDesc && (!oldDesc['[[Writable]]'] || !oldDesc['[[Configurable]]']);
	if (immutable || !extensible) {
		return false;
	}
	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		{
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		}
	);
};


/***/ }),

/***/ 8918:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var CreateDataProperty = __webpack_require__(5102);
var IsPropertyKey = __webpack_require__(5221);
var Type = __webpack_require__(6890);

// // https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow

module.exports = function CreateDataPropertyOrThrow(O, P, V) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}
	var success = CreateDataProperty(O, P, V);
	if (!success) {
		throw new $TypeError('unable to create data property');
	}
	return success;
};


/***/ }),

/***/ 7010:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var isPropertyDescriptor = __webpack_require__(5301);
var DefineOwnProperty = __webpack_require__(9568);

var FromPropertyDescriptor = __webpack_require__(7757);
var IsAccessorDescriptor = __webpack_require__(1624);
var IsDataDescriptor = __webpack_require__(1528);
var IsPropertyKey = __webpack_require__(5221);
var SameValue = __webpack_require__(4504);
var ToPropertyDescriptor = __webpack_require__(5297);
var Type = __webpack_require__(6890);

// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow

module.exports = function DefinePropertyOrThrow(O, P, desc) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}

	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
	}

	var Desc = isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, desc) ? desc : ToPropertyDescriptor(desc);
	if (!isPropertyDescriptor({
		Type: Type,
		IsDataDescriptor: IsDataDescriptor,
		IsAccessorDescriptor: IsAccessorDescriptor
	}, Desc)) {
		throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
	}

	return DefineOwnProperty(
		IsDataDescriptor,
		SameValue,
		FromPropertyDescriptor,
		O,
		P,
		Desc
	);
};


/***/ }),

/***/ 6433:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var MAX_SAFE_INTEGER = __webpack_require__(8500);

var Call = __webpack_require__(4568);
var CreateDataPropertyOrThrow = __webpack_require__(8918);
var Get = __webpack_require__(1302);
var HasProperty = __webpack_require__(5134);
var IsArray = __webpack_require__(1863);
var ToLength = __webpack_require__(5192);
var ToString = __webpack_require__(4559);

// https://ecma-international.org/ecma-262/10.0/#sec-flattenintoarray

// eslint-disable-next-line max-params, max-statements
module.exports = function FlattenIntoArray(target, source, sourceLen, start, depth) {
	var mapperFunction;
	if (arguments.length > 5) {
		mapperFunction = arguments[5];
	}

	var targetIndex = start;
	var sourceIndex = 0;
	while (sourceIndex < sourceLen) {
		var P = ToString(sourceIndex);
		var exists = HasProperty(source, P);
		if (exists === true) {
			var element = Get(source, P);
			if (typeof mapperFunction !== 'undefined') {
				if (arguments.length <= 6) {
					throw new $TypeError('Assertion failed: thisArg is required when mapperFunction is provided');
				}
				element = Call(mapperFunction, arguments[6], [element, sourceIndex, source]);
			}
			var shouldFlatten = false;
			if (depth > 0) {
				shouldFlatten = IsArray(element);
			}
			if (shouldFlatten) {
				var elementLen = ToLength(Get(element, 'length'));
				targetIndex = FlattenIntoArray(target, element, elementLen, targetIndex, depth - 1);
			} else {
				if (targetIndex >= MAX_SAFE_INTEGER) {
					throw new $TypeError('index too large');
				}
				CreateDataPropertyOrThrow(target, ToString(targetIndex), element);
				targetIndex += 1;
			}
		}
		sourceIndex += 1;
	}

	return targetIndex;
};


/***/ }),

/***/ 7757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var assertRecord = __webpack_require__(1107);

var Type = __webpack_require__(6890);

// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor

module.exports = function FromPropertyDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return Desc;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	var obj = {};
	if ('[[Value]]' in Desc) {
		obj.value = Desc['[[Value]]'];
	}
	if ('[[Writable]]' in Desc) {
		obj.writable = Desc['[[Writable]]'];
	}
	if ('[[Get]]' in Desc) {
		obj.get = Desc['[[Get]]'];
	}
	if ('[[Set]]' in Desc) {
		obj.set = Desc['[[Set]]'];
	}
	if ('[[Enumerable]]' in Desc) {
		obj.enumerable = Desc['[[Enumerable]]'];
	}
	if ('[[Configurable]]' in Desc) {
		obj.configurable = Desc['[[Configurable]]'];
	}
	return obj;
};


/***/ }),

/***/ 1302:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var inspect = __webpack_require__(7870);

var IsPropertyKey = __webpack_require__(5221);
var Type = __webpack_require__(6890);

/**
 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
 * 1. Assert: Type(O) is Object.
 * 2. Assert: IsPropertyKey(P) is true.
 * 3. Return O.[[Get]](P, O).
 */

module.exports = function Get(O, P) {
	// 7.3.1.1
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: Type(O) is not Object');
	}
	// 7.3.1.2
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
	}
	// 7.3.1.3
	return O[P];
};


/***/ }),

/***/ 5134:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var IsPropertyKey = __webpack_require__(5221);
var Type = __webpack_require__(6890);

// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty

module.exports = function HasProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: `O` must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: `P` must be a Property Key');
	}
	return P in O;
};


/***/ }),

/***/ 1624:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var has = __webpack_require__(7944);

var assertRecord = __webpack_require__(1107);

var Type = __webpack_require__(6890);

// https://www.ecma-international.org/ecma-262/6.0/#sec-isaccessordescriptor

module.exports = function IsAccessorDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
		return false;
	}

	return true;
};


/***/ }),

/***/ 1863:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Array = GetIntrinsic('%Array%');

// eslint-disable-next-line global-require
var toStr = !$Array.isArray && __webpack_require__(5948)('Object.prototype.toString');

// https://www.ecma-international.org/ecma-262/6.0/#sec-isarray

module.exports = $Array.isArray || function IsArray(argument) {
	return toStr(argument) === '[object Array]';
};


/***/ }),

/***/ 7849:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.11

module.exports = __webpack_require__(7842);


/***/ }),

/***/ 1853:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $construct = GetIntrinsic('%Reflect.construct%', true);

var DefinePropertyOrThrow = __webpack_require__(7010);
try {
	DefinePropertyOrThrow({}, '', { '[[Get]]': function () {} });
} catch (e) {
	// Accessor properties aren't supported
	DefinePropertyOrThrow = null;
}

// https://www.ecma-international.org/ecma-262/6.0/#sec-isconstructor

if (DefinePropertyOrThrow && $construct) {
	var isConstructorMarker = {};
	var badArrayLike = {};
	DefinePropertyOrThrow(badArrayLike, 'length', {
		'[[Get]]': function () {
			throw isConstructorMarker;
		},
		'[[Enumerable]]': true
	});

	module.exports = function IsConstructor(argument) {
		try {
			// `Reflect.construct` invokes `IsConstructor(target)` before `Get(args, 'length')`:
			$construct(argument, badArrayLike);
		} catch (err) {
			return err === isConstructorMarker;
		}
	};
} else {
	module.exports = function IsConstructor(argument) {
		// unfortunately there's no way to truly check this without try/catch `new argument` in old environments
		return typeof argument === 'function' && !!argument.prototype;
	};
}


/***/ }),

/***/ 1528:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var has = __webpack_require__(7944);

var assertRecord = __webpack_require__(1107);

var Type = __webpack_require__(6890);

// https://www.ecma-international.org/ecma-262/6.0/#sec-isdatadescriptor

module.exports = function IsDataDescriptor(Desc) {
	if (typeof Desc === 'undefined') {
		return false;
	}

	assertRecord(Type, 'Property Descriptor', 'Desc', Desc);

	if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
		return false;
	}

	return true;
};


/***/ }),

/***/ 3732:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Object = GetIntrinsic('%Object%');

var isPrimitive = __webpack_require__(8480);

var $preventExtensions = $Object.preventExtensions;
var $isExtensible = $Object.isExtensible;

// https://www.ecma-international.org/ecma-262/6.0/#sec-isextensible-o

module.exports = $preventExtensions
	? function IsExtensible(obj) {
		return !isPrimitive(obj) && $isExtensible(obj);
	}
	: function IsExtensible(obj) {
		return !isPrimitive(obj);
	};


/***/ }),

/***/ 8750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Math = GetIntrinsic('%Math%');

var $floor = $Math.floor;
var $abs = $Math.abs;

var $isNaN = __webpack_require__(7895);
var $isFinite = __webpack_require__(9735);

// https://www.ecma-international.org/ecma-262/6.0/#sec-isinteger

module.exports = function IsInteger(argument) {
	if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
		return false;
	}
	var abs = $abs(argument);
	return $floor(abs) === abs;
};


/***/ }),

/***/ 5221:
/***/ ((module) => {

"use strict";


// https://www.ecma-international.org/ecma-262/6.0/#sec-ispropertykey

module.exports = function IsPropertyKey(argument) {
	return typeof argument === 'string' || typeof argument === 'symbol';
};


/***/ }),

/***/ 2467:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $match = GetIntrinsic('%Symbol.match%', true);

var hasRegExpMatcher = __webpack_require__(9878);

var ToBoolean = __webpack_require__(4248);

// https://ecma-international.org/ecma-262/6.0/#sec-isregexp

module.exports = function IsRegExp(argument) {
	if (!argument || typeof argument !== 'object') {
		return false;
	}
	if ($match) {
		var isRegExp = argument[$match];
		if (typeof isRegExp !== 'undefined') {
			return ToBoolean(isRegExp);
		}
	}
	return hasRegExpMatcher(argument);
};


/***/ }),

/***/ 6863:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $gOPD = __webpack_require__(2468);
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = __webpack_require__(5948);

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var has = __webpack_require__(7944);

var IsArray = __webpack_require__(1863);
var IsPropertyKey = __webpack_require__(5221);
var IsRegExp = __webpack_require__(2467);
var ToPropertyDescriptor = __webpack_require__(5297);
var Type = __webpack_require__(6890);

// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty

module.exports = function OrdinaryGetOwnProperty(O, P) {
	if (Type(O) !== 'Object') {
		throw new $TypeError('Assertion failed: O must be an Object');
	}
	if (!IsPropertyKey(P)) {
		throw new $TypeError('Assertion failed: P must be a Property Key');
	}
	if (!has(O, P)) {
		return void 0;
	}
	if (!$gOPD) {
		// ES3 / IE 8 fallback
		var arrayLength = IsArray(O) && P === 'length';
		var regexLastIndex = IsRegExp(O) && P === 'lastIndex';
		return {
			'[[Configurable]]': !(arrayLength || regexLastIndex),
			'[[Enumerable]]': $isEnumerable(O, P),
			'[[Value]]': O[P],
			'[[Writable]]': true
		};
	}
	return ToPropertyDescriptor($gOPD(O, P));
};


/***/ }),

/***/ 7022:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(6322);


/***/ }),

/***/ 4504:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $isNaN = __webpack_require__(7895);

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.12

module.exports = function SameValue(x, y) {
	if (x === y) { // 0 === -0, but they are not identical.
		if (x === 0) { return 1 / x === 1 / y; }
		return true;
	}
	return $isNaN(x) && $isNaN(y);
};


/***/ }),

/***/ 4248:
/***/ ((module) => {

"use strict";


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.2

module.exports = function ToBoolean(value) { return !!value; };


/***/ }),

/***/ 8941:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ES5ToInteger = __webpack_require__(1416);

var ToNumber = __webpack_require__(870);

// https://www.ecma-international.org/ecma-262/6.0/#sec-tointeger

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	return ES5ToInteger(number);
};


/***/ }),

/***/ 5192:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var MAX_SAFE_INTEGER = __webpack_require__(8500);

var ToInteger = __webpack_require__(8941);

module.exports = function ToLength(argument) {
	var len = ToInteger(argument);
	if (len <= 0) { return 0; } // includes converting -0 to +0
	if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
	return len;
};


/***/ }),

/***/ 870:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');
var $Number = GetIntrinsic('%Number%');
var $RegExp = GetIntrinsic('%RegExp%');
var $parseInteger = GetIntrinsic('%parseInt%');

var callBound = __webpack_require__(5948);
var regexTester = __webpack_require__(9821);
var isPrimitive = __webpack_require__(8480);

var $strSlice = callBound('String.prototype.slice');
var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var $trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ToPrimitive = __webpack_require__(7365);

// https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber

module.exports = function ToNumber(argument) {
	var value = isPrimitive(argument) ? argument : ToPrimitive(argument, $Number);
	if (typeof value === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a number');
	}
	if (typeof value === 'string') {
		if (isBinary(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 2));
		} else if (isOctal(value)) {
			return ToNumber($parseInteger($strSlice(value, 2), 8));
		} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
			return NaN;
		} else {
			var trimmed = $trim(value);
			if (trimmed !== value) {
				return ToNumber(trimmed);
			}
		}
	}
	return $Number(value);
};


/***/ }),

/***/ 7157:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Object = GetIntrinsic('%Object%');

var RequireObjectCoercible = __webpack_require__(7022);

// https://www.ecma-international.org/ecma-262/6.0/#sec-toobject

module.exports = function ToObject(value) {
	RequireObjectCoercible(value);
	return $Object(value);
};


/***/ }),

/***/ 7365:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var toPrimitive = __webpack_require__(2608);

// https://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive

module.exports = function ToPrimitive(input) {
	if (arguments.length > 1) {
		return toPrimitive(input, arguments[1]);
	}
	return toPrimitive(input);
};


/***/ }),

/***/ 5297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var has = __webpack_require__(7944);

var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

var Type = __webpack_require__(6890);
var ToBoolean = __webpack_require__(4248);
var IsCallable = __webpack_require__(7849);

// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5

module.exports = function ToPropertyDescriptor(Obj) {
	if (Type(Obj) !== 'Object') {
		throw new $TypeError('ToPropertyDescriptor requires an object');
	}

	var desc = {};
	if (has(Obj, 'enumerable')) {
		desc['[[Enumerable]]'] = ToBoolean(Obj.enumerable);
	}
	if (has(Obj, 'configurable')) {
		desc['[[Configurable]]'] = ToBoolean(Obj.configurable);
	}
	if (has(Obj, 'value')) {
		desc['[[Value]]'] = Obj.value;
	}
	if (has(Obj, 'writable')) {
		desc['[[Writable]]'] = ToBoolean(Obj.writable);
	}
	if (has(Obj, 'get')) {
		var getter = Obj.get;
		if (typeof getter !== 'undefined' && !IsCallable(getter)) {
			throw new $TypeError('getter must be a function');
		}
		desc['[[Get]]'] = getter;
	}
	if (has(Obj, 'set')) {
		var setter = Obj.set;
		if (typeof setter !== 'undefined' && !IsCallable(setter)) {
			throw new $TypeError('setter must be a function');
		}
		desc['[[Set]]'] = setter;
	}

	if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
		throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
	}
	return desc;
};


/***/ }),

/***/ 4559:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

// https://www.ecma-international.org/ecma-262/6.0/#sec-tostring

module.exports = function ToString(argument) {
	if (typeof argument === 'symbol') {
		throw new $TypeError('Cannot convert a Symbol value to a string');
	}
	return $String(argument);
};


/***/ }),

/***/ 6890:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var ES5Type = __webpack_require__(2109);

// https://ecma-international.org/ecma-262/6.0/#sec-ecmascript-data-types-and-values

module.exports = function Type(x) {
	if (typeof x === 'symbol') {
		return 'Symbol';
	}
	return ES5Type(x);
};


/***/ }),

/***/ 6322:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.10

module.exports = function CheckObjectCoercible(value, optMessage) {
	if (value == null) {
		throw new $TypeError(optMessage || ('Cannot call method on ' + value));
	}
	return value;
};


/***/ }),

/***/ 1416:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Math = GetIntrinsic('%Math%');

var ToNumber = __webpack_require__(1870);
var $isNaN = __webpack_require__(7895);
var $isFinite = __webpack_require__(9735);
var $sign = __webpack_require__(9552);

var $floor = $Math.floor;
var $abs = $Math.abs;

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.4

module.exports = function ToInteger(value) {
	var number = ToNumber(value);
	if ($isNaN(number)) { return 0; }
	if (number === 0 || !$isFinite(number)) { return number; }
	return $sign(number) * $floor($abs(number));
};


/***/ }),

/***/ 1870:
/***/ ((module) => {

"use strict";


// http://www.ecma-international.org/ecma-262/5.1/#sec-9.3

module.exports = function ToNumber(value) {
	return +value; // eslint-disable-line no-implicit-coercion
};


/***/ }),

/***/ 2109:
/***/ ((module) => {

"use strict";


// https://www.ecma-international.org/ecma-262/5.1/#sec-8

module.exports = function Type(x) {
	if (x === null) {
		return 'Null';
	}
	if (typeof x === 'undefined') {
		return 'Undefined';
	}
	if (typeof x === 'function' || typeof x === 'object') {
		return 'Object';
	}
	if (typeof x === 'number') {
		return 'Number';
	}
	if (typeof x === 'boolean') {
		return 'Boolean';
	}
	if (typeof x === 'string') {
		return 'String';
	}
};


/***/ }),

/***/ 926:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* globals
	Atomics,
	SharedArrayBuffer,
*/

var undefined;

var $TypeError = TypeError;

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () { throw new $TypeError(); };
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(6113)();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var generator; // = function * () {};
var generatorFunction = generator ? getProto(generator) : undefined;
var asyncFn; // async function() {};
var asyncFunction = asyncFn ? asyncFn.constructor : undefined;
var asyncGen; // async function * () {};
var asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;
var asyncGenIterator = asyncGen ? asyncGen() : undefined;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%ArrayPrototype%': Array.prototype,
	'%ArrayProto_entries%': Array.prototype.entries,
	'%ArrayProto_forEach%': Array.prototype.forEach,
	'%ArrayProto_keys%': Array.prototype.keys,
	'%ArrayProto_values%': Array.prototype.values,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': asyncFunction,
	'%AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,
	'%AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,
	'%AsyncGeneratorFunction%': asyncGenFunction,
	'%AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,
	'%AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%Boolean%': Boolean,
	'%BooleanPrototype%': Boolean.prototype,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,
	'%Date%': Date,
	'%DatePrototype%': Date.prototype,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%ErrorPrototype%': Error.prototype,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%EvalErrorPrototype%': EvalError.prototype,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,
	'%Function%': Function,
	'%FunctionPrototype%': Function.prototype,
	'%Generator%': generator ? getProto(generator()) : undefined,
	'%GeneratorFunction%': generatorFunction,
	'%GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%JSONParse%': typeof JSON === 'object' ? JSON.parse : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,
	'%Math%': Math,
	'%Number%': Number,
	'%NumberPrototype%': Number.prototype,
	'%Object%': Object,
	'%ObjectPrototype%': Object.prototype,
	'%ObjProto_toString%': Object.prototype.toString,
	'%ObjProto_valueOf%': Object.prototype.valueOf,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,
	'%PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,
	'%Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,
	'%Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,
	'%Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%RangeErrorPrototype%': RangeError.prototype,
	'%ReferenceError%': ReferenceError,
	'%ReferenceErrorPrototype%': ReferenceError.prototype,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%RegExpPrototype%': RegExp.prototype,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%StringPrototype%': String.prototype,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,
	'%SyntaxError%': SyntaxError,
	'%SyntaxErrorPrototype%': SyntaxError.prototype,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,
	'%TypeError%': $TypeError,
	'%TypeErrorPrototype%': $TypeError.prototype,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,
	'%URIError%': URIError,
	'%URIErrorPrototype%': URIError.prototype,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
	'%WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype
};

var bind = __webpack_require__(4717);
var $replace = bind.call(Function.call, String.prototype.replace);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : (number || match);
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	if (!(name in INTRINSICS)) {
		throw new SyntaxError('intrinsic ' + name + ' does not exist!');
	}

	// istanbul ignore if // hopefully this is impossible to test :-)
	if (typeof INTRINSICS[name] === 'undefined' && !allowMissing) {
		throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
	}

	return INTRINSICS[name];
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);

	var value = getBaseIntrinsic('%' + (parts.length > 0 ? parts[0] : '') + '%', allowMissing);
	for (var i = 1; i < parts.length; i += 1) {
		if (value != null) {
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, parts[i]);
				if (!allowMissing && !(parts[i] in value)) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				value = desc && 'get' in desc && !('originalValue' in desc.get) ? desc.get : value[parts[i]];
			} else {
				value = value[parts[i]];
			}
		}
	}
	return value;
};


/***/ }),

/***/ 9568:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

var callBound = __webpack_require__(5948);

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

// eslint-disable-next-line max-params
module.exports = function DefineOwnProperty(IsDataDescriptor, SameValue, FromPropertyDescriptor, O, P, desc) {
	if (!$defineProperty) {
		if (!IsDataDescriptor(desc)) {
			// ES3 does not support getters/setters
			return false;
		}
		if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
			return false;
		}

		// fallback for ES3
		if (P in O && $isEnumerable(O, P) !== !!desc['[[Enumerable]]']) {
			// a non-enumerable existing property
			return false;
		}

		// property does not exist at all, or exists but is enumerable
		var V = desc['[[Value]]'];
		// eslint-disable-next-line no-param-reassign
		O[P] = V; // will use [[Define]]
		return SameValue(O[P], V);
	}
	$defineProperty(O, P, FromPropertyDescriptor(desc));
	return true;
};


/***/ }),

/***/ 1107:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var has = __webpack_require__(7944);

var predicates = {
	// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	'Property Descriptor': function isPropertyDescriptor(Type, Desc) {
		if (Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		for (var key in Desc) { // eslint-disable-line
			if (has(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = has(Desc, '[[Value]]');
		var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	}
};

module.exports = function assertRecord(Type, recordType, argumentName, value) {
	var predicate = predicates[recordType];
	if (typeof predicate !== 'function') {
		throw new $SyntaxError('unknown record type: ' + recordType);
	}
	if (!predicate(Type, value)) {
		throw new $TypeError(argumentName + ' must be a ' + recordType);
	}
};


/***/ }),

/***/ 3518:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(4717);

var GetIntrinsic = __webpack_require__(926);

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind() {
	return $reflectApply(bind, $call, arguments);
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ 5948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var callBind = __webpack_require__(3518);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ 2468:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ 9735:
/***/ ((module) => {

"use strict";


var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };


/***/ }),

/***/ 7895:
/***/ ((module) => {

"use strict";


module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};


/***/ }),

/***/ 8480:
/***/ ((module) => {

"use strict";


module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};


/***/ }),

/***/ 5301:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var has = __webpack_require__(7944);
var $TypeError = GetIntrinsic('%TypeError%');

module.exports = function IsPropertyDescriptor(ES, Desc) {
	if (ES.Type(Desc) !== 'Object') {
		return false;
	}
	var allowed = {
		'[[Configurable]]': true,
		'[[Enumerable]]': true,
		'[[Get]]': true,
		'[[Set]]': true,
		'[[Value]]': true,
		'[[Writable]]': true
	};

	for (var key in Desc) { // eslint-disable-line no-restricted-syntax
		if (has(Desc, key) && !allowed[key]) {
			return false;
		}
	}

	if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
		throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
	}
	return true;
};


/***/ }),

/***/ 8500:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $Math = GetIntrinsic('%Math%');
var $Number = GetIntrinsic('%Number%');

module.exports = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;


/***/ }),

/***/ 9821:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(926);

var $test = GetIntrinsic('RegExp.prototype.test');

var callBind = __webpack_require__(3518);

module.exports = function regexTester(regex) {
	return callBind($test, regex);
};


/***/ }),

/***/ 9552:
/***/ ((module) => {

"use strict";


module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};


/***/ }),

/***/ 2608:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = __webpack_require__(401);
var isCallable = __webpack_require__(7842);
var isDate = __webpack_require__(2308);
var isSymbol = __webpack_require__(5950);

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
	return void 0;
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (arguments[1] === String) {
			hint = 'string';
		} else if (arguments[1] === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};


/***/ }),

/***/ 401:
/***/ ((module) => {

"use strict";


module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};


/***/ }),

/***/ 7845:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */



const util = __webpack_require__(1669);
const toRegexRange = __webpack_require__(8741);

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber(start) && isNumber(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;


/***/ }),

/***/ 773:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const path = __webpack_require__(5622);
const locatePath = __webpack_require__(3665);
const pathExists = __webpack_require__(2271);

const stop = Symbol('findUp.stop');

module.exports = async (name, options = {}) => {
	let directory = path.resolve(options.cwd || '');
	const {root} = path.parse(directory);
	const paths = [].concat(name);

	const runMatcher = async locateOptions => {
		if (typeof name !== 'function') {
			return locatePath(paths, locateOptions);
		}

		const foundPath = await name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath([foundPath], locateOptions);
		}

		return foundPath;
	};

	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const foundPath = await runMatcher({...options, cwd: directory});

		if (foundPath === stop) {
			return;
		}

		if (foundPath) {
			return path.resolve(directory, foundPath);
		}

		if (directory === root) {
			return;
		}

		directory = path.dirname(directory);
	}
};

module.exports.sync = (name, options = {}) => {
	let directory = path.resolve(options.cwd || '');
	const {root} = path.parse(directory);
	const paths = [].concat(name);

	const runMatcher = locateOptions => {
		if (typeof name !== 'function') {
			return locatePath.sync(paths, locateOptions);
		}

		const foundPath = name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath.sync([foundPath], locateOptions);
		}

		return foundPath;
	};

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const foundPath = runMatcher({...options, cwd: directory});

		if (foundPath === stop) {
			return;
		}

		if (foundPath) {
			return path.resolve(directory, foundPath);
		}

		if (directory === root) {
			return;
		}

		directory = path.dirname(directory);
	}
};

module.exports.exists = pathExists;

module.exports.sync.exists = pathExists.sync;

module.exports.stop = stop;


/***/ }),

/***/ 6111:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 4717:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(6111);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 9349:
/***/ ((module) => {

"use strict";

// Call this function in a another function to find out the file from
// which that function was called from. (Inspects the v8 stack trace)
//
// Inspired by http://stackoverflow.com/questions/13227489
module.exports = function getCallerFile(position) {
    if (position === void 0) { position = 2; }
    if (position >= Error.stackTraceLimit) {
        throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
    }
    var oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    if (stack !== null && typeof stack === 'object') {
        // stack[0] holds this file
        // stack[1] holds where this function was called
        // stack[2] holds the file we're interested in
        return stack[position] ? stack[position].getFileName() : undefined;
    }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8273:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 6113:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = global.Symbol;
var hasSymbolSham = __webpack_require__(2179);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 2179:
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 7944:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(4717);

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ 7842:
/***/ ((module) => {

"use strict";


var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = reflectApply
	? function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value);
	}
	: function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		return strClass === fnClass || strClass === genClass;
	};


/***/ }),

/***/ 2308:
/***/ ((module) => {

"use strict";


var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};


/***/ }),

/***/ 3321:
/***/ ((module) => {

"use strict";
/* eslint-disable yoda */


const isFullwidthCodePoint = codePoint => {
	if (Number.isNaN(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		codePoint >= 0x1100 && (
			codePoint <= 0x115F || // Hangul Jamo
			codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
			// Hangul Jamo Extended-A
			(0xA960 <= codePoint && codePoint <= 0xA97C) ||
			// Hangul Syllables
			(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
			// CJK Compatibility Ideographs
			(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
			// Vertical Forms
			(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
			// Halfwidth and Fullwidth Forms
			(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
			(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
			// Kana Supplement
			(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
			// Enclosed Ideographic Supplement
			(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= codePoint && codePoint <= 0x3FFFD)
		)
	) {
		return true;
	}

	return false;
};

module.exports = isFullwidthCodePoint;
module.exports.default = isFullwidthCodePoint;


/***/ }),

/***/ 8654:
/***/ ((module) => {

"use strict";
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */



module.exports = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};


/***/ }),

/***/ 9878:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasSymbols = __webpack_require__(6113)();
var hasToStringTag = hasSymbols && typeof Symbol.toStringTag === 'symbol';
var hasOwnProperty;
var regexExec;
var isRegexMarker;
var badStringifier;

if (hasToStringTag) {
	hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
	regexExec = Function.call.bind(RegExp.prototype.exec);
	isRegexMarker = {};

	var throwRegexMarker = function () {
		throw isRegexMarker;
	};
	badStringifier = {
		toString: throwRegexMarker,
		valueOf: throwRegexMarker
	};

	if (typeof Symbol.toPrimitive === 'symbol') {
		badStringifier[Symbol.toPrimitive] = throwRegexMarker;
	}
}

var toStr = Object.prototype.toString;
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';

module.exports = hasToStringTag
	// eslint-disable-next-line consistent-return
	? function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && hasOwnProperty(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		try {
			regexExec(value, badStringifier);
		} catch (e) {
			return e === isRegexMarker;
		}
	}
	: function isRegex(value) {
		// In older browsers, typeof regex incorrectly returns 'function'
		if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
			return false;
		}

		return toStr.call(value) === regexClass;
	};


/***/ }),

/***/ 5950:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var toStr = Object.prototype.toString;
var hasSymbols = __webpack_require__(6113)();

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return  false && 0;
	};
}


/***/ }),

/***/ 1506:
/***/ ((module) => {

"use strict";


const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

const $ = {
	enabled: !NODE_DISABLE_COLORS && TERM !== 'dumb' && FORCE_COLOR !== '0',

	// modifiers
	reset: init(0, 0),
	bold: init(1, 22),
	dim: init(2, 22),
	italic: init(3, 23),
	underline: init(4, 24),
	inverse: init(7, 27),
	hidden: init(8, 28),
	strikethrough: init(9, 29),

	// colors
	black: init(30, 39),
	red: init(31, 39),
	green: init(32, 39),
	yellow: init(33, 39),
	blue: init(34, 39),
	magenta: init(35, 39),
	cyan: init(36, 39),
	white: init(37, 39),
	gray: init(90, 39),
	grey: init(90, 39),

	// background colors
	bgBlack: init(40, 49),
	bgRed: init(41, 49),
	bgGreen: init(42, 49),
	bgYellow: init(43, 49),
	bgBlue: init(44, 49),
	bgMagenta: init(45, 49),
	bgCyan: init(46, 49),
	bgWhite: init(47, 49)
};

function run(arr, str) {
	let i=0, tmp, beg='', end='';
	for (; i < arr.length; i++) {
		tmp = arr[i];
		beg += tmp.open;
		end += tmp.close;
		if (str.includes(tmp.close)) {
			str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
	}
	return beg + str + end;
}

function chain(has, keys) {
	let ctx = { has, keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);
	ctx.grey = $.grey.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	return ctx;
}

function init(open, close) {
	let blk = {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
	return function (txt) {
		if (this !== void 0 && this.has !== void 0) {
			this.has.includes(open) || (this.has.push(open),this.keys.push(blk));
			return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
		}
		return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
	};
}

module.exports = $;


/***/ }),

/***/ 3665:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const path = __webpack_require__(5622);
const fs = __webpack_require__(5747);
const {promisify} = __webpack_require__(1669);
const pLocate = __webpack_require__(562);

const fsStat = promisify(fs.stat);
const fsLStat = promisify(fs.lstat);

const typeMappings = {
	directory: 'isDirectory',
	file: 'isFile'
};

function checkType({type}) {
	if (type in typeMappings) {
		return;
	}

	throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => type === undefined || stat[typeMappings[type]]();

module.exports = async (paths, options) => {
	options = {
		cwd: process.cwd(),
		type: 'file',
		allowSymlinks: true,
		...options
	};
	checkType(options);
	const statFn = options.allowSymlinks ? fsStat : fsLStat;

	return pLocate(paths, async path_ => {
		try {
			const stat = await statFn(path.resolve(options.cwd, path_));
			return matchType(options.type, stat);
		} catch (_) {
			return false;
		}
	}, options);
};

module.exports.sync = (paths, options) => {
	options = {
		cwd: process.cwd(),
		allowSymlinks: true,
		type: 'file',
		...options
	};
	checkType(options);
	const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync;

	for (const path_ of paths) {
		try {
			const stat = statFn(path.resolve(options.cwd, path_));

			if (matchType(options.type, stat)) {
				return path_;
			}
		} catch (_) {
		}
	}
};


/***/ }),

/***/ 4036:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

// Generated by CoffeeScript 2.4.1
var _snake_case;

exports.merge = function merge() {
  return exports.mutate.apply(void 0, [{}].concat(Array.prototype.slice.call(arguments)));
};

exports.clone = function clone(target) {
  if (Array.isArray(target)) {
    return target.map(function (element) {
      return exports.clone(element);
    });
  } else if (target && _typeof(target) === 'object') {
    return exports.mutate({}, target);
  } else {
    return target;
  }
};

exports.mutate = function mutate() {
  var i, j, name, ref, source, target, v;
  target = arguments[0];

  for (i = j = 1, ref = arguments.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
    source = arguments[i];

    if (exports.is_object_literal(source)) {
      if (!exports.is_object_literal(target)) {
        target = {};
      }

      for (name in source) {
        target[name] = exports.mutate(target[name], source[name]);
      }
    } else if (Array.isArray(source)) {
      target = function () {
        var k, len, results;
        results = [];

        for (k = 0, len = source.length; k < len; k++) {
          v = source[k];
          results.push(exports.mutate(void 0, v));
        }

        return results;
      }();
    } else if (source !== void 0) {
      target = source;
    }
  }

  return target;
};

exports.snake_case = function snake_case(source) {
  var convert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var name, src, target, u;
  target = {};

  if (exports.is_object_literal(source)) {
    u = typeof convert === 'number' && convert > 0 ? convert - 1 : convert;

    for (name in source) {
      src = source[name];

      if (convert) {
        name = _snake_case(name);
      }

      target[name] = exports.snake_case(src, u);
    }
  } else {
    target = source;
  }

  return target;
};

_snake_case = function _snake_case(str) {
  return str.replace(/([A-Z])/g, function (_, match, index) {
    return '_' + match.toLowerCase();
  });
};

exports.is_object = function is_object(obj) {
  return obj && _typeof(obj) === 'object' && !Array.isArray(obj);
};

exports.is_object_literal = function is_object_literal(obj) {
  var test;
  test = obj;

  if (_typeof(obj) !== 'object' || obj === null) {
    return false;
  } else {
    while (!false) {
      if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
        break;
      }
    }

    return Object.getPrototypeOf(obj) === test;
  }
};


/***/ }),

/***/ 7870:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var match = String.prototype.match;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;

var inspectCustom = __webpack_require__(7722).custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean') {
        throw new TypeError('option "customInspect", if provided, must be `true` or `false`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('options "indent" must be "\\t", an integer > 0, or `null`');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        return String(obj);
    }
    if (typeof obj === 'bigint') { // eslint-disable-line valid-typeof
        return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']';
    }
    if (isSymbol(obj)) {
        var symString = Symbol.prototype.toString.call(obj);
        return typeof obj === 'object' ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        mapForEach.call(obj, function (value, key) {
            mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        setForEach.call(obj, function (value) {
            setParts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        if (ys.length === 0) { return '{}'; }
        if (indent) {
            return '{' + indentedJoin(ys, indent) + '}';
        }
        return '{ ' + ys.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]'; }
function isDate(obj) { return toStr(obj) === '[object Date]'; }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]'; }
function isError(obj) { return toStr(obj) === '[object Error]'; }
function isSymbol(obj) { return toStr(obj) === '[object Symbol]'; }
function isString(obj) { return toStr(obj) === '[object String]'; }
function isNumber(obj) { return toStr(obj) === '[object Number]'; }
function isBigInt(obj) { return toStr(obj) === '[object BigInt]'; }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]'; }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString(str.slice(0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : entries.join(', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = Array(opts.indent + 1).join(' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: Array(depth + 1).join(baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + xs.join(',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if ((/[^\w$]/).test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    return xs;
}


/***/ }),

/***/ 7722:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(1669).inspect;


/***/ }),

/***/ 9969:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = __webpack_require__(2763); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;


/***/ }),

/***/ 3772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var slice = Array.prototype.slice;
var isArgs = __webpack_require__(2763);

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(9969);

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),

/***/ 2763:
/***/ ((module) => {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),

/***/ 3963:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const pTry = __webpack_require__(1569);

const pLimit = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));
	}

	const queue = [];
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.length > 0) {
			queue.shift()();
		}
	};

	const run = (fn, resolve, ...args) => {
		activeCount++;

		const result = pTry(fn, ...args);

		resolve(result);

		result.then(next, next);
	};

	const enqueue = (fn, resolve, ...args) => {
		if (activeCount < concurrency) {
			run(fn, resolve, ...args);
		} else {
			queue.push(run.bind(null, fn, resolve, ...args));
		}
	};

	const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args));
	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.length
		},
		clearQueue: {
			value: () => {
				queue.length = 0;
			}
		}
	});

	return generator;
};

module.exports = pLimit;
module.exports.default = pLimit;


/***/ }),

/***/ 562:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const pLimit = __webpack_require__(3963);

class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// The input can also be a promise, so we await it
const testElement = async (element, tester) => tester(await element);

// The input can also be a promise, so we `Promise.all()` them both
const finder = async element => {
	const values = await Promise.all(element);
	if (values[1] === true) {
		throw new EndError(values[0]);
	}

	return false;
};

const pLocate = async (iterable, tester, options) => {
	options = {
		concurrency: Infinity,
		preserveOrder: true,
		...options
	};

	const limit = pLimit(options.concurrency);

	// Start all the promises concurrently with optional limit
	const items = [...iterable].map(element => [element, limit(testElement, element, tester)]);

	// Check the promises either serially or concurrently
	const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity);

	try {
		await Promise.all(items.map(element => checkLimit(finder, element)));
	} catch (error) {
		if (error instanceof EndError) {
			return error.value;
		}

		throw error;
	}
};

module.exports = pLocate;
// TODO: Remove this for the next major release
module.exports.default = pLocate;


/***/ }),

/***/ 1569:
/***/ ((module) => {

"use strict";


const pTry = (fn, ...arguments_) => new Promise(resolve => {
	resolve(fn(...arguments_));
});

module.exports = pTry;
// TODO: remove this in the next major version
module.exports.default = pTry;


/***/ }),

/***/ 2271:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const fs = __webpack_require__(5747);
const {promisify} = __webpack_require__(1669);

const pAccess = promisify(fs.access);

module.exports = async path => {
	try {
		await pAccess(path);
		return true;
	} catch (_) {
		return false;
	}
};

module.exports.sync = path => {
	try {
		fs.accessSync(path);
		return true;
	} catch (_) {
		return false;
	}
};


/***/ }),

/***/ 9678:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(7772);


/***/ }),

/***/ 9348:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(5622);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 9052:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const constants = __webpack_require__(9348);
const utils = __webpack_require__(7398);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 7772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(5622);
const scan = __webpack_require__(603);
const parse = __webpack_require__(9052);
const utils = __webpack_require__(7398);
const constants = __webpack_require__(9348);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const utils = __webpack_require__(7398);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(9348);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 7398:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(5622);
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(9348);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ 9668:
/***/ ((module) => {

const types = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  STRING: 'STRING',
  NULL: 'NULL',
  UNDEFINED: 'UNDEFINED',
  DATE: 'DATE',
  ARRAY: 'ARRAY',
  MAP: 'MAP',
  SET: 'SET',
  ITERABLE_OBJECT: 'ITERABLE_OBJECT',
  DEFAULT: 'OBJECT',
};

module.exports = {
  types,
  iterableTypes: [types.ITERABLE_OBJECT, types.MAP, types.ARRAY, types.SET],
  errors: {
    EMPTY_DIFF: 'No diff object is provided, Nothing to apply',
    INVALID_DIFF_FORMAT: 'Invalid diff format',
    INVALID_DIFF_OP: 'Unsupported operation provided into diff object',
  },
};


/***/ }),

/***/ 7590:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { types, iterableTypes, errors } = __webpack_require__(9668);
const utils = __webpack_require__(6862);

const checkType = {
  [types.NUMBER]: utils.isNumber,
  [types.BOOLEAN]: utils.isBoolean,
  [types.STRING]: utils.isString,
  [types.DATE]: utils.isDate,
  [types.UNDEFINED]: utils.isUndefined,
  [types.NULL]: utils.isNull,
  [types.ARRAY]: utils.isArray,
  [types.MAP]: utils.isMap,
  [types.SET]: utils.isSet,
  [types.ITERABLE_OBJECT]: utils.isIterableObject,
};

const checkEqualityForComplexTypes = {
  [types.DATE]: utils.areDatesEqual,
};

function getType(x) {
  const keys = Object.keys(checkType);
  let type = types.DEFAULT;
  for (let i = 0; i < keys.length; i += 1) {
    if (checkType[keys[i]](x)) {
      type = keys[i];
      break;
    }
  }
  return type;
}

function isTraversalNeeded(type1, type2) {
  return type1 === type2 && iterableTypes.indexOf(type1) >= 0;
}

function areEqual(x, y, type1, type2) {
  if (type1 !== type2) {
    return false;
  }
  return checkEqualityForComplexTypes[type1] ? checkEqualityForComplexTypes[type1](x, y) : x === y;
}

function computeOp(x, y, type1, type2) {
  let op;
  if (type1 === types.UNDEFINED && type2 !== types.UNDEFINED) {
    op = 'add';
  } else if (type1 !== types.UNDEFINED && type2 === types.UNDEFINED) {
    op = 'delete';
  } else if (!(areEqual(x, y, type1, type2))) {
    op = 'update';
  } else {
    utils.noop();
  }
  return op;
}

function getKeys(x, y, type) {
  if (type === types.ARRAY) {
    const keys = x.length > y.length ? new Array(x.length) : new Array(y.length);
    keys.fill(0);
    return new Set(keys.map((_, i) => i));
  }
  return new Set(Object.keys(x).concat(Object.keys(y)));
}

function makeDiff(x, y, op, path, keepOldVal) {
  const diffOb = {
    op,
    path,
  };
  if (op === 'add' || op === 'update') {
    diffOb.val = y;
  }
  if (keepOldVal && op !== 'add') {
    diffOb.oldVal = x;
  }
  return diffOb;
}

function privateGetDiff(x, y, keepOldVal, path, diff) {
  const type1 = getType(x);
  const type2 = getType(y);
  const currPath = path || [];
  const currDiff = diff || [];
  if (isTraversalNeeded(type1, type2)) {
    const iterator = getKeys(x, y, type1).values();
    let { value, done } = iterator.next();
    while (!done) {
      if (!(Object.prototype.hasOwnProperty.call(x, value))) {
        currDiff.push(makeDiff(x[value], y[value], 'add', currPath.concat(value), keepOldVal));
      } else if (!(Object.prototype.hasOwnProperty.call(y, value))) {
        currDiff.push(makeDiff(x[value], y[value], 'delete', currPath.concat(value), keepOldVal));
      } else {
        privateGetDiff(x[value], y[value], keepOldVal, currPath.concat(value), currDiff);
      }
      const curr = iterator.next();
      value = curr.value;
      done = curr.done;
    }
  } else {
    const op = computeOp(x, y, type1, type2);
    if (op != null) {
      currDiff.push(makeDiff(x, y, op, path, keepOldVal));
    }
  }
  return currDiff;
}

const opHandlers = {
  add: utils.setValueByPath,
  update: utils.setValueByPath,
  delete: utils.deleteValueByPath,
};

function privateApplyDiff(x, diff, visitorCallback) {
  if (!(diff instanceof Array)) throw new Error(errors.INVALID_DIFF_FORMAT);
  let y = x;
  diff.forEach((diffItem) => {
    const { op, val, path } = diffItem;
    if (!opHandlers[op]) {
      throw new Error(errors.INVALID_DIFF_OP);
    }
    y = opHandlers[op](y, path, val, visitorCallback);
  });
  return y;
}

module.exports = {
  getDiff(x, y, keepOldValInDiff = false) {
    return privateGetDiff(x, y, keepOldValInDiff);
  },
  applyDiff(x, diff, visitorCallback) {
    return privateApplyDiff(x, diff, visitorCallback);
  },
};


/***/ }),

/***/ 6862:
/***/ ((module) => {

const instanceOf = (instance) => (x) => x instanceof instance;

const isNumber = (x) => typeof x === 'number';
const isBoolean = (x) => typeof x === 'boolean';
const isString = (x) => typeof x === 'string';
const isDate = instanceOf(Date);
const isUndefined = (x) => typeof x === 'undefined';
const isNull = (x) => x === null;
const isArray = instanceOf(Array);
const isMap = instanceOf(Map);
const isSet = instanceOf(Set);
const isIterableObject = (x) => {
  const type = Object.prototype.toString.call(x);
  return type === '[object Object]';
};
const noop = () => {};

const areDatesEqual = (dt1, dt2) => dt1.getTime() === dt2.getTime();

function setValueByPath(x, path = [], value, visitorCallback) {
  if (!(isArray(path))) {
    throw new Error(`Diff path: "${path}" is not valid`);
  }
  const { length } = path;
  if (length === 0) {
    return value;
  }
  let val = x;
  for (let i = 0; i < length; i += 1) {
    const key = path[i];
    if (!val) throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(x, null, 2)}`);
    else if (key == null) throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(x, null, 2)}`);

    if (i !== length - 1) {
      val = val[key];
      if (visitorCallback) {
        visitorCallback(val);
      }
    } else {
      val[key] = value;
    }
  }
  return x;
}

function deleteValueByPath(ob, path) {
  const keys = path || [];
  if (keys.length === 0) {
    return undefined;
  }
  let val = ob;
  const { length } = keys;
  for (let i = 0; i < length; i += 1) {
    if (i !== length - 1) {
      if (!val[keys[i]]) {
        throw new Error(`Invalid path: "${path}" for object: ${JSON.stringify(ob, null, 2)}`);
      }
      val = val[keys[i]];
    } else if (isIterableObject(val)) {
      delete val[keys[i]];
    } else {
      const index = parseInt(keys[i], 10);
      while (val.length > index) {
        val.pop();
      }
    }
  }
  return ob;
}

module.exports = {
  isNumber,
  isBoolean,
  isString,
  isDate,
  isUndefined,
  isNull,
  isArray,
  isMap,
  isSet,
  isIterableObject,
  noop,
  areDatesEqual,
  setValueByPath,
  deleteValueByPath,
};


/***/ }),

/***/ 3411:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var fs = __webpack_require__(5747),
  join = __webpack_require__(5622).join,
  resolve = __webpack_require__(5622).resolve,
  dirname = __webpack_require__(5622).dirname,
  defaultOptions = {
    extensions: ['js', 'json', 'coffee'],
    recurse: true,
    rename: function (name) {
      return name;
    },
    visit: function (obj) {
      return obj;
    }
  };

function checkFileInclusion(path, filename, options) {
  return (
    // verify file has valid extension
    (new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i').test(filename)) &&

    // if options.include is a RegExp, evaluate it and make sure the path passes
    !(options.include && options.include instanceof RegExp && !options.include.test(path)) &&

    // if options.include is a function, evaluate it and make sure the path passes
    !(options.include && typeof options.include === 'function' && !options.include(path, filename)) &&

    // if options.exclude is a RegExp, evaluate it and make sure the path doesn't pass
    !(options.exclude && options.exclude instanceof RegExp && options.exclude.test(path)) &&

    // if options.exclude is a function, evaluate it and make sure the path doesn't pass
    !(options.exclude && typeof options.exclude === 'function' && options.exclude(path, filename))
  );
}

function requireDirectory(m, path, options) {
  var retval = {};

  // path is optional
  if (path && !options && typeof path !== 'string') {
    options = path;
    path = null;
  }

  // default options
  options = options || {};
  for (var prop in defaultOptions) {
    if (typeof options[prop] === 'undefined') {
      options[prop] = defaultOptions[prop];
    }
  }

  // if no path was passed in, assume the equivelant of __dirname from caller
  // otherwise, resolve path relative to the equivalent of __dirname
  path = !path ? dirname(m.filename) : resolve(dirname(m.filename), path);

  // get the path of each file in specified directory, append to current tree node, recurse
  fs.readdirSync(path).forEach(function (filename) {
    var joined = join(path, filename),
      files,
      key,
      obj;

    if (fs.statSync(joined).isDirectory() && options.recurse) {
      // this node is a directory; recurse
      files = requireDirectory(m, joined, options);
      // exclude empty directories
      if (Object.keys(files).length) {
        retval[options.rename(filename, joined, filename)] = files;
      }
    } else {
      if (joined !== m.filename && checkFileInclusion(joined, filename, options)) {
        // hash node key shouldn't include file extension
        key = filename.substring(0, filename.lastIndexOf('.'));
        obj = m.require(joined);
        retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
      }
    }
  });

  return retval;
}

module.exports = requireDirectory;
module.exports.defaults = defaultOptions;


/***/ }),

/***/ 4882:
/***/ ((module) => {

module.exports = function (_require) {
  _require = _require || require
  var main = _require.main
  if (main && isIISNode(main)) return handleIISNode(main)
  else return main ? main.filename : process.cwd()
}

function isIISNode (main) {
  return /\\iisnode\\/.test(main.filename)
}

function handleIISNode (main) {
  if (!main.children.length) {
    return main.filename
  } else {
    return main.children[0].filename
  }
}


/***/ }),

/***/ 4201:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {readdir, stat, lstat} = __webpack_require__(5747).promises;
const {readdirSync, statSync, lstatSync} = __webpack_require__(5747);
const {sep} = __webpack_require__(5622);
const picomatch = __webpack_require__(9678);

const sepBuffer = Buffer.from(sep);

const defaults = {
  strict: false,
  stats: false,
  followSymlinks: false,
  exclude: undefined,
  include: undefined,
  match: {
    dot: true,
  },
};

function makePath(entry, dir, encoding) {
  if (encoding === "buffer") {
    return dir === "." ? entry.name : Buffer.from([...dir, ...sepBuffer, ...entry.name]);
  } else {
    return dir === "." ? entry.name : `${dir}${sep}${entry.name}`;
  }
}

function build(dirent, path, stats, opts) {
  return {
    path,
    directory: (stats || dirent).isDirectory(),
    symlink: (stats || dirent).isSymbolicLink(),
    ...(opts.stats ? {stats} : {}),
  };
}

function makeMatchers({include, exclude, match}) {
  return {
    includeMatcher: include ? picomatch(include, match) : null,
    excludeMatcher: exclude ? picomatch(exclude, match) : null,
  };
}

const rrdir = module.exports = async function* (dir, opts = {}, {includeMatcher, excludeMatcher, encoding} = {}) {
  if (includeMatcher === undefined) {
    opts = Object.assign({}, defaults, opts);
    ({includeMatcher, excludeMatcher} = makeMatchers(opts));
    if (/[/\\]$/.test(dir)) dir = dir.substring(0, dir.length - 1);
    encoding = Buffer.isBuffer(dir) ? "buffer" : undefined;
  }

  let dirents = [];

  try {
    dirents = await readdir(dir, {encoding, withFileTypes: true});
  } catch (err) {
    if (opts.strict) {
      throw err;
    } else {
      yield {path: dir, err};
    }
  }
  if (!dirents.length) return;

  for (const dirent of dirents) {
    const path = makePath(dirent, dir, encoding);
    if (excludeMatcher && excludeMatcher(encoding === "buffer" ? String(path) : path)) continue;

    const isSymbolicLink = opts.followSymlinks && dirent.isSymbolicLink();
    const isIncluded = !includeMatcher || includeMatcher(encoding === "buffer" ? String(path) : path);
    let stats;

    if (isIncluded) {
      if (opts.stats || isSymbolicLink) {
        try {
          stats = await (opts.followSymlinks ? stat : lstat)(path);
        } catch (err) {
          if (opts.strict) throw err;
          yield {path, err};
        }
      }

      yield build(dirent, path, stats, opts);
    }

    let recurse = false;
    if (isSymbolicLink) {
      if (!stats) try { stats = await stat(path); } catch {}
      if (stats && stats.isDirectory()) recurse = true;
    } else if (dirent.isDirectory()) {
      recurse = true;
    }

    if (recurse) yield* await rrdir(path, opts, {includeMatcher, excludeMatcher, encoding});
  }
};

module.exports.async = async (dir, opts = {}, {includeMatcher, excludeMatcher, encoding} = {}) => {
  if (includeMatcher === undefined) {
    opts = Object.assign({}, defaults, opts);
    ({includeMatcher, excludeMatcher} = makeMatchers(opts));
    if (/[/\\]$/.test(dir)) dir = dir.substring(0, dir.length - 1);
    encoding = Buffer.isBuffer(dir) ? "buffer" : undefined;
  }

  const results = [];
  let dirents = [];

  try {
    dirents = await readdir(dir, {encoding, withFileTypes: true});
  } catch (err) {
    if (opts.strict) {
      throw err;
    } else {
      results.push({path: dir, err});
    }
  }
  if (!dirents.length) return results;

  await Promise.all(dirents.map(async dirent => {
    const path = makePath(dirent, dir, encoding);
    if (excludeMatcher && excludeMatcher(encoding === "buffer" ? String(path) : path)) return;

    const isSymbolicLink = opts.followSymlinks && dirent.isSymbolicLink();
    const isIncluded = !includeMatcher || includeMatcher(encoding === "buffer" ? String(path) : path);
    let stats;

    if (isIncluded) {
      if (opts.stats || isSymbolicLink) {
        try {
          stats = await (opts.followSymlinks ? stat : lstat)(path);
        } catch (err) {
          if (opts.strict) throw err;
          results.push({path, err});
        }
      }

      results.push(build(dirent, path, stats, opts));
    }

    let recurse = false;
    if (isSymbolicLink) {
      if (!stats) try { stats = await stat(path); } catch {}
      if (stats && stats.isDirectory()) recurse = true;
    } else if (dirent.isDirectory()) {
      recurse = true;
    }

    if (recurse) results.push(...await module.exports.async(path, opts, {includeMatcher, excludeMatcher, encoding}));
  }));

  return results;
};

module.exports.sync = (dir, opts = {}, {includeMatcher, excludeMatcher, encoding} = {}) => {
  if (includeMatcher === undefined) {
    opts = Object.assign({}, defaults, opts);
    ({includeMatcher, excludeMatcher} = makeMatchers(opts));
    if (/[/\\]$/.test(dir)) dir = dir.substring(0, dir.length - 1);
    encoding = Buffer.isBuffer(dir) ? "buffer" : undefined;
  }

  const results = [];
  let dirents = [];

  try {
    dirents = readdirSync(dir, {encoding, withFileTypes: true});
  } catch (err) {
    if (opts.strict) {
      throw err;
    } else {
      results.push({path: dir, err});
    }
  }
  if (!dirents.length) return results;

  for (const dirent of dirents) {
    const path = makePath(dirent, dir, encoding);
    if (excludeMatcher && excludeMatcher(encoding === "buffer" ? String(path) : path)) continue;

    const isSymbolicLink = opts.followSymlinks && dirent.isSymbolicLink();
    const isIncluded = !includeMatcher || includeMatcher(encoding === "buffer" ? String(path) : path);
    let stats;

    if (isIncluded) {
      if (opts.stats || isSymbolicLink) {
        try {
          stats = (opts.followSymlinks ? statSync : lstatSync)(path);
        } catch (err) {
          if (opts.strict) throw err;
          results.push({path, err});
        }
      }
      results.push(build(dirent, path, stats, opts));
    }

    let recurse = false;
    if (isSymbolicLink) {
      if (!stats) try { stats = statSync(path); } catch {}
      if (stats && stats.isDirectory()) recurse = true;
    } else if (dirent.isDirectory()) {
      recurse = true;
    }

    if (recurse) results.push(...module.exports.sync(path, opts, {includeMatcher, excludeMatcher, encoding}));
  }

  return results;
};


/***/ }),

/***/ 2890:
/***/ ((module) => {

module.exports = function (blocking) {
  [process.stdout, process.stderr].forEach(function (stream) {
    if (stream._handle && stream.isTTY && typeof stream._handle.setBlocking === 'function') {
      stream._handle.setBlocking(blocking)
    }
  })
}


/***/ }),

/***/ 3015:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const breakword = __webpack_require__(1728)
const stripansi = __webpack_require__(6485)
const wcwidth = __webpack_require__(7776)
const flat = __webpack_require__(3989)
if (!Array.prototype.flat) flat.shim()

const ANSIPattern = [
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
  "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
].join("|")
const ANSIRegex = new RegExp(ANSIPattern, "g")

const defaults = () => {
  let obj = {}

  obj.breakword = false
  obj.input = [] // input string split by whitespace
  obj.minWidth = 2 // fallback to if width set too narrow
  obj.paddingLeft = 0
  obj.paddingRight = 0
  obj.errorChar = "�"
  obj.returnFormat = "string" // or 'array'
  obj.skipPadding = false // set to true when padding set too wide for line length
  obj.splitAt = [" ", "\t"]
  obj.trim = true
  obj.width = 10

  return obj
}


const calculateSpaceRemaining = function(lineLength, spacesUsed, config) {
  return Math.max(lineLength - spacesUsed - config.paddingLeft - config.paddingRight, 0)
} // function to set starting line length


const validateInput = (text, options) => {

  // options validation
  let config = Object.assign({}, defaults(), options || {})

  if (config.errorChar) {
    // only allow a single errorChar
    config.errorChar = config.errorChar.split("")[0]

    // errorChar must not be wide character
    if (wcwidth(config.errorChar) > 1)
      throw new Error(`Error character cannot be a wide character (${config.errorChar})`)
  }

  // make sure correct sign on padding
  config.paddingLeft = Math.abs(config.paddingLeft)
  config.paddingRight = Math.abs(config.paddingRight)

  let lineLength = config.width
    - config.paddingLeft
    - config.paddingRight

  if(lineLength < config.minWidth) {
    // skip padding if lineLength too narrow
    config.skipPadding = true
    lineLength = config.minWidth
  }

  // to trim or not to trim...
  if(config.trim) {
    text = text.trim()
  }

  return { text, config, lineLength }
}


const wrap = (input, options) => {

  let { text, config, lineLength } = validateInput(input, options)

  // array of characters split by whitespace and/or tabs
  let words = []

  if(!config.breakword) {
    // break string into words
    if(config.splitAt.indexOf("\t")!==-1) {
      // split at both spaces and tabs
      words = text.split(/ |\t/i)
    } else{
      // split at whitespace
      words = text.split(" ")
    }
  } else {
    // do not break string into words
    words = [text]
  }

  // remove empty array elements
  words = words.filter(val => {
    if (val.length > 0) {
      return true
    }
  })

  // assume at least one line
  let lines = [
    []
  ]

  let spaceRemaining, splitIndex, word
  let currentLine = 0 // index of current line in 'lines[]'
  let spacesUsed = 0 // spaces used so far on current line

  while(words.length > 0) {
    spaceRemaining = calculateSpaceRemaining(lineLength, spacesUsed, config)
    word = words.shift()
    let wordLength = wcwidth(word)

    switch(true) {

      // too long for an empty line and is a single character
      case(lineLength < wordLength && [...word].length === 1):
        words.unshift(config.errorChar)
        break

        // too long for an empty line, must be broken between 2 lines
      case(lineLength < wordLength):
        // break it, then re-insert its parts into words
        // so can loop back to re-handle each word
        splitIndex = breakword(word, lineLength)
        let splitWord = [...word]
        words.unshift(splitWord.slice(0, splitIndex + 1).join(""))
        words.splice(1, 0, splitWord.slice(splitIndex + 1).join("")) // +1 for substr fn
        break

      // not enough space remaining in line, must be wrapped to next line
      case(spaceRemaining < wordLength):
        // add a new line to our array of lines
        lines.push([])
        // note carriage to new line in counter
        currentLine++
        // reset the spacesUsed to 0
        spacesUsed = 0
        /* falls through */

      // fits on current line
      // eslint-disable-next-line
      default:
        // add word to line
        lines[currentLine].push(word)
        // reduce space remaining (add a space between words)
        spacesUsed += wordLength + 1
    }
  }

  lines = lines.map( line => {

    // restore spaces to line
    line = line.join(" ")

    // add padding to ends of line
    if(!config.skipPadding) {
      line = Array(config.paddingLeft + 1).join(" ")
        + line
        + Array(config.paddingRight + 1).join(" ")
    }

    return line
  })

  return lines.join("\n")
}


const splitAnsiInput = (text) => {
  // get start and end positions for matches
  let matches = []
  let textArr = [...text]
  let textLength = textArr.length

  /* eslint-disable */
  while((result = ANSIRegex.exec(text)) !== null) {
    matches.push({
      start: result.index,
      end: result.index + result[0].length,
      match: result[0],
      length: result[0].length
    })
  }
  /* eslint-enable */


  if (matches.length < 1) return [] // we have no ANSI escapes, we're done here

  // add start and end positions for non matches
  matches = matches.reduce((prev, curr) => {
    // check if space exists between this and last match
    // get end of previous match
    let prevEnd = prev[prev.length -1]

    if (prevEnd.end < curr.start) {
      // insert placeholder
      prev.push({
        start: prevEnd.end,
        end: curr.start,
        length: curr.start - prevEnd.end,
        expand: true
      }, curr)
    } else {
      prev.push(curr)
    }
    return prev
  }, [{start: 0, end: 0}])
    .splice(1) // removes starting accumulator object


  // add trailing match if necessary
  let lastMatchEnd = matches[matches.length - 1].end
  if (lastMatchEnd < textLength) {
    matches.push({
      start: lastMatchEnd,
      end: textLength,
      expand: true
    })
  }


  let savedArr = matches.map(match => {
    let value = text.substring(match.start, match.end)
    return (match.expand) ? [...value] : [value]
  }).flat(2)

  return savedArr
}


const restoreANSI = (savedArr, processedArr) => {
  return processedArr.map((char) => {
    let result

    if (char === "\n") {
      result = [char]
    } else {
      // add everything saved before character match
      let splicePoint = savedArr.findIndex(element => element === char ) + 1
      result = savedArr.splice(0, splicePoint)
    }

    // add all following, consecutive closing tags in case linebreak inerted next
    const ANSIClosePattern = "^\\x1b\\[([0-9]+)*m"
    const ANSICloseRegex = new RegExp(ANSIClosePattern) // eslint-disable-line no-control-regex
    const closeCodes = ["0", "21", "22", "23", "24", "25", "27", "28", "29", "39", "49", "54", "55"]

    let match
    while (savedArr.length && (match = savedArr[0].match(ANSICloseRegex))) {
      if (!closeCodes.includes(match[1])) break
      result.push(savedArr.shift())
    }

    return result.join("")
  }).concat(savedArr)
}


module.exports = (input, options) => {

  // process each existing line separately to respect existing line breaks
  const processedLines = input.toString().split("\n").map( string => {

    // save input ANSI escape codes to be restored later
    const savedANSI = splitAnsiInput(string)

    // strip ANSI
    string = stripansi(string)

    // add newlines to string
    string = wrap(string, options)

    // convert into array of characters
    let charArr = [...string]

    // restore input ANSI escape codes
    charArr = (savedANSI.length > 0) ? restoreANSI(savedANSI, charArr) : charArr

    // convert array of single characters into array of lines
    let outArr  = charArr.join("").split("\n")

    return outArr
  })

  return processedLines.flat(2).join("\n")
}


/***/ }),

/***/ 9963:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Generated by CoffeeScript 2.4.1
// # Stream Transformer

// Pass all elements of an array or a stream to transform, filter and add. Features include:   

// *   Extends the Node.js "stream.Transform" API.   
// *   Both synchrounous and asynchronous support based and user callback 
//     arguments signature.   
// *   Ability to skip records.   
// *   Sequential and concurrent execution using the "parallel" options.

// Please look at the [README], the [samples] and the [tests] for additional
// information.
var Transformer, clone, stream, util;

stream = __webpack_require__(2413);

util = __webpack_require__(1669);

({clone} = __webpack_require__(4036));

// ## Usage

// Callback approach, for ease of use:   

// `transform(records, [options], handler, callback)`     

// Stream API, for maximum of power:   

// `transform([records], [options], handler, [callback])`   
module.exports = function() {
  var argument, callback, error, handler, i, j, len, options, records, result, transform, type;
  options = {};
  for (i = j = 0, len = arguments.length; j < len; i = ++j) {
    argument = arguments[i];
    type = typeof argument;
    if (argument === null) {
      type = 'null';
    } else if (type === 'object' && Array.isArray(argument)) {
      type = 'array';
    }
    if (type === 'array') {
      records = argument;
    } else if (type === 'object') {
      options = clone(argument);
    } else if (type === 'function') {
      if (handler && i === arguments.length - 1) {
        callback = argument;
      } else {
        handler = argument;
      }
    } else if (type !== 'null') {
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`);
    }
  }
  transform = new Transformer(options, handler);
  error = false;
  if (records) {
    setImmediate(function() {
      var k, len1, record;
      for (k = 0, len1 = records.length; k < len1; k++) {
        record = records[k];
        if (error) {
          break;
        }
        transform.write(record);
      }
      return transform.end();
    });
  }
  if (callback || options.consume) {
    result = [];
    transform.on('readable', function() {
      var record, results;
      results = [];
      while ((record = transform.read())) {
        if (callback) {
          results.push(result.push(record));
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    transform.on('error', function(err) {
      error = true;
      if (callback) {
        return callback(err);
      }
    });
    transform.on('end', function() {
      if (callback && !error) {
        return callback(null, result);
      }
    });
  }
  return transform;
};

// ## Transformer

// Options are documented [here](http://csv.js.org/transform/options/).
Transformer = function(options1 = {}, handler1) {
  var base, base1;
  this.options = options1;
  this.handler = handler1;
  if ((base = this.options).consume == null) {
    base.consume = false;
  }
  this.options.objectMode = true;
  if ((base1 = this.options).parallel == null) {
    base1.parallel = 100;
  }
  stream.Transform.call(this, this.options);
  this.state = {
    running: 0,
    started: 0,
    finished: 0
  };
  return this;
};

util.inherits(Transformer, stream.Transform);

module.exports.Transformer = Transformer;

Transformer.prototype._transform = function(chunk, encoding, cb) {
  var callback, err, l;
  this.state.started++;
  this.state.running++;
  if (this.state.running < this.options.parallel) {
    cb();
    cb = null;
  }
  try {
    l = this.handler.length;
    if (this.options.params != null) {
      l--;
    }
    if (l === 1) { // sync
      this.__done(null, [this.handler.call(this, chunk, this.options.params)], cb);
    } else if (l === 2) { // async
      callback = (err, ...chunks) => {
        return this.__done(err, chunks, cb);
      };
      this.handler.call(this, chunk, callback, this.options.params);
    } else {
      throw Error("Invalid handler arguments");
    }
    return false;
  } catch (error1) {
    err = error1;
    return this.__done(err);
  }
};

Transformer.prototype._flush = function(cb) {
  this._ending = function() {
    if (this.state.running === 0) {
      return cb();
    }
  };
  return this._ending();
};

Transformer.prototype.__done = function(err, chunks, cb) {
  var chunk, j, len;
  this.state.running--;
  if (err) {
    return this.emit('error', err);
  }
  this.state.finished++;
  for (j = 0, len = chunks.length; j < len; j++) {
    chunk = chunks[j];
    if (typeof chunk === 'number') {
      chunk = `${chunk}`;
    }
    if ((chunk != null) && chunk !== '') {
      // We dont push empty string
      // See https://nodejs.org/api/stream.html#stream_readable_push
      this.push(chunk);
    }
  }
  if (cb) {
    cb();
  }
  if (this._ending) {
    return this._ending();
  }
};

// [readme]: https://github.com/wdavidw/node-stream-transform
// [samples]: https://github.com/wdavidw/node-stream-transform/tree/master/samples
// [tests]: https://github.com/wdavidw/node-stream-transform/tree/master/test


/***/ }),

/***/ 3306:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const stripAnsi = __webpack_require__(6485);
const isFullwidthCodePoint = __webpack_require__(3321);
const emojiRegex = __webpack_require__(2646);

const stringWidth = string => {
	string = string.replace(emojiRegex(), '  ');

	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	string = stripAnsi(string);

	let width = 0;

	for (let i = 0; i < string.length; i++) {
		const code = string.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

module.exports = stringWidth;
// TODO: remove this in the next major version
module.exports.default = stringWidth;


/***/ }),

/***/ 6485:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ansiRegex = __webpack_require__(5118);

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ 2494:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(2087);
const tty = __webpack_require__(3867);
const hasFlag = __webpack_require__(8273);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 8741:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */



const isNumber = __webpack_require__(8654);

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false, options) || [];
  let intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit, options);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

module.exports = toRegexRange;


/***/ }),

/***/ 9789:
/***/ (function(module) {

//     treeify.js
//     Luke Plaster <notatestuser@gmail.com>
//     https://github.com/notatestuser/treeify.js

// do the universal module definition dance
(function (root, factory) {

  if (true) {
    module.exports = factory();
  } else {}

}(this, function() {

  function makePrefix(key, last) {
    var str = (last ? '└' : '├');
    if (key) {
      str += '─ ';
    } else {
      str += '──┐';
    }
    return str;
  }

  function filterKeys(obj, hideFunctions) {
    var keys = [];
    for (var branch in obj) {
      // always exclude anything in the object's prototype
      if (!obj.hasOwnProperty(branch)) {
        continue;
      }
      // ... and hide any keys mapped to functions if we've been told to
      if (hideFunctions && ((typeof obj[branch])==="function")) {
        continue;
      }
      keys.push(branch);
    }
    return keys;
  }

  function growBranch(key, root, last, lastStates, showValues, hideFunctions, callback) {
    var line = '', index = 0, lastKey, circular, lastStatesCopy = lastStates.slice(0);

    if (lastStatesCopy.push([ root, last ]) && lastStates.length > 0) {
      // based on the "was last element" states of whatever we're nested within,
      // we need to append either blankness or a branch to our line
      lastStates.forEach(function(lastState, idx) {
        if (idx > 0) {
          line += (lastState[1] ? ' ' : '│') + '  ';
        }
        if ( ! circular && lastState[0] === root) {
          circular = true;
        }
      });

      // the prefix varies based on whether the key contains something to show and
      // whether we're dealing with the last element in this collection
      line += makePrefix(key, last) + key;

      // append values and the circular reference indicator
      showValues && (typeof root !== 'object' || root instanceof Date) && (line += ': ' + root);
      circular && (line += ' (circular ref.)');

      callback(line);
    }

    // can we descend into the next item?
    if ( ! circular && typeof root === 'object') {
      var keys = filterKeys(root, hideFunctions);
      keys.forEach(function(branch){
        // the last key is always printed with a different prefix, so we'll need to know if we have it
        lastKey = ++index === keys.length;

        // hold your breath for recursive action
        growBranch(branch, root[branch], lastKey, lastStatesCopy, showValues, hideFunctions, callback);
      });
    }
  };

  // --------------------

  var Treeify = {};

  // Treeify.asLines
  // --------------------
  // Outputs the tree line-by-line, calling the lineCallback when each one is available.

  Treeify.asLines = function(obj, showValues, hideFunctions, lineCallback) {
    /* hideFunctions and lineCallback are curried, which means we don't break apps using the older form */
    var hideFunctionsArg = typeof hideFunctions !== 'function' ? hideFunctions : false;
    growBranch('.', obj, false, [], showValues, hideFunctionsArg, lineCallback || hideFunctions);
  };

  // Treeify.asTree
  // --------------------
  // Outputs the entire tree, returning it as a string with line breaks.

  Treeify.asTree = function(obj, showValues, hideFunctions) {
    var tree = '';
    growBranch('.', obj, false, [], showValues, hideFunctions, function(line) {
      tree += line + '\n';
    });
    return tree;
  };

  // --------------------

  return Treeify;

}));


/***/ }),

/***/ 5541:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Factory = __webpack_require__(1092)

var Table = function (options) {
  options = options || {}
  options.adapter = "automattic"

  // translations

  // header
  var header = []
  if (options.head && options.head instanceof Array) {
    options.head.forEach(function (val) {
      header.push({
        value: val
      })
    })
  }

  // colWidths
  if (options.colWidths) {
    options.colWidths.forEach(function (val, i) {
      header[i].width = val
    })
  }

  // colAligns
  if (options.colAligns) {
    options.colAligns.forEach(function (val, i) {
      header[i].align = val
      header[i].headerAlign = val
    })
  }

  // style
  options.style = options.style || {}

  // style - padding
  if (options.style["padding-left"]) {
    options.paddingLeft = options.style["padding-left"]
  }

  if (options.style["padding-right"]) {
    options.paddingRight = options.style["padding-right"]
  }

  // style - colors
  if (options.style.head && options.style.head instanceof Array) {
    options.headerColor = options.style.head[0]
  }

  if (options.style.body && options.style.body instanceof Array) {
    options.color = options.style.body[0]
  }

  // style - compact
  if (options.style.compact) {
    options.compact = true
  }

  // @todo style - border color

  // inherited from prototype
  const t = Factory(header, [], [], options)
  t.toString = t.render
  return t
}

module.exports = Table


/***/ }),

/***/ 8953:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Factory = __webpack_require__(1092)
module.exports = Factory


/***/ }),

/***/ 4291:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const path = __webpack_require__(5622)
const fs = __webpack_require__(5747)
const csv = __webpack_require__(629)
const style = __webpack_require__(4342).style
let yargs = __webpack_require__(8841)

yargs.epilog("Copyright github.com/tecfu 2018")

yargs.option("config", {
  describe: "Specify the configuration for your table."
})

yargs.option("csv-delimiter", {
  describe: "Set the field delimiter. One character only.",
  default: ","
})

yargs.option("csv-escape", {
  describe: "Set the escape character. One character only."
})

yargs.option("csv-rowDelimiter", {
  describe: "String used to delimit record rows. You can also use a special constant: \"auto\",\"unix\",\"max\",\"windows\",\"unicode\".",
  default: "\n"
})

yargs.option("format", {
  describe: "Set input data format",
  choices: ["json", "csv"],
  default: "csv"
})

yargs.option("options\u2010\u002A", {
  describe: "Specify an optional setting where * is the setting name. See README.md for a complete list."
})

// run help only at the end
yargs = yargs.help("h").argv

const emitError = function (type, detail) {
  console.log(`
${style(type, "white", "bgRed")}

${detail}`)
  process.exit(1)
}

// note that this is the first run
let alreadyRendered = false
let previousHeight = 0

let dataFormat = "csv"
switch (true) {
  case (typeof yargs.format === "undefined"):
    break
  case (yargs.format.toString().match(/json/i) !== null):
    dataFormat = "json"
    break
  default:
}

// look for individually flagged options-*
const options = {}
Object.keys(yargs).forEach(function (key) {
  const keyParts = key.split("-")
  if (keyParts[0] === "options") {
    options[keyParts[1]] = yargs[key]
  }
})

// look for options passed via config file
let header = []
if (yargs.header) {
  if (!fs.existsSync(path.resolve(yargs.header))) {
    emitError(
      "Invalid file path",
      `Cannot find config file at: ${yargs.header}.`
    )
  }
  // merge with any individually flagged options
  header = require(path.resolve(yargs.header))
}

// because different dataFormats
const runTable = function (header, body) {
  // footer = [],
  const Table = __webpack_require__(1092)
  options.terminalAdapter = true
  const t1 = Table(header, body, options)

  // hide cursor
  console.log("\u001b[?25l")

  // wipe existing if already rendered
  if (alreadyRendered) {
    // move cursor up number to the top of the previous print
    // before deleting
    console.log(`\u001b[${previousHeight + 3}A`)

    // delete to end of terminal
    console.log("\u001b[0J")
  } else {
    alreadyRendered = true
  }

  console.log(t1.render())

  // reset the previous height to the height of this output
  // for when we next clear the print
  previousHeight = t1.height
}

process.stdin.resume()
process.stdin.setEncoding("utf8")
process.stdin.on("data", function (chunk) {
  // handle dataFormats
  switch (true) {
    case (dataFormat === "json"):
      let data
      try {
        data = JSON.parse(chunk)
      } catch (e) {
        emitError(
          "JSON parse error",
          "Please check to make sure that your input data consists of JSON or specify a different format with the --format flag."
        )
      }
      runTable(header, data)
      break
    default:
      const formatterOptions = {}
      Object.keys(yargs).forEach(function (key) {
        if (key.slice(0, 4) === "csv-" && typeof (yargs[key]) !== "undefined") {
          formatterOptions[key.slice(4)] = yargs[key]
        }
      })

      csv.parse(chunk, formatterOptions, function (err, data) {
      // validate csv
        if (err || typeof data === "undefined") {
          emitError(
            "CSV parse error",
            "Please check to make sure that your input data consists of valid comma separated values or specify a different format with the --format flag."
          )
        }
        runTable(header, data)
      })
  }
})

/* istanbul ignore next */
if (process.platform === "win32") {
  const rl = __webpack_require__(1058).createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on("SIGINT", function () {
    process.emit("SIGINT")
  })
}

/* istanbul ignore next */
process.on("SIGINT", function () {
  // graceful shutdown
  process.exit()
})

process.on("exit", function () {
  // show cursor
  console.log("\u001b[?25h")
})


/***/ }),

/***/ 4149:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ansiStyles = __webpack_require__(8537);
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(2494);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(5787);

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level > 3 || options.level < 0) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!Array.isArray(firstString)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = __webpack_require__(229);
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

// For TypeScript
chalk.Level = {
	None: 0,
	Basic: 1,
	Ansi256: 2,
	TrueColor: 3,
	0: 'None',
	1: 'Basic',
	2: 'Ansi256',
	3: 'TrueColor'
};

module.exports = chalk;


/***/ }),

/***/ 229:
/***/ ((module) => {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

module.exports = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMsg);
	}

	return chunks.join('');
};


/***/ }),

/***/ 5787:
/***/ ((module) => {

"use strict";


const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};


/***/ }),

/***/ 4851:
/***/ ((module) => {

// @TODO split defaults into table and cell settings
const defaults = {
  borderCharacters: {
    invisible: [
      { v: " ", l: " ", j: " ", h: " ", r: " " },
      { v: " ", l: " ", j: " ", h: " ", r: " " },
      { v: " ", l: " ", j: " ", h: " ", r: " " }
    ],
    solid: [
      { v: "│", l: "┌", j: "┬", h: "─", r: "┐" },
      { v: "│", l: "├", j: "┼", h: "─", r: "┤" },
      { v: "│", l: "└", j: "┴", h: "─", r: "┘" }
    ],
    dashed: [
      { v: "|", l: "+", j: "+", h: "-", r: "+" },
      { v: "|", l: "+", j: "+", h: "-", r: "+" },
      { v: "|", l: "+", j: "+", h: "-", r: "+" }
    ],
    none: [
      { v: "", l: "", j: "", h: "", r: "" },
      { v: "", l: "", j: "", h: "", r: "" },
      { v: "", l: "", j: "", h: "", r: "" }
    ]
  },
  align: "center",
  borderColor: null,
  borderStyle: "solid",
  color: false,
  COLUMNS: 80, // if !process.stdout.columns assume redirecting to write stream 80 columns is VT200 standard
  compact: false,
  defaultErrorValue: "�",
  // defaultValue: "\u001b[31m?\u001b[39m",
  defaultValue: "[32m[37m[41m ?[49m[32m[39m",
  errorOnNull: false,
  FIXED_WIDTH: false,
  footerAlign: "center",
  footerColor: false,
  formatter: null,
  headerAlign: "center",
  headerColor: "yellow",
  isNull: false, // undocumented cell setting
  marginLeft: 2,
  marginTop: 1,
  paddingBottom: 0,
  paddingLeft: 1,
  paddingRight: 1,
  paddingTop: 0,
  showHeader: null, // undocumented
  truncate: false,
  width: "100%",
  GUTTER: 1, // undocumented
  columnSettings: [],
  // save so cell options can be merged into column options
  table: {
    body: "",
    columnInnerWidths: [],
    columnWidths: [],
    columns: [],
    footer: "",
    header: "", // post-rendered strings.
    height: 0,
    typeLocked: false // once a table type is selected can't switch
  }
}

// support deprecated border style values
defaults.borderCharacters["0"] = defaults.borderCharacters.none
defaults.borderCharacters["1"] = defaults.borderCharacters.solid
defaults.borderCharacters["2"] = defaults.borderCharacters.dashed

module.exports = defaults


/***/ }),

/***/ 1092:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function __ncc_wildcard$0 (arg) {
  if (arg === "automattic-cli-table.js" || arg === "automattic-cli-table") return __webpack_require__(5541);
  else if (arg === "default-adapter.js" || arg === "default-adapter") return __webpack_require__(8953);
  else if (arg === "terminal-adapter.js" || arg === "terminal-adapter") return __webpack_require__(4291);
}
const defaults = __webpack_require__(4851)
const Render = __webpack_require__(3251)
const Style = __webpack_require__(4342)
let counter = 0

const Factory = function (paramsArr) {
  const _configKey = Symbol.config
  let header = []
  const body = []
  let footer = []
  let options = {}

  // handle different parameter scenarios
  switch (true) {
    // header, rows, footer, and options
    case (paramsArr.length === 4):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows (body)
      footer = paramsArr[2]
      options = paramsArr[3]
      break

    // header, rows, footer
    case (paramsArr.length === 3 && paramsArr[2] instanceof Array):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows
      footer = paramsArr[2]
      break

    // header, rows, options
    case (paramsArr.length === 3 && typeof paramsArr[2] === "object"):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows
      options = paramsArr[2]
      break

    // header, rows            (rows, footer is not an option)
    case (paramsArr.length === 2 && paramsArr[1] instanceof Array):
      header = paramsArr[0]
      body.push(...paramsArr[1]) // creates new array to store our rows
      break

    // rows, options
    case (paramsArr.length === 2 && typeof paramsArr[1] === "object"):
      body.push(...paramsArr[0]) // creates new array to store our rows
      options = paramsArr[1]
      break

    // rows
    case (paramsArr.length === 1 && paramsArr[0] instanceof Array):
      body.push(...paramsArr[0])
      break

    // adapter called: i.e. `require('tty-table')('automattic-cli')`
    case (paramsArr.length === 1 && typeof paramsArr[0] === "string"):
      return __ncc_wildcard$0(paramsArr[0])

    /* istanbul ignore next */
    default:
      console.log("Error: Bad params. \nSee docs at github.com/tecfu/tty-table")
      process.exit()
  }

  // for "deep" copy, use JSON.parse
  const cloneddefaults = JSON.parse(JSON.stringify(defaults))
  const config = Object.assign({}, cloneddefaults, options)

  // backfixes for shortened option names
  config.align = config.alignment || config.align
  config.headerAlign = config.headerAlignment || config.headerAlign

  // for truncate true is equivalent to empty string
  if (config.truncate === true) config.truncate = ""

  // if borderColor customized, color the border character set
  if (config.borderColor) {
    config.borderCharacters[config.borderStyle]
      = config.borderCharacters[config.borderStyle].map(function (obj) {
        Object.keys(obj).forEach(function (key) {
          obj[key] = Style.style(obj[key], config.borderColor)
        })
        return obj
      })
  }

  // save a copy for merging columnSettings into cell options
  config.columnSettings = header.slice(0)

  // header
  config.table.header = header

  // match header geometry with body array
  config.table.header = [config.table.header]

  // footer
  config.table.footer = footer

  // counting table enables fixed column widths for streams,
  // variable widths for multiple tables simulateously
  if (config.terminalAdapter !== true) {
    counter++ // fix columnwidths for streams
  }
  config.tableId = counter

  // create a new object with an Array prototype
  const tableObject = Object.create(body)

  // save configuration to new object
  tableObject[_configKey] = config

  /**
   * Add method to render table to a string
   * @returns {String}
   * @memberof Table
   * @example
   * ```js
   * let str = t1.render();
   * console.log(str); //outputs table
   * ```
  */
  tableObject.render = function () {
    const output = Render.stringifyData(this[_configKey], this.slice(0)) // get string output
    tableObject.height = this[_configKey].height
    return output
  }

  return tableObject
}

const Table = function () {
  return new Factory(arguments)
}

Table.resetStyle = Style.resetStyle
Table.style = Style.styleEachChar

module.exports = Table


/***/ }),

/***/ 286:
/***/ ((module, exports, __webpack_require__) => {

const stripAnsi = __webpack_require__(6485)
const smartwrap = __webpack_require__(3015)
const wcwidth = __webpack_require__(7776)

const addPadding = (config, width) => {
  return width + config.paddingLeft + config.paddingRight
}

/**
 * Returns the widest cell give a collection of rows
 *
 * @param object columnOptions
 * @param array rows
 * @param integer columnIndex
 * @returns string
 */
const getMaxLength = (columnOptions, rows, columnIndex) => {
  let iterable

  // add header value, alias to calculate width when applicable
  if (columnOptions && (columnOptions.value || columnOptions.alias)) {
    // string we use from header
    let val = columnOptions.alias || columnOptions.value
    val = val.toString()
    // create a row with value in the current columnIndex
    const headerRow = Array(rows[0].length)
    headerRow[columnIndex] = val
    // add header row to new array we will check for max value width
    iterable = rows.slice()
    iterable.push(headerRow)
  } else {
    // no header value, just use rows to derive max width
    iterable = rows
  }

  const widest = iterable.reduce((prev, row) => {
    if (row[columnIndex]) {
      // check cell value is object or scalar
      const value = (row[columnIndex].value) ? row[columnIndex].value : row[columnIndex]
      const width = Math.max(
        ...stripAnsi(value.toString()).split(/[\n\r]/).map((s) => wcwidth(s))
      )
      return (width > prev) ? width : prev
    }
    return prev
  }, 0)

  return widest
}

/**
 * Get total width available to this table instance
 *
 *
 */
const getAvailableWidth = config => {
  if (process && ((process.stdout && process.stdout.columns) || (process.env && process.env.COLUMNS))) {
    // forked calls that do not inherit process.stdout must use process.env
    let viewport = (process.stdout && process.stdout.columns) ? process.stdout.columns : process.env.COLUMNS
    viewport = viewport - config.marginLeft

    // table width percentage of (viewport less margin)
    if (config.width !== "auto" && /^\d+%$/.test(config.width)) {
      return Math.min(1, (config.width.slice(0, -1) * 0.01)) * viewport
    }

    // table width fixed
    if (config.width !== "auto" && /^\d+$/.test(config.width)) {
      config.FIXED_WIDTH = true
      return config.width
    }

    // table width equals viewport less margin
    // @TODO deprecate and remove "auto", which was never documented so should not be
    // an issue
    return viewport
  }

  // browser
  /* istanbul ignore next */
  if (typeof window !== "undefined") return window.innerWidth // eslint-disable-line

  // process.stdout.columns does not exist. assume redirecting to write stream
  // use 80 columns, which is VT200 standard
  return config.COLUMNS - config.marginLeft
}

module.exports.getStringLength = string => {
  // stripAnsi(string.replace(/[^\x00-\xff]/g,'XX')).length
  return wcwidth(stripAnsi(string))
}

module.exports.wrapCellText = (
  config,
  cellValue,
  columnIndex,
  cellOptions,
  rowType
) => {
  // ANSI chararacters that demarcate the start/end of a line
  const startAnsiRegexp = /^(\033\[[0-9;]*m)+/
  const endAnsiRegexp = /(\033\[[0-9;]*m)+$/

  // coerce cell value to string
  let string = cellValue.toString()

  // store matching ANSI characters
  const startMatches = string.match(startAnsiRegexp) || [""]

  // remove ANSI start-of-line chars
  string = string.replace(startAnsiRegexp, "")

  // store matching ANSI characters so can be later re-attached
  const endMatches = string.match(endAnsiRegexp) || [""]

  // remove ANSI end-of-line chars
  string = string.replace(endAnsiRegexp, "")

  let alignTgt

  switch (rowType) {
    case ("header"):
      alignTgt = "headerAlign"
      break
    case ("body"):
      alignTgt = "align"
      break
    default:
      alignTgt = "footerAlign"
  }

  // equalize padding for centered lines
  if (cellOptions[alignTgt] === "center") {
    cellOptions.paddingLeft = cellOptions.paddingRight = Math.max(
      cellOptions.paddingRight,
      cellOptions.paddingLeft,
      0
    )
  }

  const columnWidth = config.table.columnWidths[columnIndex]

  // innerWidth is the width available for text within the cell
  const innerWidth = columnWidth
    - cellOptions.paddingLeft
    - cellOptions.paddingRight
    - config.GUTTER

  if (typeof config.truncate === "string") {
    string = exports.truncate(string, cellOptions, innerWidth)
  } else {
    string = exports.wrap(string, cellOptions, innerWidth)
  }

  // format each line
  const cell = string.split("\n").map(line => {
    line = line.trim()

    const lineLength = exports.getStringLength(line)

    // alignment
    if (lineLength < columnWidth) {
      let emptySpace = columnWidth - lineLength

      switch (true) {
        case (cellOptions[alignTgt] === "center"):
          emptySpace--
          const padBoth = Math.floor(emptySpace / 2)
          const padRemainder = emptySpace % 2
          line = Array(padBoth + 1).join(" ")
            + line
            + Array(padBoth + 1 + padRemainder).join(" ")
          break

        case (cellOptions[alignTgt] === "right"):
          line = Array(emptySpace - cellOptions.paddingRight).join(" ")
            + line
            + Array(cellOptions.paddingRight + 1).join(" ")
          break

        default:
          line = Array(cellOptions.paddingLeft + 1).join(" ")
            + line
            + Array(emptySpace - cellOptions.paddingLeft).join(" ")
      }
    }

    // put ANSI color codes BACK on the beginning and end of string
    return startMatches[0] + line + endMatches[0]
  })

  return { cell, innerWidth }
}

module.exports.truncate = (string, cellOptions, maxWidth) => {
  const stringWidth = wcwidth(string)

  if (maxWidth < stringWidth) {
    // @TODO give user option to decide if they want to break words on wrapping
    string = smartwrap(string, {
      width: maxWidth - cellOptions.truncate.length,
      breakword: true
    }).split("\n")[0]
    string = string + cellOptions.truncate
  }

  return string
}

module.exports.wrap = (string, cellOptions, innerWidth) => {
  const outstring = smartwrap(string, {
    errorChar: cellOptions.defaultErrorValue,
    minWidth: 1,
    trim: true,
    width: innerWidth
  })

  return outstring
}

module.exports.getColumnWidths = (config, rows) => {
  const availableWidth = getAvailableWidth(config)

  // iterate over the header if we have it, iterate over the first row
  // if we do not (to step through the correct number of columns)
  const iterable = (config.table.header[0] && config.table.header[0].length > 0)
    ? config.table.header[0] : rows[0]

  let widths = iterable.map((column, columnIndex) => {
    let result

    switch (true) {
      // column width is a percentage of table width specified in column header
      case (typeof column === "object" && (/^\d+%$/.test(column.width))):
        result = (column.width.slice(0, -1) * 0.01) * availableWidth
        result = addPadding(config, result)
        break

      // column width is specified in column header
      case (typeof column === "object" && (/^\d+$/.test(column.width))):
        result = column.width
        break

      // 'auto' sets column width to its longest value in the initial data set
      default:
        const columnOptions = (config.table.header[0][columnIndex])
          ? config.table.header[0][columnIndex] : {}
        const measurableRows = (rows.length) ? rows : config.table.header[0]

        result = getMaxLength(columnOptions, measurableRows, columnIndex)

        // add spaces for padding if not centered
        // @TODO test with if not centered conditional
        result = addPadding(config, result)
    }

    // add space for gutter
    result = result + config.GUTTER
    return result
  })

  // calculate sum of all column widths (including marginLeft)
  const totalWidth = widths.reduce((prev, current) => prev + current)

  // proportionately resize columns when necessary
  if (totalWidth > availableWidth || config.FIXED_WIDTH) {
    // proportion wont be exact fit, but this method keeps us safe
    const proportion = (availableWidth / totalWidth).toFixed(2) - 0.01
    const relativeWidths = widths.map(value => Math.floor(proportion * value))

    if (config.FIXED_WIDTH) return relativeWidths

    // when proportion < 0 column cant be resized and totalWidth must overflow viewport
    if (proportion > 0) {
      const totalRelativeWidths = relativeWidths.reduce((prev, current) => prev + current)
      widths = (totalRelativeWidths < totalWidth) ? relativeWidths : widths
    }
  }

  return widths
}


/***/ }),

/***/ 3953:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

if (false) {} else {
  // called as a module
  module.exports = __webpack_require__(8953)
}


/***/ }),

/***/ 3251:
/***/ ((module, exports, __webpack_require__) => {

const Style = __webpack_require__(4342)
const Format = __webpack_require__(286)

/**
 * Converts arrays of data into arrays of cell strings
 * @param {TtyTable.Config} config
 * @param {Array<Array<string>|object|TtyTable.Formatter>} inputData
 * @returns {Array<string>}
 */
module.exports.stringifyData = (config, inputData) => {
  const sections = {
    header: [],
    body: [],
    footer: []
  }
  const marginLeft = Array(config.marginLeft + 1).join(" ")
  const borderStyle = config.borderCharacters[config.borderStyle]
  const borders = []

  // support backwards compatibility cli-table's multiple constructor geometries
  // @TODO deprecate and support only a single format
  const constructorType = exports.getConstructorGeometry(inputData[0] || [], config)
  const rows = exports.coerceConstructorGeometry(config, inputData, constructorType)

  // when streaming values to tty-table, we don't want column widths to change
  // from one rows set to the next, so we save the first set of widths and reuse
  if (!global.columnWidths) {
    global.columnWidths = {}
  }

  if (global.columnWidths[config.tableId]) {
    config.table.columnWidths = global.columnWidths[config.tableId]
  } else {
    global.columnWidths[config.tableId] = config.table.columnWidths = Format.getColumnWidths(config, rows)
  }

  // stringify header cells
  // hide header if no column names or if specified in config
  switch (true) {
    case (config.showHeader !== null && !config.showHeader): // explicitly false, hide
      sections.header = []
      break

    case (config.showHeader === true): // explicitly true, show
    case (!!config.table.header[0].find(obj => obj.value || obj.alias)): //  atleast one named column, show header
      sections.header = config.table.header.map(row => {
        return exports.buildRow(config, row, "header", null, rows, inputData)
      })
      break

    default: // no named columns, hide
      sections.header = []
  }

  // stringify body cells
  sections.body = rows.map((row, rowIndex) => {
    return exports.buildRow(config, row, "body", rowIndex, rows, inputData)
  })

  // stringify footer cells
  sections.footer = (config.table.footer instanceof Array && config.table.footer.length > 0) ? [config.table.footer] : []

  sections.footer = sections.footer.map(row => {
    return exports.buildRow(config, row, "footer", null, rows, inputData)
  })

  // apply borders
  // 0=top, 1=middle, 2=bottom
  for (let a = 0; a < 3; a++) {
    // add left border
    borders[a] = borderStyle[a].l

    // add joined borders for each column
    config.table.columnWidths.forEach((columnWidth, index, arr) => {
      // Math.max because otherwise columns 1 wide wont have horizontal border
      borders[a] += Array(Math.max(columnWidth, 2)).join(borderStyle[a].h)
      borders[a] += ((index + 1 < arr.length) ? borderStyle[a].j : "")
    })

    // add right border
    borders[a] += borderStyle[a].r

    // no trailing space on footer
    borders[a] = (a < 2) ? `${marginLeft + borders[a]}\n` : marginLeft + borders[a]
  }

  // top horizontal border
  let output = borders[0]

  // for each section (header,body,footer)
  Object.keys(sections).forEach((p, i) => {
    // for each row in the section
    while (sections[p].length) {
      const row = sections[p].shift()

      // if(row.length === 0) {break}

      row.forEach(line => {
        // vertical row borders
        output = `${output
          + marginLeft
          // left vertical border
          + borderStyle[1].v
          // join cells on vertical border
          + line.join(borderStyle[1].v)
          // right vertical border
          + borderStyle[1].v
          // end of line
        }\n`
      })

      // bottom horizontal row border
      switch (true) {
      // skip if end of body and no footer
        case (sections[p].length === 0
             && i === 1
             && sections.footer.length === 0):
          break

        // skip if end of footer
        case (sections[p].length === 0
             && i === 2):
          break

        // skip if compact
        case (config.compact && p === "body" && !row.empty):
          break

        // skip if border style is "none"
        case (config.borderStyle === "none" && config.compact):
          break

        default:
          output += borders[1]
      }
    }
  })

  // bottom horizontal border
  output += borders[2]

  const finalOutput = Array(config.marginTop + 1).join("\n") + output

  // record the height of the output
  config.height = finalOutput.split(/\r\n|\r|\n/).length

  return finalOutput
}

module.exports.buildRow = (config, row, rowType, rowIndex, rowData, inputData) => {
  let minRowHeight = 0

  // tag row as empty if empty, used for `compact` option
  if (row.length === 0 && config.compact) {
    row.empty = true
    return row
  }

  // force row to have correct number of columns
  const lengthDifference = config.table.columnWidths.length - row.length
  if (lengthDifference > 0) {
    // array (row) lacks elements, add until equal
    row = row.concat(Array.apply(null, new Array(lengthDifference)).map(() => null))
  } else if (lengthDifference < 0) {
    // array (row) has too many elements, remove until equal
    row.length = config.table.columnWidths.length
  }

  // convert each element in row to cell format
  row = row.map((elem, elemIndex) => {
    const cell = exports.buildCell(config, elem, elemIndex, rowType, rowIndex, rowData, inputData)
    minRowHeight = (minRowHeight < cell.length) ? cell.length : minRowHeight
    return cell
  })

  // apply top and bottom padding to row
  minRowHeight = (rowType === "header") ? minRowHeight
    : minRowHeight + (config.paddingBottom + config.paddingTop)

  const linedRow = Array.apply(null, { length: minRowHeight })
    .map(Function.call, () => [])

  row.forEach(function (cell, a) {
    const whitespace = Array(config.table.columnWidths[a]).join(" ")

    if (rowType === "body") {
      // add whitespace for top padding
      for (let i = 0; i < config.paddingTop; i++) {
        cell.unshift(whitespace)
      }

      // add whitespace for bottom padding
      for (let i = 0; i < config.paddingBottom; i++) {
        cell.push(whitespace)
      }
    }

    // a `row` is divided by columns (horizontally)
    // a `linedRow` becomes the row divided instead into an array of vertical lines
    // each nested line divided by columns
    for (let i = 0; i < minRowHeight; i++) {
      linedRow[i].push((typeof cell[i] !== "undefined")
        ? cell[i] : whitespace)
    }
  })

  return linedRow
}

module.exports.buildCell = (config, elem, columnIndex, rowType, rowIndex, rowData, inputData) => {
  let cellValue = null

  const cellOptions = Object.assign(
    { reset: false },
    config,
    (rowType === "body") ? config.columnSettings[columnIndex] : {}, // ignore columnSettings for footer
    (typeof elem === "object") ? elem : {}
  )

  if (rowType === "header") {
    config.table.columns.push(cellOptions)
    cellValue = cellOptions.alias || cellOptions.value || ""
  } else {
    // set cellValue
    switch (true) {
      case (typeof elem === "undefined" || elem === null):
        // replace undefined/null elem values with placeholder
        cellValue = (config.errorOnNull) ? config.defaultErrorValue : config.defaultValue
        // @TODO add to elem defaults
        cellOptions.isNull = true
        break

      case (typeof elem === "object" && elem !== null && typeof elem.value !== "undefined"):
        cellValue = elem.value
        break

      case (typeof elem === "function"):
        cellValue = elem.bind({
          configure: function (object) {
            return Object.assign(cellOptions, object)
          },
          style: Style.style,
          resetStyle: Style.resetStyle
        })(
          (!cellOptions.isNull) ? cellValue : "",
          columnIndex,
          rowIndex,
          rowData,
          inputData
        )
        break

      default:
        // elem is assumed to be a scalar
        cellValue = elem || ""
    }

    // run formatter
    if (typeof cellOptions.formatter === "function") {
      cellValue = cellOptions.formatter
        .bind({
          configure: function (object) {
            return Object.assign(cellOptions, object)
          },
          style: Style.style,
          resetStyle: Style.resetStyle
        })(
          (!cellOptions.isNull) ? cellValue : "",
          columnIndex,
          rowIndex,
          rowData,
          inputData
        )
    }
  }

  // colorize cellValue
  // we don't want the formatter to pass a styled cell value with ANSI codes
  // (in case user wants to do math or string operations to cell value), so
  // we apply default styles to the cell after it runs through the formatter
  // and omit those default styles if the user applied `this.resetStyle`
  if (!cellOptions.reset) {
    cellValue = Style.colorizeCell(cellValue, cellOptions, rowType)
  }

  // textwrap cellValue
  const { cell, innerWidth } = Format.wrapCellText(cellOptions, cellValue, columnIndex, cellOptions, rowType)

  if (rowType === "header") {
    config.table.columnInnerWidths.push(innerWidth)
  }

  return cell
}

/**
 * Check for a backwards compatible (cli-table) constructor
 */
module.exports.getConstructorGeometry = (row, config) => {
  let type

  // rows passed as an object
  if (typeof row === "object" && !(row instanceof Array)) {
    const keys = Object.keys(row)

    if (config.adapter === "automattic") {
      // detected cross table
      const key = keys[0]

      if (row[key] instanceof Array) {
        type = "automattic-cross"
      } else {
        // detected vertical table
        type = "automattic-vertical"
      }
    } else {
      // detected horizontal table
      type = "o-horizontal"
    }
  } else {
    // rows passed as an array
    type = "a-horizontal"
  }

  return type
}

/**
 * Coerce backwards compatible constructor styles
 */
module.exports.coerceConstructorGeometry = (config, rows, constructorType) => {
  let output = []
  switch (constructorType) {
    case ("automattic-cross"):
      // assign header styles to first column
      config.columnSettings[0] = config.columnSettings[0] || {}
      config.columnSettings[0].color = config.headerColor

      output = rows.map(obj => {
        const arr = []
        const key = Object.keys(obj)[0]
        arr.push(key)
        return arr.concat(obj[key])
      })
      break

    case ("automattic-vertical"):
      // assign header styles to first column
      config.columnSettings[0] = config.columnSettings[0] || {}
      config.columnSettings[0].color = config.headerColor

      output = rows.map(function (value) {
        const key = Object.keys(value)[0]
        return [key, value[key]]
      })
      break

    case ("o-horizontal"):
      // cell property names are specified in header columns
      if (config.table.header[0].length
        && config.table.header[0].every(obj => obj.value)) {
        output = rows.map(row => config.table.header[0]
          .map(obj => row[obj.value]))
      } // eslint-disable-line brace-style
      // no property names given, default to object property order
      else {
        output = rows.map(obj => Object.values(obj))
      }
      break

    case ("a-horizontal"):
      output = rows
      break

    default:
  }

  return output
}

// @TODO For rotating horizontal data into a vertical table
// assumes all rows are same length
// module.exports.verticalizeMatrix = (config, inputArray) => {
//
//   // grow to # arrays equal to number of columns in input array
//   let outputArray = []
//   let headers = config.table.columns
//
//   // create a row for each heading, and prepend the row
//   // with the heading name
//   headers.forEach(name => outputArray.push([name]))
//
//   inputArray.forEach(row => {
//     row.forEach((element, index) => outputArray[index].push(element))
//   })
//
//   return outputArray
// }


/***/ }),

/***/ 4342:
/***/ ((module, exports, __webpack_require__) => {

const chalk = __webpack_require__(4149)
const kleur = __webpack_require__(1506)

// user kleur if we are in the browser
const colorLib = (process && process.stdout) ? chalk : kleur

const stripAnsi = __webpack_require__(6485)

module.exports.style = (str, ...colors) => {
  const out = colors.reduce(function (input, color) {
    return colorLib[color](input)
  }, str)
  return out
}

module.exports.styleEachChar = (str, ...colors) => {
  // strip existing ansi chars so we dont loop them
  // @ TODO create a really clever workaround so that you can accrete styles
  const chars = [...stripAnsi(str)]

  // style each character
  const out = chars.reduce((prev, current) => {
    const coded = colors.reduce((input, color) => {
      return colorLib[color](input)
    }, current)
    return prev + coded
  }, "")

  return out
}

module.exports.resetStyle = function (str) {
  this.configure({ reset: true })
  return stripAnsi(str)
}

module.exports.colorizeCell = (str, cellOptions, rowType) => {
  let color = false // false will keep terminal default

  switch (true) {
    case (rowType === "body"):
      color = cellOptions.color || color
      break

    case (rowType === "header"):
      color = cellOptions.headerColor || color
      break

    default:
      color = cellOptions.footerColor || color
  }

  if (color) {
    str = exports.style(str, color)
  }

  return str
}


/***/ }),

/***/ 1174:
/***/ ((module) => {

module.exports = [
    [ 0x0300, 0x036F ], [ 0x0483, 0x0486 ], [ 0x0488, 0x0489 ],
    [ 0x0591, 0x05BD ], [ 0x05BF, 0x05BF ], [ 0x05C1, 0x05C2 ],
    [ 0x05C4, 0x05C5 ], [ 0x05C7, 0x05C7 ], [ 0x0600, 0x0603 ],
    [ 0x0610, 0x0615 ], [ 0x064B, 0x065E ], [ 0x0670, 0x0670 ],
    [ 0x06D6, 0x06E4 ], [ 0x06E7, 0x06E8 ], [ 0x06EA, 0x06ED ],
    [ 0x070F, 0x070F ], [ 0x0711, 0x0711 ], [ 0x0730, 0x074A ],
    [ 0x07A6, 0x07B0 ], [ 0x07EB, 0x07F3 ], [ 0x0901, 0x0902 ],
    [ 0x093C, 0x093C ], [ 0x0941, 0x0948 ], [ 0x094D, 0x094D ],
    [ 0x0951, 0x0954 ], [ 0x0962, 0x0963 ], [ 0x0981, 0x0981 ],
    [ 0x09BC, 0x09BC ], [ 0x09C1, 0x09C4 ], [ 0x09CD, 0x09CD ],
    [ 0x09E2, 0x09E3 ], [ 0x0A01, 0x0A02 ], [ 0x0A3C, 0x0A3C ],
    [ 0x0A41, 0x0A42 ], [ 0x0A47, 0x0A48 ], [ 0x0A4B, 0x0A4D ],
    [ 0x0A70, 0x0A71 ], [ 0x0A81, 0x0A82 ], [ 0x0ABC, 0x0ABC ],
    [ 0x0AC1, 0x0AC5 ], [ 0x0AC7, 0x0AC8 ], [ 0x0ACD, 0x0ACD ],
    [ 0x0AE2, 0x0AE3 ], [ 0x0B01, 0x0B01 ], [ 0x0B3C, 0x0B3C ],
    [ 0x0B3F, 0x0B3F ], [ 0x0B41, 0x0B43 ], [ 0x0B4D, 0x0B4D ],
    [ 0x0B56, 0x0B56 ], [ 0x0B82, 0x0B82 ], [ 0x0BC0, 0x0BC0 ],
    [ 0x0BCD, 0x0BCD ], [ 0x0C3E, 0x0C40 ], [ 0x0C46, 0x0C48 ],
    [ 0x0C4A, 0x0C4D ], [ 0x0C55, 0x0C56 ], [ 0x0CBC, 0x0CBC ],
    [ 0x0CBF, 0x0CBF ], [ 0x0CC6, 0x0CC6 ], [ 0x0CCC, 0x0CCD ],
    [ 0x0CE2, 0x0CE3 ], [ 0x0D41, 0x0D43 ], [ 0x0D4D, 0x0D4D ],
    [ 0x0DCA, 0x0DCA ], [ 0x0DD2, 0x0DD4 ], [ 0x0DD6, 0x0DD6 ],
    [ 0x0E31, 0x0E31 ], [ 0x0E34, 0x0E3A ], [ 0x0E47, 0x0E4E ],
    [ 0x0EB1, 0x0EB1 ], [ 0x0EB4, 0x0EB9 ], [ 0x0EBB, 0x0EBC ],
    [ 0x0EC8, 0x0ECD ], [ 0x0F18, 0x0F19 ], [ 0x0F35, 0x0F35 ],
    [ 0x0F37, 0x0F37 ], [ 0x0F39, 0x0F39 ], [ 0x0F71, 0x0F7E ],
    [ 0x0F80, 0x0F84 ], [ 0x0F86, 0x0F87 ], [ 0x0F90, 0x0F97 ],
    [ 0x0F99, 0x0FBC ], [ 0x0FC6, 0x0FC6 ], [ 0x102D, 0x1030 ],
    [ 0x1032, 0x1032 ], [ 0x1036, 0x1037 ], [ 0x1039, 0x1039 ],
    [ 0x1058, 0x1059 ], [ 0x1160, 0x11FF ], [ 0x135F, 0x135F ],
    [ 0x1712, 0x1714 ], [ 0x1732, 0x1734 ], [ 0x1752, 0x1753 ],
    [ 0x1772, 0x1773 ], [ 0x17B4, 0x17B5 ], [ 0x17B7, 0x17BD ],
    [ 0x17C6, 0x17C6 ], [ 0x17C9, 0x17D3 ], [ 0x17DD, 0x17DD ],
    [ 0x180B, 0x180D ], [ 0x18A9, 0x18A9 ], [ 0x1920, 0x1922 ],
    [ 0x1927, 0x1928 ], [ 0x1932, 0x1932 ], [ 0x1939, 0x193B ],
    [ 0x1A17, 0x1A18 ], [ 0x1B00, 0x1B03 ], [ 0x1B34, 0x1B34 ],
    [ 0x1B36, 0x1B3A ], [ 0x1B3C, 0x1B3C ], [ 0x1B42, 0x1B42 ],
    [ 0x1B6B, 0x1B73 ], [ 0x1DC0, 0x1DCA ], [ 0x1DFE, 0x1DFF ],
    [ 0x200B, 0x200F ], [ 0x202A, 0x202E ], [ 0x2060, 0x2063 ],
    [ 0x206A, 0x206F ], [ 0x20D0, 0x20EF ], [ 0x302A, 0x302F ],
    [ 0x3099, 0x309A ], [ 0xA806, 0xA806 ], [ 0xA80B, 0xA80B ],
    [ 0xA825, 0xA826 ], [ 0xFB1E, 0xFB1E ], [ 0xFE00, 0xFE0F ],
    [ 0xFE20, 0xFE23 ], [ 0xFEFF, 0xFEFF ], [ 0xFFF9, 0xFFFB ],
    [ 0x10A01, 0x10A03 ], [ 0x10A05, 0x10A06 ], [ 0x10A0C, 0x10A0F ],
    [ 0x10A38, 0x10A3A ], [ 0x10A3F, 0x10A3F ], [ 0x1D167, 0x1D169 ],
    [ 0x1D173, 0x1D182 ], [ 0x1D185, 0x1D18B ], [ 0x1D1AA, 0x1D1AD ],
    [ 0x1D242, 0x1D244 ], [ 0xE0001, 0xE0001 ], [ 0xE0020, 0xE007F ],
    [ 0xE0100, 0xE01EF ]
]


/***/ }),

/***/ 7776:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var defaults = __webpack_require__(6490)
var combining = __webpack_require__(1174)

var DEFAULTS = {
  nul: 0,
  control: 0
}

module.exports = function wcwidth(str) {
  return wcswidth(str, DEFAULTS)
}

module.exports.config = function(opts) {
  opts = defaults(opts || {}, DEFAULTS)
  return function wcwidth(str) {
    return wcswidth(str, opts)
  }
}

/*
 *  The following functions define the column width of an ISO 10646
 *  character as follows:
 *  - The null character (U+0000) has a column width of 0.
 *  - Other C0/C1 control characters and DEL will lead to a return value
 *    of -1.
 *  - Non-spacing and enclosing combining characters (general category
 *    code Mn or Me in the
 *    Unicode database) have a column width of 0.
 *  - SOFT HYPHEN (U+00AD) has a column width of 1.
 *  - Other format characters (general category code Cf in the Unicode
 *    database) and ZERO WIDTH
 *    SPACE (U+200B) have a column width of 0.
 *  - Hangul Jamo medial vowels and final consonants (U+1160-U+11FF)
 *    have a column width of 0.
 *  - Spacing characters in the East Asian Wide (W) or East Asian
 *    Full-width (F) category as
 *    defined in Unicode Technical Report #11 have a column width of 2.
 *  - All remaining characters (including all printable ISO 8859-1 and
 *    WGL4 characters, Unicode control characters, etc.) have a column
 *    width of 1.
 *  This implementation assumes that characters are encoded in ISO 10646.
*/

function wcswidth(str, opts) {
  if (typeof str !== 'string') return wcwidth(str, opts)

  var s = 0
  for (var i = 0; i < str.length; i++) {
    var n = wcwidth(str.charCodeAt(i), opts)
    if (n < 0) return -1
    s += n
  }

  return s
}

function wcwidth(ucs, opts) {
  // test for 8-bit control characters
  if (ucs === 0) return opts.nul
  if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0)) return opts.control

  // binary search in table of non-spacing characters
  if (bisearch(ucs)) return 0

  // if we arrive here, ucs is not a combining or C0/C1 control character
  return 1 +
      (ucs >= 0x1100 &&
       (ucs <= 0x115f ||                       // Hangul Jamo init. consonants
        ucs == 0x2329 || ucs == 0x232a ||
        (ucs >= 0x2e80 && ucs <= 0xa4cf &&
         ucs != 0x303f) ||                     // CJK ... Yi
        (ucs >= 0xac00 && ucs <= 0xd7a3) ||    // Hangul Syllables
        (ucs >= 0xf900 && ucs <= 0xfaff) ||    // CJK Compatibility Ideographs
        (ucs >= 0xfe10 && ucs <= 0xfe19) ||    // Vertical forms
        (ucs >= 0xfe30 && ucs <= 0xfe6f) ||    // CJK Compatibility Forms
        (ucs >= 0xff00 && ucs <= 0xff60) ||    // Fullwidth Forms
        (ucs >= 0xffe0 && ucs <= 0xffe6) ||
        (ucs >= 0x20000 && ucs <= 0x2fffd) ||
        (ucs >= 0x30000 && ucs <= 0x3fffd)));
}

function bisearch(ucs) {
  var min = 0
  var max = combining.length - 1
  var mid

  if (ucs < combining[0][0] || ucs > combining[max][1]) return false

  while (max >= min) {
    mid = Math.floor((min + max) / 2)
    if (ucs > combining[mid][1]) min = mid + 1
    else if (ucs < combining[mid][0]) max = mid - 1
    else return true
  }

  return false
}


/***/ }),

/***/ 2432:
/***/ ((module) => {

"use strict";


module.exports = function whichModule (exported) {
  for (var i = 0, files = Object.keys(require.cache), mod; i < files.length; i++) {
    mod = require.cache[files[i]]
    if (mod.exports === exported) return mod
  }
  return null
}


/***/ }),

/***/ 4380:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fs = __webpack_require__(5747)
var path = __webpack_require__(5622)
var util = __webpack_require__(1669)

function Y18N (opts) {
  // configurable options.
  opts = opts || {}
  this.directory = opts.directory || './locales'
  this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true
  this.locale = opts.locale || 'en'
  this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true

  // internal stuff.
  this.cache = {}
  this.writeQueue = []
}

Y18N.prototype.__ = function () {
  if (typeof arguments[0] !== 'string') {
    return this._taggedLiteral.apply(this, arguments)
  }
  var args = Array.prototype.slice.call(arguments)
  var str = args.shift()
  var cb = function () {} // start with noop.

  if (typeof args[args.length - 1] === 'function') cb = args.pop()
  cb = cb || function () {} // noop.

  if (!this.cache[this.locale]) this._readLocaleFile()

  // we've observed a new string, update the language file.
  if (!this.cache[this.locale][str] && this.updateFiles) {
    this.cache[this.locale][str] = str

    // include the current directory and locale,
    // since these values could change before the
    // write is performed.
    this._enqueueWrite([this.directory, this.locale, cb])
  } else {
    cb()
  }

  return util.format.apply(util, [this.cache[this.locale][str] || str].concat(args))
}

Y18N.prototype._taggedLiteral = function (parts) {
  var args = arguments
  var str = ''
  parts.forEach(function (part, i) {
    var arg = args[i + 1]
    str += part
    if (typeof arg !== 'undefined') {
      str += '%s'
    }
  })
  return this.__.apply(null, [str].concat([].slice.call(arguments, 1)))
}

Y18N.prototype._enqueueWrite = function (work) {
  this.writeQueue.push(work)
  if (this.writeQueue.length === 1) this._processWriteQueue()
}

Y18N.prototype._processWriteQueue = function () {
  var _this = this
  var work = this.writeQueue[0]

  // destructure the enqueued work.
  var directory = work[0]
  var locale = work[1]
  var cb = work[2]

  var languageFile = this._resolveLocaleFile(directory, locale)
  var serializedLocale = JSON.stringify(this.cache[locale], null, 2)

  fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
    _this.writeQueue.shift()
    if (_this.writeQueue.length > 0) _this._processWriteQueue()
    cb(err)
  })
}

Y18N.prototype._readLocaleFile = function () {
  var localeLookup = {}
  var languageFile = this._resolveLocaleFile(this.directory, this.locale)

  try {
    localeLookup = JSON.parse(fs.readFileSync(languageFile, 'utf-8'))
  } catch (err) {
    if (err instanceof SyntaxError) {
      err.message = 'syntax error in ' + languageFile
    }

    if (err.code === 'ENOENT') localeLookup = {}
    else throw err
  }

  this.cache[this.locale] = localeLookup
}

Y18N.prototype._resolveLocaleFile = function (directory, locale) {
  var file = path.resolve(directory, './', locale + '.json')
  if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
    // attempt fallback to language only
    var languageFile = path.resolve(directory, './', locale.split('_')[0] + '.json')
    if (this._fileExistsSync(languageFile)) file = languageFile
  }
  return file
}

// this only exists because fs.existsSync() "will be deprecated"
// see https://nodejs.org/api/fs.html#fs_fs_existssync_path
Y18N.prototype._fileExistsSync = function (file) {
  try {
    return fs.statSync(file).isFile()
  } catch (err) {
    return false
  }
}

Y18N.prototype.__n = function () {
  var args = Array.prototype.slice.call(arguments)
  var singular = args.shift()
  var plural = args.shift()
  var quantity = args.shift()

  var cb = function () {} // start with noop.
  if (typeof args[args.length - 1] === 'function') cb = args.pop()

  if (!this.cache[this.locale]) this._readLocaleFile()

  var str = quantity === 1 ? singular : plural
  if (this.cache[this.locale][singular]) {
    str = this.cache[this.locale][singular][quantity === 1 ? 'one' : 'other']
  }

  // we've observed a new string, update the language file.
  if (!this.cache[this.locale][singular] && this.updateFiles) {
    this.cache[this.locale][singular] = {
      one: singular,
      other: plural
    }

    // include the current directory and locale,
    // since these values could change before the
    // write is performed.
    this._enqueueWrite([this.directory, this.locale, cb])
  } else {
    cb()
  }

  // if a %d placeholder is provided, add quantity
  // to the arguments expanded by util.format.
  var values = [str]
  if (~str.indexOf('%d')) values.push(quantity)

  return util.format.apply(util, values.concat(args))
}

Y18N.prototype.setLocale = function (locale) {
  this.locale = locale
}

Y18N.prototype.getLocale = function () {
  return this.locale
}

Y18N.prototype.updateLocale = function (obj) {
  if (!this.cache[this.locale]) this._readLocaleFile()

  for (var key in obj) {
    this.cache[this.locale][key] = obj[key]
  }
}

module.exports = function (opts) {
  var y18n = new Y18N(opts)

  // bind all functions to y18n, so that
  // they can be used in isolation.
  for (var key in y18n) {
    if (typeof y18n[key] === 'function') {
      y18n[key] = y18n[key].bind(y18n)
    }
  }

  return y18n
}


/***/ }),

/***/ 2222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const camelCase = __webpack_require__(5024)
const decamelize = __webpack_require__(7325)
const path = __webpack_require__(5622)
const tokenizeArgString = __webpack_require__(3450)
const util = __webpack_require__(1669)

function parse (args, opts) {
  opts = Object.assign(Object.create(null), opts)
  // allow a string argument to be passed in rather
  // than an argv array.
  args = tokenizeArgString(args)

  // aliases might have transitive relationships, normalize this.
  const aliases = combineAliases(Object.assign(Object.create(null), opts.alias))
  const configuration = Object.assign({
    'boolean-negation': true,
    'camel-case-expansion': true,
    'combine-arrays': false,
    'dot-notation': true,
    'duplicate-arguments-array': true,
    'flatten-duplicate-arrays': true,
    'greedy-arrays': true,
    'halt-at-non-option': false,
    'nargs-eats-options': false,
    'negation-prefix': 'no-',
    'parse-numbers': true,
    'populate--': false,
    'set-placeholder-key': false,
    'short-option-groups': true,
    'strip-aliased': false,
    'strip-dashed': false,
    'unknown-options-as-args': false
  }, opts.configuration)
  const defaults = Object.assign(Object.create(null), opts.default)
  const configObjects = opts.configObjects || []
  const envPrefix = opts.envPrefix
  const notFlagsOption = configuration['populate--']
  const notFlagsArgv = notFlagsOption ? '--' : '_'
  const newAliases = Object.create(null)
  const defaulted = Object.create(null)
  // allow a i18n handler to be passed in, default to a fake one (util.format).
  const __ = opts.__ || util.format
  const flags = {
    aliases: Object.create(null),
    arrays: Object.create(null),
    bools: Object.create(null),
    strings: Object.create(null),
    numbers: Object.create(null),
    counts: Object.create(null),
    normalize: Object.create(null),
    configs: Object.create(null),
    nargs: Object.create(null),
    coercions: Object.create(null),
    keys: []
  }
  const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/
  const negatedBoolean = new RegExp('^--' + configuration['negation-prefix'] + '(.+)')

  ;[].concat(opts.array).filter(Boolean).forEach(function (opt) {
    const key = opt.key || opt

    // assign to flags[bools|strings|numbers]
    const assignment = Object.keys(opt).map(function (key) {
      return ({
        boolean: 'bools',
        string: 'strings',
        number: 'numbers'
      })[key]
    }).filter(Boolean).pop()

    // assign key to be coerced
    if (assignment) {
      flags[assignment][key] = true
    }

    flags.arrays[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.boolean).filter(Boolean).forEach(function (key) {
    flags.bools[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.string).filter(Boolean).forEach(function (key) {
    flags.strings[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.number).filter(Boolean).forEach(function (key) {
    flags.numbers[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.count).filter(Boolean).forEach(function (key) {
    flags.counts[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.normalize).filter(Boolean).forEach(function (key) {
    flags.normalize[key] = true
    flags.keys.push(key)
  })

  Object.keys(opts.narg || {}).forEach(function (k) {
    flags.nargs[k] = opts.narg[k]
    flags.keys.push(k)
  })

  Object.keys(opts.coerce || {}).forEach(function (k) {
    flags.coercions[k] = opts.coerce[k]
    flags.keys.push(k)
  })

  if (Array.isArray(opts.config) || typeof opts.config === 'string') {
    ;[].concat(opts.config).filter(Boolean).forEach(function (key) {
      flags.configs[key] = true
    })
  } else {
    Object.keys(opts.config || {}).forEach(function (k) {
      flags.configs[k] = opts.config[k]
    })
  }

  // create a lookup table that takes into account all
  // combinations of aliases: {f: ['foo'], foo: ['f']}
  extendAliases(opts.key, aliases, opts.default, flags.arrays)

  // apply default values to all aliases.
  Object.keys(defaults).forEach(function (key) {
    (flags.aliases[key] || []).forEach(function (alias) {
      defaults[alias] = defaults[key]
    })
  })

  let error = null
  checkConfiguration()

  let notFlags = []

  const argv = Object.assign(Object.create(null), { _: [] })
  // TODO(bcoe): for the first pass at removing object prototype  we didn't
  // remove all prototypes from objects returned by this API, we might want
  // to gradually move towards doing so.
  const argvReturn = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    let broken
    let key
    let letters
    let m
    let next
    let value

    // any unknown option (except for end-of-options, "--")
    if (arg !== '--' && isUnknownOptionAsArg(arg)) {
      argv._.push(arg)
    // -- separated by =
    } else if (arg.match(/^--.+=/) || (
      !configuration['short-option-groups'] && arg.match(/^-.+=/)
    )) {
      // Using [\s\S] instead of . because js doesn't support the
      // 'dotall' regex modifier. See:
      // http://stackoverflow.com/a/1068308/13216
      m = arg.match(/^--?([^=]+)=([\s\S]*)$/)

      // arrays format = '--f=a b c'
      if (checkAllAliases(m[1], flags.arrays)) {
        i = eatArray(i, m[1], args, m[2])
      } else if (checkAllAliases(m[1], flags.nargs) !== false) {
        // nargs format = '--f=monkey washing cat'
        i = eatNargs(i, m[1], args, m[2])
      } else {
        setArg(m[1], m[2])
      }
    } else if (arg.match(negatedBoolean) && configuration['boolean-negation']) {
      key = arg.match(negatedBoolean)[1]
      setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false)

    // -- separated by space.
    } else if (arg.match(/^--.+/) || (
      !configuration['short-option-groups'] && arg.match(/^-[^-]+/)
    )) {
      key = arg.match(/^--?(.+)/)[1]

      if (checkAllAliases(key, flags.arrays)) {
        // array format = '--foo a b c'
        i = eatArray(i, key, args)
      } else if (checkAllAliases(key, flags.nargs) !== false) {
        // nargs format = '--foo a b c'
        // should be truthy even if: flags.nargs[key] === 0
        i = eatNargs(i, key, args)
      } else {
        next = args[i + 1]

        if (next !== undefined && (!next.match(/^-/) ||
          next.match(negative)) &&
          !checkAllAliases(key, flags.bools) &&
          !checkAllAliases(key, flags.counts)) {
          setArg(key, next)
          i++
        } else if (/^(true|false)$/.test(next)) {
          setArg(key, next)
          i++
        } else {
          setArg(key, defaultValue(key))
        }
      }

    // dot-notation flag separated by '='.
    } else if (arg.match(/^-.\..+=/)) {
      m = arg.match(/^-([^=]+)=([\s\S]*)$/)
      setArg(m[1], m[2])

    // dot-notation flag separated by space.
    } else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
      next = args[i + 1]
      key = arg.match(/^-(.\..+)/)[1]

      if (next !== undefined && !next.match(/^-/) &&
        !checkAllAliases(key, flags.bools) &&
        !checkAllAliases(key, flags.counts)) {
        setArg(key, next)
        i++
      } else {
        setArg(key, defaultValue(key))
      }
    } else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
      letters = arg.slice(1, -1).split('')
      broken = false

      for (let j = 0; j < letters.length; j++) {
        next = arg.slice(j + 2)

        if (letters[j + 1] && letters[j + 1] === '=') {
          value = arg.slice(j + 3)
          key = letters[j]

          if (checkAllAliases(key, flags.arrays)) {
            // array format = '-f=a b c'
            i = eatArray(i, key, args, value)
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            // nargs format = '-f=monkey washing cat'
            i = eatNargs(i, key, args, value)
          } else {
            setArg(key, value)
          }

          broken = true
          break
        }

        if (next === '-') {
          setArg(letters[j], next)
          continue
        }

        // current letter is an alphabetic character and next value is a number
        if (/[A-Za-z]/.test(letters[j]) &&
          /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
          setArg(letters[j], next)
          broken = true
          break
        }

        if (letters[j + 1] && letters[j + 1].match(/\W/)) {
          setArg(letters[j], next)
          broken = true
          break
        } else {
          setArg(letters[j], defaultValue(letters[j]))
        }
      }

      key = arg.slice(-1)[0]

      if (!broken && key !== '-') {
        if (checkAllAliases(key, flags.arrays)) {
          // array format = '-f a b c'
          i = eatArray(i, key, args)
        } else if (checkAllAliases(key, flags.nargs) !== false) {
          // nargs format = '-f a b c'
          // should be truthy even if: flags.nargs[key] === 0
          i = eatNargs(i, key, args)
        } else {
          next = args[i + 1]

          if (next !== undefined && (!/^(-|--)[^-]/.test(next) ||
            next.match(negative)) &&
            !checkAllAliases(key, flags.bools) &&
            !checkAllAliases(key, flags.counts)) {
            setArg(key, next)
            i++
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next)
            i++
          } else {
            setArg(key, defaultValue(key))
          }
        }
      }
    } else if (arg.match(/^-[0-9]$/) &&
      arg.match(negative) &&
      checkAllAliases(arg.slice(1), flags.bools)) {
      // single-digit boolean alias, e.g: xargs -0
      key = arg.slice(1)
      setArg(key, defaultValue(key))
    } else if (arg === '--') {
      notFlags = args.slice(i + 1)
      break
    } else if (configuration['halt-at-non-option']) {
      notFlags = args.slice(i)
      break
    } else {
      argv._.push(maybeCoerceNumber('_', arg))
    }
  }

  // order of precedence:
  // 1. command line arg
  // 2. value from env var
  // 3. value from config file
  // 4. value from config objects
  // 5. configured default value
  applyEnvVars(argv, true) // special case: check env vars that point to config file
  applyEnvVars(argv, false)
  setConfig(argv)
  setConfigObjects()
  applyDefaultsAndAliases(argv, flags.aliases, defaults, true)
  applyCoercions(argv)
  if (configuration['set-placeholder-key']) setPlaceholderKeys(argv)

  // for any counts either not in args or without an explicit default, set to 0
  Object.keys(flags.counts).forEach(function (key) {
    if (!hasKey(argv, key.split('.'))) setArg(key, 0)
  })

  // '--' defaults to undefined.
  if (notFlagsOption && notFlags.length) argv[notFlagsArgv] = []
  notFlags.forEach(function (key) {
    argv[notFlagsArgv].push(key)
  })

  if (configuration['camel-case-expansion'] && configuration['strip-dashed']) {
    Object.keys(argv).filter(key => key !== '--' && key.includes('-')).forEach(key => {
      delete argv[key]
    })
  }

  if (configuration['strip-aliased']) {
    ;[].concat(...Object.keys(aliases).map(k => aliases[k])).forEach(alias => {
      if (configuration['camel-case-expansion']) {
        delete argv[alias.split('.').map(prop => camelCase(prop)).join('.')]
      }

      delete argv[alias]
    })
  }

  // how many arguments should we consume, based
  // on the nargs option?
  function eatNargs (i, key, args, argAfterEqualSign) {
    let ii
    let toEat = checkAllAliases(key, flags.nargs)
    // NaN has a special meaning for the array type, indicating that one or
    // more values are expected.
    toEat = isNaN(toEat) ? 1 : toEat

    if (toEat === 0) {
      if (!isUndefined(argAfterEqualSign)) {
        error = Error(__('Argument unexpected for: %s', key))
      }
      setArg(key, defaultValue(key))
      return i
    }

    let available = isUndefined(argAfterEqualSign) ? 0 : 1
    if (configuration['nargs-eats-options']) {
      // classic behavior, yargs eats positional and dash arguments.
      if (args.length - (i + 1) + available < toEat) {
        error = Error(__('Not enough arguments following: %s', key))
      }
      available = toEat
    } else {
      // nargs will not consume flag arguments, e.g., -abc, --foo,
      // and terminates when one is observed.
      for (ii = i + 1; ii < args.length; ii++) {
        if (!args[ii].match(/^-[^0-9]/) || args[ii].match(negative) || isUnknownOptionAsArg(args[ii])) available++
        else break
      }
      if (available < toEat) error = Error(__('Not enough arguments following: %s', key))
    }

    let consumed = Math.min(available, toEat)
    if (!isUndefined(argAfterEqualSign) && consumed > 0) {
      setArg(key, argAfterEqualSign)
      consumed--
    }
    for (ii = i + 1; ii < (consumed + i + 1); ii++) {
      setArg(key, args[ii])
    }

    return (i + consumed)
  }

  // if an option is an array, eat all non-hyphenated arguments
  // following it... YUM!
  // e.g., --foo apple banana cat becomes ["apple", "banana", "cat"]
  function eatArray (i, key, args, argAfterEqualSign) {
    let argsToSet = []
    let next = argAfterEqualSign || args[i + 1]
    // If both array and nargs are configured, enforce the nargs count:
    const nargsCount = checkAllAliases(key, flags.nargs)

    if (checkAllAliases(key, flags.bools) && !(/^(true|false)$/.test(next))) {
      argsToSet.push(true)
    } else if (isUndefined(next) ||
        (isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))) {
      // for keys without value ==> argsToSet remains an empty []
      // set user default value, if available
      if (defaults[key] !== undefined) {
        const defVal = defaults[key]
        argsToSet = Array.isArray(defVal) ? defVal : [defVal]
      }
    } else {
      // value in --option=value is eaten as is
      if (!isUndefined(argAfterEqualSign)) {
        argsToSet.push(processValue(key, argAfterEqualSign))
      }
      for (let ii = i + 1; ii < args.length; ii++) {
        if ((!configuration['greedy-arrays'] && argsToSet.length > 0) ||
          (nargsCount && argsToSet.length >= nargsCount)) break
        next = args[ii]
        if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next)) break
        i = ii
        argsToSet.push(processValue(key, next))
      }
    }

    // If both array and nargs are configured, create an error if less than
    // nargs positionals were found. NaN has special meaning, indicating
    // that at least one value is required (more are okay).
    if ((nargsCount && argsToSet.length < nargsCount) ||
        (isNaN(nargsCount) && argsToSet.length === 0)) {
      error = Error(__('Not enough arguments following: %s', key))
    }

    setArg(key, argsToSet)
    return i
  }

  function setArg (key, val) {
    if (/-/.test(key) && configuration['camel-case-expansion']) {
      const alias = key.split('.').map(function (prop) {
        return camelCase(prop)
      }).join('.')
      addNewAlias(key, alias)
    }

    const value = processValue(key, val)
    const splitKey = key.split('.')
    setKey(argv, splitKey, value)

    // handle populating aliases of the full key
    if (flags.aliases[key]) {
      flags.aliases[key].forEach(function (x) {
        x = x.split('.')
        setKey(argv, x, value)
      })
    }

    // handle populating aliases of the first element of the dot-notation key
    if (splitKey.length > 1 && configuration['dot-notation']) {
      ;(flags.aliases[splitKey[0]] || []).forEach(function (x) {
        x = x.split('.')

        // expand alias with nested objects in key
        const a = [].concat(splitKey)
        a.shift() // nuke the old key.
        x = x.concat(a)

        // populate alias only if is not already an alias of the full key
        // (already populated above)
        if (!(flags.aliases[key] || []).includes(x.join('.'))) {
          setKey(argv, x, value)
        }
      })
    }

    // Set normalize getter and setter when key is in 'normalize' but isn't an array
    if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
      const keys = [key].concat(flags.aliases[key] || [])
      keys.forEach(function (key) {
        Object.defineProperty(argvReturn, key, {
          enumerable: true,
          get () {
            return val
          },
          set (value) {
            val = typeof value === 'string' ? path.normalize(value) : value
          }
        })
      })
    }
  }

  function addNewAlias (key, alias) {
    if (!(flags.aliases[key] && flags.aliases[key].length)) {
      flags.aliases[key] = [alias]
      newAliases[alias] = true
    }
    if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
      addNewAlias(alias, key)
    }
  }

  function processValue (key, val) {
    // strings may be quoted, clean this up as we assign values.
    if (typeof val === 'string' &&
      (val[0] === "'" || val[0] === '"') &&
      val[val.length - 1] === val[0]
    ) {
      val = val.substring(1, val.length - 1)
    }

    // handle parsing boolean arguments --foo=true --bar false.
    if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
      if (typeof val === 'string') val = val === 'true'
    }

    let value = Array.isArray(val)
      ? val.map(function (v) { return maybeCoerceNumber(key, v) })
      : maybeCoerceNumber(key, val)

    // increment a count given as arg (either no value or value parsed as boolean)
    if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === 'boolean')) {
      value = increment
    }

    // Set normalized value when key is in 'normalize' and in 'arrays'
    if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
      if (Array.isArray(val)) value = val.map(path.normalize)
      else value = path.normalize(val)
    }
    return value
  }

  function maybeCoerceNumber (key, value) {
    if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
      const shouldCoerceNumber = isNumber(value) && configuration['parse-numbers'] && (
        Number.isSafeInteger(Math.floor(value))
      )
      if (shouldCoerceNumber || (!isUndefined(value) && checkAllAliases(key, flags.numbers))) value = Number(value)
    }
    return value
  }

  // set args from config.json file, this should be
  // applied last so that defaults can be applied.
  function setConfig (argv) {
    const configLookup = Object.create(null)

    // expand defaults/aliases, in-case any happen to reference
    // the config.json file.
    applyDefaultsAndAliases(configLookup, flags.aliases, defaults)

    Object.keys(flags.configs).forEach(function (configKey) {
      const configPath = argv[configKey] || configLookup[configKey]
      if (configPath) {
        try {
          let config = null
          const resolvedConfigPath = path.resolve(process.cwd(), configPath)

          if (typeof flags.configs[configKey] === 'function') {
            try {
              config = flags.configs[configKey](resolvedConfigPath)
            } catch (e) {
              config = e
            }
            if (config instanceof Error) {
              error = config
              return
            }
          } else {
            config = require(resolvedConfigPath)
          }

          setConfigObject(config)
        } catch (ex) {
          if (argv[configKey]) error = Error(__('Invalid JSON config file: %s', configPath))
        }
      }
    })
  }

  // set args from config object.
  // it recursively checks nested objects.
  function setConfigObject (config, prev) {
    Object.keys(config).forEach(function (key) {
      const value = config[key]
      const fullKey = prev ? prev + '.' + key : key

      // if the value is an inner object and we have dot-notation
      // enabled, treat inner objects in config the same as
      // heavily nested dot notations (foo.bar.apple).
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && configuration['dot-notation']) {
        // if the value is an object but not an array, check nested object
        setConfigObject(value, fullKey)
      } else {
        // setting arguments via CLI takes precedence over
        // values within the config file.
        if (!hasKey(argv, fullKey.split('.')) || (checkAllAliases(fullKey, flags.arrays) && configuration['combine-arrays'])) {
          setArg(fullKey, value)
        }
      }
    })
  }

  // set all config objects passed in opts
  function setConfigObjects () {
    if (typeof configObjects === 'undefined') return
    configObjects.forEach(function (configObject) {
      setConfigObject(configObject)
    })
  }

  function applyEnvVars (argv, configOnly) {
    if (typeof envPrefix === 'undefined') return

    const prefix = typeof envPrefix === 'string' ? envPrefix : ''
    Object.keys(process.env).forEach(function (envVar) {
      if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
        // get array of nested keys and convert them to camel case
        const keys = envVar.split('__').map(function (key, i) {
          if (i === 0) {
            key = key.substring(prefix.length)
          }
          return camelCase(key)
        })

        if (((configOnly && flags.configs[keys.join('.')]) || !configOnly) && !hasKey(argv, keys)) {
          setArg(keys.join('.'), process.env[envVar])
        }
      }
    })
  }

  function applyCoercions (argv) {
    let coerce
    const applied = new Set()
    Object.keys(argv).forEach(function (key) {
      if (!applied.has(key)) { // If we haven't already coerced this option via one of its aliases
        coerce = checkAllAliases(key, flags.coercions)
        if (typeof coerce === 'function') {
          try {
            const value = maybeCoerceNumber(key, coerce(argv[key]))
            ;([].concat(flags.aliases[key] || [], key)).forEach(ali => {
              applied.add(ali)
              argv[ali] = value
            })
          } catch (err) {
            error = err
          }
        }
      }
    })
  }

  function setPlaceholderKeys (argv) {
    flags.keys.forEach((key) => {
      // don't set placeholder keys for dot notation options 'foo.bar'.
      if (~key.indexOf('.')) return
      if (typeof argv[key] === 'undefined') argv[key] = undefined
    })
    return argv
  }

  function applyDefaultsAndAliases (obj, aliases, defaults, canLog = false) {
    Object.keys(defaults).forEach(function (key) {
      if (!hasKey(obj, key.split('.'))) {
        setKey(obj, key.split('.'), defaults[key])
        if (canLog) defaulted[key] = true

        ;(aliases[key] || []).forEach(function (x) {
          if (hasKey(obj, x.split('.'))) return
          setKey(obj, x.split('.'), defaults[key])
        })
      }
    })
  }

  function hasKey (obj, keys) {
    let o = obj

    if (!configuration['dot-notation']) keys = [keys.join('.')]

    keys.slice(0, -1).forEach(function (key) {
      o = (o[key] || {})
    })

    const key = keys[keys.length - 1]

    if (typeof o !== 'object') return false
    else return key in o
  }

  function setKey (obj, keys, value) {
    let o = obj

    if (!configuration['dot-notation']) keys = [keys.join('.')]

    keys.slice(0, -1).forEach(function (key, index) {
      // TODO(bcoe): in the next major version of yargs, switch to
      // Object.create(null) for dot notation:
      key = sanitizeKey(key)

      if (typeof o === 'object' && o[key] === undefined) {
        o[key] = {}
      }

      if (typeof o[key] !== 'object' || Array.isArray(o[key])) {
        // ensure that o[key] is an array, and that the last item is an empty object.
        if (Array.isArray(o[key])) {
          o[key].push({})
        } else {
          o[key] = [o[key], {}]
        }

        // we want to update the empty object at the end of the o[key] array, so set o to that object
        o = o[key][o[key].length - 1]
      } else {
        o = o[key]
      }
    })

    // TODO(bcoe): in the next major version of yargs, switch to
    // Object.create(null) for dot notation:
    const key = sanitizeKey(keys[keys.length - 1])

    const isTypeArray = checkAllAliases(keys.join('.'), flags.arrays)
    const isValueArray = Array.isArray(value)
    let duplicate = configuration['duplicate-arguments-array']

    // nargs has higher priority than duplicate
    if (!duplicate && checkAllAliases(key, flags.nargs)) {
      duplicate = true
      if ((!isUndefined(o[key]) && flags.nargs[key] === 1) || (Array.isArray(o[key]) && o[key].length === flags.nargs[key])) {
        o[key] = undefined
      }
    }

    if (value === increment) {
      o[key] = increment(o[key])
    } else if (Array.isArray(o[key])) {
      if (duplicate && isTypeArray && isValueArray) {
        o[key] = configuration['flatten-duplicate-arrays'] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value])
      } else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
        o[key] = value
      } else {
        o[key] = o[key].concat([value])
      }
    } else if (o[key] === undefined && isTypeArray) {
      o[key] = isValueArray ? value : [value]
    } else if (duplicate && !(
      o[key] === undefined ||
        checkAllAliases(key, flags.counts) ||
        checkAllAliases(key, flags.bools)
    )) {
      o[key] = [o[key], value]
    } else {
      o[key] = value
    }
  }

  // extend the aliases list with inferred aliases.
  function extendAliases (...args) {
    args.forEach(function (obj) {
      Object.keys(obj || {}).forEach(function (key) {
        // short-circuit if we've already added a key
        // to the aliases array, for example it might
        // exist in both 'opts.default' and 'opts.key'.
        if (flags.aliases[key]) return

        flags.aliases[key] = [].concat(aliases[key] || [])
        // For "--option-name", also set argv.optionName
        flags.aliases[key].concat(key).forEach(function (x) {
          if (/-/.test(x) && configuration['camel-case-expansion']) {
            const c = camelCase(x)
            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
              flags.aliases[key].push(c)
              newAliases[c] = true
            }
          }
        })
        // For "--optionName", also set argv['option-name']
        flags.aliases[key].concat(key).forEach(function (x) {
          if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
            const c = decamelize(x, '-')
            if (c !== key && flags.aliases[key].indexOf(c) === -1) {
              flags.aliases[key].push(c)
              newAliases[c] = true
            }
          }
        })
        flags.aliases[key].forEach(function (x) {
          flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
            return x !== y
          }))
        })
      })
    })
  }

  // return the 1st set flag for any of a key's aliases (or false if no flag set)
  function checkAllAliases (key, flag) {
    const toCheck = [].concat(flags.aliases[key] || [], key)
    const keys = Object.keys(flag)
    const setAlias = toCheck.find(key => keys.includes(key))
    return setAlias ? flag[setAlias] : false
  }

  function hasAnyFlag (key) {
    const toCheck = [].concat(Object.keys(flags).map(k => flags[k]))
    return toCheck.some(function (flag) {
      return Array.isArray(flag) ? flag.includes(key) : flag[key]
    })
  }

  function hasFlagsMatching (arg, ...patterns) {
    const toCheck = [].concat(...patterns)
    return toCheck.some(function (pattern) {
      const match = arg.match(pattern)
      return match && hasAnyFlag(match[1])
    })
  }

  // based on a simplified version of the short flag group parsing logic
  function hasAllShortFlags (arg) {
    // if this is a negative number, or doesn't start with a single hyphen, it's not a short flag group
    if (arg.match(negative) || !arg.match(/^-[^-]+/)) { return false }
    let hasAllFlags = true
    let next
    const letters = arg.slice(1).split('')
    for (let j = 0; j < letters.length; j++) {
      next = arg.slice(j + 2)

      if (!hasAnyFlag(letters[j])) {
        hasAllFlags = false
        break
      }

      if ((letters[j + 1] && letters[j + 1] === '=') ||
        next === '-' ||
        (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
        (letters[j + 1] && letters[j + 1].match(/\W/))) {
        break
      }
    }
    return hasAllFlags
  }

  function isUnknownOptionAsArg (arg) {
    return configuration['unknown-options-as-args'] && isUnknownOption(arg)
  }

  function isUnknownOption (arg) {
    // ignore negative numbers
    if (arg.match(negative)) { return false }
    // if this is a short option group and all of them are configured, it isn't unknown
    if (hasAllShortFlags(arg)) { return false }
    // e.g. '--count=2'
    const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/
    // e.g. '-a' or '--arg'
    const normalFlag = /^-+([^=]+?)$/
    // e.g. '-a-'
    const flagEndingInHyphen = /^-+([^=]+?)-$/
    // e.g. '-abc123'
    const flagEndingInDigits = /^-+([^=]+?\d+)$/
    // e.g. '-a/usr/local'
    const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/
    // check the different types of flag styles, including negatedBoolean, a pattern defined near the start of the parse method
    return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters)
  }

  // make a best effor to pick a default value
  // for an option based on name and type.
  function defaultValue (key) {
    if (!checkAllAliases(key, flags.bools) &&
        !checkAllAliases(key, flags.counts) &&
        `${key}` in defaults) {
      return defaults[key]
    } else {
      return defaultForType(guessType(key))
    }
  }

  // return a default value, given the type of a flag.,
  // e.g., key of type 'string' will default to '', rather than 'true'.
  function defaultForType (type) {
    const def = {
      boolean: true,
      string: '',
      number: undefined,
      array: []
    }

    return def[type]
  }

  // given a flag, enforce a default type.
  function guessType (key) {
    let type = 'boolean'
    if (checkAllAliases(key, flags.strings)) type = 'string'
    else if (checkAllAliases(key, flags.numbers)) type = 'number'
    else if (checkAllAliases(key, flags.bools)) type = 'boolean'
    else if (checkAllAliases(key, flags.arrays)) type = 'array'
    return type
  }

  function isNumber (x) {
    if (x === null || x === undefined) return false
    // if loaded from config, may already be a number.
    if (typeof x === 'number') return true
    // hexadecimal.
    if (/^0x[0-9a-f]+$/i.test(x)) return true
    // don't treat 0123 as a number; as it drops the leading '0'.
    if (x.length > 1 && x[0] === '0') return false
    return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x)
  }

  function isUndefined (num) {
    return num === undefined
  }

  // check user configuration settings for inconsistencies
  function checkConfiguration () {
    // count keys should not be set as array/narg
    Object.keys(flags.counts).find(key => {
      if (checkAllAliases(key, flags.arrays)) {
        error = Error(__('Invalid configuration: %s, opts.count excludes opts.array.', key))
        return true
      } else if (checkAllAliases(key, flags.nargs)) {
        error = Error(__('Invalid configuration: %s, opts.count excludes opts.narg.', key))
        return true
      }
    })
  }

  return {
    argv: Object.assign(argvReturn, argv),
    error: error,
    aliases: Object.assign({}, flags.aliases),
    newAliases: Object.assign({}, newAliases),
    defaulted: Object.assign({}, defaulted),
    configuration: configuration
  }
}

// if any aliases reference each other, we should
// merge them together.
function combineAliases (aliases) {
  const aliasArrays = []
  const combined = Object.create(null)
  let change = true

  // turn alias lookup hash {key: ['alias1', 'alias2']} into
  // a simple array ['key', 'alias1', 'alias2']
  Object.keys(aliases).forEach(function (key) {
    aliasArrays.push(
      [].concat(aliases[key], key)
    )
  })

  // combine arrays until zero changes are
  // made in an iteration.
  while (change) {
    change = false
    for (let i = 0; i < aliasArrays.length; i++) {
      for (let ii = i + 1; ii < aliasArrays.length; ii++) {
        const intersect = aliasArrays[i].filter(function (v) {
          return aliasArrays[ii].indexOf(v) !== -1
        })

        if (intersect.length) {
          aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii])
          aliasArrays.splice(ii, 1)
          change = true
          break
        }
      }
    }
  }

  // map arrays back to the hash-lookup (de-dupe while
  // we're at it).
  aliasArrays.forEach(function (aliasArray) {
    aliasArray = aliasArray.filter(function (v, i, self) {
      return self.indexOf(v) === i
    })
    combined[aliasArray.pop()] = aliasArray
  })

  return combined
}

// this function should only be called when a count is given as an arg
// it is NOT called to set a default value
// thus we can start the count at 1 instead of 0
function increment (orig) {
  return orig !== undefined ? orig + 1 : 1
}

function Parser (args, opts) {
  const result = parse(args.slice(), opts)
  return result.argv
}

// parse arguments and return detailed
// meta information, aliases, etc.
Parser.detailed = function (args, opts) {
  return parse(args.slice(), opts)
}

// TODO(bcoe): in the next major version of yargs, switch to
// Object.create(null) for dot notation:
function sanitizeKey (key) {
  if (key === '__proto__') return '___proto___'
  return key
}

module.exports = Parser


/***/ }),

/***/ 3450:
/***/ ((module) => {

// take an un-split argv string and tokenize it.
module.exports = function (argString) {
  if (Array.isArray(argString)) {
    return argString.map(e => typeof e !== 'string' ? e + '' : e)
  }

  argString = argString.trim()

  let i = 0
  let prevC = null
  let c = null
  let opening = null
  const args = []

  for (let ii = 0; ii < argString.length; ii++) {
    prevC = c
    c = argString.charAt(ii)

    // split on spaces unless we're in quotes.
    if (c === ' ' && !opening) {
      if (!(prevC === ' ')) {
        i++
      }
      continue
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.
    if (c === opening) {
      opening = null
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c
    }

    if (!args[i]) args[i] = ''
    args[i] += c
  }

  return args
}


/***/ }),

/***/ 7349:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.applyExtends = void 0;
const fs = __webpack_require__(5747);
const path = __webpack_require__(5622);
const yerror_1 = __webpack_require__(3837);
let previouslyVisitedConfigs = [];
function checkForCircularExtends(cfgPath) {
    if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
        throw new yerror_1.YError(`Circular extended configurations: '${cfgPath}'.`);
    }
}
function getPathToDefaultConfig(cwd, pathToExtend) {
    return path.resolve(cwd, pathToExtend);
}
function mergeDeep(config1, config2) {
    const target = {};
    function isObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    }
    Object.assign(target, config1);
    for (const key of Object.keys(config2)) {
        if (isObject(config2[key]) && isObject(target[key])) {
            target[key] = mergeDeep(config1[key], config2[key]);
        }
        else {
            target[key] = config2[key];
        }
    }
    return target;
}
function applyExtends(config, cwd, mergeExtends = false) {
    let defaultConfig = {};
    if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
        if (typeof config.extends !== 'string')
            return defaultConfig;
        const isPath = /\.json|\..*rc$/.test(config.extends);
        let pathToDefault = null;
        if (!isPath) {
            try {
                pathToDefault = require.resolve(config.extends);
            }
            catch (err) {
                // most likely this simply isn't a module.
            }
        }
        else {
            pathToDefault = getPathToDefaultConfig(cwd, config.extends);
        }
        // maybe the module uses key for some other reason,
        // err on side of caution.
        if (!pathToDefault && !isPath)
            return config;
        if (!pathToDefault)
            throw new yerror_1.YError(`Unable to find extended config '${config.extends}' in '${cwd}'.`);
        checkForCircularExtends(pathToDefault);
        previouslyVisitedConfigs.push(pathToDefault);
        defaultConfig = isPath ? JSON.parse(fs.readFileSync(pathToDefault, 'utf8')) : require(config.extends);
        delete config.extends;
        defaultConfig = applyExtends(defaultConfig, path.dirname(pathToDefault), mergeExtends);
    }
    previouslyVisitedConfigs = [];
    return mergeExtends ? mergeDeep(defaultConfig, config) : Object.assign({}, defaultConfig, config);
}
exports.applyExtends = applyExtends;


/***/ }),

/***/ 4984:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.argsert = void 0;
const yerror_1 = __webpack_require__(3837);
const parse_command_1 = __webpack_require__(9571);
const positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
function argsert(arg1, arg2, arg3) {
    function parseArgs() {
        return typeof arg1 === 'object'
            ? [{ demanded: [], optional: [] }, arg1, arg2]
            : [parse_command_1.parseCommand(`cmd ${arg1}`), arg2, arg3];
    }
    // TODO: should this eventually raise an exception.
    try {
        // preface the argument description with "cmd", so
        // that we can run it through yargs' command parser.
        let position = 0;
        let [parsed, callerArguments, length] = parseArgs();
        const args = [].slice.call(callerArguments);
        while (args.length && args[args.length - 1] === undefined)
            args.pop();
        length = length || args.length;
        if (length < parsed.demanded.length) {
            throw new yerror_1.YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`);
        }
        const totalCommands = parsed.demanded.length + parsed.optional.length;
        if (length > totalCommands) {
            throw new yerror_1.YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`);
        }
        parsed.demanded.forEach((demanded) => {
            const arg = args.shift();
            const observedType = guessType(arg);
            const matchingTypes = demanded.cmd.filter(type => type === observedType || type === '*');
            if (matchingTypes.length === 0)
                argumentTypeError(observedType, demanded.cmd, position);
            position += 1;
        });
        parsed.optional.forEach((optional) => {
            if (args.length === 0)
                return;
            const arg = args.shift();
            const observedType = guessType(arg);
            const matchingTypes = optional.cmd.filter(type => type === observedType || type === '*');
            if (matchingTypes.length === 0)
                argumentTypeError(observedType, optional.cmd, position);
            position += 1;
        });
    }
    catch (err) {
        console.warn(err.stack);
    }
}
exports.argsert = argsert;
function guessType(arg) {
    if (Array.isArray(arg)) {
        return 'array';
    }
    else if (arg === null) {
        return 'null';
    }
    return typeof arg;
}
function argumentTypeError(observedType, allowedTypes, position) {
    throw new yerror_1.YError(`Invalid ${positionName[position] || 'manyith'} argument. Expected ${allowedTypes.join(' or ')} but received ${observedType}.`);
}


/***/ }),

/***/ 4996:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isCommandBuilderCallback = exports.isCommandBuilderDefinition = exports.isCommandHandlerDefinition = exports.command = void 0;
const common_types_1 = __webpack_require__(8350);
const is_promise_1 = __webpack_require__(1558);
const middleware_1 = __webpack_require__(5443);
const parse_command_1 = __webpack_require__(9571);
const path = __webpack_require__(5622);
const util_1 = __webpack_require__(1669);
const yargs_1 = __webpack_require__(5764);
const requireDirectory = __webpack_require__(3411);
const whichModule = __webpack_require__(2432);
const Parser = __webpack_require__(2222);
const DEFAULT_MARKER = /(^\*)|(^\$0)/;
// handles parsing positional arguments,
// and populating argv with said positional
// arguments.
function command(yargs, usage, validation, globalMiddleware = []) {
    const self = {};
    let handlers = {};
    let aliasMap = {};
    let defaultCommand;
    self.addHandler = function addHandler(cmd, description, builder, handler, commandMiddleware, deprecated) {
        let aliases = [];
        const middlewares = middleware_1.commandMiddlewareFactory(commandMiddleware);
        handler = handler || (() => { });
        if (Array.isArray(cmd)) {
            aliases = cmd.slice(1);
            cmd = cmd[0];
        }
        else if (isCommandHandlerDefinition(cmd)) {
            let command = (Array.isArray(cmd.command) || typeof cmd.command === 'string') ? cmd.command : moduleName(cmd);
            if (cmd.aliases)
                command = [].concat(command).concat(cmd.aliases);
            self.addHandler(command, extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares, cmd.deprecated);
            return;
        }
        // allow a module to be provided instead of separate builder and handler
        if (isCommandBuilderDefinition(builder)) {
            self.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares, builder.deprecated);
            return;
        }
        // parse positionals out of cmd string
        const parsedCommand = parse_command_1.parseCommand(cmd);
        // remove positional args from aliases only
        aliases = aliases.map(alias => parse_command_1.parseCommand(alias).cmd);
        // check for default and filter out '*''
        let isDefault = false;
        const parsedAliases = [parsedCommand.cmd].concat(aliases).filter((c) => {
            if (DEFAULT_MARKER.test(c)) {
                isDefault = true;
                return false;
            }
            return true;
        });
        // standardize on $0 for default command.
        if (parsedAliases.length === 0 && isDefault)
            parsedAliases.push('$0');
        // shift cmd and aliases after filtering out '*'
        if (isDefault) {
            parsedCommand.cmd = parsedAliases[0];
            aliases = parsedAliases.slice(1);
            cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
        }
        // populate aliasMap
        aliases.forEach((alias) => {
            aliasMap[alias] = parsedCommand.cmd;
        });
        if (description !== false) {
            usage.command(cmd, description, isDefault, aliases, deprecated);
        }
        handlers[parsedCommand.cmd] = {
            original: cmd,
            description,
            handler,
            builder: builder || {},
            middlewares,
            deprecated,
            demanded: parsedCommand.demanded,
            optional: parsedCommand.optional
        };
        if (isDefault)
            defaultCommand = handlers[parsedCommand.cmd];
    };
    self.addDirectory = function addDirectory(dir, context, req, callerFile, opts) {
        opts = opts || {};
        // disable recursion to support nested directories of subcommands
        if (typeof opts.recurse !== 'boolean')
            opts.recurse = false;
        // exclude 'json', 'coffee' from require-directory defaults
        if (!Array.isArray(opts.extensions))
            opts.extensions = ['js'];
        // allow consumer to define their own visitor function
        const parentVisit = typeof opts.visit === 'function' ? opts.visit : (o) => o;
        // call addHandler via visitor function
        opts.visit = function visit(obj, joined, filename) {
            const visited = parentVisit(obj, joined, filename);
            // allow consumer to skip modules with their own visitor
            if (visited) {
                // check for cyclic reference
                // each command file path should only be seen once per execution
                if (~context.files.indexOf(joined))
                    return visited;
                // keep track of visited files in context.files
                context.files.push(joined);
                self.addHandler(visited);
            }
            return visited;
        };
        requireDirectory({ require: req, filename: callerFile }, dir, opts);
    };
    // lookup module object from require()d command and derive name
    // if module was not require()d and no name given, throw error
    function moduleName(obj) {
        const mod = whichModule(obj);
        if (!mod)
            throw new Error(`No command name given for module: ${util_1.inspect(obj)}`);
        return commandFromFilename(mod.filename);
    }
    // derive command name from filename
    function commandFromFilename(filename) {
        return path.basename(filename, path.extname(filename));
    }
    function extractDesc({ describe, description, desc }) {
        for (const test of [describe, description, desc]) {
            if (typeof test === 'string' || test === false)
                return test;
            common_types_1.assertNotStrictEqual(test, true);
        }
        return false;
    }
    self.getCommands = () => Object.keys(handlers).concat(Object.keys(aliasMap));
    self.getCommandHandlers = () => handlers;
    self.hasDefaultCommand = () => !!defaultCommand;
    self.runCommand = function runCommand(command, yargs, parsed, commandIndex) {
        let aliases = parsed.aliases;
        const commandHandler = handlers[command] || handlers[aliasMap[command]] || defaultCommand;
        const currentContext = yargs.getContext();
        let numFiles = currentContext.files.length;
        const parentCommands = currentContext.commands.slice();
        // what does yargs look like after the builder is run?
        let innerArgv = parsed.argv;
        let positionalMap = {};
        if (command) {
            currentContext.commands.push(command);
            currentContext.fullCommands.push(commandHandler.original);
        }
        const builder = commandHandler.builder;
        if (isCommandBuilderCallback(builder)) {
            // a function can be provided, which builds
            // up a yargs chain and possibly returns it.
            const builderOutput = builder(yargs.reset(parsed.aliases));
            const innerYargs = yargs_1.isYargsInstance(builderOutput) ? builderOutput : yargs;
            if (shouldUpdateUsage(innerYargs)) {
                innerYargs.getUsageInstance().usage(usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
            }
            innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
            aliases = innerYargs.parsed.aliases;
        }
        else if (isCommandBuilderOptionDefinitions(builder)) {
            // as a short hand, an object can instead be provided, specifying
            // the options that a command takes.
            const innerYargs = yargs.reset(parsed.aliases);
            if (shouldUpdateUsage(innerYargs)) {
                innerYargs.getUsageInstance().usage(usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
            }
            Object.keys(commandHandler.builder).forEach((key) => {
                innerYargs.option(key, builder[key]);
            });
            innerArgv = innerYargs._parseArgs(null, null, true, commandIndex);
            aliases = innerYargs.parsed.aliases;
        }
        if (!yargs._hasOutput()) {
            positionalMap = populatePositionals(commandHandler, innerArgv, currentContext);
        }
        const middlewares = globalMiddleware.slice(0).concat(commandHandler.middlewares);
        middleware_1.applyMiddleware(innerArgv, yargs, middlewares, true);
        // we apply validation post-hoc, so that custom
        // checks get passed populated positional arguments.
        if (!yargs._hasOutput()) {
            yargs._runValidation(innerArgv, aliases, positionalMap, yargs.parsed.error, !command);
        }
        if (commandHandler.handler && !yargs._hasOutput()) {
            yargs._setHasOutput();
            // to simplify the parsing of positionals in commands,
            // we temporarily populate '--' rather than _, with arguments
            const populateDoubleDash = !!yargs.getOptions().configuration['populate--'];
            if (!populateDoubleDash)
                yargs._copyDoubleDash(innerArgv);
            innerArgv = middleware_1.applyMiddleware(innerArgv, yargs, middlewares, false);
            let handlerResult;
            if (is_promise_1.isPromise(innerArgv)) {
                handlerResult = innerArgv.then(argv => commandHandler.handler(argv));
            }
            else {
                handlerResult = commandHandler.handler(innerArgv);
            }
            const handlerFinishCommand = yargs.getHandlerFinishCommand();
            if (is_promise_1.isPromise(handlerResult)) {
                yargs.getUsageInstance().cacheHelpMessage();
                handlerResult
                    .then(value => {
                    if (handlerFinishCommand) {
                        handlerFinishCommand(value);
                    }
                })
                    .catch(error => {
                    try {
                        yargs.getUsageInstance().fail(null, error);
                    }
                    catch (err) {
                        // fail's throwing would cause an unhandled rejection.
                    }
                })
                    .then(() => {
                    yargs.getUsageInstance().clearCachedHelpMessage();
                });
            }
            else {
                if (handlerFinishCommand) {
                    handlerFinishCommand(handlerResult);
                }
            }
        }
        if (command) {
            currentContext.commands.pop();
            currentContext.fullCommands.pop();
        }
        numFiles = currentContext.files.length - numFiles;
        if (numFiles > 0)
            currentContext.files.splice(numFiles * -1, numFiles);
        return innerArgv;
    };
    function shouldUpdateUsage(yargs) {
        return !yargs.getUsageInstance().getUsageDisabled() &&
            yargs.getUsageInstance().getUsage().length === 0;
    }
    function usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
        const c = DEFAULT_MARKER.test(commandHandler.original) ? commandHandler.original.replace(DEFAULT_MARKER, '').trim() : commandHandler.original;
        const pc = parentCommands.filter((c) => { return !DEFAULT_MARKER.test(c); });
        pc.push(c);
        return `$0 ${pc.join(' ')}`;
    }
    self.runDefaultBuilderOn = function (yargs) {
        common_types_1.assertNotStrictEqual(defaultCommand, undefined);
        if (shouldUpdateUsage(yargs)) {
            // build the root-level command string from the default string.
            const commandString = DEFAULT_MARKER.test(defaultCommand.original)
                ? defaultCommand.original : defaultCommand.original.replace(/^[^[\]<>]*/, '$0 ');
            yargs.getUsageInstance().usage(commandString, defaultCommand.description);
        }
        const builder = defaultCommand.builder;
        if (isCommandBuilderCallback(builder)) {
            builder(yargs);
        }
        else {
            Object.keys(builder).forEach((key) => {
                yargs.option(key, builder[key]);
            });
        }
    };
    // transcribe all positional arguments "command <foo> <bar> [apple]"
    // onto argv.
    function populatePositionals(commandHandler, argv, context) {
        argv._ = argv._.slice(context.commands.length); // nuke the current commands
        const demanded = commandHandler.demanded.slice(0);
        const optional = commandHandler.optional.slice(0);
        const positionalMap = {};
        validation.positionalCount(demanded.length, argv._.length);
        while (demanded.length) {
            const demand = demanded.shift();
            populatePositional(demand, argv, positionalMap);
        }
        while (optional.length) {
            const maybe = optional.shift();
            populatePositional(maybe, argv, positionalMap);
        }
        argv._ = context.commands.concat(argv._);
        postProcessPositionals(argv, positionalMap, self.cmdToParseOptions(commandHandler.original));
        return positionalMap;
    }
    function populatePositional(positional, argv, positionalMap) {
        const cmd = positional.cmd[0];
        if (positional.variadic) {
            positionalMap[cmd] = argv._.splice(0).map(String);
        }
        else {
            if (argv._.length)
                positionalMap[cmd] = [String(argv._.shift())];
        }
    }
    // we run yargs-parser against the positional arguments
    // applying the same parsing logic used for flags.
    function postProcessPositionals(argv, positionalMap, parseOptions) {
        // combine the parsing hints we've inferred from the command
        // string with explicitly configured parsing hints.
        const options = Object.assign({}, yargs.getOptions());
        options.default = Object.assign(parseOptions.default, options.default);
        for (const key of Object.keys(parseOptions.alias)) {
            options.alias[key] = (options.alias[key] || []).concat(parseOptions.alias[key]);
        }
        options.array = options.array.concat(parseOptions.array);
        delete options.config; //  don't load config when processing positionals.
        const unparsed = [];
        Object.keys(positionalMap).forEach((key) => {
            positionalMap[key].map((value) => {
                if (options.configuration['unknown-options-as-args'])
                    options.key[key] = true;
                unparsed.push(`--${key}`);
                unparsed.push(value);
            });
        });
        // short-circuit parse.
        if (!unparsed.length)
            return;
        const config = Object.assign({}, options.configuration, {
            'populate--': true
        });
        const parsed = Parser.detailed(unparsed, Object.assign({}, options, {
            configuration: config
        }));
        if (parsed.error) {
            yargs.getUsageInstance().fail(parsed.error.message, parsed.error);
        }
        else {
            // only copy over positional keys (don't overwrite
            // flag arguments that were already parsed).
            const positionalKeys = Object.keys(positionalMap);
            Object.keys(positionalMap).forEach((key) => {
                positionalKeys.push(...parsed.aliases[key]);
            });
            Object.keys(parsed.argv).forEach((key) => {
                if (positionalKeys.indexOf(key) !== -1) {
                    // any new aliases need to be placed in positionalMap, which
                    // is used for validation.
                    if (!positionalMap[key])
                        positionalMap[key] = parsed.argv[key];
                    argv[key] = parsed.argv[key];
                }
            });
        }
    }
    self.cmdToParseOptions = function (cmdString) {
        const parseOptions = {
            array: [],
            default: {},
            alias: {},
            demand: {}
        };
        const parsed = parse_command_1.parseCommand(cmdString);
        parsed.demanded.forEach((d) => {
            const [cmd, ...aliases] = d.cmd;
            if (d.variadic) {
                parseOptions.array.push(cmd);
                parseOptions.default[cmd] = [];
            }
            parseOptions.alias[cmd] = aliases;
            parseOptions.demand[cmd] = true;
        });
        parsed.optional.forEach((o) => {
            const [cmd, ...aliases] = o.cmd;
            if (o.variadic) {
                parseOptions.array.push(cmd);
                parseOptions.default[cmd] = [];
            }
            parseOptions.alias[cmd] = aliases;
        });
        return parseOptions;
    };
    self.reset = () => {
        handlers = {};
        aliasMap = {};
        defaultCommand = undefined;
        return self;
    };
    // used by yargs.parse() to freeze
    // the state of commands such that
    // we can apply .parse() multiple times
    // with the same yargs instance.
    const frozens = [];
    self.freeze = () => {
        frozens.push({
            handlers,
            aliasMap,
            defaultCommand
        });
    };
    self.unfreeze = () => {
        const frozen = frozens.pop();
        common_types_1.assertNotStrictEqual(frozen, undefined);
        ({
            handlers,
            aliasMap,
            defaultCommand
        } = frozen);
    };
    return self;
}
exports.command = command;
function isCommandHandlerDefinition(cmd) {
    return typeof cmd === 'object';
}
exports.isCommandHandlerDefinition = isCommandHandlerDefinition;
function isCommandBuilderDefinition(builder) {
    return typeof builder === 'object' &&
        !!builder.builder &&
        typeof builder.handler === 'function';
}
exports.isCommandBuilderDefinition = isCommandBuilderDefinition;
function isCommandBuilderCallback(builder) {
    return typeof builder === 'function';
}
exports.isCommandBuilderCallback = isCommandBuilderCallback;
function isCommandBuilderOptionDefinitions(builder) {
    return typeof builder === 'object';
}


/***/ }),

/***/ 8350:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.objectKeys = exports.assertSingleKey = exports.assertNotStrictEqual = void 0;
const assert_1 = __webpack_require__(2357);
/**
 * Typing wrapper around assert.notStrictEqual()
 */
function assertNotStrictEqual(actual, expected, message) {
    assert_1.notStrictEqual(actual, expected, message);
}
exports.assertNotStrictEqual = assertNotStrictEqual;
/**
 * Asserts actual is a single key, not a key array or a key map.
 */
function assertSingleKey(actual) {
    assert_1.strictEqual(typeof actual, 'string');
}
exports.assertSingleKey = assertSingleKey;
/**
 * Typing wrapper around Object.keys()
 */
function objectKeys(object) {
    return Object.keys(object);
}
exports.objectKeys = objectKeys;


/***/ }),

/***/ 5817:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.completionZshTemplate = exports.completionShTemplate = void 0;
exports.completionShTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_yargs_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o default -F _yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;
exports.completionZshTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zsh_profile on OSX.
#
_{{app_name}}_yargs_completions()
{
  local reply
  local si=$IFS
  IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;


/***/ }),

/***/ 695:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.completion = void 0;
const command_1 = __webpack_require__(4996);
const templates = __webpack_require__(5817);
const is_promise_1 = __webpack_require__(1558);
const parse_command_1 = __webpack_require__(9571);
const path = __webpack_require__(5622);
const common_types_1 = __webpack_require__(8350);
// add bash completions to your
//  yargs-powered applications.
function completion(yargs, usage, command) {
    const self = {
        completionKey: 'get-yargs-completions'
    };
    let aliases;
    self.setParsed = function setParsed(parsed) {
        aliases = parsed.aliases;
    };
    const zshShell = (process.env.SHELL && process.env.SHELL.indexOf('zsh') !== -1) ||
        (process.env.ZSH_NAME && process.env.ZSH_NAME.indexOf('zsh') !== -1);
    // get a list of completion commands.
    // 'args' is the array of strings from the line to be completed
    self.getCompletion = function getCompletion(args, done) {
        const completions = [];
        const current = args.length ? args[args.length - 1] : '';
        const argv = yargs.parse(args, true);
        const parentCommands = yargs.getContext().commands;
        // a custom completion function can be provided
        // to completion().
        function runCompletionFunction(argv) {
            common_types_1.assertNotStrictEqual(completionFunction, null);
            if (isSyncCompletionFunction(completionFunction)) {
                const result = completionFunction(current, argv);
                // promise based completion function.
                if (is_promise_1.isPromise(result)) {
                    return result.then((list) => {
                        process.nextTick(() => { done(list); });
                    }).catch((err) => {
                        process.nextTick(() => { throw err; });
                    });
                }
                // synchronous completion function.
                return done(result);
            }
            else {
                // asynchronous completion function
                return completionFunction(current, argv, (completions) => {
                    done(completions);
                });
            }
        }
        if (completionFunction) {
            return is_promise_1.isPromise(argv) ? argv.then(runCompletionFunction) : runCompletionFunction(argv);
        }
        const handlers = command.getCommandHandlers();
        for (let i = 0, ii = args.length; i < ii; ++i) {
            if (handlers[args[i]] && handlers[args[i]].builder) {
                const builder = handlers[args[i]].builder;
                if (command_1.isCommandBuilderCallback(builder)) {
                    const y = yargs.reset();
                    builder(y);
                    return y.argv;
                }
            }
        }
        if (!current.match(/^-/) && parentCommands[parentCommands.length - 1] !== current) {
            usage.getCommands().forEach((usageCommand) => {
                const commandName = parse_command_1.parseCommand(usageCommand[0]).cmd;
                if (args.indexOf(commandName) === -1) {
                    if (!zshShell) {
                        completions.push(commandName);
                    }
                    else {
                        const desc = usageCommand[1] || '';
                        completions.push(commandName.replace(/:/g, '\\:') + ':' + desc);
                    }
                }
            });
        }
        if (current.match(/^-/) || (current === '' && completions.length === 0)) {
            const descs = usage.getDescriptions();
            const options = yargs.getOptions();
            Object.keys(options.key).forEach((key) => {
                const negable = !!options.configuration['boolean-negation'] && options.boolean.includes(key);
                // If the key and its aliases aren't in 'args', add the key to 'completions'
                let keyAndAliases = [key].concat(aliases[key] || []);
                if (negable)
                    keyAndAliases = keyAndAliases.concat(keyAndAliases.map(key => `no-${key}`));
                function completeOptionKey(key) {
                    const notInArgs = keyAndAliases.every(val => args.indexOf(`--${val}`) === -1);
                    if (notInArgs) {
                        const startsByTwoDashes = (s) => /^--/.test(s);
                        const isShortOption = (s) => /^[^0-9]$/.test(s);
                        const dashes = !startsByTwoDashes(current) && isShortOption(key) ? '-' : '--';
                        if (!zshShell) {
                            completions.push(dashes + key);
                        }
                        else {
                            const desc = descs[key] || '';
                            completions.push(dashes + `${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`);
                        }
                    }
                }
                completeOptionKey(key);
                if (negable && !!options.default[key])
                    completeOptionKey(`no-${key}`);
            });
        }
        done(completions);
    };
    // generate the completion script to add to your .bashrc.
    self.generateCompletionScript = function generateCompletionScript($0, cmd) {
        let script = zshShell ? templates.completionZshTemplate : templates.completionShTemplate;
        const name = path.basename($0);
        // add ./to applications not yet installed as bin.
        if ($0.match(/\.js$/))
            $0 = `./${$0}`;
        script = script.replace(/{{app_name}}/g, name);
        script = script.replace(/{{completion_command}}/g, cmd);
        return script.replace(/{{app_path}}/g, $0);
    };
    // register a function to perform your own custom
    // completions., this function can be either
    // synchrnous or asynchronous.
    let completionFunction = null;
    self.registerFunction = (fn) => {
        completionFunction = fn;
    };
    return self;
}
exports.completion = completion;
function isSyncCompletionFunction(completionFunction) {
    return completionFunction.length < 3;
}


/***/ }),

/***/ 1558:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isPromise = void 0;
function isPromise(maybePromise) {
    return !!maybePromise &&
        !!maybePromise.then &&
        (typeof maybePromise.then === 'function');
}
exports.isPromise = isPromise;


/***/ }),

/***/ 6800:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
Copyright (c) 2011 Andrei Mackenzie

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.levenshtein = void 0;
// levenshtein distance algorithm, pulled from Andrei Mackenzie's MIT licensed.
// gist, which can be found here: https://gist.github.com/andrei-m/982927
// Compute the edit distance between the two given strings
function levenshtein(a, b) {
    if (a.length === 0)
        return b.length;
    if (b.length === 0)
        return a.length;
    const matrix = [];
    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                Math.min(matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j] + 1)); // deletion
            }
        }
    }
    return matrix[b.length][a.length];
}
exports.levenshtein = levenshtein;


/***/ }),

/***/ 5443:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.applyMiddleware = exports.commandMiddlewareFactory = exports.globalMiddlewareFactory = void 0;
const argsert_1 = __webpack_require__(4984);
const is_promise_1 = __webpack_require__(1558);
function globalMiddlewareFactory(globalMiddleware, context) {
    return function (callback, applyBeforeValidation = false) {
        argsert_1.argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length);
        if (Array.isArray(callback)) {
            for (let i = 0; i < callback.length; i++) {
                if (typeof callback[i] !== 'function') {
                    throw Error('middleware must be a function');
                }
                callback[i].applyBeforeValidation = applyBeforeValidation;
            }
            Array.prototype.push.apply(globalMiddleware, callback);
        }
        else if (typeof callback === 'function') {
            callback.applyBeforeValidation = applyBeforeValidation;
            globalMiddleware.push(callback);
        }
        return context;
    };
}
exports.globalMiddlewareFactory = globalMiddlewareFactory;
function commandMiddlewareFactory(commandMiddleware) {
    if (!commandMiddleware)
        return [];
    return commandMiddleware.map(middleware => {
        middleware.applyBeforeValidation = false;
        return middleware;
    });
}
exports.commandMiddlewareFactory = commandMiddlewareFactory;
function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
    const beforeValidationError = new Error('middleware cannot return a promise when applyBeforeValidation is true');
    return middlewares
        .reduce((acc, middleware) => {
        if (middleware.applyBeforeValidation !== beforeValidation) {
            return acc;
        }
        if (is_promise_1.isPromise(acc)) {
            return acc
                .then(initialObj => Promise.all([initialObj, middleware(initialObj, yargs)]))
                .then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
        }
        else {
            const result = middleware(acc, yargs);
            if (beforeValidation && is_promise_1.isPromise(result))
                throw beforeValidationError;
            return is_promise_1.isPromise(result)
                ? result.then(middlewareObj => Object.assign(acc, middlewareObj))
                : Object.assign(acc, result);
        }
    }, argv);
}
exports.applyMiddleware = applyMiddleware;


/***/ }),

/***/ 5005:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.objFilter = void 0;
const common_types_1 = __webpack_require__(8350);
function objFilter(original = {}, filter = () => true) {
    const obj = {};
    common_types_1.objectKeys(original).forEach((key) => {
        if (filter(key, original[key])) {
            obj[key] = original[key];
        }
    });
    return obj;
}
exports.objFilter = objFilter;


/***/ }),

/***/ 9571:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseCommand = void 0;
function parseCommand(cmd) {
    const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
    const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
    const bregex = /\.*[\][<>]/g;
    const firstCommand = splitCommand.shift();
    if (!firstCommand)
        throw new Error(`No command found in: ${cmd}`);
    const parsedCommand = {
        cmd: firstCommand.replace(bregex, ''),
        demanded: [],
        optional: []
    };
    splitCommand.forEach((cmd, i) => {
        let variadic = false;
        cmd = cmd.replace(/\s/g, '');
        if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1)
            variadic = true;
        if (/^\[/.test(cmd)) {
            parsedCommand.optional.push({
                cmd: cmd.replace(bregex, '').split('|'),
                variadic
            });
        }
        else {
            parsedCommand.demanded.push({
                cmd: cmd.replace(bregex, '').split('|'),
                variadic
            });
        }
    });
    return parsedCommand;
}
exports.parseCommand = parseCommand;


/***/ }),

/***/ 6438:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getProcessArgvBin = exports.getProcessArgvWithoutBin = void 0;
function getProcessArgvBinIndex() {
    // The binary name is the first command line argument for:
    // - bundled Electron apps: bin argv1 argv2 ... argvn
    if (isBundledElectronApp())
        return 0;
    // or the second one (default) for:
    // - standard node apps: node bin.js argv1 argv2 ... argvn
    // - unbundled Electron apps: electron bin.js argv1 arg2 ... argvn
    return 1;
}
function isBundledElectronApp() {
    // process.defaultApp is either set by electron in an electron unbundled app, or undefined
    // see https://github.com/electron/electron/blob/master/docs/api/process.md#processdefaultapp-readonly
    return isElectronApp() && !process.defaultApp;
}
function isElectronApp() {
    // process.versions.electron is either set by electron, or undefined
    // see https://github.com/electron/electron/blob/master/docs/api/process.md#processversionselectron-readonly
    return !!process.versions.electron;
}
function getProcessArgvWithoutBin() {
    return process.argv.slice(getProcessArgvBinIndex() + 1);
}
exports.getProcessArgvWithoutBin = getProcessArgvWithoutBin;
function getProcessArgvBin() {
    return process.argv[getProcessArgvBinIndex()];
}
exports.getProcessArgvBin = getProcessArgvBin;


/***/ }),

/***/ 3840:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.usage = void 0;
// this file handles outputting usage instructions,
// failures, etc. keeps logging in one place.
const common_types_1 = __webpack_require__(8350);
const obj_filter_1 = __webpack_require__(5005);
const path = __webpack_require__(5622);
const yerror_1 = __webpack_require__(3837);
const decamelize = __webpack_require__(7325);
const setBlocking = __webpack_require__(2890);
const stringWidth = __webpack_require__(3306);
function usage(yargs, y18n) {
    const __ = y18n.__;
    const self = {};
    // methods for ouputting/building failure message.
    const fails = [];
    self.failFn = function failFn(f) {
        fails.push(f);
    };
    let failMessage = null;
    let showHelpOnFail = true;
    self.showHelpOnFail = function showHelpOnFailFn(arg1 = true, arg2) {
        function parseFunctionArgs() {
            return typeof arg1 === 'string' ? [true, arg1] : [arg1, arg2];
        }
        const [enabled, message] = parseFunctionArgs();
        failMessage = message;
        showHelpOnFail = enabled;
        return self;
    };
    let failureOutput = false;
    self.fail = function fail(msg, err) {
        const logger = yargs._getLoggerInstance();
        if (fails.length) {
            for (let i = fails.length - 1; i >= 0; --i) {
                fails[i](msg, err, self);
            }
        }
        else {
            if (yargs.getExitProcess())
                setBlocking(true);
            // don't output failure message more than once
            if (!failureOutput) {
                failureOutput = true;
                if (showHelpOnFail) {
                    yargs.showHelp('error');
                    logger.error();
                }
                if (msg || err)
                    logger.error(msg || err);
                if (failMessage) {
                    if (msg || err)
                        logger.error('');
                    logger.error(failMessage);
                }
            }
            err = err || new yerror_1.YError(msg);
            if (yargs.getExitProcess()) {
                return yargs.exit(1);
            }
            else if (yargs._hasParseCallback()) {
                return yargs.exit(1, err);
            }
            else {
                throw err;
            }
        }
    };
    // methods for ouputting/building help (usage) message.
    let usages = [];
    let usageDisabled = false;
    self.usage = (msg, description) => {
        if (msg === null) {
            usageDisabled = true;
            usages = [];
            return self;
        }
        usageDisabled = false;
        usages.push([msg, description || '']);
        return self;
    };
    self.getUsage = () => {
        return usages;
    };
    self.getUsageDisabled = () => {
        return usageDisabled;
    };
    self.getPositionalGroupName = () => {
        return __('Positionals:');
    };
    let examples = [];
    self.example = (cmd, description) => {
        examples.push([cmd, description || '']);
    };
    let commands = [];
    self.command = function command(cmd, description, isDefault, aliases, deprecated = false) {
        // the last default wins, so cancel out any previously set default
        if (isDefault) {
            commands = commands.map((cmdArray) => {
                cmdArray[2] = false;
                return cmdArray;
            });
        }
        commands.push([cmd, description || '', isDefault, aliases, deprecated]);
    };
    self.getCommands = () => commands;
    let descriptions = {};
    self.describe = function describe(keyOrKeys, desc) {
        if (Array.isArray(keyOrKeys)) {
            keyOrKeys.forEach((k) => {
                self.describe(k, desc);
            });
        }
        else if (typeof keyOrKeys === 'object') {
            Object.keys(keyOrKeys).forEach((k) => {
                self.describe(k, keyOrKeys[k]);
            });
        }
        else {
            descriptions[keyOrKeys] = desc;
        }
    };
    self.getDescriptions = () => descriptions;
    let epilogs = [];
    self.epilog = (msg) => {
        epilogs.push(msg);
    };
    let wrapSet = false;
    let wrap;
    self.wrap = (cols) => {
        wrapSet = true;
        wrap = cols;
    };
    function getWrap() {
        if (!wrapSet) {
            wrap = windowWidth();
            wrapSet = true;
        }
        return wrap;
    }
    const deferY18nLookupPrefix = '__yargsString__:';
    self.deferY18nLookup = str => deferY18nLookupPrefix + str;
    self.help = function help() {
        if (cachedHelpMessage)
            return cachedHelpMessage;
        normalizeAliases();
        // handle old demanded API
        const base$0 = yargs.customScriptName ? yargs.$0 : path.basename(yargs.$0);
        const demandedOptions = yargs.getDemandedOptions();
        const demandedCommands = yargs.getDemandedCommands();
        const deprecatedOptions = yargs.getDeprecatedOptions();
        const groups = yargs.getGroups();
        const options = yargs.getOptions();
        let keys = [];
        keys = keys.concat(Object.keys(descriptions));
        keys = keys.concat(Object.keys(demandedOptions));
        keys = keys.concat(Object.keys(demandedCommands));
        keys = keys.concat(Object.keys(options.default));
        keys = keys.filter(filterHiddenOptions);
        keys = Object.keys(keys.reduce((acc, key) => {
            if (key !== '_')
                acc[key] = true;
            return acc;
        }, {}));
        const theWrap = getWrap();
        const ui = __webpack_require__(9911)({
            width: theWrap,
            wrap: !!theWrap
        });
        // the usage string.
        if (!usageDisabled) {
            if (usages.length) {
                // user-defined usage.
                usages.forEach((usage) => {
                    ui.div(`${usage[0].replace(/\$0/g, base$0)}`);
                    if (usage[1]) {
                        ui.div({ text: `${usage[1]}`, padding: [1, 0, 0, 0] });
                    }
                });
                ui.div();
            }
            else if (commands.length) {
                let u = null;
                // demonstrate how commands are used.
                if (demandedCommands._) {
                    u = `${base$0} <${__('command')}>\n`;
                }
                else {
                    u = `${base$0} [${__('command')}]\n`;
                }
                ui.div(`${u}`);
            }
        }
        // your application's commands, i.e., non-option
        // arguments populated in '_'.
        if (commands.length) {
            ui.div(__('Commands:'));
            const context = yargs.getContext();
            const parentCommands = context.commands.length ? `${context.commands.join(' ')} ` : '';
            if (yargs.getParserConfiguration()['sort-commands'] === true) {
                commands = commands.sort((a, b) => a[0].localeCompare(b[0]));
            }
            commands.forEach((command) => {
                const commandString = `${base$0} ${parentCommands}${command[0].replace(/^\$0 ?/, '')}`; // drop $0 from default commands.
                ui.span({
                    text: commandString,
                    padding: [0, 2, 0, 2],
                    width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4
                }, { text: command[1] });
                const hints = [];
                if (command[2])
                    hints.push(`[${__('default')}]`);
                if (command[3] && command[3].length) {
                    hints.push(`[${__('aliases:')} ${command[3].join(', ')}]`);
                }
                if (command[4]) {
                    if (typeof command[4] === 'string') {
                        hints.push(`[${__('deprecated: %s', command[4])}]`);
                    }
                    else {
                        hints.push(`[${__('deprecated')}]`);
                    }
                }
                if (hints.length) {
                    ui.div({ text: hints.join(' '), padding: [0, 0, 0, 2], align: 'right' });
                }
                else {
                    ui.div();
                }
            });
            ui.div();
        }
        // perform some cleanup on the keys array, making it
        // only include top-level keys not their aliases.
        const aliasKeys = (Object.keys(options.alias) || [])
            .concat(Object.keys(yargs.parsed.newAliases) || []);
        keys = keys.filter(key => !yargs.parsed.newAliases[key] && aliasKeys.every(alias => (options.alias[alias] || []).indexOf(key) === -1));
        // populate 'Options:' group with any keys that have not
        // explicitly had a group set.
        const defaultGroup = __('Options:');
        if (!groups[defaultGroup])
            groups[defaultGroup] = [];
        addUngroupedKeys(keys, options.alias, groups, defaultGroup);
        // display 'Options:' table along with any custom tables:
        Object.keys(groups).forEach((groupName) => {
            if (!groups[groupName].length)
                return;
            // if we've grouped the key 'f', but 'f' aliases 'foobar',
            // normalizedKeys should contain only 'foobar'.
            const normalizedKeys = groups[groupName].filter(filterHiddenOptions).map((key) => {
                if (~aliasKeys.indexOf(key))
                    return key;
                for (let i = 0, aliasKey; (aliasKey = aliasKeys[i]) !== undefined; i++) {
                    if (~(options.alias[aliasKey] || []).indexOf(key))
                        return aliasKey;
                }
                return key;
            });
            if (normalizedKeys.length < 1)
                return;
            ui.div(groupName);
            // actually generate the switches string --foo, -f, --bar.
            const switches = normalizedKeys.reduce((acc, key) => {
                acc[key] = [key].concat(options.alias[key] || [])
                    .map(sw => {
                    // for the special positional group don't
                    // add '--' or '-' prefix.
                    if (groupName === self.getPositionalGroupName())
                        return sw;
                    else {
                        return (
                        // matches yargs-parser logic in which single-digits
                        // aliases declared with a boolean type are now valid
                        /^[0-9]$/.test(sw)
                            ? ~options.boolean.indexOf(key) ? '-' : '--'
                            : sw.length > 1 ? '--' : '-') + sw;
                    }
                })
                    .join(', ');
                return acc;
            }, {});
            normalizedKeys.forEach((key) => {
                const kswitch = switches[key];
                let desc = descriptions[key] || '';
                let type = null;
                if (~desc.lastIndexOf(deferY18nLookupPrefix))
                    desc = __(desc.substring(deferY18nLookupPrefix.length));
                if (~options.boolean.indexOf(key))
                    type = `[${__('boolean')}]`;
                if (~options.count.indexOf(key))
                    type = `[${__('count')}]`;
                if (~options.string.indexOf(key))
                    type = `[${__('string')}]`;
                if (~options.normalize.indexOf(key))
                    type = `[${__('string')}]`;
                if (~options.array.indexOf(key))
                    type = `[${__('array')}]`;
                if (~options.number.indexOf(key))
                    type = `[${__('number')}]`;
                const deprecatedExtra = (deprecated) => typeof deprecated === 'string'
                    ? `[${__('deprecated: %s', deprecated)}]`
                    : `[${__('deprecated')}]`;
                const extra = [
                    (key in deprecatedOptions) ? deprecatedExtra(deprecatedOptions[key]) : null,
                    type,
                    (key in demandedOptions) ? `[${__('required')}]` : null,
                    options.choices && options.choices[key] ? `[${__('choices:')} ${self.stringifiedValues(options.choices[key])}]` : null,
                    defaultString(options.default[key], options.defaultDescription[key])
                ].filter(Boolean).join(' ');
                ui.span({ text: kswitch, padding: [0, 2, 0, 2], width: maxWidth(switches, theWrap) + 4 }, desc);
                if (extra)
                    ui.div({ text: extra, padding: [0, 0, 0, 2], align: 'right' });
                else
                    ui.div();
            });
            ui.div();
        });
        // describe some common use-cases for your application.
        if (examples.length) {
            ui.div(__('Examples:'));
            examples.forEach((example) => {
                example[0] = example[0].replace(/\$0/g, base$0);
            });
            examples.forEach((example) => {
                if (example[1] === '') {
                    ui.div({
                        text: example[0],
                        padding: [0, 2, 0, 2]
                    });
                }
                else {
                    ui.div({
                        text: example[0],
                        padding: [0, 2, 0, 2],
                        width: maxWidth(examples, theWrap) + 4
                    }, {
                        text: example[1]
                    });
                }
            });
            ui.div();
        }
        // the usage string.
        if (epilogs.length > 0) {
            const e = epilogs.map(epilog => epilog.replace(/\$0/g, base$0)).join('\n');
            ui.div(`${e}\n`);
        }
        // Remove the trailing white spaces
        return ui.toString().replace(/\s*$/, '');
    };
    // return the maximum width of a string
    // in the left-hand column of a table.
    function maxWidth(table, theWrap, modifier) {
        let width = 0;
        // table might be of the form [leftColumn],
        // or {key: leftColumn}
        if (!Array.isArray(table)) {
            table = Object.values(table).map(v => [v]);
        }
        table.forEach((v) => {
            width = Math.max(stringWidth(modifier ? `${modifier} ${v[0]}` : v[0]), width);
        });
        // if we've enabled 'wrap' we should limit
        // the max-width of the left-column.
        if (theWrap)
            width = Math.min(width, parseInt((theWrap * 0.5).toString(), 10));
        return width;
    }
    // make sure any options set for aliases,
    // are copied to the keys being aliased.
    function normalizeAliases() {
        // handle old demanded API
        const demandedOptions = yargs.getDemandedOptions();
        const options = yargs.getOptions();
        (Object.keys(options.alias) || []).forEach((key) => {
            options.alias[key].forEach((alias) => {
                // copy descriptions.
                if (descriptions[alias])
                    self.describe(key, descriptions[alias]);
                // copy demanded.
                if (alias in demandedOptions)
                    yargs.demandOption(key, demandedOptions[alias]);
                // type messages.
                if (~options.boolean.indexOf(alias))
                    yargs.boolean(key);
                if (~options.count.indexOf(alias))
                    yargs.count(key);
                if (~options.string.indexOf(alias))
                    yargs.string(key);
                if (~options.normalize.indexOf(alias))
                    yargs.normalize(key);
                if (~options.array.indexOf(alias))
                    yargs.array(key);
                if (~options.number.indexOf(alias))
                    yargs.number(key);
            });
        });
    }
    // if yargs is executing an async handler, we take a snapshot of the
    // help message to display on failure:
    let cachedHelpMessage;
    self.cacheHelpMessage = function () {
        cachedHelpMessage = this.help();
    };
    // however this snapshot must be cleared afterwards
    // not to be be used by next calls to parse
    self.clearCachedHelpMessage = function () {
        cachedHelpMessage = undefined;
    };
    // given a set of keys, place any keys that are
    // ungrouped under the 'Options:' grouping.
    function addUngroupedKeys(keys, aliases, groups, defaultGroup) {
        let groupedKeys = [];
        let toCheck = null;
        Object.keys(groups).forEach((group) => {
            groupedKeys = groupedKeys.concat(groups[group]);
        });
        keys.forEach((key) => {
            toCheck = [key].concat(aliases[key]);
            if (!toCheck.some(k => groupedKeys.indexOf(k) !== -1)) {
                groups[defaultGroup].push(key);
            }
        });
        return groupedKeys;
    }
    function filterHiddenOptions(key) {
        return yargs.getOptions().hiddenOptions.indexOf(key) < 0 || yargs.parsed.argv[yargs.getOptions().showHiddenOpt];
    }
    self.showHelp = (level) => {
        const logger = yargs._getLoggerInstance();
        if (!level)
            level = 'error';
        const emit = typeof level === 'function' ? level : logger[level];
        emit(self.help());
    };
    self.functionDescription = (fn) => {
        const description = fn.name ? decamelize(fn.name, '-') : __('generated-value');
        return ['(', description, ')'].join('');
    };
    self.stringifiedValues = function stringifiedValues(values, separator) {
        let string = '';
        const sep = separator || ', ';
        const array = [].concat(values);
        if (!values || !array.length)
            return string;
        array.forEach((value) => {
            if (string.length)
                string += sep;
            string += JSON.stringify(value);
        });
        return string;
    };
    // format the default-value-string displayed in
    // the right-hand column.
    function defaultString(value, defaultDescription) {
        let string = `[${__('default:')} `;
        if (value === undefined && !defaultDescription)
            return null;
        if (defaultDescription) {
            string += defaultDescription;
        }
        else {
            switch (typeof value) {
                case 'string':
                    string += `"${value}"`;
                    break;
                case 'object':
                    string += JSON.stringify(value);
                    break;
                default:
                    string += value;
            }
        }
        return `${string}]`;
    }
    // guess the width of the console window, max-width 80.
    function windowWidth() {
        const maxWidth = 80;
        // CI is not a TTY
        /* c8 ignore next 2 */
        if (typeof process === 'object' && process.stdout && process.stdout.columns) {
            return Math.min(maxWidth, process.stdout.columns);
        }
        else {
            return maxWidth;
        }
    }
    // logic for displaying application version.
    let version = null;
    self.version = (ver) => {
        version = ver;
    };
    self.showVersion = () => {
        const logger = yargs._getLoggerInstance();
        logger.log(version);
    };
    self.reset = function reset(localLookup) {
        // do not reset wrap here
        // do not reset fails here
        failMessage = null;
        failureOutput = false;
        usages = [];
        usageDisabled = false;
        epilogs = [];
        examples = [];
        commands = [];
        descriptions = obj_filter_1.objFilter(descriptions, k => !localLookup[k]);
        return self;
    };
    const frozens = [];
    self.freeze = function freeze() {
        frozens.push({
            failMessage,
            failureOutput,
            usages,
            usageDisabled,
            epilogs,
            examples,
            commands,
            descriptions
        });
    };
    self.unfreeze = function unfreeze() {
        const frozen = frozens.pop();
        common_types_1.assertNotStrictEqual(frozen, undefined);
        ({
            failMessage,
            failureOutput,
            usages,
            usageDisabled,
            epilogs,
            examples,
            commands,
            descriptions
        } = frozen);
    };
    return self;
}
exports.usage = usage;


/***/ }),

/***/ 6034:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validation = void 0;
const argsert_1 = __webpack_require__(4984);
const common_types_1 = __webpack_require__(8350);
const levenshtein_1 = __webpack_require__(6800);
const obj_filter_1 = __webpack_require__(5005);
const specialKeys = ['$0', '--', '_'];
// validation-type-stuff, missing params,
// bad implications, custom checks.
function validation(yargs, usage, y18n) {
    const __ = y18n.__;
    const __n = y18n.__n;
    const self = {};
    // validate appropriate # of non-option
    // arguments were provided, i.e., '_'.
    self.nonOptionCount = function nonOptionCount(argv) {
        const demandedCommands = yargs.getDemandedCommands();
        // don't count currently executing commands
        const _s = argv._.length - yargs.getContext().commands.length;
        if (demandedCommands._ && (_s < demandedCommands._.min || _s > demandedCommands._.max)) {
            if (_s < demandedCommands._.min) {
                if (demandedCommands._.minMsg !== undefined) {
                    usage.fail(
                    // replace $0 with observed, $1 with expected.
                    demandedCommands._.minMsg
                        ? demandedCommands._.minMsg.replace(/\$0/g, _s.toString()).replace(/\$1/, demandedCommands._.min.toString())
                        : null);
                }
                else {
                    usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', _s, _s, demandedCommands._.min));
                }
            }
            else if (_s > demandedCommands._.max) {
                if (demandedCommands._.maxMsg !== undefined) {
                    usage.fail(
                    // replace $0 with observed, $1 with expected.
                    demandedCommands._.maxMsg
                        ? demandedCommands._.maxMsg.replace(/\$0/g, _s.toString()).replace(/\$1/, demandedCommands._.max.toString())
                        : null);
                }
                else {
                    usage.fail(__n('Too many non-option arguments: got %s, maximum of %s', 'Too many non-option arguments: got %s, maximum of %s', _s, _s, demandedCommands._.max));
                }
            }
        }
    };
    // validate the appropriate # of <required>
    // positional arguments were provided:
    self.positionalCount = function positionalCount(required, observed) {
        if (observed < required) {
            usage.fail(__n('Not enough non-option arguments: got %s, need at least %s', 'Not enough non-option arguments: got %s, need at least %s', observed, observed, required));
        }
    };
    // make sure all the required arguments are present.
    self.requiredArguments = function requiredArguments(argv) {
        const demandedOptions = yargs.getDemandedOptions();
        let missing = null;
        for (const key of Object.keys(demandedOptions)) {
            if (!Object.prototype.hasOwnProperty.call(argv, key) || typeof argv[key] === 'undefined') {
                missing = missing || {};
                missing[key] = demandedOptions[key];
            }
        }
        if (missing) {
            const customMsgs = [];
            for (const key of Object.keys(missing)) {
                const msg = missing[key];
                if (msg && customMsgs.indexOf(msg) < 0) {
                    customMsgs.push(msg);
                }
            }
            const customMsg = customMsgs.length ? `\n${customMsgs.join('\n')}` : '';
            usage.fail(__n('Missing required argument: %s', 'Missing required arguments: %s', Object.keys(missing).length, Object.keys(missing).join(', ') + customMsg));
        }
    };
    // check for unknown arguments (strict-mode).
    self.unknownArguments = function unknownArguments(argv, aliases, positionalMap, isDefaultCommand) {
        const commandKeys = yargs.getCommandInstance().getCommands();
        const unknown = [];
        const currentContext = yargs.getContext();
        Object.keys(argv).forEach((key) => {
            if (specialKeys.indexOf(key) === -1 &&
                !Object.prototype.hasOwnProperty.call(positionalMap, key) &&
                !Object.prototype.hasOwnProperty.call(yargs._getParseContext(), key) &&
                !self.isValidAndSomeAliasIsNotNew(key, aliases)) {
                unknown.push(key);
            }
        });
        if ((currentContext.commands.length > 0) || (commandKeys.length > 0) || isDefaultCommand) {
            argv._.slice(currentContext.commands.length).forEach((key) => {
                if (commandKeys.indexOf(key) === -1) {
                    unknown.push(key);
                }
            });
        }
        if (unknown.length > 0) {
            usage.fail(__n('Unknown argument: %s', 'Unknown arguments: %s', unknown.length, unknown.join(', ')));
        }
    };
    self.unknownCommands = function unknownCommands(argv) {
        const commandKeys = yargs.getCommandInstance().getCommands();
        const unknown = [];
        const currentContext = yargs.getContext();
        if ((currentContext.commands.length > 0) || (commandKeys.length > 0)) {
            argv._.slice(currentContext.commands.length).forEach((key) => {
                if (commandKeys.indexOf(key) === -1) {
                    unknown.push(key);
                }
            });
        }
        if (unknown.length > 0) {
            usage.fail(__n('Unknown command: %s', 'Unknown commands: %s', unknown.length, unknown.join(', ')));
            return true;
        }
        else {
            return false;
        }
    };
    // check for a key that is not an alias, or for which every alias is new,
    // implying that it was invented by the parser, e.g., during camelization
    self.isValidAndSomeAliasIsNotNew = function isValidAndSomeAliasIsNotNew(key, aliases) {
        if (!Object.prototype.hasOwnProperty.call(aliases, key)) {
            return false;
        }
        const newAliases = yargs.parsed.newAliases;
        for (const a of [key, ...aliases[key]]) {
            if (!Object.prototype.hasOwnProperty.call(newAliases, a) || !newAliases[key]) {
                return true;
            }
        }
        return false;
    };
    // validate arguments limited to enumerated choices
    self.limitedChoices = function limitedChoices(argv) {
        const options = yargs.getOptions();
        const invalid = {};
        if (!Object.keys(options.choices).length)
            return;
        Object.keys(argv).forEach((key) => {
            if (specialKeys.indexOf(key) === -1 &&
                Object.prototype.hasOwnProperty.call(options.choices, key)) {
                [].concat(argv[key]).forEach((value) => {
                    // TODO case-insensitive configurability
                    if (options.choices[key].indexOf(value) === -1 &&
                        value !== undefined) {
                        invalid[key] = (invalid[key] || []).concat(value);
                    }
                });
            }
        });
        const invalidKeys = Object.keys(invalid);
        if (!invalidKeys.length)
            return;
        let msg = __('Invalid values:');
        invalidKeys.forEach((key) => {
            msg += `\n  ${__('Argument: %s, Given: %s, Choices: %s', key, usage.stringifiedValues(invalid[key]), usage.stringifiedValues(options.choices[key]))}`;
        });
        usage.fail(msg);
    };
    // custom checks, added using the `check` option on yargs.
    let checks = [];
    self.check = function check(f, global) {
        checks.push({
            func: f,
            global
        });
    };
    self.customChecks = function customChecks(argv, aliases) {
        for (let i = 0, f; (f = checks[i]) !== undefined; i++) {
            const func = f.func;
            let result = null;
            try {
                result = func(argv, aliases);
            }
            catch (err) {
                usage.fail(err.message ? err.message : err, err);
                continue;
            }
            if (!result) {
                usage.fail(__('Argument check failed: %s', func.toString()));
            }
            else if (typeof result === 'string' || result instanceof Error) {
                usage.fail(result.toString(), result);
            }
        }
    };
    // check implications, argument foo implies => argument bar.
    let implied = {};
    self.implies = function implies(key, value) {
        argsert_1.argsert('<string|object> [array|number|string]', [key, value], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach((k) => {
                self.implies(k, key[k]);
            });
        }
        else {
            yargs.global(key);
            if (!implied[key]) {
                implied[key] = [];
            }
            if (Array.isArray(value)) {
                value.forEach((i) => self.implies(key, i));
            }
            else {
                common_types_1.assertNotStrictEqual(value, undefined);
                implied[key].push(value);
            }
        }
    };
    self.getImplied = function getImplied() {
        return implied;
    };
    function keyExists(argv, val) {
        // convert string '1' to number 1
        const num = Number(val);
        val = isNaN(num) ? val : num;
        if (typeof val === 'number') {
            // check length of argv._
            val = argv._.length >= val;
        }
        else if (val.match(/^--no-.+/)) {
            // check if key/value doesn't exist
            val = val.match(/^--no-(.+)/)[1];
            val = !argv[val];
        }
        else {
            // check if key/value exists
            val = argv[val];
        }
        return val;
    }
    self.implications = function implications(argv) {
        const implyFail = [];
        Object.keys(implied).forEach((key) => {
            const origKey = key;
            (implied[key] || []).forEach((value) => {
                let key = origKey;
                const origValue = value;
                key = keyExists(argv, key);
                value = keyExists(argv, value);
                if (key && !value) {
                    implyFail.push(` ${origKey} -> ${origValue}`);
                }
            });
        });
        if (implyFail.length) {
            let msg = `${__('Implications failed:')}\n`;
            implyFail.forEach((value) => {
                msg += (value);
            });
            usage.fail(msg);
        }
    };
    let conflicting = {};
    self.conflicts = function conflicts(key, value) {
        argsert_1.argsert('<string|object> [array|string]', [key, value], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach((k) => {
                self.conflicts(k, key[k]);
            });
        }
        else {
            yargs.global(key);
            if (!conflicting[key]) {
                conflicting[key] = [];
            }
            if (Array.isArray(value)) {
                value.forEach((i) => self.conflicts(key, i));
            }
            else {
                conflicting[key].push(value);
            }
        }
    };
    self.getConflicting = () => conflicting;
    self.conflicting = function conflictingFn(argv) {
        Object.keys(argv).forEach((key) => {
            if (conflicting[key]) {
                conflicting[key].forEach((value) => {
                    // we default keys to 'undefined' that have been configured, we should not
                    // apply conflicting check unless they are a value other than 'undefined'.
                    if (value && argv[key] !== undefined && argv[value] !== undefined) {
                        usage.fail(__('Arguments %s and %s are mutually exclusive', key, value));
                    }
                });
            }
        });
    };
    self.recommendCommands = function recommendCommands(cmd, potentialCommands) {
        const threshold = 3; // if it takes more than three edits, let's move on.
        potentialCommands = potentialCommands.sort((a, b) => b.length - a.length);
        let recommended = null;
        let bestDistance = Infinity;
        for (let i = 0, candidate; (candidate = potentialCommands[i]) !== undefined; i++) {
            const d = levenshtein_1.levenshtein(cmd, candidate);
            if (d <= threshold && d < bestDistance) {
                bestDistance = d;
                recommended = candidate;
            }
        }
        if (recommended)
            usage.fail(__('Did you mean %s?', recommended));
    };
    self.reset = function reset(localLookup) {
        implied = obj_filter_1.objFilter(implied, k => !localLookup[k]);
        conflicting = obj_filter_1.objFilter(conflicting, k => !localLookup[k]);
        checks = checks.filter(c => c.global);
        return self;
    };
    const frozens = [];
    self.freeze = function freeze() {
        frozens.push({
            implied,
            checks,
            conflicting
        });
    };
    self.unfreeze = function unfreeze() {
        const frozen = frozens.pop();
        common_types_1.assertNotStrictEqual(frozen, undefined);
        ({
            implied,
            checks,
            conflicting
        } = frozen);
    };
    return self;
}
exports.validation = validation;


/***/ }),

/***/ 5764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isYargsInstance = exports.rebase = exports.Yargs = void 0;
const command_1 = __webpack_require__(4996);
const common_types_1 = __webpack_require__(8350);
const yerror_1 = __webpack_require__(3837);
const usage_1 = __webpack_require__(3840);
const argsert_1 = __webpack_require__(4984);
const fs = __webpack_require__(5747);
const completion_1 = __webpack_require__(695);
const path = __webpack_require__(5622);
const validation_1 = __webpack_require__(6034);
const obj_filter_1 = __webpack_require__(5005);
const apply_extends_1 = __webpack_require__(7349);
const middleware_1 = __webpack_require__(5443);
const processArgv = __webpack_require__(6438);
const is_promise_1 = __webpack_require__(1558);
const Parser = __webpack_require__(2222);
const y18nFactory = __webpack_require__(4380);
const setBlocking = __webpack_require__(2890);
const findUp = __webpack_require__(773);
const requireMainFilename = __webpack_require__(4882);
function Yargs(processArgs = [], cwd = process.cwd(), parentRequire = require) {
    const self = {};
    let command;
    let completion = null;
    let groups = {};
    const globalMiddleware = [];
    let output = '';
    const preservedGroups = {};
    let usage;
    let validation;
    let handlerFinishCommand = null;
    const y18n = y18nFactory({
        directory: __webpack_require__.ab + "locales",
        updateFiles: false
    });
    self.middleware = middleware_1.globalMiddlewareFactory(globalMiddleware, self);
    self.scriptName = function (scriptName) {
        self.customScriptName = true;
        self.$0 = scriptName;
        return self;
    };
    // ignore the node bin, specify this in your
    // bin file with #!/usr/bin/env node
    let default$0;
    if (/\b(node|iojs|electron)(\.exe)?$/.test(process.argv[0])) {
        default$0 = process.argv.slice(1, 2);
    }
    else {
        default$0 = process.argv.slice(0, 1);
    }
    self.$0 = default$0
        .map(x => {
        const b = rebase(cwd, x);
        return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
    })
        .join(' ').trim();
    if (process.env._ !== undefined && processArgv.getProcessArgvBin() === process.env._) {
        self.$0 = process.env._.replace(`${path.dirname(process.execPath)}/`, '');
    }
    // use context object to keep track of resets, subcommand execution, etc
    // submodules should modify and check the state of context as necessary
    const context = { resets: -1, commands: [], fullCommands: [], files: [] };
    self.getContext = () => context;
    // puts yargs back into an initial state. any keys
    // that have been set to "global" will not be reset
    // by this action.
    let options;
    self.resetOptions = self.reset = function resetOptions(aliases = {}) {
        context.resets++;
        options = options || {};
        // put yargs back into an initial state, this
        // logic is used to build a nested command
        // hierarchy.
        const tmpOptions = {};
        tmpOptions.local = options.local ? options.local : [];
        tmpOptions.configObjects = options.configObjects ? options.configObjects : [];
        // if a key has been explicitly set as local,
        // we should reset it before passing options to command.
        const localLookup = {};
        tmpOptions.local.forEach((l) => {
            localLookup[l] = true;
            (aliases[l] || []).forEach((a) => {
                localLookup[a] = true;
            });
        });
        // add all groups not set to local to preserved groups
        Object.assign(preservedGroups, Object.keys(groups).reduce((acc, groupName) => {
            const keys = groups[groupName].filter(key => !(key in localLookup));
            if (keys.length > 0) {
                acc[groupName] = keys;
            }
            return acc;
        }, {}));
        // groups can now be reset
        groups = {};
        const arrayOptions = [
            'array', 'boolean', 'string', 'skipValidation',
            'count', 'normalize', 'number',
            'hiddenOptions'
        ];
        const objectOptions = [
            'narg', 'key', 'alias', 'default', 'defaultDescription',
            'config', 'choices', 'demandedOptions', 'demandedCommands', 'coerce',
            'deprecatedOptions'
        ];
        arrayOptions.forEach(k => {
            tmpOptions[k] = (options[k] || []).filter(k => !localLookup[k]);
        });
        objectOptions.forEach((k) => {
            tmpOptions[k] = obj_filter_1.objFilter(options[k], k => !localLookup[k]);
        });
        tmpOptions.envPrefix = options.envPrefix;
        options = tmpOptions;
        // if this is the first time being executed, create
        // instances of all our helpers -- otherwise just reset.
        usage = usage ? usage.reset(localLookup) : usage_1.usage(self, y18n);
        validation = validation ? validation.reset(localLookup) : validation_1.validation(self, usage, y18n);
        command = command ? command.reset() : command_1.command(self, usage, validation, globalMiddleware);
        if (!completion)
            completion = completion_1.completion(self, usage, command);
        completionCommand = null;
        output = '';
        exitError = null;
        hasOutput = false;
        self.parsed = false;
        return self;
    };
    self.resetOptions();
    // temporary hack: allow "freezing" of reset-able state for parse(msg, cb)
    const frozens = [];
    function freeze() {
        frozens.push({
            options,
            configObjects: options.configObjects.slice(0),
            exitProcess,
            groups,
            strict,
            strictCommands,
            completionCommand,
            output,
            exitError,
            hasOutput,
            parsed: self.parsed,
            parseFn,
            parseContext,
            handlerFinishCommand
        });
        usage.freeze();
        validation.freeze();
        command.freeze();
    }
    function unfreeze() {
        const frozen = frozens.pop();
        common_types_1.assertNotStrictEqual(frozen, undefined);
        let configObjects;
        ({
            options,
            configObjects,
            exitProcess,
            groups,
            output,
            exitError,
            hasOutput,
            parsed: self.parsed,
            strict,
            strictCommands,
            completionCommand,
            parseFn,
            parseContext,
            handlerFinishCommand
        } = frozen);
        options.configObjects = configObjects;
        usage.unfreeze();
        validation.unfreeze();
        command.unfreeze();
    }
    self.boolean = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('boolean', keys);
        return self;
    };
    self.array = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('array', keys);
        return self;
    };
    self.number = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('number', keys);
        return self;
    };
    self.normalize = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('normalize', keys);
        return self;
    };
    self.count = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('count', keys);
        return self;
    };
    self.string = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('string', keys);
        return self;
    };
    self.requiresArg = function (keys) {
        // the 2nd paramter [number] in the argsert the assertion is mandatory
        // as populateParserHintSingleValueDictionary recursively calls requiresArg
        // with Nan as a 2nd parameter, although we ignore it
        argsert_1.argsert('<array|string|object> [number]', [keys], arguments.length);
        // If someone configures nargs at the same time as requiresArg,
        // nargs should take precedent,
        // see: https://github.com/yargs/yargs/pull/1572
        // TODO: make this work with aliases, using a check similar to
        // checkAllAliases() in yargs-parser.
        if (typeof keys === 'string' && options.narg[keys]) {
            return self;
        }
        else {
            populateParserHintSingleValueDictionary(self.requiresArg, 'narg', keys, NaN);
        }
        return self;
    };
    self.skipValidation = function (keys) {
        argsert_1.argsert('<array|string>', [keys], arguments.length);
        populateParserHintArray('skipValidation', keys);
        return self;
    };
    function populateParserHintArray(type, keys) {
        keys = [].concat(keys);
        keys.forEach((key) => {
            key = sanitizeKey(key);
            options[type].push(key);
        });
    }
    self.nargs = function (key, value) {
        argsert_1.argsert('<string|object|array> [number]', [key, value], arguments.length);
        populateParserHintSingleValueDictionary(self.nargs, 'narg', key, value);
        return self;
    };
    self.choices = function (key, value) {
        argsert_1.argsert('<object|string|array> [string|array]', [key, value], arguments.length);
        populateParserHintArrayDictionary(self.choices, 'choices', key, value);
        return self;
    };
    self.alias = function (key, value) {
        argsert_1.argsert('<object|string|array> [string|array]', [key, value], arguments.length);
        populateParserHintArrayDictionary(self.alias, 'alias', key, value);
        return self;
    };
    // TODO: actually deprecate self.defaults.
    self.default = self.defaults = function (key, value, defaultDescription) {
        argsert_1.argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length);
        if (defaultDescription) {
            common_types_1.assertSingleKey(key);
            options.defaultDescription[key] = defaultDescription;
        }
        if (typeof value === 'function') {
            common_types_1.assertSingleKey(key);
            if (!options.defaultDescription[key])
                options.defaultDescription[key] = usage.functionDescription(value);
            value = value.call();
        }
        populateParserHintSingleValueDictionary(self.default, 'default', key, value);
        return self;
    };
    self.describe = function (key, desc) {
        argsert_1.argsert('<object|string|array> [string]', [key, desc], arguments.length);
        setKey(key, true);
        usage.describe(key, desc);
        return self;
    };
    function setKey(key, set) {
        populateParserHintSingleValueDictionary(setKey, 'key', key, set);
        return self;
    }
    function demandOption(keys, msg) {
        argsert_1.argsert('<object|string|array> [string]', [keys, msg], arguments.length);
        populateParserHintSingleValueDictionary(self.demandOption, 'demandedOptions', keys, msg);
        return self;
    }
    self.demandOption = demandOption;
    self.coerce = function (keys, value) {
        argsert_1.argsert('<object|string|array> [function]', [keys, value], arguments.length);
        populateParserHintSingleValueDictionary(self.coerce, 'coerce', keys, value);
        return self;
    };
    function populateParserHintSingleValueDictionary(builder, type, key, value) {
        populateParserHintDictionary(builder, type, key, value, (type, key, value) => {
            options[type][key] = value;
        });
    }
    function populateParserHintArrayDictionary(builder, type, key, value) {
        populateParserHintDictionary(builder, type, key, value, (type, key, value) => {
            options[type][key] = (options[type][key] || []).concat(value);
        });
    }
    function populateParserHintDictionary(builder, type, key, value, singleKeyHandler) {
        if (Array.isArray(key)) {
            // an array of keys with one value ['x', 'y', 'z'], function parse () {}
            key.forEach((k) => {
                builder(k, value);
            });
        }
        else if (((key) => typeof key === 'object')(key)) {
            // an object of key value pairs: {'x': parse () {}, 'y': parse() {}}
            for (const k of common_types_1.objectKeys(key)) {
                builder(k, key[k]);
            }
        }
        else {
            singleKeyHandler(type, sanitizeKey(key), value);
        }
    }
    function sanitizeKey(key) {
        if (key === '__proto__')
            return '___proto___';
        return key;
    }
    function deleteFromParserHintObject(optionKey) {
        // delete from all parsing hints:
        // boolean, array, key, alias, etc.
        common_types_1.objectKeys(options).forEach((hintKey) => {
            // configObjects is not a parsing hint array
            if (((key) => key === 'configObjects')(hintKey))
                return;
            const hint = options[hintKey];
            if (Array.isArray(hint)) {
                if (~hint.indexOf(optionKey))
                    hint.splice(hint.indexOf(optionKey), 1);
            }
            else if (typeof hint === 'object') {
                delete hint[optionKey];
            }
        });
        // now delete the description from usage.js.
        delete usage.getDescriptions()[optionKey];
    }
    self.config = function config(key = 'config', msg, parseFn) {
        argsert_1.argsert('[object|string] [string|function] [function]', [key, msg, parseFn], arguments.length);
        // allow a config object to be provided directly.
        if ((typeof key === 'object') && !Array.isArray(key)) {
            key = apply_extends_1.applyExtends(key, cwd, self.getParserConfiguration()['deep-merge-config']);
            options.configObjects = (options.configObjects || []).concat(key);
            return self;
        }
        // allow for a custom parsing function.
        if (typeof msg === 'function') {
            parseFn = msg;
            msg = undefined;
        }
        self.describe(key, msg || usage.deferY18nLookup('Path to JSON config file'));
        (Array.isArray(key) ? key : [key]).forEach((k) => {
            options.config[k] = parseFn || true;
        });
        return self;
    };
    self.example = function (cmd, description) {
        argsert_1.argsert('<string|array> [string]', [cmd, description], arguments.length);
        if (Array.isArray(cmd)) {
            cmd.forEach((exampleParams) => self.example(...exampleParams));
        }
        else {
            usage.example(cmd, description);
        }
        return self;
    };
    self.command = function (cmd, description, builder, handler, middlewares, deprecated) {
        argsert_1.argsert('<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]', [cmd, description, builder, handler, middlewares, deprecated], arguments.length);
        command.addHandler(cmd, description, builder, handler, middlewares, deprecated);
        return self;
    };
    self.commandDir = function (dir, opts) {
        argsert_1.argsert('<string> [object]', [dir, opts], arguments.length);
        const req = parentRequire || require;
        command.addDirectory(dir, self.getContext(), req, __webpack_require__(9349)(), opts);
        return self;
    };
    // TODO: deprecate self.demand in favor of
    // .demandCommand() .demandOption().
    self.demand = self.required = self.require = function demand(keys, max, msg) {
        // you can optionally provide a 'max' key,
        // which will raise an exception if too many '_'
        // options are provided.
        if (Array.isArray(max)) {
            max.forEach((key) => {
                common_types_1.assertNotStrictEqual(msg, true);
                demandOption(key, msg);
            });
            max = Infinity;
        }
        else if (typeof max !== 'number') {
            msg = max;
            max = Infinity;
        }
        if (typeof keys === 'number') {
            common_types_1.assertNotStrictEqual(msg, true);
            self.demandCommand(keys, max, msg, msg);
        }
        else if (Array.isArray(keys)) {
            keys.forEach((key) => {
                common_types_1.assertNotStrictEqual(msg, true);
                demandOption(key, msg);
            });
        }
        else {
            if (typeof msg === 'string') {
                demandOption(keys, msg);
            }
            else if (msg === true || typeof msg === 'undefined') {
                demandOption(keys);
            }
        }
        return self;
    };
    self.demandCommand = function demandCommand(min = 1, max, minMsg, maxMsg) {
        argsert_1.argsert('[number] [number|string] [string|null|undefined] [string|null|undefined]', [min, max, minMsg, maxMsg], arguments.length);
        if (typeof max !== 'number') {
            minMsg = max;
            max = Infinity;
        }
        self.global('_', false);
        options.demandedCommands._ = {
            min,
            max,
            minMsg,
            maxMsg
        };
        return self;
    };
    self.getDemandedOptions = () => {
        argsert_1.argsert([], 0);
        return options.demandedOptions;
    };
    self.getDemandedCommands = () => {
        argsert_1.argsert([], 0);
        return options.demandedCommands;
    };
    self.deprecateOption = function deprecateOption(option, message) {
        argsert_1.argsert('<string> [string|boolean]', [option, message], arguments.length);
        options.deprecatedOptions[option] = message;
        return self;
    };
    self.getDeprecatedOptions = () => {
        argsert_1.argsert([], 0);
        return options.deprecatedOptions;
    };
    self.implies = function (key, value) {
        argsert_1.argsert('<string|object> [number|string|array]', [key, value], arguments.length);
        validation.implies(key, value);
        return self;
    };
    self.conflicts = function (key1, key2) {
        argsert_1.argsert('<string|object> [string|array]', [key1, key2], arguments.length);
        validation.conflicts(key1, key2);
        return self;
    };
    self.usage = function (msg, description, builder, handler) {
        argsert_1.argsert('<string|null|undefined> [string|boolean] [function|object] [function]', [msg, description, builder, handler], arguments.length);
        if (description !== undefined) {
            common_types_1.assertNotStrictEqual(msg, null);
            // .usage() can be used as an alias for defining
            // a default command.
            if ((msg || '').match(/^\$0( |$)/)) {
                return self.command(msg, description, builder, handler);
            }
            else {
                throw new yerror_1.YError('.usage() description must start with $0 if being used as alias for .command()');
            }
        }
        else {
            usage.usage(msg);
            return self;
        }
    };
    self.epilogue = self.epilog = function (msg) {
        argsert_1.argsert('<string>', [msg], arguments.length);
        usage.epilog(msg);
        return self;
    };
    self.fail = function (f) {
        argsert_1.argsert('<function>', [f], arguments.length);
        usage.failFn(f);
        return self;
    };
    self.onFinishCommand = function (f) {
        argsert_1.argsert('<function>', [f], arguments.length);
        handlerFinishCommand = f;
        return self;
    };
    self.getHandlerFinishCommand = () => handlerFinishCommand;
    self.check = function (f, _global) {
        argsert_1.argsert('<function> [boolean]', [f, _global], arguments.length);
        validation.check(f, _global !== false);
        return self;
    };
    self.global = function global(globals, global) {
        argsert_1.argsert('<string|array> [boolean]', [globals, global], arguments.length);
        globals = [].concat(globals);
        if (global !== false) {
            options.local = options.local.filter(l => globals.indexOf(l) === -1);
        }
        else {
            globals.forEach((g) => {
                if (options.local.indexOf(g) === -1)
                    options.local.push(g);
            });
        }
        return self;
    };
    self.pkgConf = function pkgConf(key, rootPath) {
        argsert_1.argsert('<string> [string]', [key, rootPath], arguments.length);
        let conf = null;
        // prefer cwd to require-main-filename in this method
        // since we're looking for e.g. "nyc" config in nyc consumer
        // rather than "yargs" config in nyc (where nyc is the main filename)
        const obj = pkgUp(rootPath || cwd);
        // If an object exists in the key, add it to options.configObjects
        if (obj[key] && typeof obj[key] === 'object') {
            conf = apply_extends_1.applyExtends(obj[key], rootPath || cwd, self.getParserConfiguration()['deep-merge-config']);
            options.configObjects = (options.configObjects || []).concat(conf);
        }
        return self;
    };
    const pkgs = {};
    function pkgUp(rootPath) {
        const npath = rootPath || '*';
        if (pkgs[npath])
            return pkgs[npath];
        let obj = {};
        try {
            let startDir = rootPath || requireMainFilename(parentRequire);
            // When called in an environment that lacks require.main.filename, such as a jest test runner,
            // startDir is already process.cwd(), and should not be shortened.
            // Whether or not it is _actually_ a directory (e.g., extensionless bin) is irrelevant, find-up handles it.
            if (!rootPath && path.extname(startDir)) {
                startDir = path.dirname(startDir);
            }
            const pkgJsonPath = findUp.sync('package.json', {
                cwd: startDir
            });
            common_types_1.assertNotStrictEqual(pkgJsonPath, undefined);
            obj = JSON.parse(fs.readFileSync(pkgJsonPath).toString());
        }
        catch (noop) { }
        pkgs[npath] = obj || {};
        return pkgs[npath];
    }
    let parseFn = null;
    let parseContext = null;
    self.parse = function parse(args, shortCircuit, _parseFn) {
        argsert_1.argsert('[string|array] [function|boolean|object] [function]', [args, shortCircuit, _parseFn], arguments.length);
        freeze();
        if (typeof args === 'undefined') {
            const argv = self._parseArgs(processArgs);
            const tmpParsed = self.parsed;
            unfreeze();
            // TODO: remove this compatibility hack when we release yargs@15.x:
            self.parsed = tmpParsed;
            return argv;
        }
        // a context object can optionally be provided, this allows
        // additional information to be passed to a command handler.
        if (typeof shortCircuit === 'object') {
            parseContext = shortCircuit;
            shortCircuit = _parseFn;
        }
        // by providing a function as a second argument to
        // parse you can capture output that would otherwise
        // default to printing to stdout/stderr.
        if (typeof shortCircuit === 'function') {
            parseFn = shortCircuit;
            shortCircuit = false;
        }
        // completion short-circuits the parsing process,
        // skipping validation, etc.
        if (!shortCircuit)
            processArgs = args;
        if (parseFn)
            exitProcess = false;
        const parsed = self._parseArgs(args, !!shortCircuit);
        completion.setParsed(self.parsed);
        if (parseFn)
            parseFn(exitError, parsed, output);
        unfreeze();
        return parsed;
    };
    self._getParseContext = () => parseContext || {};
    self._hasParseCallback = () => !!parseFn;
    self.option = self.options = function option(key, opt) {
        argsert_1.argsert('<string|object> [object]', [key, opt], arguments.length);
        if (typeof key === 'object') {
            Object.keys(key).forEach((k) => {
                self.options(k, key[k]);
            });
        }
        else {
            if (typeof opt !== 'object') {
                opt = {};
            }
            options.key[key] = true; // track manually set keys.
            if (opt.alias)
                self.alias(key, opt.alias);
            const deprecate = opt.deprecate || opt.deprecated;
            if (deprecate) {
                self.deprecateOption(key, deprecate);
            }
            const demand = opt.demand || opt.required || opt.require;
            // A required option can be specified via "demand: true".
            if (demand) {
                self.demand(key, demand);
            }
            if (opt.demandOption) {
                self.demandOption(key, typeof opt.demandOption === 'string' ? opt.demandOption : undefined);
            }
            if (opt.conflicts) {
                self.conflicts(key, opt.conflicts);
            }
            if ('default' in opt) {
                self.default(key, opt.default);
            }
            if (opt.implies !== undefined) {
                self.implies(key, opt.implies);
            }
            if (opt.nargs !== undefined) {
                self.nargs(key, opt.nargs);
            }
            if (opt.config) {
                self.config(key, opt.configParser);
            }
            if (opt.normalize) {
                self.normalize(key);
            }
            if (opt.choices) {
                self.choices(key, opt.choices);
            }
            if (opt.coerce) {
                self.coerce(key, opt.coerce);
            }
            if (opt.group) {
                self.group(key, opt.group);
            }
            if (opt.boolean || opt.type === 'boolean') {
                self.boolean(key);
                if (opt.alias)
                    self.boolean(opt.alias);
            }
            if (opt.array || opt.type === 'array') {
                self.array(key);
                if (opt.alias)
                    self.array(opt.alias);
            }
            if (opt.number || opt.type === 'number') {
                self.number(key);
                if (opt.alias)
                    self.number(opt.alias);
            }
            if (opt.string || opt.type === 'string') {
                self.string(key);
                if (opt.alias)
                    self.string(opt.alias);
            }
            if (opt.count || opt.type === 'count') {
                self.count(key);
            }
            if (typeof opt.global === 'boolean') {
                self.global(key, opt.global);
            }
            if (opt.defaultDescription) {
                options.defaultDescription[key] = opt.defaultDescription;
            }
            if (opt.skipValidation) {
                self.skipValidation(key);
            }
            const desc = opt.describe || opt.description || opt.desc;
            self.describe(key, desc);
            if (opt.hidden) {
                self.hide(key);
            }
            if (opt.requiresArg) {
                self.requiresArg(key);
            }
        }
        return self;
    };
    self.getOptions = () => options;
    self.positional = function (key, opts) {
        argsert_1.argsert('<string> <object>', [key, opts], arguments.length);
        if (context.resets === 0) {
            throw new yerror_1.YError(".positional() can only be called in a command's builder function");
        }
        // .positional() only supports a subset of the configuration
        // options available to .option().
        const supportedOpts = ['default', 'defaultDescription', 'implies', 'normalize',
            'choices', 'conflicts', 'coerce', 'type', 'describe',
            'desc', 'description', 'alias'];
        opts = obj_filter_1.objFilter(opts, (k, v) => {
            let accept = supportedOpts.indexOf(k) !== -1;
            // type can be one of string|number|boolean.
            if (k === 'type' && ['string', 'number', 'boolean'].indexOf(v) === -1)
                accept = false;
            return accept;
        });
        // copy over any settings that can be inferred from the command string.
        const fullCommand = context.fullCommands[context.fullCommands.length - 1];
        const parseOptions = fullCommand ? command.cmdToParseOptions(fullCommand) : {
            array: [],
            alias: {},
            default: {},
            demand: {}
        };
        common_types_1.objectKeys(parseOptions).forEach((pk) => {
            const parseOption = parseOptions[pk];
            if (Array.isArray(parseOption)) {
                if (parseOption.indexOf(key) !== -1)
                    opts[pk] = true;
            }
            else {
                if (parseOption[key] && !(pk in opts))
                    opts[pk] = parseOption[key];
            }
        });
        self.group(key, usage.getPositionalGroupName());
        return self.option(key, opts);
    };
    self.group = function group(opts, groupName) {
        argsert_1.argsert('<string|array> <string>', [opts, groupName], arguments.length);
        const existing = preservedGroups[groupName] || groups[groupName];
        if (preservedGroups[groupName]) {
            // we now only need to track this group name in groups.
            delete preservedGroups[groupName];
        }
        const seen = {};
        groups[groupName] = (existing || []).concat(opts).filter((key) => {
            if (seen[key])
                return false;
            return (seen[key] = true);
        });
        return self;
    };
    // combine explicit and preserved groups. explicit groups should be first
    self.getGroups = () => Object.assign({}, groups, preservedGroups);
    // as long as options.envPrefix is not undefined,
    // parser will apply env vars matching prefix to argv
    self.env = function (prefix) {
        argsert_1.argsert('[string|boolean]', [prefix], arguments.length);
        if (prefix === false)
            delete options.envPrefix;
        else
            options.envPrefix = prefix || '';
        return self;
    };
    self.wrap = function (cols) {
        argsert_1.argsert('<number|null|undefined>', [cols], arguments.length);
        usage.wrap(cols);
        return self;
    };
    let strict = false;
    self.strict = function (enabled) {
        argsert_1.argsert('[boolean]', [enabled], arguments.length);
        strict = enabled !== false;
        return self;
    };
    self.getStrict = () => strict;
    let strictCommands = false;
    self.strictCommands = function (enabled) {
        argsert_1.argsert('[boolean]', [enabled], arguments.length);
        strictCommands = enabled !== false;
        return self;
    };
    self.getStrictCommands = () => strictCommands;
    let parserConfig = {};
    self.parserConfiguration = function parserConfiguration(config) {
        argsert_1.argsert('<object>', [config], arguments.length);
        parserConfig = config;
        return self;
    };
    self.getParserConfiguration = () => parserConfig;
    self.showHelp = function (level) {
        argsert_1.argsert('[string|function]', [level], arguments.length);
        if (!self.parsed)
            self._parseArgs(processArgs); // run parser, if it has not already been executed.
        if (command.hasDefaultCommand()) {
            context.resets++; // override the restriction on top-level positoinals.
            command.runDefaultBuilderOn(self);
        }
        usage.showHelp(level);
        return self;
    };
    let versionOpt = null;
    self.version = function version(opt, msg, ver) {
        const defaultVersionOpt = 'version';
        argsert_1.argsert('[boolean|string] [string] [string]', [opt, msg, ver], arguments.length);
        // nuke the key previously configured
        // to return version #.
        if (versionOpt) {
            deleteFromParserHintObject(versionOpt);
            usage.version(undefined);
            versionOpt = null;
        }
        if (arguments.length === 0) {
            ver = guessVersion();
            opt = defaultVersionOpt;
        }
        else if (arguments.length === 1) {
            if (opt === false) { // disable default 'version' key.
                return self;
            }
            ver = opt;
            opt = defaultVersionOpt;
        }
        else if (arguments.length === 2) {
            ver = msg;
            msg = undefined;
        }
        versionOpt = typeof opt === 'string' ? opt : defaultVersionOpt;
        msg = msg || usage.deferY18nLookup('Show version number');
        usage.version(ver || undefined);
        self.boolean(versionOpt);
        self.describe(versionOpt, msg);
        return self;
    };
    function guessVersion() {
        const obj = pkgUp();
        return obj.version || 'unknown';
    }
    let helpOpt = null;
    self.addHelpOpt = self.help = function addHelpOpt(opt, msg) {
        const defaultHelpOpt = 'help';
        argsert_1.argsert('[string|boolean] [string]', [opt, msg], arguments.length);
        // nuke the key previously configured
        // to return help.
        if (helpOpt) {
            deleteFromParserHintObject(helpOpt);
            helpOpt = null;
        }
        if (arguments.length === 1) {
            if (opt === false)
                return self;
        }
        // use arguments, fallback to defaults for opt and msg
        helpOpt = typeof opt === 'string' ? opt : defaultHelpOpt;
        self.boolean(helpOpt);
        self.describe(helpOpt, msg || usage.deferY18nLookup('Show help'));
        return self;
    };
    const defaultShowHiddenOpt = 'show-hidden';
    options.showHiddenOpt = defaultShowHiddenOpt;
    self.addShowHiddenOpt = self.showHidden = function addShowHiddenOpt(opt, msg) {
        argsert_1.argsert('[string|boolean] [string]', [opt, msg], arguments.length);
        if (arguments.length === 1) {
            if (opt === false)
                return self;
        }
        const showHiddenOpt = typeof opt === 'string' ? opt : defaultShowHiddenOpt;
        self.boolean(showHiddenOpt);
        self.describe(showHiddenOpt, msg || usage.deferY18nLookup('Show hidden options'));
        options.showHiddenOpt = showHiddenOpt;
        return self;
    };
    self.hide = function hide(key) {
        argsert_1.argsert('<string>', [key], arguments.length);
        options.hiddenOptions.push(key);
        return self;
    };
    self.showHelpOnFail = function showHelpOnFail(enabled, message) {
        argsert_1.argsert('[boolean|string] [string]', [enabled, message], arguments.length);
        usage.showHelpOnFail(enabled, message);
        return self;
    };
    var exitProcess = true;
    self.exitProcess = function (enabled = true) {
        argsert_1.argsert('[boolean]', [enabled], arguments.length);
        exitProcess = enabled;
        return self;
    };
    self.getExitProcess = () => exitProcess;
    var completionCommand = null;
    self.completion = function (cmd, desc, fn) {
        argsert_1.argsert('[string] [string|boolean|function] [function]', [cmd, desc, fn], arguments.length);
        // a function to execute when generating
        // completions can be provided as the second
        // or third argument to completion.
        if (typeof desc === 'function') {
            fn = desc;
            desc = undefined;
        }
        // register the completion command.
        completionCommand = cmd || completionCommand || 'completion';
        if (!desc && desc !== false) {
            desc = 'generate completion script';
        }
        self.command(completionCommand, desc);
        // a function can be provided
        if (fn)
            completion.registerFunction(fn);
        return self;
    };
    self.showCompletionScript = function ($0, cmd) {
        argsert_1.argsert('[string] [string]', [$0, cmd], arguments.length);
        $0 = $0 || self.$0;
        _logger.log(completion.generateCompletionScript($0, cmd || completionCommand || 'completion'));
        return self;
    };
    self.getCompletion = function (args, done) {
        argsert_1.argsert('<array> <function>', [args, done], arguments.length);
        completion.getCompletion(args, done);
    };
    self.locale = function (locale) {
        argsert_1.argsert('[string]', [locale], arguments.length);
        if (!locale) {
            guessLocale();
            return y18n.getLocale();
        }
        detectLocale = false;
        y18n.setLocale(locale);
        return self;
    };
    self.updateStrings = self.updateLocale = function (obj) {
        argsert_1.argsert('<object>', [obj], arguments.length);
        detectLocale = false;
        y18n.updateLocale(obj);
        return self;
    };
    let detectLocale = true;
    self.detectLocale = function (detect) {
        argsert_1.argsert('<boolean>', [detect], arguments.length);
        detectLocale = detect;
        return self;
    };
    self.getDetectLocale = () => detectLocale;
    var hasOutput = false;
    var exitError = null;
    // maybe exit, always capture
    // context about why we wanted to exit.
    self.exit = (code, err) => {
        hasOutput = true;
        exitError = err;
        if (exitProcess)
            process.exit(code);
    };
    // we use a custom logger that buffers output,
    // so that we can print to non-CLIs, e.g., chat-bots.
    const _logger = {
        log(...args) {
            if (!self._hasParseCallback())
                console.log(...args);
            hasOutput = true;
            if (output.length)
                output += '\n';
            output += args.join(' ');
        },
        error(...args) {
            if (!self._hasParseCallback())
                console.error(...args);
            hasOutput = true;
            if (output.length)
                output += '\n';
            output += args.join(' ');
        }
    };
    self._getLoggerInstance = () => _logger;
    // has yargs output an error our help
    // message in the current execution context.
    self._hasOutput = () => hasOutput;
    self._setHasOutput = () => {
        hasOutput = true;
    };
    let recommendCommands;
    self.recommendCommands = function (recommend = true) {
        argsert_1.argsert('[boolean]', [recommend], arguments.length);
        recommendCommands = recommend;
        return self;
    };
    self.getUsageInstance = () => usage;
    self.getValidationInstance = () => validation;
    self.getCommandInstance = () => command;
    self.terminalWidth = () => {
        argsert_1.argsert([], 0);
        return typeof process.stdout.columns !== 'undefined' ? process.stdout.columns : null;
    };
    Object.defineProperty(self, 'argv', {
        get: () => self._parseArgs(processArgs),
        enumerable: true
    });
    self._parseArgs = function parseArgs(args, shortCircuit, _calledFromCommand, commandIndex) {
        let skipValidation = !!_calledFromCommand;
        args = args || processArgs;
        options.__ = y18n.__;
        options.configuration = self.getParserConfiguration();
        const populateDoubleDash = !!options.configuration['populate--'];
        const config = Object.assign({}, options.configuration, {
            'populate--': true
        });
        const parsed = Parser.detailed(args, Object.assign({}, options, {
            configuration: config
        }));
        let argv = parsed.argv;
        if (parseContext)
            argv = Object.assign({}, argv, parseContext);
        const aliases = parsed.aliases;
        argv.$0 = self.$0;
        self.parsed = parsed;
        try {
            guessLocale(); // guess locale lazily, so that it can be turned off in chain.
            // while building up the argv object, there
            // are two passes through the parser. If completion
            // is being performed short-circuit on the first pass.
            if (shortCircuit) {
                return (populateDoubleDash || _calledFromCommand) ? argv : self._copyDoubleDash(argv);
            }
            // if there's a handler associated with a
            // command defer processing to it.
            if (helpOpt) {
                // consider any multi-char helpOpt alias as a valid help command
                // unless all helpOpt aliases are single-char
                // note that parsed.aliases is a normalized bidirectional map :)
                const helpCmds = [helpOpt]
                    .concat(aliases[helpOpt] || [])
                    .filter(k => k.length > 1);
                // check if help should trigger and strip it from _.
                if (~helpCmds.indexOf(argv._[argv._.length - 1])) {
                    argv._.pop();
                    argv[helpOpt] = true;
                }
            }
            const handlerKeys = command.getCommands();
            const requestCompletions = completion.completionKey in argv;
            const skipRecommendation = argv[helpOpt] || requestCompletions;
            const skipDefaultCommand = skipRecommendation && (handlerKeys.length > 1 || handlerKeys[0] !== '$0');
            if (argv._.length) {
                if (handlerKeys.length) {
                    let firstUnknownCommand;
                    for (let i = (commandIndex || 0), cmd; argv._[i] !== undefined; i++) {
                        cmd = String(argv._[i]);
                        if (~handlerKeys.indexOf(cmd) && cmd !== completionCommand) {
                            // commands are executed using a recursive algorithm that executes
                            // the deepest command first; we keep track of the position in the
                            // argv._ array that is currently being executed.
                            const innerArgv = command.runCommand(cmd, self, parsed, i + 1);
                            return populateDoubleDash ? innerArgv : self._copyDoubleDash(innerArgv);
                        }
                        else if (!firstUnknownCommand && cmd !== completionCommand) {
                            firstUnknownCommand = cmd;
                            break;
                        }
                    }
                    // run the default command, if defined
                    if (command.hasDefaultCommand() && !skipDefaultCommand) {
                        const innerArgv = command.runCommand(null, self, parsed);
                        return populateDoubleDash ? innerArgv : self._copyDoubleDash(innerArgv);
                    }
                    // recommend a command if recommendCommands() has
                    // been enabled, and no commands were found to execute
                    if (recommendCommands && firstUnknownCommand && !skipRecommendation) {
                        validation.recommendCommands(firstUnknownCommand, handlerKeys);
                    }
                }
                // generate a completion script for adding to ~/.bashrc.
                if (completionCommand && ~argv._.indexOf(completionCommand) && !requestCompletions) {
                    if (exitProcess)
                        setBlocking(true);
                    self.showCompletionScript();
                    self.exit(0);
                }
            }
            else if (command.hasDefaultCommand() && !skipDefaultCommand) {
                const innerArgv = command.runCommand(null, self, parsed);
                return populateDoubleDash ? innerArgv : self._copyDoubleDash(innerArgv);
            }
            // we must run completions first, a user might
            // want to complete the --help or --version option.
            if (requestCompletions) {
                if (exitProcess)
                    setBlocking(true);
                // we allow for asynchronous completions,
                // e.g., loading in a list of commands from an API.
                args = [].concat(args);
                const completionArgs = args.slice(args.indexOf(`--${completion.completionKey}`) + 1);
                completion.getCompletion(completionArgs, (completions) => {
                    ;
                    (completions || []).forEach((completion) => {
                        _logger.log(completion);
                    });
                    self.exit(0);
                });
                return (populateDoubleDash || _calledFromCommand) ? argv : self._copyDoubleDash(argv);
            }
            // Handle 'help' and 'version' options
            // if we haven't already output help!
            if (!hasOutput) {
                Object.keys(argv).forEach((key) => {
                    if (key === helpOpt && argv[key]) {
                        if (exitProcess)
                            setBlocking(true);
                        skipValidation = true;
                        self.showHelp('log');
                        self.exit(0);
                    }
                    else if (key === versionOpt && argv[key]) {
                        if (exitProcess)
                            setBlocking(true);
                        skipValidation = true;
                        usage.showVersion();
                        self.exit(0);
                    }
                });
            }
            // Check if any of the options to skip validation were provided
            if (!skipValidation && options.skipValidation.length > 0) {
                skipValidation = Object.keys(argv).some(key => options.skipValidation.indexOf(key) >= 0 && argv[key] === true);
            }
            // If the help or version options where used and exitProcess is false,
            // or if explicitly skipped, we won't run validations.
            if (!skipValidation) {
                if (parsed.error)
                    throw new yerror_1.YError(parsed.error.message);
                // if we're executed via bash completion, don't
                // bother with validation.
                if (!requestCompletions) {
                    self._runValidation(argv, aliases, {}, parsed.error);
                }
            }
        }
        catch (err) {
            if (err instanceof yerror_1.YError)
                usage.fail(err.message, err);
            else
                throw err;
        }
        return (populateDoubleDash || _calledFromCommand) ? argv : self._copyDoubleDash(argv);
    };
    // to simplify the parsing of positionals in commands,
    // we temporarily populate '--' rather than _, with arguments
    // after the '--' directive. After the parse, we copy these back.
    self._copyDoubleDash = function (argv) {
        if (is_promise_1.isPromise(argv) || !argv._ || !argv['--'])
            return argv;
        argv._.push.apply(argv._, argv['--']);
        // TODO(bcoe): refactor command parsing such that this delete is not
        // necessary: https://github.com/yargs/yargs/issues/1482
        try {
            delete argv['--'];
        }
        catch (_err) { }
        return argv;
    };
    self._runValidation = function runValidation(argv, aliases, positionalMap, parseErrors, isDefaultCommand = false) {
        if (parseErrors)
            throw new yerror_1.YError(parseErrors.message);
        validation.nonOptionCount(argv);
        validation.requiredArguments(argv);
        let failedStrictCommands = false;
        if (strictCommands) {
            failedStrictCommands = validation.unknownCommands(argv);
        }
        if (strict && !failedStrictCommands) {
            validation.unknownArguments(argv, aliases, positionalMap, isDefaultCommand);
        }
        validation.customChecks(argv, aliases);
        validation.limitedChoices(argv);
        validation.implications(argv);
        validation.conflicting(argv);
    };
    function guessLocale() {
        if (!detectLocale)
            return;
        const locale = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE || 'en_US';
        self.locale(locale.replace(/[.:].*/, ''));
    }
    // an app should almost always have --version and --help,
    // if you *really* want to disable this use .help(false)/.version(false).
    self.help();
    self.version();
    return self;
}
exports.Yargs = Yargs;
// rebase an absolute path to a relative one with respect to a base directory
// exported for tests
function rebase(base, dir) {
    return path.relative(base, dir);
}
exports.rebase = rebase;
function isYargsInstance(y) {
    return !!y && (typeof y._parseArgs === 'function');
}
exports.isYargsInstance = isYargsInstance;


/***/ }),

/***/ 3837:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.YError = void 0;
class YError extends Error {
    constructor(msg) {
        super(msg || 'yargs error');
        this.name = 'YError';
        Error.captureStackTrace(this, YError);
    }
}
exports.YError = YError;


/***/ }),

/***/ 8841:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// classic singleton yargs API, to use yargs
// without running as a singleton do:
// require('yargs/yargs')(process.argv.slice(2))
const yargs = __webpack_require__(4118)
const processArgv = __webpack_require__(6438)

Argv(processArgv.getProcessArgvWithoutBin())

module.exports = Argv

function Argv (processArgs, cwd) {
  const argv = yargs(processArgs, cwd, require)
  singletonify(argv)
  return argv
}

/*  Hack an instance of Argv with process.argv into Argv
    so people can do
    require('yargs')(['--beeble=1','-z','zizzle']).argv
    to parse a list of args and
    require('yargs').argv
    to get a parsed version of process.argv.
*/
function singletonify (inst) {
  Object.keys(inst).forEach((key) => {
    if (key === 'argv') {
      Argv.__defineGetter__(key, inst.__lookupGetter__(key))
    } else if (typeof inst[key] === 'function') {
      Argv[key] = inst[key].bind(inst)
    } else {
      Argv.__defineGetter__('$0', () => {
        return inst.$0
      })
      Argv.__defineGetter__('parsed', () => {
        return inst.parsed
      })
    }
  })
}


/***/ }),

/***/ 9911:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const stringWidth = __webpack_require__(3306)
const stripAnsi = __webpack_require__(6485)
const wrap = __webpack_require__(6282)

const align = {
  right: alignRight,
  center: alignCenter
}
const top = 0
const right = 1
const bottom = 2
const left = 3

class UI {
  constructor (opts) {
    this.width = opts.width
    this.wrap = opts.wrap
    this.rows = []
  }

  span (...args) {
    const cols = this.div(...args)
    cols.span = true
  }

  resetOutput () {
    this.rows = []
  }

  div (...args) {
    if (args.length === 0) {
      this.div('')
    }

    if (this.wrap && this._shouldApplyLayoutDSL(...args)) {
      return this._applyLayoutDSL(args[0])
    }

    const cols = args.map(arg => {
      if (typeof arg === 'string') {
        return this._colFromString(arg)
      }

      return arg
    })

    this.rows.push(cols)
    return cols
  }

  _shouldApplyLayoutDSL (...args) {
    return args.length === 1 && typeof args[0] === 'string' &&
      /[\t\n]/.test(args[0])
  }

  _applyLayoutDSL (str) {
    const rows = str.split('\n').map(row => row.split('\t'))
    let leftColumnWidth = 0

    // simple heuristic for layout, make sure the
    // second column lines up along the left-hand.
    // don't allow the first column to take up more
    // than 50% of the screen.
    rows.forEach(columns => {
      if (columns.length > 1 && stringWidth(columns[0]) > leftColumnWidth) {
        leftColumnWidth = Math.min(
          Math.floor(this.width * 0.5),
          stringWidth(columns[0])
        )
      }
    })

    // generate a table:
    //  replacing ' ' with padding calculations.
    //  using the algorithmically generated width.
    rows.forEach(columns => {
      this.div(...columns.map((r, i) => {
        return {
          text: r.trim(),
          padding: this._measurePadding(r),
          width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
        }
      }))
    })

    return this.rows[this.rows.length - 1]
  }

  _colFromString (text) {
    return {
      text,
      padding: this._measurePadding(text)
    }
  }

  _measurePadding (str) {
    // measure padding without ansi escape codes
    const noAnsi = stripAnsi(str)
    return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length]
  }

  toString () {
    const lines = []

    this.rows.forEach(row => {
      this.rowToString(row, lines)
    })

    // don't display any lines with the
    // hidden flag set.
    return lines
      .filter(line => !line.hidden)
      .map(line => line.text)
      .join('\n')
  }

  rowToString (row, lines) {
    this._rasterize(row).forEach((rrow, r) => {
      let str = ''
      rrow.forEach((col, c) => {
        const { width } = row[c] // the width with padding.
        const wrapWidth = this._negatePadding(row[c]) // the width without padding.

        let ts = col // temporary string used during alignment/padding.

        if (wrapWidth > stringWidth(col)) {
          ts += ' '.repeat(wrapWidth - stringWidth(col))
        }

        // align the string within its column.
        if (row[c].align && row[c].align !== 'left' && this.wrap) {
          ts = align[row[c].align](ts, wrapWidth)
          if (stringWidth(ts) < wrapWidth) {
            ts += ' '.repeat(width - stringWidth(ts) - 1)
          }
        }

        // apply border and padding to string.
        const padding = row[c].padding || [0, 0, 0, 0]
        if (padding[left]) {
          str += ' '.repeat(padding[left])
        }

        str += addBorder(row[c], ts, '| ')
        str += ts
        str += addBorder(row[c], ts, ' |')
        if (padding[right]) {
          str += ' '.repeat(padding[right])
        }

        // if prior row is span, try to render the
        // current row on the prior line.
        if (r === 0 && lines.length > 0) {
          str = this._renderInline(str, lines[lines.length - 1])
        }
      })

      // remove trailing whitespace.
      lines.push({
        text: str.replace(/ +$/, ''),
        span: row.span
      })
    })

    return lines
  }

  // if the full 'source' can render in
  // the target line, do so.
  _renderInline (source, previousLine) {
    const leadingWhitespace = source.match(/^ */)[0].length
    const target = previousLine.text
    const targetTextWidth = stringWidth(target.trimRight())

    if (!previousLine.span) {
      return source
    }

    // if we're not applying wrapping logic,
    // just always append to the span.
    if (!this.wrap) {
      previousLine.hidden = true
      return target + source
    }

    if (leadingWhitespace < targetTextWidth) {
      return source
    }

    previousLine.hidden = true

    return target.trimRight() + ' '.repeat(leadingWhitespace - targetTextWidth) + source.trimLeft()
  }

  _rasterize (row) {
    const rrows = []
    const widths = this._columnWidths(row)
    let wrapped

    // word wrap all columns, and create
    // a data-structure that is easy to rasterize.
    row.forEach((col, c) => {
      // leave room for left and right padding.
      col.width = widths[c]
      if (this.wrap) {
        wrapped = wrap(col.text, this._negatePadding(col), { hard: true }).split('\n')
      } else {
        wrapped = col.text.split('\n')
      }

      if (col.border) {
        wrapped.unshift('.' + '-'.repeat(this._negatePadding(col) + 2) + '.')
        wrapped.push("'" + '-'.repeat(this._negatePadding(col) + 2) + "'")
      }

      // add top and bottom padding.
      if (col.padding) {
        wrapped.unshift(...new Array(col.padding[top] || 0).fill(''))
        wrapped.push(...new Array(col.padding[bottom] || 0).fill(''))
      }

      wrapped.forEach((str, r) => {
        if (!rrows[r]) {
          rrows.push([])
        }

        const rrow = rrows[r]

        for (let i = 0; i < c; i++) {
          if (rrow[i] === undefined) {
            rrow.push('')
          }
        }

        rrow.push(str)
      })
    })

    return rrows
  }

  _negatePadding (col) {
    let wrapWidth = col.width
    if (col.padding) {
      wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0)
    }

    if (col.border) {
      wrapWidth -= 4
    }

    return wrapWidth
  }

  _columnWidths (row) {
    if (!this.wrap) {
      return row.map(col => {
        return col.width || stringWidth(col.text)
      })
    }

    let unset = row.length
    let remainingWidth = this.width

    // column widths can be set in config.
    const widths = row.map(col => {
      if (col.width) {
        unset--
        remainingWidth -= col.width
        return col.width
      }

      return undefined
    })

    // any unset widths should be calculated.
    const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0

    return widths.map((w, i) => {
      if (w === undefined) {
        return Math.max(unsetWidth, _minWidth(row[i]))
      }

      return w
    })
  }
}

function addBorder (col, ts, style) {
  if (col.border) {
    if (/[.']-+[.']/.test(ts)) {
      return ''
    }

    if (ts.trim().length !== 0) {
      return style
    }

    return '  '
  }

  return ''
}

// calculates the minimum width of
// a column, based on padding preferences.
function _minWidth (col) {
  const padding = col.padding || []
  const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0)
  if (col.border) {
    return minWidth + 4
  }

  return minWidth
}

function getWindowWidth () {
  /* istanbul ignore next: depends on terminal */
  if (typeof process === 'object' && process.stdout && process.stdout.columns) {
    return process.stdout.columns
  }
}

function alignRight (str, width) {
  str = str.trim()
  const strWidth = stringWidth(str)

  if (strWidth < width) {
    return ' '.repeat(width - strWidth) + str
  }

  return str
}

function alignCenter (str, width) {
  str = str.trim()
  const strWidth = stringWidth(str)

  /* istanbul ignore next */
  if (strWidth >= width) {
    return str
  }

  return ' '.repeat((width - strWidth) >> 1) + str
}

module.exports = function (opts = {}) {
  return new UI({
    width: opts.width || getWindowWidth() || /* istanbul ignore next */ 80,
    wrap: opts.wrap !== false
  })
}


/***/ }),

/***/ 6282:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const stringWidth = __webpack_require__(3306);
const stripAnsi = __webpack_require__(6485);
const ansiStyles = __webpack_require__(8537);

const ESCAPES = new Set([
	'\u001B',
	'\u009B'
]);

const END_CODE = 39;

const wrapAnsi = code => `${ESCAPES.values().next().value}[${code}m`;

// Calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes
const wordLengths = string => string.split(' ').map(character => stringWidth(character));

// Wrap a long word across multiple rows
// Ansi escape codes do not count towards length
const wrapWord = (rows, word, columns) => {
	const characters = [...word];

	let isInsideEscape = false;
	let visible = stringWidth(stripAnsi(rows[rows.length - 1]));

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character);

		if (visible + characterLength <= columns) {
			rows[rows.length - 1] += character;
		} else {
			rows.push(character);
			visible = 0;
		}

		if (ESCAPES.has(character)) {
			isInsideEscape = true;
		} else if (isInsideEscape && character === 'm') {
			isInsideEscape = false;
			continue;
		}

		if (isInsideEscape) {
			continue;
		}

		visible += characterLength;

		if (visible === columns && index < characters.length - 1) {
			rows.push('');
			visible = 0;
		}
	}

	// It's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop();
	}
};

// Trims spaces from a string ignoring invisible sequences
const stringVisibleTrimSpacesRight = str => {
	const words = str.split(' ');
	let last = words.length;

	while (last > 0) {
		if (stringWidth(words[last - 1]) > 0) {
			break;
		}

		last--;
	}

	if (last === words.length) {
		return str;
	}

	return words.slice(0, last).join(' ') + words.slice(last).join('');
};

// The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
//
// 'hard' will never allow a string to take up more than columns characters
//
// 'soft' allows long words to expand past the column length
const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === '') {
		return '';
	}

	let pre = '';
	let ret = '';
	let escapeCode;

	const lengths = wordLengths(string);
	let rows = [''];

	for (const [index, word] of string.split(' ').entries()) {
		if (options.trim !== false) {
			rows[rows.length - 1] = rows[rows.length - 1].trimLeft();
		}

		let rowLength = stringWidth(rows[rows.length - 1]);

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				// If we start with a new word but the current row length equals the length of the columns, add a new row
				rows.push('');
				rowLength = 0;
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += ' ';
				rowLength++;
			}
		}

		// In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
		if (options.hard && lengths[index] > columns) {
			const remainingColumns = (columns - rowLength);
			const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
			const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
			if (breaksStartingNextLine < breaksStartingThisLine) {
				rows.push('');
			}

			wrapWord(rows, word, columns);
			continue;
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				continue;
			}

			rows.push('');
		}

		if (rowLength + lengths[index] > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns);
			continue;
		}

		rows[rows.length - 1] += word;
	}

	if (options.trim !== false) {
		rows = rows.map(stringVisibleTrimSpacesRight);
	}

	pre = rows.join('\n');

	for (const [index, character] of [...pre].entries()) {
		ret += character;

		if (ESCAPES.has(character)) {
			const code = parseFloat(/\d[^m]*/.exec(pre.slice(index, index + 4)));
			escapeCode = code === END_CODE ? null : code;
		}

		const code = ansiStyles.codes.get(Number(escapeCode));

		if (escapeCode && code) {
			if (pre[index + 1] === '\n') {
				ret += wrapAnsi(code);
			} else if (character === '\n') {
				ret += wrapAnsi(escapeCode);
			}
		}
	}

	return ret;
};

// For each newline, invoke the method separately
module.exports = (string, columns, options) => {
	return String(string)
		.normalize()
		.replace(/\r\n/g, '\n')
		.split('\n')
		.map(line => exec(line, columns, options))
		.join('\n');
};


/***/ }),

/***/ 4118:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


// an async function fails early in Node.js versions prior to 8.
async function requiresNode8OrGreater () {}
requiresNode8OrGreater()

const { Yargs, rebase } = __webpack_require__(5764)
const Parser = __webpack_require__(2222)

exports = module.exports = Yargs
exports.rebase = rebase

// allow consumers to directly use the version of yargs-parser used by yargs
exports.Parser = Parser


/***/ }),

/***/ 5164:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const braces = __webpack_require__(5466);
const fs = __webpack_require__(5747);
const path = __webpack_require__(5622);
const rrdir = __webpack_require__(4201);
const chalk = __webpack_require__(4478);
const treeify = __webpack_require__(9789);
const Table = __webpack_require__(3953);
const rdiff = __webpack_require__(7590);

this.logger = global.logger ? global.logger : console;

function * diffRows(object) {
  for (const prop of Object.keys(object)) {
    switch (prop) {
      case 'op':
        yield object[prop];
        break;
      case 'path':
        yield object[prop].join('->');
        break;
      case 'val':
        yield chalk.magentaBright(treeify.asTree(object[prop]));
        break;
      default:
        break;
    }
  }
}

function getNextPath(p) {
  return p.split(path.sep).slice(1).join(path.sep);
}

function getNextLevelPath(p) {
  const paths = p.split(path.sep);
  if (paths.length > 1) {
    return paths.slice(1).join(path.sep);
  }

  return null;
}

function getTopLevelPath(p) {
  return p.split(path.sep)[0];
}

function getTreeNode(array) {
  const object = {};
  for (const a of array) {
    const top = getTopLevelPath(a);
    const next = getNextLevelPath(a);
    if (!next) {
      object[top] = 'file';
      continue;
    }

    const subArray = array.filter(i => i.startsWith(top)).map(i => getNextLevelPath(i));
    if (!Object.prototype.hasOwnProperty.call(object, top)) {
      object[top] = {...getTreeNode(subArray)};
    }
  }

  return object;
}

module.exports.diff = function (readPath, expansion, ignoreFiles, ignoreDirectories) {
  return new Promise((resolve, reject) => {
    try {
      if (!expansion) {
        this.logger.error(chalk.red('param \'brace-expansion\' is required'));
        reject(new Error('param \'brace-expansion\' is required'));
        return;
      }

      readPath = path.normalize(readPath);
      const ignoreFilesArray = ignoreFiles.split(',').map(i => path.normalize(readPath + path.sep + i));
      const ignoreDirectoriesArray = ignoreDirectories.split(',').map(i => path.normalize(readPath + path.sep + i));

      const expectStructure = braces(expansion, {expand: true}).map(i => {
        return path.normalize(i);
      });

      const expectTree = getTreeNode(expectStructure);

      const expectTreeHeader = chalk.blueBright.bgYellowBright.bold('[Expect]');
      const expectTreeSubHeader = chalk.blueBright.bold('brace-expansion');
      const expectTreeContent = chalk.blue(treeify.asTree(expectTree));

      if (!fs.existsSync(readPath)) {
        this.logger.error(chalk.red('the path: ' + readPath + ' was not existed'));
        reject(new Error('the path: ' + readPath + ' was not existed'));
        return;
      }

      let actualPath = rrdir.sync(readPath, {
        exclude: [...ignoreDirectoriesArray, ...ignoreFilesArray],
        strict: true
      });
      actualPath = actualPath.map(i => {
        const p = path.normalize(i.path).slice(readPath.length);

        return {
          path: getNextPath(path.normalize(p)),
          directory: i.directory,
          symlink: i.symlink
        };
      }).filter(i => !i.directory);
      actualPath = [...actualPath.map(i => i.path)];
      const actualTree = getTreeNode(actualPath);
      const actualTreeHeader = chalk.greenBright.bgYellowBright.bold('[Actual]');
      const actualTreeSubHeader = chalk.greenBright.bold('under: ' + readPath);
      const actualTreeContent = chalk.green(treeify.asTree(actualTree));

      this.delta = rdiff.getDiff(actualTree, expectTree);

      const tableDelta = this.delta.map(i => {
        const keys = Object.keys(i);
        if (!keys.includes('val')) {
          i.val = '';
        }

        return Array.from(diffRows(i));
      });

      const diffTreeHeader = chalk.redBright.bgYellowBright.bold('[Diff]');
      const diffTreeSubHeader = chalk.redBright.bold('[Expect] diff with [Actual]');
      const diffTreeContent = new Table([
        {
          value: '[Action]'
        },
        {
          value: '[Path]'
        },
        {
          value: '[Structure]'
        }
      ],
      tableDelta,
      {
        borderStyle: 'dashed',
        borderColor: 'gray',
        headerAlign: 'center',
        align: 'left',
        color: 'red'
      }).render();

      if (this.layout === 'vertical') {
        let out = new Table([
          {value: actualTreeHeader}
        ],
        [
          [actualTreeSubHeader],
          [actualTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();
        this.logger.log(out);

        out = new Table([
          {value: expectTreeHeader}
        ],
        [
          [expectTreeSubHeader],
          [expectTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();
        this.logger.log(out);

        out = new Table([
          {value: diffTreeHeader}
        ],
        [
          [diffTreeSubHeader],
          [diffTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();
        this.logger.log(out);
      } else {
        const out = new Table([
          {value: actualTreeHeader},
          {value: expectTreeHeader},
          {value: diffTreeHeader}
        ],
        [
          [actualTreeSubHeader, expectTreeSubHeader, diffTreeSubHeader],
          [actualTreeContent, expectTreeContent, diffTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();

        this.logger.log(out);
      }
    } catch (error) {
      this.logger.error(chalk.red(error.message));
      reject(error);
    } finally {
      if (this.delta && this.delta.length > 0) {
        reject(new Error(JSON.stringify(this.delta)));
      } else {
        resolve({
          diff: chalk.greenBright.bgYellowBright('[success] file structures are all matched!')
        });
      }
    }
  });
};

module.exports.setRenderLayout = function (layout) {
  this.layout = layout;
  return module.exports;
};

module.exports.avfs = module.exports;


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 1058:
/***/ ((module) => {

"use strict";
module.exports = require("readline");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(3379);
/******/ })()
;