const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/v3", {
      target: "https://api.yelp.com", // API endpoint 1
      changeOrigin: true,
      // pathRewrite: {
      //   "^/places/api": "/v3", // remove base path
      // },

      headers: {
        Authorization: `Bearer y3s9ZkkmoGS-H-lv4qMC8gZCWAPun7GEn8tiEzL8EiTR9_3EYYQuOWmzKTjbiQsDnfmvHOZL-MX1lj-kkvnK0oqLWdIWKYXftJSyFC_bVDIpT3ZkxvzOoRmtsmluYXYx`,
        Connection: "keep-alive",
      },
    })
  );
  app.use(
    createProxyMiddleware("/reviews", {
      target: "http://06f8-35-205-106-249.ngrok.io", // API endpoint 2
      changeOrigin: true,

      headers: {
        Connection: "keep-alive",
      },
    })
  );
};
