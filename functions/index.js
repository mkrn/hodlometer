'use strict';var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const functions = require('firebase-functions');
const { default: Binance } = require('binance-api-node');
const cors = require('cors')({
  origin: true });


const atrs = require('./lib/atrs.js');

const client = Binance();


// The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');
// admin.initializeApp();


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.cacheCoin = functions.https.onRequest((req, res) => {
  return cors(req, res, (0, _asyncToGenerator3.default)(function* () {
    const { symbol } = req.query;

    // 1) Download daily OHLC data from Binance
    const data = yield client.candles({ symbol, interval: '1d', limit: 1000 });
    //  data is sorted by old -> new
    // console.log(data);

    const closes = data.map(function (c) {return Number(c.close);});
    const highs = data.map(function (c) {return Number(c.high);});
    const lows = data.map(function (c) {return Number(c.low);});
    const openTimes = data.map(function (c) {return Number(c.openTime);});

    // 2) calculate ATR
    atrs(highs, lows, closes, openTimes, function (err, a) {
      if (err) {
        return res.status(500).send(err);
      }

      // 3) Return JSON: array of all closes, hodl events

      res.status(200).send(a);
    });
  }));
});