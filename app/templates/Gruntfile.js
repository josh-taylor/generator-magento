'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    php: {
      server: {
        options: {
          port: 9000,
          router: 'router.php',
          open: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-php');

  grunt.registerTask('serve', ['php']);
};
