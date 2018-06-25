import React, { Component, Fragment } from "react"
import { getSvgX, getSvgY, getSectors } from '../../lib';
import "./styles.css"

const getLegend = (sector, isLast) => {
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

  return isLast ? part1 : `${part1}, ${part2} ${part3}`;
}

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      legend: '',
      legendX: 20,
    };
  }

  setLegend = (sector, isLast, legendX) => {
    this.setState({
      legend: getLegend(sector, isLast),
      legendX,
    });
  }

  makePath = (sector, data, isLast, i) => {
    const { svgWidth, svgHeight } = this.props;

    const first = sector[0];
    const stroke = first.hodl ? '#28a745' : '#dc3545'; //  grey '#6c757d'

    if (sector.length <= 0) return null;

    const { time: firstX, close: firstY } = first;

    const svgStartX = getSvgX(firstX, svgWidth, data);
    const svgEndX = getSvgX(sector[sector.length-1].time, svgWidth, data);
    const svgStartY = getSvgY(firstY, svgHeight, data);
    const width = svgEndX - svgStartX;
    const legendX = svgStartX + width/2;

    let pathD = "M " + svgStartX + " " + svgStartY + " ";

    pathD += sector.map(({ time, close }, i) => {
      return "L " + getSvgX(time, svgWidth, data) + " " + getSvgY(close, svgHeight, data) + " ";
    });

    return (
      <Fragment key={i}>
        <path
          className="linechart_path"
          d={pathD}
          style={{ stroke, pointerEvents: "none" }}
        />
        <rect
          id={`rect_${i}`}
          x={svgStartX}
          y="0"
          width={width}
          height={svgHeight}
          onMouseOver={() => this.setLegend(sector, isLast, legendX)}
          onMouseOut={() => this.setState({ legend: '' })}
          style={{ fill: 'transparent' }}
        />
      </Fragment>
    );
  }

  render() {
    const { svgHeight, svgWidth, data } = this.props;
    const { legend, legendX } = this.state;
    const sectors = getSectors(data);
    const textAnchor = (legendX < svgWidth / 2) ? 'start' : 'end';

    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>

        {
          sectors.map((sector, i) => this.makePath(sector, data, i === (sectors.length - 1), i))
        }
        <text
          x={legendX}
          y="15"
          className="LineChart_smallLegend"
          style={{ textAnchor }}
        >{ legend }</text>
      </svg>
    );
  }
}
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  svgHeight: 75,
  svgWidth: 700
}

export default LineChart;
