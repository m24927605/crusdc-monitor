import { Log } from '@ethersproject/abstract-provider/src.ts/index';
import * as fs from 'fs';
import * as path from 'path';

abstract class MonitorLog {
  private static _logFolderPath = '../../../logs';

  protected _logContent: string;
  private static readonly _logFileName = 'log.txt';
  private static readonly logFilePath = path.resolve(__dirname, `${MonitorLog._logFolderPath}/${MonitorLog._logFileName}`);

  writeLogFile(): void {
    const logFolderPath = path.resolve(__dirname, `${MonitorLog._logFolderPath}`);
    if (!fs.existsSync(logFolderPath)) {
      fs.mkdirSync(logFolderPath);
    }
    console.info(this._logContent);
    fs.appendFileSync(MonitorLog.logFilePath, this._logContent);
  }
}

export abstract class EventMonitorLog extends MonitorLog {
  constructor(private readonly _event: Log) {
    super();
  }

  protected abstract makeEventLogContent(event: Log, message: string): void;

  protected _appendDefaultLog(message: string) {
    return '\r\n' + `#${this._event.blockNumber}: ${this._event.transactionHash}` + '\r\n' + message + '\r\n';
  }
}

export abstract class StatusMonitorLog extends MonitorLog {
  protected abstract makeStatusLogContent(blockHeight: number): void;

  protected _appendDefaultLog(messages: string[]) {
    return '\r\n' + messages.join('\r\n') + '\r\n';
  }
}