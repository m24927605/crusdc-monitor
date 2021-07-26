import { WsEventName } from '../../../const/event';

import { CrUSDCMonitorSingleton } from '../../token/crusdc/monitor';
import { EthBase } from '../../base/eth';

export class ETHMonitor extends EthBase {
  private static _logStatusBlockGap = parseInt(process.env.LOG_STATUS_BLOCK_GAP);
  private static _crUSDCMonitorSingleton = CrUSDCMonitorSingleton.getInstance();
  private static _recordLatestBlockHeight: number = 0;
  private static _lockExpiredTime = 10 * 1000; // 10 sec
  private static _lock = false;

  constructor() {
    super();
  }

  async ready() {
    await this._wsProvider._ready();
  }

  async run() {
    this._bindEvent();
  }

  private _bindEvent() {
    this._wsProvider.on(WsEventName.NewBlock, ETHMonitor._newBlockListener);
  }

  private static async _newBlockListener(currentBlockHeight: number) {
    // fetch event at current block
    await ETHMonitor._crUSDCMonitorSingleton.fetchEvent(currentBlockHeight);

    const diffBlocks = currentBlockHeight - ETHMonitor._recordLatestBlockHeight;
    // first record
    if (diffBlocks === currentBlockHeight) {
      await ETHMonitor._execLogStatus(currentBlockHeight);
    }
    if (diffBlocks !== ETHMonitor._logStatusBlockGap || ETHMonitor._lock) {
      return;
    }
    await ETHMonitor._execLogStatus(currentBlockHeight);
  }

  private static async _execLogStatus(currentBlockHeight: number) {
    ETHMonitor._recordLatestBlockHeight = currentBlockHeight;
    ETHMonitor._lockUp();
    ETHMonitor._makeLockExpired();
    try {
      await ETHMonitor._crUSDCMonitorSingleton.logStatus(currentBlockHeight);
      ETHMonitor._releaseLock();
    } catch (e) {
      console.error(e.message);
    }
  }

  private static _lockUp() {
    ETHMonitor._lock = true;
  }

  private static _releaseLock() {
    ETHMonitor._lock = false;
  }

  private static _makeLockExpired() {
    setTimeout(() => {
      ETHMonitor._lock = false;
    }, ETHMonitor._lockExpiredTime);
  }
}

export class ETHMonitorSingleton {
  private static _instance: ETHMonitor;

  public static getInstance(): ETHMonitor {
    if (!ETHMonitorSingleton._instance) {
      ETHMonitorSingleton._instance = new ETHMonitor();
    }

    return ETHMonitorSingleton._instance;
  }
}