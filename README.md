# HODLOMETER.com

This is entire source code for [hodlometer.com](https://hodlometer.com)

It's idea is show it was better to use a simple algorithm to sell into stablecoins rather than just blindly HODL.

I intend to create an automated service to notify of crypto uptrends and potentially make a SaaS to manage that automatically using exchange API keys if there is enough interest.

## Algorithm

I have researched a bunch of algorithms with opened source on [TradingView](https://tradingview.com) and end up porting "Average True Range Trailing Stops Strategy", by Sylvain Vervoort to JavaScript. It accounts for much varying volatility of cryptocurrencies, which prevents it from selling or buying in extra rough periods.

## Thanks

Thanks to amazing [React](https://reactjs.org/), [reactstrap](https://reactstrap.github.io/), [Bootstrap4](https://getbootstrap.com/), [Firebase](https://firebase.google.com/), [Netlify](http://netlify.com/) to allow me to implement this idea so quickly.

## License

MIT