module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['dist']
        },
        copy: {
            build: {
                expand: true,
                cwd: 'src/js',
                src: ['**/*.js'],
                dest: 'dist/'
            }
        },
        uglify: {
            build: {
                expand: true,
                cwd: 'dist/',
                src: ['**/*.js'],
                dest: 'dist/',
                ext: '.min.js',
                extDot: 'last'
            }
        },
        less: {
            build: {
                options: {
                    strictMath: true
                },
                src: 'src/less/base.less',
                dest: 'dist/<%= pkg.name %>.css'
            }
        },
        cssmin: {
            build: {
                files: [{
                        expand: true,
                        cwd: 'dist/',
                        src: ['*.css'],
                        dest: 'dist/',
                        ext: '.min.css'
                    }]
            }
        },
        usebanner: {
            build: {
                options: {
                    position: 'top',
                    linebreak: true,
                    banner: '/* ========================================================= \n' +
                            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                            ' * <%= pkg.homepage %>\n' +
                            ' * ========================================================= \n' +
                            ' * Copyright 2014 <%= pkg.author %>\n' +
                            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
                            ' * ========================================================= */\n'
                },
                files: {
                    src: ['dist/**/*.js', 'dist/**/*.css']
                }
            }
        },
		
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },
            files: ['src/**/*.js']
        }	
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');	
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.registerTask('default', ['jshint', 'clean', 'copy', 'uglify', 'less', 'cssmin', 'usebanner']);

};