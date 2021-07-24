import BigNumber from 'bignumber.js';
import { CrUSDCMonitorSingleton } from './tokens/crusdc/monitor';
import { StatusLog } from './tokens/crusdc/log';

export class ScheduleTask {
  private static readonly _timePeriod = 2 * 1000; // 2 sec
  private static _crUSDCMonitorSingleton = CrUSDCMonitorSingleton.getInstance();
  private static _recordLatestBlockHeight: number = 0;
  private static _isRunningRecordStatus = false;

  public runMonitorTask() {
    setInterval(async () => {
      const currentBlockHeight = await ScheduleTask._crUSDCMonitorSingleton.getCurrentBlockHeight();
      const diffBlocks = currentBlockHeight - ScheduleTask._recordLatestBlockHeight;
      const logStatusBlockGap = parseInt(process.env.LOG_STATUS_BLOCK_GAP);
      if (diffBlocks !== logStatusBlockGap && ScheduleTask._recordLatestBlockHeight !== 0) {
        return;
      }
      // check if unlocked
      if (!ScheduleTask._isRunningRecordStatus) {
        ScheduleTask._isRunningRecordStatus = true; // lock up to avoid duplicated log
        await ScheduleTask._runMonitorTask(currentBlockHeight);
      }
    }, ScheduleTask._timePeriod);
  }

  private static async _runMonitorTask(currentBlockHeight: number) {
    const borrowRatePerBlock: BigNumber = await ScheduleTask._crUSDCMonitorSingleton.getBorrowRatePerBlock();
    const supplyRatePerBlock: BigNumber = await ScheduleTask._crUSDCMonitorSingleton.getSupplyRatePerBlock();
    const borrowRatePerBlockNum = borrowRatePerBlock.toNumber();
    const supplyRatePerBlockNum = supplyRatePerBlock.toNumber();
    const statusLog = new StatusLog();
    statusLog.borrowRatePerBlock = borrowRatePerBlockNum;
    statusLog.supplyRatePerBlock = supplyRatePerBlockNum;
    statusLog.makeStatusLogContent(currentBlockHeight);
    statusLog.writeLogFile();
    ScheduleTask._recordLatestBlockHeight = currentBlockHeight;
    ScheduleTask._isRunningRecordStatus = false;
  }
}