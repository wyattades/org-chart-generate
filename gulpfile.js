const gulp = require('gulp');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const es = require('event-stream');

gulp.task('js', () => {
  const tasks = ['orgchart.js', 'orgchartCSV.js', 'orgchartDrupal7.js', 'orgchartDrupal8.js']
  .map((entry, i) => {
    return browserify('./src/' + entry, i < 2 ? { standalone: 'embedOrgChart' } : {})
      .bundle()
      .pipe(source(entry)) 
      .pipe(streamify(uglify()))
      .pipe(gulp.dest('./dist/'))
      .on('error', console.error);
  });

  return es.merge.apply(null, tasks);
});

gulp.task('css', () => {
  return gulp.src('./src/orgchart.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/'))
    .on('error', console.error);    
});

gulp.task('watch', () => {
  gulp.watch('./src/*', ['js', 'css']);
});

gulp.task('default', ['js', 'css']);
