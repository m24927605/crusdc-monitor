import BigNumber from 'bignumber.js';
import * as ContractEvent from '@ethersproject/contracts/src.ts/index';
import { EventFilter } from '@ethersproject/contracts';

import {
  BorrowArg,
  crUSDCEventName,
  eventImplementation,
  MintArg,
  RedeemArg,
  RepayBorrowArg,
  TxEventArg
} from '../../../const/event';
import { crUSDCFuncName, funcImplementation } from '../../../const/function';

import { ContractBase } from '../../base/contract';
import { Log } from '../../base/log';

import {
  BorrowEventLog,
  MintEventLog,
  RedeemEventLog,
  RepayBorrowEventLog,
  StatusLog
} from './log';


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

  constructor() {
    super(CrUSDCMonitor._crUSDCContractAddress, CrUSDCMonitor._crUSDCABIs);
  }

  async ready() {
    await this._jsonRPCProvider._ready();
  }

  async run() {
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

  async fetchEvent(currentBlockHeight: number) {
    await this._fetchMintEvent(currentBlockHeight);
    await this._fetchRedeemEvent(currentBlockHeight);
    await this._fetchBorrowEvent(currentBlockHeight);
    await this._fetchRepayBorrowEvent(currentBlockHeight);
  }

  private async _fetchMintEvent(currentBlockHeight: number) {
    const mintFilter = this._contract.filters.Mint(null, null);
    const mintTxs = await this._contractQueryFilter(mintFilter, currentBlockHeight);
    mintTxs.forEach((tx: ContractEvent.Event) => {
      const txEventArg = new TxEventArg();
      txEventArg.blockNumber = tx.blockNumber;
      txEventArg.transactionHash = tx.transactionHash;
      const mintArg = new MintArg();
      mintArg.minter = tx.args['minter'];
      mintArg.mintAmount = tx.args['mintAmount'];
      mintArg.mintTokens = tx.args['mintTokens'];
      CrUSDCMonitor._mintEventHandler(txEventArg, mintArg);
    });
  }

  private async _fetchRedeemEvent(currentBlockHeight: number) {
    const redeemFilter = this._contract.filters.Redeem(null, null);
    const redeemFilterTxs = await this._contractQueryFilter(redeemFilter, currentBlockHeight);
    redeemFilterTxs.forEach((tx: ContractEvent.Event) => {
      const txEventArg = new TxEventArg();
      txEventArg.blockNumber = tx.blockNumber;
      txEventArg.transactionHash = tx.transactionHash;
      const redeemArg = new RedeemArg();
      redeemArg.redeemer = tx.args['redeemer'];
      redeemArg.redeemAmount = tx.args['redeemAmount'];
      redeemArg.redeemTokens = tx.args['redeemTokens'];
      CrUSDCMonitor._redeemEventHandler(txEventArg, redeemArg);
    });
  }

  private async _fetchBorrowEvent(currentBlockHeight: number) {
    const borrowFilter = this._contract.filters.Borrow(null, null);
    const borrowFilterTxs = await this._contractQueryFilter(borrowFilter, currentBlockHeight);
    borrowFilterTxs.forEach((tx: ContractEvent.Event) => {
      const txEventArg = new TxEventArg();
      txEventArg.blockNumber = tx.blockNumber;
      txEventArg.transactionHash = tx.transactionHash;
      const borrowArg = new BorrowArg();
      borrowArg.borrower = tx.args['borrower'];
      borrowArg.borrowAmount = tx.args['borrowAmount'];
      borrowArg.accountBorrows = tx.args['accountBorrows'];
      borrowArg.totalBorrows = tx.args['totalBorrows'];
      CrUSDCMonitor._borrowEventHandler(txEventArg, borrowArg);
    });
  }

  private async _fetchRepayBorrowEvent(currentBlockHeight: number) {
    const repayBorrowFilter = this._contract.filters.RepayBorrow(null, null);
    const repayBorrowTxs = await this._contractQueryFilter(repayBorrowFilter, currentBlockHeight);
    repayBorrowTxs.forEach((tx: ContractEvent.Event) => {
      const txEventArg = new TxEventArg();
      txEventArg.blockNumber = tx.blockNumber;
      txEventArg.transactionHash = tx.transactionHash;
      const repayBorrowArg = new RepayBorrowArg();
      repayBorrowArg.payer = tx.args['payer'];
      repayBorrowArg.borrower = tx.args['borrower'];
      repayBorrowArg.repayAmount = tx.args['repayAmount'];
      repayBorrowArg.accountBorrows = tx.args['accountBorrows'];
      repayBorrowArg.totalBorrows = tx.args['totalBorrows'];
      CrUSDCMonitor._repayBorrowEventHandler(txEventArg, repayBorrowArg);
    });
  }

  private _contractQueryFilter(eventFilter: EventFilter, currentBlockHeight: number) {
    return this._contract.queryFilter(eventFilter, currentBlockHeight, currentBlockHeight);
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

  private static _mintEventHandler(txEventArg: TxEventArg, mintArg: MintArg) {
    const { blockNumber, transactionHash } = txEventArg;
    const { minter, mintAmount, mintTokens } = mintArg;
    const mintEventLog = new MintEventLog(blockNumber, transactionHash);
    mintEventLog.minter = minter;
    mintEventLog.mintAmount = mintAmount.toString();
    mintEventLog.mintTokens = mintTokens.toString();
    const message = mintEventLog.makeEventLogContent();
    Log.info(message);
  }

  private static _redeemEventHandler(txEventArg: TxEventArg, redeemArg: RedeemArg) {
    const { blockNumber, transactionHash } = txEventArg;
    const { redeemer, redeemAmount, redeemTokens } = redeemArg;
    const redeemEventLog = new RedeemEventLog(blockNumber, transactionHash);
    redeemEventLog.redeemer = redeemer;
    redeemEventLog.redeemAmount = redeemAmount.toString();
    redeemEventLog.redeemTokens = redeemTokens.toString();
    const message = redeemEventLog.makeEventLogContent();
    Log.info(message);
  }

  private static _borrowEventHandler(txEventArg: TxEventArg, borrowArg: BorrowArg) {
    const { blockNumber, transactionHash } = txEventArg;
    const { borrower, borrowAmount, accountBorrows, totalBorrows } = borrowArg;
    const borrowEventLog = new BorrowEventLog(blockNumber, transactionHash);
    borrowEventLog.borrower = borrower;
    borrowEventLog.borrowAmount = borrowAmount.toString();
    borrowEventLog.accountBorrows = accountBorrows.toString();
    borrowEventLog.totalBorrows = totalBorrows.toString();
    const message = borrowEventLog.makeEventLogContent();
    Log.info(message);
  }

  private static _repayBorrowEventHandler(txEventArg: TxEventArg, repayBorrowArg: RepayBorrowArg) {
    const { blockNumber, transactionHash } = txEventArg;
    const { payer, borrower, repayAmount, accountBorrows, totalBorrows } = repayBorrowArg;
    const repayBorrowEventLog = new RepayBorrowEventLog(blockNumber, transactionHash);
    repayBorrowEventLog.payer = payer;
    repayBorrowEventLog.borrower = borrower;
    repayBorrowEventLog.repayAmount = repayAmount.toString();
    repayBorrowEventLog.accountBorrows = accountBorrows.toString();
    repayBorrowEventLog.totalBorrows = totalBorrows.toString();
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