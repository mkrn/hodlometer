
export const getMinX = data => data[0].time;

export const getMaxX = data => data[data.length - 1].time;

export const getMinY = data => data.reduce((min, p) => p.close < min ? p.close : min, data[0].close);

export const getMaxY = data => data.reduce((max, p) => p.close > max ? p.close : max, data[0].close);

export const getSvgX = (x, svgWidth, data) => ((x - getMinX(data)) / (getMaxX(data) - getMinX(data)) * svgWidth);

export const getSvgY = (y, svgHeight, data) => svgHeight - (y / getMaxY(data) * svgHeight);

// Split data into sectors by HODL / FODL periods
export const getSectors = (data) => {
  const sectors = [];
  let h = true;
  let start = 0;

  const hodldata = data.map(({ close, time, trailing}) =>
    ({ close, time, trailing, hodl: close >= trailing }));

  hodldata.forEach(({ close, time, trailing, hodl }, i) => {
    if (hodl !== h || i === hodldata.length - 1) {
      sectors.push(hodldata.slice(start, i+1));
      start = i;
      h = hodl;
    }
  });

  return sectors;
}

// Is sector HODL or FODL?
export const hodl = graph => {
  const { trailing, close } = graph[graph.length-1] || {};
  return close >= trailing;
}

// HODLing return
const getReturn = graph => (graph[graph.length - 1].close - graph[0].close) / graph[0].close;

export const hodlRevenue = graph => {
  if (!graph) return 0;
  if (!graph.length) return 0;
  return Math.round(getReturn(graph) * 100);
}

// Revenue with HODLometer
// All the bearish sectors (when direction guessed right) add up letting you buy more cryptocurrency
export const hodlometerRevenue = graph => {
  const sectors = getSectors(graph || []);
  const revenue = 100;

  const total = sectors.reduce((prev, sector) => {
    const h = sector[0].hodl;
    if (h)
      return prev + prev * getReturn(sector || [])
    else
      return prev;
  }, revenue) - revenue;
  return Math.round(total);
}

// Format cryptocurrency price to 8 digits after .
export const fix = num =>
  num ? parseFloat(parseFloat(num).toFixed(8)) : 0;

// Format USD price
export const fix2 = num =>
  num ? parseFloat(parseFloat(num).toFixed(2)) : 0;

// Legend text for given sector of data
export const getLegend = (sector, isLast) => {
  const first = sector[0];
  const last = sector[sector.length-1];
  const hodl = first.hodl;

  const part1 = hodl ?
    `Buy at ${first.close}` :
    `Sell at ${first.close}`;

  const part2 = hodl ?
    `Sell at ${last.close}` :
    `Buy back at ${last.close}`;

  const profit = Math.round((last.close - first.close)/first.close * 100);

  const part3 = hodl ?
    (profit > 0 ? `(${profit}% Profit)` : `(${-profit}% Loss)`) :
    (profit < 0 ? `(Prevented ${-profit}% Loss)` : '');

  return isLast ?
    `${part1}. Now ${last.close}` :
    `${part1}, ${part2} ${part3}`;
}

// Color for HODL and FODL
export const strokeColor = hodl => hodl ? '#28a745' : '#dc3545';
