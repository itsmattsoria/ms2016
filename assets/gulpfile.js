// Gulp setup for Start Here front end boilerplate

// Load required plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    critical = require('critical'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    runSequence  = require('run-sequence'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    svg2png = require('gulp-svg2png')

// File path vars
var paths = {
    scssSrc: 'sass/**/*.scss',
    imgSrc: 'images/**/*',
    svgSrc: 'svgs/*.svg'
}

// Setup browsersync
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "starthere.static"
    });
});

// Do the stuff!

// Sass compilation and output
gulp.task('styles', function() {
  return sass('sass/main.scss', { style: 'expanded' })
    .pipe(autoprefixer())
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

// Inline critical css
gulp.task('critical', function() {
  critical.generate({
      inline: true,
      base: '../',
      css: ['css/main.css'],
      src: 'index.html',
      dest: 'index.html',
      minify: true,
      width: 1300,
      height: 900
  });
});

// Javascript concatenation
gulp.task('scripts', function() {
  return gulp.src(['js/libs/*.js', 'js/main.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('site.js'))
    .pipe(gulp.dest('js/build'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js/build'))
    .pipe(browserSync.stream());
});

// Compress images (must run glulp images manually)
gulp.task('images', function() {
  return gulp.src(paths.imgSrc)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('images'))
    .pipe(browserSync.stream());
});

// SVG time!
gulp.task('svgs', function() {
  return gulp.src(paths.svgSrc)
    .pipe(svgmin({
        plugins: [{
            removeViewBox: false
        }, {
            removeEmptyAttrs: false
        }]
    }))
    .pipe(gulp.dest('svgs'))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename({suffix: '-defs'}))
    .pipe(gulp.dest('svgs/build'))
    .pipe(browserSync.stream());
});
// convert to png for fallback
gulp.task('svgfallback', function() {
  return gulp.src(paths.svgSrc)
    .pipe(svg2png())
    .pipe(gulp.dest('images'));
});

// Do the build
gulp.task('build', function(callback) {
  runSequence('styles',
              'scripts',
              ['images', 'svgs', 'svgfallback'],
              callback);
});

// Gulp watch
gulp.task('watch', function() {
  // Init BrowserSync
  browserSync.init({
    files: ['*.html', '*.php'],
    proxy: 'ms2016.static',
    notify: false,
  });
  // Kick it off with a build
  gulp.start('build');
  // Watch sass files
  gulp.watch(paths.scssSrc, ['styles']);
  // Watch js files
  gulp.watch(['js/libs/*.js', 'js/main.js'], ['scripts']);
  // Watch SVGs
  gulp.watch(paths.svgSrc, ['svgs', 'svgfallback']);
});

gulp.task('default', function() {
    gulp.start('build');
});