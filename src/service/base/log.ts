import * as Event from '@ethersproject/abstract-provider/src.ts/index';

import { LogLevel } from '../../const/log';

export class Log {
  private static _logLevel: number = LogLevel[process.env.LOG_LEVEL.toUpperCase()] || LogLevel.INFO;

  static trace(message: string) {
    const logLevel = LogLevel.TRACE;
    if (!this._isValidToPrint(logLevel)) {
      return;
    }
    console.trace(message);
  }

  static debug(message: string) {
    if (!this._isValidToPrint(LogLevel.DEBUG)) {
      return;
    }
    console.debug(message);
  }

  static info(message: string) {
    if (!this._isValidToPrint(LogLevel.INFO)) {
      return;
    }
    console.info(message);
  }

  static warn(message: string) {
    if (!this._isValidToPrint(LogLevel.WARN)) {
      return;
    }
    console.warn(message);
  }

  static error(message: string) {
    console.error(message);
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