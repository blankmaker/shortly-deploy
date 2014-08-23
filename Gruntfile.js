module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      clientApp: {
        src: ['public/client/*.js'],
        dest: 'public/dist/prodClient.js'
      },

      libraries: {
        src: ['public/lib/underscore.js','public/lib/jquery.js','public/lib/backbone.js', "public/lib/handlebars.js"],
        dest: 'public/dist/prodLib.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    uglify: {
      dist: {
        files: {
          'public/dist/prodClient.min.js': ['public/dist/prodClient.js'],
          'public/dist/prodLib.min.js': ['public/dist/prodLib.js']
        }
      }
    },

    jshint: {
      files: ['app/**/*.js', 'lib/**/*.js', 'public/**/*.js', 'test/**/*.js', 'Gruntfile.js', 'server-config.js', 'server.js' ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/dist/prodCSS.min.css': ['public/style.css']
        }
      }
    },

     nodemon: {
      dev: {
        script:'server.js'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify',
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      deploy: {
        command: 'grunt build'
      },
      prod: {
        command: 'git push azure master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('default', [
    'mochaTest', 'concat', 'jshint', 'nodemon'
  ]);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('smush', [
    'concat'
  ]);

  grunt.registerTask('unpretty', [
    'uglify:dist'
  ]);

  grunt.registerTask('syntax', [
    'jshint'
  ]);

  grunt.registerTask('minifyCSS', [
    'cssmin'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'jshint',
    'cssmin'
  ]);



  grunt.registerTask('deploy', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run([ 'shell:prod' ]);
    } else {
      grunt.task.run([ 'shell:deploy' ]);
    }
  });


};
