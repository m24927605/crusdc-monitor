import { Log } from '@ethersproject/abstract-provider/src.ts/index';
import { providers } from 'ethers';

import { crUSDCEventName, eventImplementation } from '../../../const/event';
import { crUSDCFuncName, funcImplementation } from '../../../const/function';
import { Monitor } from '../../base/monitor';
import { BorrowEventLog, MintEventLog, RedeemEventLog, RepayBorrowEventLog } from './log';

const crUSDCABI = new Map<string, string>([
  [crUSDCFuncName.BorrowRatePerBlock, funcImplementation.BorrowRatePerBlock],
  [crUSDCFuncName.SupplyRatePerBlock, funcImplementation.SupplyRatePerBlock],
  [crUSDCEventName.Mint, eventImplementation.Mint],
  [crUSDCEventName.Redeem, eventImplementation.Redeem],
  [crUSDCEventName.Borrow, eventImplementation.Borrow],
  [crUSDCEventName.RepayBorrow, eventImplementation.RepayBorrow]
]);

class CrUSDCMonitor extends Monitor {
  public currentBlockHeight: number;
  private static readonly _crUSDCContractAddress = '0x44fbebd2f576670a6c33f6fc0b00aa8c5753b322';
  private _eventHandler = new Map<crUSDCEventName, providers.Listener>([
    [crUSDCEventName.Mint, CrUSDCMonitor._mintEventListener],
    [crUSDCEventName.Redeem, CrUSDCMonitor._redeemEventListener],
    [crUSDCEventName.Borrow, CrUSDCMonitor._borrowEventListener],
    [crUSDCEventName.RepayBorrow, CrUSDCMonitor._repayBorrowEventListener]
  ]);

  constructor() {
    super(CrUSDCMonitor._crUSDCContractAddress, CrUSDCMonitor._crUSDCABIs);
    for (const [event, listener] of this._eventHandler.entries()) {
      this._contract.on(event, listener);
    }
  }

  async getCurrentBlockHeight() {
    this.currentBlockHeight = await this._provider.getBlockNumber();
    return this._provider.getBlockNumber();
  }

  async getBorrowRatePerBlock() {
    return this._contract.borrowRatePerBlock();
  }

  async getSupplyRatePerBlock() {
    return this._contract.supplyRatePerBlock();
  }

  private static get _crUSDCABIs() {
    return [
      crUSDCABI.get(crUSDCFuncName.BorrowRatePerBlock),
      crUSDCABI.get(crUSDCFuncName.SupplyRatePerBlock),
      crUSDCABI.get(crUSDCEventName.Mint),
      crUSDCABI.get(crUSDCEventName.Redeem),
      crUSDCABI.get(crUSDCEventName.Borrow),
      crUSDCABI.get(crUSDCEventName.RepayBorrow)
    ];
  }

  private static _mintEventListener(minter: string, mintAmount: number, mintTokens: number, event: Log) {
    const mintEventLog = new MintEventLog(event);
    mintEventLog.minter = minter;
    mintEventLog.mintAmount = mintAmount;
    mintEventLog.mintTokens = mintTokens;
    mintEventLog.makeEventLogContent();
    mintEventLog.writeLogFile();
  }

  private static _redeemEventListener(redeemer: string, redeemAmount: number, redeemTokens: number, event: Log) {
    const redeemEventLog = new RedeemEventLog(event);
    redeemEventLog.redeemer = redeemer;
    redeemEventLog.redeemAmount = redeemAmount;
    redeemEventLog.redeemTokens = redeemTokens;
    redeemEventLog.makeEventLogContent();
    redeemEventLog.writeLogFile();
  }

  private static _borrowEventListener(borrower: string, borrowAmount: number, accountBorrows: number, totalBorrows: number, event: Log) {
    const borrowEventLog = new BorrowEventLog(event);
    borrowEventLog.borrower = borrower;
    borrowEventLog.borrowAmount = borrowAmount;
    borrowEventLog.accountBorrows = accountBorrows;
    borrowEventLog.totalBorrows = totalBorrows;
    borrowEventLog.makeEventLogContent();
    borrowEventLog.writeLogFile();
  }

  private static _repayBorrowEventListener(payer: string, borrower: string, repayAmount: number, accountBorrows: number, totalBorrows: number, event: Log) {
    const repayBorrowEventLog = new RepayBorrowEventLog(event);
    repayBorrowEventLog.payer = payer;
    repayBorrowEventLog.borrower = borrower;
    repayBorrowEventLog.repayAmount = repayAmount;
    repayBorrowEventLog.accountBorrows = accountBorrows;
    repayBorrowEventLog.totalBorrows = totalBorrows;
    repayBorrowEventLog.makeEventLogContent();
    repayBorrowEventLog.writeLogFile();
  }
}

export class CrUSDCMonitorSingleton {
  private static _instance: CrUSDCMonitor;

  public static getInstance(): CrUSDCMonitor {
    if (!CrUSDCMonitorSingleton._instance) {
      CrUSDCMonitorSingleton._instance = new CrUSDCMonitor();
    }

    return CrUSDCMonitorSingleton._instance;
  }
}