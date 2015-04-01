'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var camelcase = require('lodash.camelcase');
var kebabcase = require('lodash.kebabcase');
var trim = require('lodash.trim');

var Promise = require('bluebird');

var exec = Promise.promisify(require('child_process').exec);
var gitConfig = Promise.promisify(require('git-config'));
var fs = require('fs');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the super-duper ' + chalk.red('Es6NodeBoilerplate') + ' generator!'
    ));

    Promise.all([gitConfig(), exec('npm whoami').catch(function(e) {
      console.error('Error getting npm user name: run `npm login`');
      console.error(e);
    })])
    .then(function(args) {
      this.config = args[0];
      this.username = trim(args[1][0]);
      this._showPrompts(done);
    }.bind(this));
  },

  _showPrompts: function(done) {
    var prompts = [{
      type: 'input',
      name: 'user',
      message: 'What is your github username/organization?',
      default: this.username
    }, {
      type: 'input',
      name: 'repo',
      message: 'What is your repo/projects name?',
      default: kebabcase(this.appname)
    }, {
      type: 'input',
      name: 'description',
      message: 'What is a description of this project? (eg. A nice module.)'
    }, {
      type: 'input',
      name: 'author',
      message: 'Who is the author of this project?',
      default: this.config.user.name + ' <' + this.config.user.email + '>'
    }, {
      type: 'input',
      name: 'tags',
      message: 'Are there any tags for your package (e.g. cure for world hunger, million dollar idea)'
    }];

    this.prompt(prompts, function(props) {
      this.user = props.user;
      this.repo = props.repo;
      this.description = props.description;
      this.author = props.author;
      this.tags = JSON.stringify(props.tags ? props.tags.split(',').map(trim) : []);
      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      var root = this.sourceRoot();
      fs.readdirSync(root).forEach(function(p) {
        if (fs.lstatSync(path.join(root, p)).isFile()) {
          this.template(p, p);
        }
      }, this);
      this.directory('test');
      this.directory('src');
    }
  },

  install: function() {
    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: this.options['skip-install']
    });
  }
});
