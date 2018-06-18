import React, {Component} from "react"
import {
  Form,
  Collapse,
  Jumbotron,
  Button,
  Input
} from 'reactstrap';


class SubscribeForm extends Component {
  render() {
    return (
      <Jumbotron style={{ marginBottom: 0 }}>
        <h1>Save your crypto investment in bear market</h1>
        <p>Automatically take profits in a stablecoin when market downtrending, buy back when trend is going up.
        We are preparing a beta release of a simple and secure automated tool that works with Binance and other exchanges. Subscribe to be notified when it's ready</p>

        <Form inline method="post" action="https://app.freshmail.com/en/actions/subscribe/">
          <input type="hidden" name="subscribers_list_hash" value="lpai693qam" /><br />
          <Input type="email" name="freshmail_email" placeholder="Your email" />
          { ' ' }
          <Button color="primary">{ `Keep me updated`}</Button>
        </Form>
      </Jumbotron>
    );
  }
}

export default SubscribeForm;
