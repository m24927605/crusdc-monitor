import * as Event from '@ethersproject/abstract-provider/src.ts/index';

import { LogLevel } from '../../const/log';

const LogMap = new Map([
  [LogLevel.TRACE, console.trace],
  [LogLevel.DEBUG, console.debug],
  [LogLevel.INFO, console.info],
  [LogLevel.WARN, console.warn],
  [LogLevel.ERROR, console.error]
]);

export class Log {
  private static _logLevel: number = LogLevel[process.env.LOG_LEVEL.toUpperCase()] || LogLevel.INFO;

  static trace(message: string) {
    const logLevel = LogLevel.TRACE;
    if (!this._isValidToPrint(logLevel)) {
      return;
    }
    LogMap.get(logLevel)(message);
  }

  static debug(message: string) {
    const logLevel = LogLevel.DEBUG;
    if (!this._isValidToPrint(logLevel)) {
      return;
    }
    LogMap.get(logLevel)(message);
  }

  static info(message: string) {
    const logLevel = LogLevel.INFO;
    if (!this._isValidToPrint(logLevel)) {
      return;
    }
    LogMap.get(logLevel)(message);
  }

  static warn(message: string) {
    const logLevel = LogLevel.WARN;
    if (!this._isValidToPrint(logLevel)) {
      return;
    }
    LogMap.get(logLevel)(message);
  }

  static error(message: string) {
    const logLevel = LogLevel.ERROR;
    if (!this._isValidToPrint(logLevel)) {
      return;
    }
    LogMap.get(logLevel)(message);
  }

  private static _isValidToPrint(logLevel: LogLevel) {
    return logLevel >= Log._logLevel;
  }
}

export abstract class EventMonitorLog {
  constructor(private readonly _blockNumber: number, private readonly _transactionHash: string) {
  }

  protected abstract makeEventLogContent(event: Event.Log, message: string): string;

  protected _appendDefaultLog(message: string) {
    return '\r\n' + `#${this._blockNumber}: ${this._transactionHash}` + '\r\n' + message + '\r\n';
  }
}

export abstract class StatusMonitorLog {
  protected abstract makeStatusLogContent(blockHeight: number): string;

  protected _appendDefaultLog(messages: string[]) {
    return '\r\n' + messages.join('\r\n') + '\r\n';
  }
}