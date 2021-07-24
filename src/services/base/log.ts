import { Log } from '@ethersproject/abstract-provider/src.ts/index';
import * as fs from 'fs';
import * as path from 'path';

abstract class MonitorLog {
  protected _logContent: string;
  private static readonly _logFileName = 'log.txt';
  private static readonly logFilePath = path.resolve(__dirname, `../../../${MonitorLog._logFileName}`);

  writeLogFile(): void {
    fs.appendFileSync(MonitorLog.logFilePath, this._logContent);
  }
}

export abstract class EventMonitorLog extends MonitorLog {
  constructor(private readonly _event: Log) {
    super();
  }

  protected abstract makeEventLogContent(event: Log, message: string): void;

  protected _appendDefaultLog(message) {
    return '\r\n' + `#${this._event.blockNumber}: ${this._event.transactionHash}` + '\r\n' + `${message}` + '\r\n';
  }
}