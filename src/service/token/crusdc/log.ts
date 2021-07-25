import { EventMonitorLog, StatusMonitorLog } from '../../base/log';

export class MintEventLog extends EventMonitorLog {
  private _minter: string = '';
  private _mintAmount: number = 0;
  private _mintTokens: number = 0;

  set minter(value: string) {
    this._minter = value;
  }

  set mintAmount(value: number) {
    this._mintAmount = value;
  }

  set mintTokens(value: number) {
    this._mintTokens = value;
  }

  makeEventLogContent() {
    const message = `${this._minter} Mint ${this._mintTokens} crUSDC with ${this._mintAmount} USDC`;
    return this._appendDefaultLog(message);
  }
}

export class RedeemEventLog extends EventMonitorLog {
  private _redeemer: string = '';
  private _redeemAmount: number = 0;
  private _redeemTokens: number = 0;

  set redeemer(value: string) {
    this._redeemer = value;
  }

  set redeemAmount(value: number) {
    this._redeemAmount = value;
  }

  set redeemTokens(value: number) {
    this._redeemTokens = value;
  }

  makeEventLogContent() {
    const message = `${this._redeemer} Redeem ${this._redeemAmount} USDC, burn ${this._redeemTokens} crUSDC`;
    return this._appendDefaultLog(message);
  }
}

export class BorrowEventLog extends EventMonitorLog {
  private _borrower: string = '';
  private _borrowAmount: number = 0;
  private _accountBorrows: number = 0;
  private _totalBorrows: number = 0;

  set borrower(value: string) {
    this._borrower = value;
  }

  set borrowAmount(value: number) {
    this._borrowAmount = value;
  }

  set accountBorrows(value: number) {
    this._accountBorrows = value;
  }

  set totalBorrows(value: number) {
    this._totalBorrows = value;
  }

  makeEventLogContent() {
    const message = `${this._borrower} Borrow ${this._borrowAmount} USDC`;
    return this._appendDefaultLog(message);
  }
}

export class RepayBorrowEventLog extends EventMonitorLog {
  private _payer: string = '';
  private _borrower: string = '';
  private _repayAmount: number = 0;
  private _accountBorrows: number = 0;
  private _totalBorrows: number = 0;

  set payer(value: string) {
    this._payer = value;
  }

  set borrower(value: string) {
    this._borrower = value;
  }

  set repayAmount(value: number) {
    this._repayAmount = value;
  }

  set accountBorrows(value: number) {
    this._accountBorrows = value;
  }

  set totalBorrows(value: number) {
    this._totalBorrows = value;
  }

  makeEventLogContent() {
    const message = `${this._payer} RepayBorrow ${this._repayAmount} USDC for ${this._borrower}`;
    return this._appendDefaultLog(message);
  }
}

export class StatusLog extends StatusMonitorLog {
  private _supplyRatePerBlock: number;
  private _borrowRatePerBlock: number;

  set supplyRatePerBlock(value: number) {
    this._supplyRatePerBlock = value;
  }

  set borrowRatePerBlock(value: number) {
    this._borrowRatePerBlock = value;
  }

  makeStatusLogContent(blockHeight: number) {
    const supplyMessage = `#${blockHeight} supply rate: ${this._supplyRatePerBlock}`;
    const borrowMessage = `#${blockHeight} borrow rate: ${this._borrowRatePerBlock}`;
    const messages = [supplyMessage, borrowMessage];
    return this._appendDefaultLog(messages);
  }
}