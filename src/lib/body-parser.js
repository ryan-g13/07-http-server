'use strict';

const url = require('url');
const queryString = require('querystring');

module.exports = function bodyParser(req) {
  // console.log(req, 'WHAT IS REQUEST????');
  return new Promise((resolve, reject) => {
    req.url = url.parse(req.url); // setting the request url property to the parsed url
    req.url.query = queryString.parse(req.url.query); // using queryString to parse the query 
    // portion of the url


    // test to see if request is a GET request, if it is returns the resolve with the request
    if (req.method !== 'POST' && req.method !== 'PUT') {
      return resolve(req);
    }

    // if the request has data we append to the string message 
    let message = '';
    req.on('data', (data) => {
      message += data.toString();
    });

    
    req.on('end', () => {
      try {
        req.body = JSON.parse(message);
        return resolve(req);
      } catch (err) {
        return reject(err);
      }
    });

    req.on('error', err => reject(err));
    return undefined;
  });
};
