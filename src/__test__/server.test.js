'use strict';

const server = require('../lib/server');
const superagent = require('superagent');
const cowsay = require('cowsay');

beforeAll(() => server.start(5000));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('GET /', () => {
    it('should response with a status 200', () => {
      return superagent.get(':5000/')
        .then((res) => {
          expect(res.status).toEqual(200);
        });
    });
  });

  describe('GET /cowsay', () => {
    const fakeCow = cowsay.say({ text: 'Hola Terra' });
    const fakeHtml = `<section><h3><a href="/">Click here to return home</a></h3><pre>${fakeCow}</pre></section>`;
    test('should respond with status 200 and return cow HTML', () => {
      return superagent.get(':5000/cowsayPage')
        .query({ text: 'Hello World' })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toEqual(fakeHtml);
        });
    });
  });

  describe.skip('POST /echo', () => {
    it('should return status 200 for successful post', () => {
      return superagent.post(':5000/echo')
        // .set('Content-Type', 'application/json')
        .send({ name: 'judy' })
        .then((res) => {
          expect(res.body.name).toEqual('judy');
          expect(res.status).toEqual(200);
        });
    });
  });
});

describe.skip('INVALID request to the API', () => {
  describe('GET /cowsay', () => {
    it('should err out with 400 status code for not sending text in query', () => {
      return superagent.get(':5000/cowsayPage')
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});
