const gulp = require('gulp');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const es = require('event-stream');

gulp.task('js', () => {
  const tasks = ['orgchart.js', 'orgchartCSV.js']
  .map(entry => {
    return browserify('./src/' + entry, { standalone: 'embedOrgChart' })
      .bundle()
      .pipe(source(entry)) 
      .pipe(streamify(babel({
        presets: ['env', 'stage-0'],
      })))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest('./dist/'))
      .on('error', err => console.error(err));
  });

  return es.merge.apply(null, tasks);
});

gulp.task('css', () => {
  return gulp.src('./src/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js', 'css']);
