const child = require('child_process')
const fs = require('fs')
const gulp = require('gulp')
const yaml = require('js-yaml')


var appconfig = yaml.load(fs.readFileSync('appconfig.yml'))

gulp.task('scrap', done => {
  child.spawn('python', ['-u', './routine.py'], { cwd: appconfig.path.scraper, stdio: 'inherit' }).on('close', done)
})

gulp.task('classify', done => {
  child.spawn('python', ['-u', './routine_predict.py'], { cwd: appconfig.path.datamining, stdio: 'inherit' }).on('close', done)
})

gulp.task('extract-patterns', done => {
  child.spawn('python', ['-u', './routine_extract_patterns.py'], { cwd: appconfig.path.datamining, stdio: 'inherit' }).on('close', done)
})

gulp.task('default', gulp.series('scrap', 'classify', 'extract-patterns'))
