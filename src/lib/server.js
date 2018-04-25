'use strict';

const http = require('http');
const cowsay = require('cowsay');
const bodyParser = require('./body-parser');
const faker = require('faker');

const server = module.exports = {};

const app = http.createServer((req, res) => {
  bodyParser(req)
    .then((parsedRequest) => {
      // 1. First thing we need to is write status head to headers
      // 2. Next, we write response body
      // 3. Finally, we need to END the response

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<!DOCTYPE html><html><head><title>My Cowsay API page</title></head><body><header><nav><ul><li><a href="/cowsay">link to cowsay</a></li></ul></nav></header><main>This here lies the project description</main></body></html>`);
        // REMEMBER TO END THINGS!!
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/cowsay') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let replacementText;
        if (parsedRequest.url.query.text) {
          replacementText = parsedRequest.url.query.text;
        } else {
          replacementText = faker.random.words();
        }
        const cowsayText = cowsay.say({ text: replacementText });
        res.write(`<!DOCTYPE html><html><head><title>Cowsay Path</title><body><h1>cowsay</h1><pre>${cowsayText}</pre></body></html>`);
        res.end();
        return undefined;
      }

      // GET API
      if (parsedRequest.method === 'GET' && parsedRequest.url.pathname === '/api/cowsay') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // res.write(JSON.stringify(content));
        res.end();
        return undefined;
      }

      if (parsedRequest.method === 'POST' && parsedRequest.url.pathname === '/echo') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(parsedRequest.body));
        res.end();
        return undefined;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('NOT FOUND');
      res.end();
      return undefined;
    })
    .catch((err) => {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('BAD REQUEST', err);
      res.end();
      return undefined;
    });
});

server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);
