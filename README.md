# Magento Generator [![Build Status](https://travis-ci.org/josh-taylor/generator-magento.png?branch=0.3.0)](https://travis-ci.org/josh-taylor/generator-magento)

A yeoman generator for starting a Magento project. Still quite early in development, but usable.

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-magento`
- Run: `yo magento`

## Features
- Compass support
- Option to install Twitter Bootstrap (Either LESS or SASS)
- Use `grunt serve` to automatically build compass files and start a [php cli server](http://www.php.net/manual/en/features.commandline.webserver.php) (Navigate to http://127.0.0.1:8000).
- Automatically set the required permissions for a Magento installation

## Roadmap

- [] Use github clone of Magento repository instead of tarball
- [] Use `bootstrap-sass-official` instead of unofficial version

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)
