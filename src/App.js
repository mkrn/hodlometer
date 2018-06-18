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
  Jumbotron,
  Button
} from 'reactstrap';

import LineChart from './components/LineChart';
import { hodl, hodlRevenue, hodlometerRevenue } from './lib';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

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
    symbol: 'ETCBTC', name: 'ETC'
  },
  {
    symbol: 'TRXBTC', name: 'Tron'
  },
  {
    symbol: 'ADABTC', name: 'Cardano'
  }
];


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphs: {},
      isOpen: false
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

  render() {

    const { graphs } = this.state;

    return (
      <div>
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">hodlometer</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/how_it_works/">How it works</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/what_is_fodl">What is FODL</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/automate">Automate It!</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        {
          coins.map(({ symbol, name }) => {
            const isHodl = hodl(graphs[symbol] || []);
            return (
              <Container style={{ marginTop: 40 }}>
                <Row>
                  <Col>
                    <h1>
                      <span class={`badge ${isHodl ? 'badge-success' : 'badge-secondary'}`}>
                        { isHodl ? 'HODL': 'FODL' }
                      </span>
                      { ' ' }
                      { name }
                    </h1>
                    <p>HODLing: { hodlRevenue(graphs[symbol]) }% With hodlometer: { hodlometerRevenue(graphs[symbol]) }%</p>

                    <LineChart data={graphs[symbol] || []} />
                  </Col>
                </Row>
              </Container>
            )
          })
        }
      </div>
    );
  }
}

export default App;
