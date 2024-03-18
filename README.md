﻿# gulp-fontfacegen-mod

**gulp-fontfacegen-mod** is a modified [gulp-fontfacegen](https://www.npmjs.com/package/gulp-fontfacegen), [gulp-fontfacegen-extended](https://www.npmjs.com/package/gulp-fontfacegen-extended) plugins.<br>
It generates CSS file with @font-face rules for modern browsers (**woff, woff2** formats) based on keywords in font filename.
>[!NOTE]
>It does not convert fonts to different formats, but only generates a CSS file with the font name @font-face and its parameters: font-family, font-style, font-weight.

## What is the difference?
- You can specify fonts destination folder.
- Formatted font names remain unchanged.
- You can choose what to do with "fonts.css" that already exists: create a new one by deleting the old one (del), add to an existing one (add), or do nothing (skip).
- The existing "fonts.css" file no longer causes errors. .pipe() and .plumber() will continue to work.
- [gulp-notify](https://www.npmjs.com/package/gulp-notify) should also work normal.

## Install

```
$ npm install --save-dev gulp-fontfacegen-mod
```

## Usage
Then, add it to your `gulpfile.js`:
# Simple example

```javascript
const gulp = require("gulp");
const fontFaceGen = require("gulp-fontfacegen-mod");

gulp.task("html-bem-validator", () => {
 gulp.src("./src/font/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}")
 // .pipe(fonter({formats: ['woff', 'ttf'],}))
 // .pipe(ttf2woff2())
 .pipe(
  fontFaceGen()
  //or with options
  fontFaceGen({
   filepath: "./src/css/partial", //default
   filename:  "fonts.css", //default
   destpath: "../fonts", //default
   rewrite: "add"  //default
  })
 )
 .pipe(gulp.dest('build/'));
});
```

## API
## fontFaceGen(options)

## options

Type: `object`

### filepath

Type: `string`<br>
Default: `"./src/css/partial"`

Destination folder where @font-face CSS rules should be created.

### filename

Type: `string`<br>
Default: `"fonts.css"`

Name of file with @font-face CSS rules.

### destpath

Type: `string`<br>
Default: `"../fonts"`

Destination folder where fonts are located `url("../fonts)`.

### rewrite

Type: `string`<br>
Default: `"add"`

`del` - will delete the "fonts.css" file if it exists and create a new one.<br>
`add` - adds to an existing "fonts.css" file or creates a new one.<br>
`skip` - does not change the existing "fonts.css" file or creates a new one if it does not exist.<br>

## Example

- Input font names:

```
../fonts/brioso_pro_v26-Italic Semibold.woff
../fonts/TTCommons-Medium.woff
```

- Output file contents:

```
@font-face {
	font-family: 'Brioso Pro';
	font-style: italic;
	font-weight: 600;
	src: local(''),
	url("../fonts/brioso_pro_v26-Italic Semibold.woff2") format("woff2"),
	url("../fonts/brioso_pro_v26-Italic Semibold.woff") format("woff");
	font-display: swap;
}
@font-face {
	font-family: 'TTCommons';
	font-style: normal;
	font-weight: 500;
	src: local(''),
	url("../fonts/TTCommons-Medium.woff2") format("woff2"),
	url("../fonts/TTCommons-Medium.woff") format("woff");
	font-display: swap;
}
```

---

## Features

- checks if CSS file already exists;
- creates folder for CSS file;
- prevents @font-face rules duplicates while processing fonts with same name (it could happen with same name fonts but different extensions);
- font-family is generated by excluding font-style, font-weight, font version (v9, v10, v25, etc) and language charset keywords from filename;
- possible font-style values: _italic, oblique, normal_;
- possible font-weight values: _100, 200, 300, 400, 500, 600, 700, 800, 900, 950_;
