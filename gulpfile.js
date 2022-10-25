"use strict";

var gulp = require("gulp");
var sass = require('gulp-sass')(require('sass'));

const terser = require('gulp-plugin-terser');
var rename = require("gulp-rename");
var mergeStream = require('merge-stream');

const options = {
  suffix: '.min.js',
  terserOptions: {
    output: {
      comments: false
    }
  }
};


// compile scss to css
gulp.task("sass", function () {
  var mainStyles = gulp
    .src("./sass/styles.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ basename: "styles.min" }))
    .pipe(gulp.dest("./css"));
  var rsvpFormStyles = gulp
    .src("./sass/rsvp-form.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ basename: "rsvp-form.min" }))
    .pipe(gulp.dest("./css"));

  return mergeStream(mainStyles, rsvpFormStyles);
});

// watch changes in scss files and run sass task
gulp.task("sass:watch", function () {
  gulp.watch("./sass/**/*.scss", ["sass"]);
});

// minify js
gulp.task("minify-js", function () {
    var scriptsJS = gulp
    .src("./js/scripts.js")
    .pipe(terser(options))
    .pipe(rename({ basename: "scripts.min" }))
    .pipe(gulp.dest("./js"));

    var rsvpFormJS = gulp
    .src("./js/rsvp-form.js")
    .pipe(terser(options))
    .pipe(rename({ basename: "rsvp-form.min" }))
    .pipe(gulp.dest("./js"));
  
    return mergeStream(scriptsJS, rsvpFormJS);
});

// default task
gulp.task("default", gulp.series("sass", "minify-js"));
