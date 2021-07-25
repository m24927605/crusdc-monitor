import BigNumber from 'bignumber.js';
import * as Event from '@ethersproject/abstract-provider/src.ts/index';
import { providers } from 'ethers';

import { crUSDCEventName, eventImplementation } from '../../../const/event';
import { crUSDCFuncName, funcImplementation } from '../../../const/function';

import { ContractBase } from '../../base/contract';
import { Log } from '../../base/log';

import { BorrowEventLog, MintEventLog, RedeemEventLog, RepayBorrowEventLog, StatusLog } from './log';


const crUSDCABI = new Map<string, string>([
  [crUSDCFuncName.BorrowRatePerBlock, funcImplementation.BorrowRatePerBlock],
  [crUSDCFuncName.SupplyRatePerBlock, funcImplementation.SupplyRatePerBlock],
  [crUSDCEventName.Mint, eventImplementation.Mint],
  [crUSDCEventName.Redeem, eventImplementation.Redeem],
  [crUSDCEventName.Borrow, eventImplementation.Borrow],
  [crUSDCEventName.RepayBorrow, eventImplementation.RepayBorrow]
]);

export class CrUSDCMonitor extends ContractBase {
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

  async logStatus(currentBlockHeight: number) {
    const borrowRatePerBlock: BigNumber = await this._getBorrowRatePerBlock();
    const supplyRatePerBlock: BigNumber = await this._getSupplyRatePerBlock();
    const borrowRatePerBlockNum = borrowRatePerBlock.toNumber();
    const supplyRatePerBlockNum = supplyRatePerBlock.toNumber();
    const statusLog = new StatusLog();
    statusLog.borrowRatePerBlock = borrowRatePerBlockNum;
    statusLog.supplyRatePerBlock = supplyRatePerBlockNum;
    const message = statusLog.makeStatusLogContent(currentBlockHeight);
    Log.info(message);
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

  private async _getBorrowRatePerBlock() {
    return this._contract.borrowRatePerBlock();
  }

  private async _getSupplyRatePerBlock() {
    return this._contract.supplyRatePerBlock();
  }

  private static _mintEventListener(minter: string, mintAmount: number, mintTokens: number, event: Event.Log) {
    const mintEventLog = new MintEventLog(event);
    mintEventLog.minter = minter;
    mintEventLog.mintAmount = mintAmount;
    mintEventLog.mintTokens = mintTokens;
    const message = mintEventLog.makeEventLogContent();
    Log.info(message);
  }

  private static _redeemEventListener(redeemer: string, redeemAmount: number, redeemTokens: number, event: Event.Log) {
    const redeemEventLog = new RedeemEventLog(event);
    redeemEventLog.redeemer = redeemer;
    redeemEventLog.redeemAmount = redeemAmount;
    redeemEventLog.redeemTokens = redeemTokens;
    const message = redeemEventLog.makeEventLogContent();
    Log.info(message);
  }

  private static _borrowEventListener(borrower: string, borrowAmount: number, accountBorrows: number, totalBorrows: number, event: Event.Log) {
    const borrowEventLog = new BorrowEventLog(event);
    borrowEventLog.borrower = borrower;
    borrowEventLog.borrowAmount = borrowAmount;
    borrowEventLog.accountBorrows = accountBorrows;
    borrowEventLog.totalBorrows = totalBorrows;
    const message = borrowEventLog.makeEventLogContent();
    Log.info(message);
  }

  private static _repayBorrowEventListener(payer: string, borrower: string, repayAmount: number, accountBorrows: number, totalBorrows: number, event: Event.Log) {
    const repayBorrowEventLog = new RepayBorrowEventLog(event);
    repayBorrowEventLog.payer = payer;
    repayBorrowEventLog.borrower = borrower;
    repayBorrowEventLog.repayAmount = repayAmount;
    repayBorrowEventLog.accountBorrows = accountBorrows;
    repayBorrowEventLog.totalBorrows = totalBorrows;
    const message = repayBorrowEventLog.makeEventLogContent();
    Log.info(message);
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