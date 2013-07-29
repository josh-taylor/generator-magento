'use strict';
var util = require('util');
var path = require('path');
var wrench = require('wrench');
var yeoman = require('yeoman-generator');


var MagentoGenerator = module.exports = function MagentoGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MagentoGenerator, yeoman.generators.Base);

MagentoGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'magentoVersion',
    message: 'What version do you want to use? (e.g. 1.7.0.2)',
    default: '1.7.0.2'
  }, {
    type:'confirm',
    name: 'includeGitignore',
    message: 'Do you want to include the default .gitignore file?',
    default: true,
  }];

  this.prompt(prompts, function (props) {
    this.magentoVersion = props.magentoVersion;
    this.includeUnitTest = props.includeUnitTest;

    cb();
  }.bind(this));
};

MagentoGenerator.prototype.app = function app() {
  var cb = this.async(),
    self = this;

  this.copy('_gitignore', '.gitignore');
  this.copy('_bower.json', 'bower.json');
  this.copy('_package.json', 'package.json');

  this.tarball('http://www.magentocommerce.com/downloads/assets/' + self.magentoVersion + '/magento-' + self.magentoVersion + '.tar.gz', './', cb);
};

MagentoGenerator.prototype.permission = function permissions() {
  var cb = this.async(),
    self = this;

  wrench.chmodSyncRecursive('app/etc', 775);
  wrench.chmodSyncRecursive('media', 775);
  wrench.chmodSyncRecursive('var', 775);
}
