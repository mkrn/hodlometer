interface Html5Websocket extends WebSocket {
  new (url: string, protocols?: string | Array<string>): Html5Websocket;
}

declare const Html5Websocket: Html5Websocket;

export = Html5Websocket;
