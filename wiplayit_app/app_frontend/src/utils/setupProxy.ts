const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('api/', { target: 'http://www.latiro.com:8000/' }))
  app.use(proxy('/sockjs-node/', { target: 'http://www.latiro.com:8000/' }))
  app.use(proxy('/socket.io/', { target: 'http://www.latiro.com:8000/' }))
}