import React, { Component, Fragment } from "react"
import { getSvgX, getSvgY, getSectors, getLegend, strokeColor } from '../../lib';
import "./styles.css"

const topMargin = 30;

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      legend: '',
      legendX: 20,
    };
  }

  setLegend = (sector, isLast, legendX, legendY) => {
    this.setState({
      legend: getLegend(sector, isLast),
      legendHodl: sector[0].hodl,
      legendX,
      legendY,
    });
  }

  makePath = (sector, data, isLast, i) => {
    const { svgWidth, svgHeight } = this.props;

    const first = sector[0];
    const middle = sector[Math.floor(sector.length/2)];
    const stroke = strokeColor(first.hodl);

    if (sector.length <= 0) return null;

    const { time: firstX, close: firstY } = first;

    const heightLessMargin = svgHeight - topMargin;

    const svgStartX = getSvgX(firstX, svgWidth, data);
    const svgEndX = getSvgX(sector[sector.length-1].time, svgWidth, data);
    const svgStartY = topMargin + getSvgY(firstY, heightLessMargin, data);
    const width = svgEndX - svgStartX;
    const legendX = svgStartX + width/2;
    const legendY = topMargin + getSvgY(middle.close, heightLessMargin, data)

    let pathD = "M " + svgStartX + " " + svgStartY + " ";

    pathD += sector.map(({ time, close }, i) => {
      return "L " + getSvgX(time, svgWidth, data) +
             " " + (topMargin + getSvgY(close, heightLessMargin, data)) + " ";
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
          onMouseOver={() => this.setLegend(sector, isLast, legendX, legendY)}
          onMouseOut={() => this.setState({ legend: '' })}
          style={{ fill: 'transparent' }}
        />
      </Fragment>
    );
  }

  render() {
    const { svgHeight, svgWidth, data } = this.props;
    const { legend, legendX, legendY, legendHodl } = this.state;
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

        {
          legend &&
            <line
              x1={legendX}
              y1="20"
              x2={legendX}
              y2={legendY}
              style={{
                stroke: strokeColor(legendHodl),
                pointerEvents: "none"
              }}
            />
        }
      </svg>
    );
  }
}
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  svgHeight: 90,
  svgWidth: 700
}

export default LineChart;
