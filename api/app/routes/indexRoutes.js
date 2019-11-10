const packageJson = require('../../package.json');

module.exports = app => {
  app.route('/').get((_req, res) => {
    return res.send({
      success: true,
      status: 200,
      message: 'OK',
      data: {
        serverStatus: 'online',
        version: packageJson.version
      }
    });
  });
};
