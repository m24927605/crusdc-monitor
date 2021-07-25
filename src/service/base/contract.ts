import { Contract, providers } from 'ethers';

export class ContractBase {
  private static _network = process.env.NETWORK;
  private static _infuraHttpUrl = `https://${ContractBase._network}.infura.io/v3`;
  private static _infuraUrl = `${ContractBase._infuraHttpUrl}/${process.env.INFURA_KEY}`;
  protected _jsonRPCProvider = new providers.JsonRpcProvider(ContractBase._infuraUrl, ContractBase._network);
  protected _contract: Contract;

  constructor(private readonly _contractAddress: string, private _contractABIs: string[]) {
    this._contract = new Contract(this._contractAddress, this._contractABIs, this._jsonRPCProvider);
  }
}