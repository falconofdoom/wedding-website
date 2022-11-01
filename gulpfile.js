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

gulp.task('lib', function () {
  var animateCSS = 'node_modules/animate.css';
  var fontAwesome = 'node_modules/font-awesome';
  var waypoints = 'node_modules/waypoints';
  var jqueryEasing = 'node_modules/jquery.easing';
  var animateCSSStream = gulp.src([`${animateCSS}/**/*`]).pipe(gulp.dest(`./dist/${animateCSS}`));
  var fontAwesomeStream = gulp.src([`${fontAwesome}/**/*`]).pipe(gulp.dest(`./dist/${fontAwesome}`));
  var waypointsStream = gulp.src([`${waypoints}/**/*`]).pipe(gulp.dest(`./dist/${waypoints}`));
  var jqueryEasingStream = gulp.src([`${jqueryEasing}/**/*`]).pipe(gulp.dest(`./dist/${jqueryEasing}`));

  return mergeStream(animateCSSStream, fontAwesomeStream, waypointsStream, jqueryEasingStream);
});

// default task
gulp.task("default", gulp.series("sass", "minify-js", "lib"));
