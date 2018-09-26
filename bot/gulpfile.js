const child = require('child_process')
const fs = require('fs')
const gulp = require('gulp')
const yaml = require('js-yaml')


const appconfig = yaml.load(fs.readFileSync('appconfig.yml'))
var pythonCommand = ''
switch (process.platform) {
  case 'win32':
    pythonCommand = 'python'
    break;
  case 'linux':
    pythonCommand = 'python3'
}

gulp.task('scrap', done => {
  child.spawn(pythonCommand, ['-u', './routine.py'], { cwd: appconfig.path.scraper, stdio: 'inherit' }).on('close', done)
})

gulp.task('classify', done => {
  child.spawn(pythonCommand, ['-u', './routine_predict.py'], { cwd: appconfig.path.datamining, stdio: 'inherit' }).on('close', done)
})

gulp.task('extract-patterns', done => {
  child.spawn(pythonCommand, ['-u', './routine_extract_patterns.py'], { cwd: appconfig.path.datamining, stdio: 'inherit' }).on('close', done)
})

gulp.task('default', gulp.series('scrap', 'classify', 'extract-patterns'))
