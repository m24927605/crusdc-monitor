import { providers } from 'ethers';
import { WsEventName } from '../../const/event';

export class EthBase {
  private static _network = process.env.NETWORK;
  private static _infuraWebsocketAPIUrl = `wss://${EthBase._network}.infura.io/ws/v3`;
  private static _infuraWebsocketUrl = `${EthBase._infuraWebsocketAPIUrl}/${process.env.INFURA_KEY}`;
  protected _wsProvider = new providers.WebSocketProvider(EthBase._infuraWebsocketUrl, EthBase._network);

  constructor() {
    this._wsProvider.on(WsEventName.Error, this._errorListener);
  }

  protected _errorListener(e: Error) {
    console.error(e.message);
  }
}