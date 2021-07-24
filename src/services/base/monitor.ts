import { Contract, providers } from 'ethers';

export class Monitor {
  private _provider = new providers.JsonRpcProvider(process.env.INFURA_URL);
  protected _contract: Contract;

  constructor(private readonly _contractAddress: string, private _contractABIs: string[]) {
    this._contract = new Contract(this._contractAddress, this._contractABIs, this._provider);
  }
}