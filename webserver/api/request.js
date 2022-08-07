const http = require('http');
/**
 * @param {string} host
 * @param {number} port
 * @param {string} path
 * @param {Object|Map|object} query
 * @param {string} method
 * @param {http.RequestListener} result
 */
module.exports = function (host, port, path, query, method, result) {
    query = new URLSearchParams(query).toString()
    if (query != "") query = "?" + query;
    if (path.endsWith('/')) path = path.substring(0, path.length - 1);
    console.log(`http://${host}:${port}${path}${query}`);
    http.request(`http://${host}:${port}${path}${query}`, {
        method: method.toUpperCase()
    }, (res) => result(res)).end()
}