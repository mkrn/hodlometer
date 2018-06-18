import React, {Component} from "react"
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

  return isLast ? part1 : `${part1}, ${part2}`;
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

  makePath = (sector, data, isLast) => {
    const { svgWidth, svgHeight } = this.props;

    const first = sector[0];
    const stroke = first.hodl ? '#28a745' : '#dc3545'; //  grey '#6c757d'

    if (sector.length <= 0) return null;

    const { time: firstX, close: firstY } = first;

    const svgStartX = getSvgX(firstX, svgWidth, data);
    const svgStartY = getSvgY(firstY, svgHeight, data);

    let pathD = "M " + svgStartX + " " + svgStartY + " ";

    pathD += sector.map(({ time, close }, i) => {
      return "L " + getSvgX(time, svgWidth, data) + " " + getSvgY(close, svgHeight, data) + " ";
    });

    return (
      <path
        className="linechart_path"
        d={pathD}
        style={{ stroke }}
        onMouseOver={() => this.setLegend(sector, isLast, svgStartX)}
        onMouseOut={() => this.setState({ legend: '' })}
      />
    );
  }

  render() {
    const { svgHeight, svgWidth, data } = this.props;
    const { legend, legendX } = this.state;
    const sectors = getSectors(data);

    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>

        {
          sectors.map((sector, i) => this.makePath(sector, data, i === (sectors.length - 1)))
        }
        <text x={legendX} y="15" class="LineChart_smallLegend">{ legend }</text>
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
