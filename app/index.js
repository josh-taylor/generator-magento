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
    message: 'What version do you want to use?',
    default: '1.8.1.0'
  }];

  this.prompt(prompts, function (props) {
    this.magentoVersion = props.magentoVersion;

    cb();
  }.bind(this));
};

MagentoGenerator.prototype.app = function app() {
  this.copy('_gitignore', '.gitignore');
  this.copy('_bower.json', 'bower.json');
  this.copy('_package.json', 'package.json');
  this.copy('bowerrc', '.bowerrc');
};

MagentoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

MagentoGenerator.prototype.download = function download() {
  var cb = this.async();

  this.tarball('http://www.magentocommerce.com/downloads/assets/' + this.magentoVersion + '/magento-' + this.magentoVersion + '.tar.gz', './', cb);
};
