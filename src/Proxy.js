const { createProxyMiddleware } = require('http-proxy-middleware');

// 웹소켓은 포트 번호에 맞게 번호를 설정하면 됩니다
module.exports = function(app) {
    app.use(
        '/websocket',
        createProxyMiddleware({
            target: 'http://1.220.247.76:8090',
            // target: 'http://3.36.105.162:8090',
            changeOrigin: true,
            ws: true,
        })
    );
    app.use(
        '/',
        createProxyMiddleware({
            target: 'http://localhost:8090',
            changeOrigin: true,
        })
    );
}