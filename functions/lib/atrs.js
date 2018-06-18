const _ = require('lodash');
const talib = require('talib');

const period = 5;
const k = 2;

module.exports = (high, low, closes, times, cb) => {
  talib.execute({
    name: 'ATR',
    high,
    close: closes,
    low,
    startIdx: 0,
    endIdx: closes.length - 1,
    optInTimePeriod: period
  }, (err, result) => {
    if (err) {
      return cb(err);
    }

    // console.log(result);
    const atrsOut = result.result.outReal;

    const line = [];

    closes.forEach((close, i) => {
      const time = times[i];

      if (i < period) {
        line.push({ time, trailing: 0, close });
        return;
      }
      const atr = atrsOut[i - period];
      const nLoss = atr * k;
      const prevClose = closes[i-1];
      const { trailing: prevTrailing } = line[i-1];

      // Conditions:
      const stayAbove = (close > prevTrailing) && (prevClose > prevTrailing);
      const stayBelow = (close < prevTrailing) && (prevClose < prevTrailing);
      const closeAbove = close > prevTrailing;

      const trailing = stayAbove ? Math.max(prevTrailing, close - nLoss) :
        (stayBelow ? Math.min(prevTrailing, close + nLoss) :
          (closeAbove ? close - nLoss : close + nLoss));

      line.push({ time, trailing, close });
    });

    return cb(null, line);
  });
}