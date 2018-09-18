const child = require('child_process')
const fs = require('fs')
const git = require('gulp-git')
const gulp = require('gulp')
const install = require("gulp-install")
const yaml = require('js-yaml')


const appconfig = yaml.load(fs.readFileSync('appconfig.yml'))

gulp.task('reset-api', done => {
  git.reset('origin/master', { args:'--hard', cwd: appconfig.path.api }, done)
})
gulp.task('reset-client', done => {
  git.reset('origin/master', { args:'--hard', cwd: appconfig.path.client }, done)
})

gulp.task('update-api', done => {
  git.pull('origin', 'master', { cwd: appconfig.path.api }, done)
})
gulp.task('update-client',  done => {
  git.pull('origin', 'master', { cwd: appconfig.path.client }, done)
})

gulp.task('install-dependencies-api', done => {
  gulp.src([appconfig.path.api + '/package.json']).pipe(install(done))
})
gulp.task('install-dependencies-client', done => {
  gulp.src([appconfig.path.client + '/package.json']).pipe(install(done))
})

gulp.task('build-client', done => {
  child.exec('npm.cmd run build', { cwd: appconfig.path.client }, done)
})
gulp.task('build-simple-client', done => {
  child.exec('npm.cmd run build:simple', { cwd: appconfig.path.client }, done)
})

gulp.task('start-api', done => {
  child.spawn('npm.cmd', ['start'], { cwd: appconfig.path.api, stdio: 'inherit' }).on('close', done)
})
gulp.task('start-client', done => {
  child.spawn('npm.cmd', ['start'], { cwd: appconfig.path.client, stdio: 'inherit' }).on('close', done)
})

gulp.task('default', gulp.series(
  gulp.parallel('reset-api', 'reset-client'),
  gulp.parallel('update-api', 'update-client'),
  gulp.parallel('install-dependencies-api', 'install-dependencies-client'),
  'build-client',
  gulp.parallel('start-api', 'start-client')
))

gulp.task('simple', gulp.series(
  gulp.parallel('reset-api', 'reset-client'),
  gulp.parallel('update-api', 'update-client'),
  gulp.parallel('install-dependencies-api', 'install-dependencies-client'),
  'build-simple-client',
  gulp.parallel('start-api', 'start-client')
))
