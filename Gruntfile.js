module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      main: {
        files: {
          'css/app.min.css': [
            'bower_components/ionic/release/css/ionic.min.css',
            'bower_components/angular-busy/dist/angular-busy.css',
            'css/build/app.css'
          ]
        }
      }
    },
    concat: {
      main: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/ionic/release/js/ionic.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-ui-router/release/angular-ui-router.js',
          'bower_components/ionic/release/js/ionic-angular.js',
          'bower_components/angular-audio-playlist/dist/angular-audio-player.js',
          'bower_components/angular-media-player/dist/angular-media-player.js',
          'bower_components/angular-busy/dist/angular-busy.js',
          'js/build/app.js',
          'js/build/services.js',
          'js/build/controllers.js'
        ],
        dest: 'js/app.min.js'
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['bower_components/ionic/release/fonts/*'],
            dest: 'fonts/',
            filter: 'isFile'
          }
        ]
      }
    },
    uglify: {
      main: {
        files: {
          'js/app.min.js': 'js/app.min.js',
        }
      }
    },
    watch: {
      stylesheets: {
        files: 'css/build/app.css',
        tasks: ['cssmin']
      },
      scripts: {
        files: 'js/build/*.js',
        tasks: ['concat']
        //tasks: ['concat', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['cssmin', 'concat', 'copy', 'uglify']);

};