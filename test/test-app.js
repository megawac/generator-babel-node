'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs');
var readdirSync = require('recursive-readdir-sync');

describe('es6-node-boilerplate:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({
        someOption: true
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    assert.file([
      '.editorconfig',
      '.gitignore',
      '.jscsrc',
      '.jshintrc',
      '.travis.yml',
      'LICENSE',
      'README.md',
      'gulpfile.js',
      'package.json',
      'test/.jshintrc'
    ]);
  });
});
