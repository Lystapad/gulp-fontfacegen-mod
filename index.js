"use strict";
const PluginError = require("plugin-error");
const through = require("through2");
const fs = require("fs");
const chalk = require("chalk");

const fontFaceGenResult = require("./facegen");

const PLUGIN_NAME = "gulp-fontfacegen-mod";

module.exports = function (options = {}) {

	let {
		filepath = "./src/css/partial",
		filename = "fonts.css",
		destpath = "../fonts",
		rewrite = "add" //del, add, sqip
	} = options,
		fontFaceFile = `${filepath}/${filename}`,
		fileExist = fs.existsSync(fontFaceFile), fileContent = null;

	if (!fs.existsSync(filepath)) {
		fs.mkdirSync(filepath, { recursive: true });
	}

	function print(stat, msg) {
		switch (stat) {
			case 1: //Error
				console.log(chalk.red("❌", msg));

				break;
			case 2: //Warning
				console.log(chalk.hex("#FFA500")("⚠", msg));
				break;
			case 3: //Pass
			default:
				console.log(chalk.green("✔", msg));
				break;
		}
	}

	if (fileExist) {
		console.log(chalk.cyan(`✔ File ${fontFaceFile} already exists.`));
		switch (options.rewrite) {
			case "del":
				print(1, `File "${filename}" will be deleted.`);
				fs.unlink(fontFaceFile,
					(err) => {
						if (err) print(1, err);
					});
				break;
			case "skip":
				print(2, `File "${filename}" SKIP, will not be processed.`);
				break;
			case "add":
			default:
				print(3, `File "${filename}" will be appended.`);
				fileContent = fs.readFileSync(fontFaceFile, "utf8");
				break;
		}
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) return cb(null, file);

		if (file.isStream()) {
			this.emit("error", new PluginError(PLUGIN_NAME, "Streams not supported!"));
			return cb(null);
		}
		// check CSS file existance && options rewrite.
		if (fileExist && options.rewrite === "skip") return cb(null, file);

		try {
			let result = fontFaceGenResult(file, destpath);
			if (result.msg) print(3, result.msg);
			if (result.dataApp) {

				if (fileContent && fileContent.includes(result.dataApp)) {
					print(2, `"${file.stem}" is already in the "${filename}"`);
				} else {
					fs.appendFile(
						fontFaceFile, result.dataApp,
						(err) => {
							if (err) {
								this.emit("error", new PluginError(PLUGIN_NAME, `Error while creating ${fontFaceFile}`));
							}
						}
					);
				}
			}
		} catch (err) {
			this.emit("error", new PluginError(PLUGIN_NAME, err));
		}

		cb(null, file);
	});
};
