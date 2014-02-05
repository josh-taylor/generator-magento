/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


describe('magento generator', function () {
  this.timeout(120000);

  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('magento:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      '.jshintrc',
      '.editorconfig',
      '.gitignore',
      'package.json',
      'bower.json',
      'app/design/frontend/testpackage/default/',
      'app/design/frontend/testpackage/default/template/',
      'app/design/frontend/testpackage/default/layout/',
      'skin/frontend/testpackage/default/'
    ];

    helpers.mockPrompt(this.app, {
      magentoVersion: '1.8.0.0',
      designPackage: 'testpackage'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
