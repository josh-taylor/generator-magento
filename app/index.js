'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var wrench = require('wrench');

var MagentoGenerator = module.exports = function MagentoGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MagentoGenerator, yeoman.generators.NamedBase);

MagentoGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'magentoVersion',
    message: 'What version do you want to use?',
    default: '1.9.0.0'
  },{
    name: 'designPackage',
    message: 'Name of design package to create',
    default: 'custom'
  },{
    type: 'checkbox',
    name: 'features',
    message: 'What would you like to include?',
    choices: [{
      name: 'Sass with Compass',
      value: 'includeCompass',
      default: true
    },{
      name: 'Twitter Bootstrap',
      value: 'includeBootstrap',
      default: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var features = props.features;
    this.magentoVersion = props.magentoVersion;
    this.designPackage = props.designPackage;

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }

    this.includeCompass = hasFeature('includeCompass');
    this.includeBootstrap = hasFeature('includeBootstrap');

    cb();
  }.bind(this));
};

MagentoGenerator.prototype.app = function app() {
  this.copy('_gitignore', '.gitignore');
  this.template('_bower.json', 'bower.json');
  this.template('_package.json', 'package.json');
  this.copy('bowerrc', '.bowerrc');
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.copy('router.php', 'router.php');
};

MagentoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

MagentoGenerator.prototype.download = function download() {
  var cb = this.async(),
    url = 'https://github.com/speedupmate/Magento-CE-Mirror/archive/magento-ce-' + this.magentoVersion + '.tar.gz';

  this.tarball(url, './', function(err) {
    if (err) return done(err);
    cb();
  });
};

MagentoGenerator.prototype.createBlankDesignPackage = function createBlankDesignPackage() {
  var designPath = 'app/design/frontend/' + this.designPackage,
    skinPath = 'skin/frontend/' + this.designPackage;

  this.mkdir(designPath);
  this.mkdir(designPath + '/default');
  this.mkdir(designPath + '/default/layout');
  this.mkdir(designPath + '/default/template');

  this.mkdir(skinPath);
  this.mkdir(skinPath + '/default');
  this.mkdir(skinPath + '/default/scss');
  this.mkdir(skinPath + '/default/images');
  this.mkdir(skinPath + '/default/css');
  this.mkdir(skinPath + '/default/fonts');

  this.mkdir('js/vendor');
};

MagentoGenerator.prototype.permissions = function permissions() {
  wrench.chmodSyncRecursive('app/etc', '777');
  wrench.chmodSyncRecursive('media', '777');
  wrench.chmodSyncRecursive('var', '777');
};
