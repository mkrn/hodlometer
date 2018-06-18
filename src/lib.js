
export const getMinX = data => data[0].time;

export const getMaxX = data => data[data.length - 1].time;

export const getMinY = data => data.reduce((min, p) => p.close < min ? p.close : min, data[0].close);

export const getMaxY = data => data.reduce((max, p) => p.close > max ? p.close : max, data[0].close);

export const getSvgX = (x, svgWidth, data) => ((x - getMinX(data)) / (getMaxX(data) - getMinX(data)) * svgWidth);

export const getSvgY = (y, svgHeight, data) => svgHeight - (y / getMaxY(data) * svgHeight);

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

export const hodl = graph => {
  const { trailing, close } = graph[graph.length-1] || {};
  return close >= trailing;
}

const getReturn = graph => (graph[graph.length - 1].close - graph[0].close) / graph[0].close;

export const hodlRevenue = graph => {
  if (!graph) return 0;
  if (!graph.length) return 0;
  return Math.round(getReturn(graph) * 100);
}

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