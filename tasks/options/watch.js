module.exports = () => ({
  src: {
    files: 'lib/**/*.js',
    tasks: ['test'],
  },
  test: {
    files: 'test/**/*.*',
    tasks: ['test'],
  },
});
