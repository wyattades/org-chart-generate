const gulp = require('gulp');
const plumber = require('gulp-plumber');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const es = require('event-stream');

let debug = false;

gulp.task('js', () => {
  const tasks = ['orgchart.js', 'orgchartCSV.js', 'orgchartDrupal7.js', 'orgchartDrupal8.js']
  .map((entry, i) => {
    let res = browserify('./src/' + entry, i < 2 ? { standalone: 'embedOrgChart' } : {})
      .bundle()
      .on('error', console.error)
      .pipe(source(entry));
    if (!debug) res = res.pipe(streamify(uglify()));
    res = res.pipe(gulp.dest('./dist/'));
    return res;
  });

  return es.merge.apply(null, tasks);
});

gulp.task('css', () => {
  return gulp.src('./src/orgchart.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {
  debug = true;
  gulp.start('js', 'css');
  gulp.watch('./src/*', ['js', 'css']);
});

gulp.task('default', ['js', 'css']);
