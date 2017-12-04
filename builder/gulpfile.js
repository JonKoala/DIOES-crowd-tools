var gulp = require('gulp')
var child = require('child_process')
var git = require('gulp-git')
var install = require("gulp-install")

var fs = require('fs')
var yaml = require('js-yaml')
var appconfig = yaml.load(fs.readFileSync('appconfig.yml'));

gulp.task('reset-api', done => {
  git.reset('origin/master', {args:'--hard', cwd: appconfig.path.api}, done);
});
gulp.task('reset-client', done => {
  git.reset('origin/master', {args:'--hard', cwd: appconfig.path.client}, done);
});

gulp.task('update-api', ['reset-api'],  done => {
  git.pull('origin', 'master', {cwd: appconfig.path.api}, done);
});
gulp.task('update-client', ['reset-client'],  done => {
  git.pull('origin', 'master', {cwd: appconfig.path.client}, done);
});

gulp.task('install-dependencies-api', ['update-api'], done => {
  gulp.src([appconfig.path.api + '/package.json']).pipe(install(done));
});
gulp.task('install-dependencies-client', ['update-client'], done => {
  gulp.src([appconfig.path.client + '/package.json']).pipe(install(done));
});

gulp.task('build-client', ['install-dependencies-client'], done => {
  child.exec('npm.cmd run build', {cwd: appconfig.path.client}, done);
});

gulp.task('start-api', ['install-dependencies-api'], done => {
  child.spawn('npm.cmd', ['start'], {cwd: appconfig.path.api, stdio: [0,1,2]}, streamProcess.bind(this, done));
});
gulp.task('start-client', ['build-client'], done => {
  child.spawn('npm.cmd', ['start'], {cwd: appconfig.path.client, stdio: [0,1,2]}, streamProcess.bind(this, done));
});
gulp.task('start-api-dev', done => {
  child.spawn('npm.cmd', ['start'], {cwd: appconfig.path.api, stdio: [0,1,2]}, streamProcess.bind(this, done));
});
gulp.task('start-client-dev', done => {
  child.spawn('npm.cmd', ['run', 'dev'], {cwd: appconfig.path.client, stdio: [0,1,2]}, streamProcess.bind(this, done));
});


function streamProcess(done, err, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
  done(err);
}


gulp.task('dev', [
  'start-api-dev',
  'start-client-dev'
]);

gulp.task('prod', [
  'reset-api',
  'reset-client',
  'update-api',
  'update-client',
  'install-dependencies-api',
  'install-dependencies-client',
  'build-client',
  'start-api',
  'start-client'
]);
