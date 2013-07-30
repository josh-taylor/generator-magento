var util = require('util');
var path = require('path');
var wrench = require('wrench');
var yeoman = require('yeoman-generator');
var mysql = require('mysql');
var exec = require('child_process').exec;

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
    name: 'mysqlHost',
    message: 'MySQL Host',
    default: 'localhost'
  }, {
    name: 'mysqlUser',
    message: '      Username',
    default: 'root'
  }, {
    name: 'mysqlPassword',
    message: '      Password'
  }, {
    name: 'mysqlDatabase',
    message: '      Database',
    default: 'magento'
  }, {
    type: 'confirm',
    name: 'installSampleData',
    message: 'Install sample data?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.magentoVersion = props.magentoVersion;
    this.includeUnitTest = props.includeUnitTest;

    this.mysqlHost = props.mysqlHost;
    this.mysqlUsername = props.mysqlUser;
    this.mysqlPassword = props.mysqlPassword;
    this.mysqlDatabase = props.mysqlDatabase;

    this.installSampleData = props.installSampleData;

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

  wrench.chmodSyncRecursive('app/etc', 0775);
  wrench.chmodSyncRecursive('media', 0775);
  wrench.chmodSyncRecursive('var', 0775);

  cb();
}

MagentoGenerator.prototype.sampleData = function sampleData() {
  var cb = this.async(),
    self = this;

  if (this.installSampleData) {
    this.tarball('http://www.magentocommerce.com/downloads/assets/1.6.1.0/magento-sample-data-1.6.1.0.tar.gz', 'tmp', function() {
      // Copy sample product images across
      wrench.copyDirSyncRecursive('tmp/media', 'media/');

      // Setup connection and if database doesn't exist, create it
      var connection = mysql.createConnection({
        host: self.mysqlHost,
        user: self.mysqlUsername,
        password: self.mysqlPassword
      });
      connection.connect();
      connection.query('CREATE DATABASE IF NOT EXISTS `' + self.mysqlDatabase + '`');

      // Import the MySQL file
      var mysqlCommand = 'mysql -u ' + self.mysqlUsername;
      if (self.mysqlPassword != '') {
        mysqlCommand += ' -p' + self.mysqlPassword;
      }
      mysqlCommand += ' ' + self.mysqlDatabase + ' < tmp/magento_sample_data_for_1.6.1.0.sql';
      exec(mysqlCommand, function(err, stdout, stderr) {
        if (err) {
          throw err;
        }
        wrench.rmdirSyncRecursive('tmp');
        cb();
      });
    });
  } else {
    cb();
  }
}
