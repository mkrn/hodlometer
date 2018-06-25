import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';

import LineChart from './components/LineChart';
import SubscribeForm from './components/SubscribeForm';
import { hodl, hodlRevenue, hodlometerRevenue, fix, fix2 } from './lib';
import 'bootstrap/dist/css/bootstrap.css';

// TOP 10 Coins
const coins = [
  {
    symbol: 'BTCUSDT', name: 'Bitcoin'
  },
  {
    symbol: 'ETHBTC', name: 'Ethereum'
  },
  {
    symbol: 'XRPBTC', name: 'Ripple'
  },
  {
    symbol: 'BCCBTC', name: 'Bitcoin Cash'
  },
  {
    symbol: 'EOSBTC', name: 'EOS'
  },
  {
    symbol: 'LTCBTC', name: 'Litecoin'
  },
  {
    symbol: 'XLMBTC', name: 'Stellar'
  },
  {
    symbol: 'ADABTC', name: 'Cardano'
  },
  {
    symbol: 'IOTABTC', name: 'IOTA'
  },
  {
    symbol: 'TRXBTC', name: 'Tron'
  }
];

const Explain = ({ children, title, isOpen, toggle }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>{ title }</ModalHeader>
    <ModalBody>
      { children }
    </ModalBody>
  </Modal>
);


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphs: {},
      isOpen: false,
      modals: {},
    };
  }

  componentWillMount() {
    coins.forEach(({ symbol}) => this.fetchCoin(symbol));
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  fetchCoin = async (symbol) => {
    const res = await fetch(`https://us-central1-hodlometer.cloudfunctions.net/cacheCoin?symbol=${symbol}`);
    const graph = await res.json();

    this.setState({
      graphs: {
        ...this.state.graphs,
        [symbol]: graph
      }
    })
  }

  toggleModal = (name) => (evt) => {
    evt.preventDefault();

    this.setState({
      modals: {
        ...this.state.modals,
        [name]: !this.state.modals[name]
      }
    })
  }

  render() {

    const { graphs, modals } = this.state;

    return (
      <div>
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">HODLometer</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink
                  href="/how_it_works/"
                  onClick={this.toggleModal('how_it_works')}
                >
                  How it works?
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/what_is_fodl"
                  onClick={this.toggleModal('what_is_fodl')}
                >
                  What is FODL?</NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="/automate"
                  onClick={this.toggleModal('automate')}
                >
                  Automate It!</NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="https://t.me/hodlometer"
                >
                  Telegram
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="https://github.com/mkrn/hodlometer"
                >
                  Github
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Explain
          title="How it works"
          toggle={this.toggleModal('how_it_works')}
          isOpen={modals['how_it_works']}
        >
          <p>Our algorithm calculates the periods of uptrend and downtrend using average volatility for several days.</p>
          <p>We then hold a trailing target which, when crossed, signals a change of direction</p>
          <p>On the charts periods when algorithm would hold crypto asset are shown in green, and periods of FODL are shown in red.</p>
          <p>It allows to take profits and cut losses and in most cases end up with significantly better returns.</p>

        </Explain>

        <Explain
          title="What is FODL"
          toggle={this.toggleModal('what_is_fodl')}
          isOpen={modals['what_is_fodl']}
        >
          <p>FODL is selling your Bitcoin for a stablecoin such as USDT (Tether) or TUSD,
          or selling your altcoin for Bitcoin when market is downtrending.</p>
          <p>Oppositely, HODL refers to holding the cryptocurrency rather than selling it.</p>
          <p>Our calculations show that it's more profitable to take profits and buy back into a clear uptrend to make more profit overall.</p>
          <p>If you like the idea of automatically taking profit and not missing an uptrend, subscribe to be the first to know when we release an automated tool.</p>
        </Explain>

        <Explain
          title="Automate It"
          toggle={this.toggleModal('automate')}
          isOpen={modals['automate']}
        >
          <SubscribeForm />
        </Explain>

        {
          coins.map(({ symbol, name }) => {
            const chart = graphs[symbol] || [];
            const loaded = !!chart.length;
            const isHodl = hodl(chart);
            const target = loaded && chart[chart.length - 1].trailing;
            // Format BTC or USD amounts properly
            const targetFormatted = symbol.indexOf('USD') > 0 ? fix2(target) : fix(target);

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
                      <p>
                        { isHodl ? 'Sell target': 'Buy back target' }: {targetFormatted}
                      </p>
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
          })
        }

        <SubscribeForm />
      </div>
    );
  }
}

export default App;
