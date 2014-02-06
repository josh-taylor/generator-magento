'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    php: {
      server: {
        options: {
          port: 8000,
          router: 'router.php'
        }
      }
    },

    watch: {<% if (includeCompass) { %>
      compass: {
        files: ['skin/frontend/<%= designPackage %>/default/scss/{,**/}*.scss'],
        tasks: ['compass:server']
      },
      <% } %>livereload: {
        options: {
          livereload: true,
        },
        files: [
          'app/design/frontend/<%= designPackage %>/default/{layout,template}/{,**/}*.{xml,phtml}',
          'skin/frontend/<%= designPackage %>/default/css/{,*/}*.css'
        ]
      }
    }<% if (includeCompass) { %>,

    compass: {
      options: {
        sassDir: 'skin/frontend/<%= designPackage %>/default/scss',
        cssDir: 'skin/frontend/<%= designPackage %>/default/css',
        generatedImagesDir: 'skin/frontend/<%= designPackage %>/default/images/generated',
        imagesDir: 'skin/frontend/<%= designPackage %>/default/images',
        javascriptsDir: 'skin/frontend/<%= designPackage %>/default/js',
        fontsDir: 'skin/frontend/<%= designPackage %>/default/fonts',
        importPath: 'js/vendor',
        relativeAssets: true,
        assetCacheBuster: false
      },
      server: {
        options: {
          debugInfo: false
        }
      }
    }<% } %>
  });

  grunt.loadNpmTasks('grunt-php');
  grunt.loadNpmTasks('grunt-contrib-watch');<% if (includeCompass) { %>
  grunt.loadNpmTasks('grunt-contrib-compass');
  <% } %>

  grunt.registerTask('serve', [<% if (includeCompass) { %>'compass:server', <% } %>'php', 'watch']);
};
