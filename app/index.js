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
  }, {
    type: 'confirm',
    name: 'includeUnitTest',
    message: 'Do you want to include EcomDevs PHPUnit module?',
    default: false
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
  this.tarball('http://www.magentocommerce.com/downloads/assets/' + self.magentoVersion + '/magento-' + self.magentoVersion + '.tar.gz', './', cb);
};

MagentoGenerator.prototype.permission = function permissions() {
  var cb = this.async(),
    self = this;

  wrench.chmodSyncRecursive('app/etc', 775);
  wrench.chmodSyncRecursive('media', 775);
  wrench.chmodSyncRecursive('var', 775);
}

MagentoGenerator.prototype.phpunit = function phpunit() {
  var cb = this.async(),
    self = this;

  if (self.includeUnitTest) {
    try {
      var version = exec('git ls-remote --tags git://github.com/EcomDev/EcomDev_PHPUnit.git | tail -n 1', function(err, stdout, stderr) {
        if (err) {
          cb()
        } else {
          var pattern = /\d\.\d[\.\d]*/ig,
            match = pattern.exec(stdout);

          if (match !== null && typeof match[0] !== 'undefined') {
            self.ecomdevPHPUnitVersion = match[0];
          }
        }

        cb()
      });
    } catch(e) {
      cb()
    }

    if (typeof self.ecomdevPHPUnitVersion !== "undefined") {
      this.tarball('https://github.com/EcomDev/EcomDev_PHPUnit  /tarball/' + self.ecomdevPHPUnitVersion, './', cb);
    }
  }
}
