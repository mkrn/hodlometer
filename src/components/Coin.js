import React, { Component, Fragment } from 'react';
import {
  Container,
  Row,
  Col,
  Tooltip,
} from 'reactstrap';

import LineChart from './LineChart';
import { hodl, hodlRevenue, hodlometerRevenue, fix, fix2 } from '../lib';

class Coin extends Component {
  state = { tooltipOpen: false }

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    })
  }

  render() {
    const { symbol, name, chart } = this.props;

    const loaded = !!chart.length;
    const isHodl = hodl(chart);
    const target = loaded && chart[chart.length - 1].trailing;
    // Format BTC or USD amounts properly
    const targetFormatted = symbol.indexOf('USD') > 0 ? fix2(target) : fix(target);
    const tooltipId = `target_${symbol}`;

    return (
      <Container style={{ marginTop: 40 }} key={symbol}>
        <Row>
          <Col>
            <h1>
              { loaded &&
                <span className={`badge ${isHodl ? 'badge-success' : 'badge-secondary'}`}>
                  { isHodl ? 'HODL': 'FODL' }
                </span>
              }
              { ' ' }
              { name }
            </h1>

            { loaded &&
              <Fragment>
                <p>
                  <span id={tooltipId}>
                    { isHodl ? 'Stop Loss': 'Buy back target' }: {targetFormatted}
                  </span>
                </p>
                <Tooltip
                  placement="right"
                  isOpen={this.state.tooltipOpen}
                  target={tooltipId}
                  toggle={this.toggle}
                >
                  <p>{ isHodl ? 'Sell': 'Buy back' } if day closes { isHodl ? 'below': 'above' } this price.</p>
                  <p>* Target can change if the {symbol} price { isHodl ? 'goes higher': 'falls further' }</p>
                </Tooltip>
              </Fragment>
            }

            <LineChart data={chart} />

            { loaded &&
              <p style={{ fontSize: '10px', textAlign: 'center' }}>
                { chart.length } days return:
                HODLing: { hodlRevenue(chart) }%,
                HODLometer: <strong>{ hodlometerRevenue(chart) }%</strong>
                { ' ' }
                (Data: {symbol} on Binance)
              </p>
            }
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Coin;
