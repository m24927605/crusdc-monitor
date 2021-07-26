import { config } from 'dotenv';

config();
import { Log } from '../../service/base/log';
import { LogLevel } from '../../const/log';

describe('test Log class', () => {
  const traceSpy = jest.spyOn(global.console, 'trace');
  const debugSpy = jest.spyOn(global.console, 'debug');
  const infoSpy = jest.spyOn(global.console, 'info');
  const warnSpy = jest.spyOn(global.console, 'warn');
  const errorSpy = jest.spyOn(global.console, 'error');
  afterEach(() => {
    traceSpy.mockReset();
    debugSpy.mockReset();
    infoSpy.mockReset();
    warnSpy.mockReset();
    errorSpy.mockReset();
  });
  it('should set default log level if environment variable is not exists', async () => {
    expect(Log['_logLevel']).toBe(LogLevel.INFO);
  });
  it('should print trace log', async () => {
    Log['_logLevel'] = LogLevel.TRACE;
    const expected = 'trace log';
    Log.trace(expected);
    expect(traceSpy).toBeCalledTimes(1);
    expect(traceSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print trace log', async () => {
    Log['_logLevel'] = LogLevel.DEBUG;
    const expected = 'trace log';
    Log.trace(expected);
    expect(traceSpy).toBeCalledTimes(0);
  });
  it('should print debug log', async () => {
    Log['_logLevel'] = LogLevel.DEBUG;
    const expected = 'debug log';
    Log.debug(expected);
    expect(debugSpy).toBeCalledTimes(1);
    expect(debugSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print debug log', async () => {
    Log['_logLevel'] = LogLevel.INFO;
    const expected = 'debug log';
    Log.debug(expected);
    expect(traceSpy).toBeCalledTimes(0);
  });
  it('should print info log', async () => {
    Log['_logLevel'] = LogLevel.INFO;
    const expected = 'info log';
    Log.info(expected);
    expect(infoSpy).toBeCalledTimes(1);
    expect(infoSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print info log', async () => {
    Log['_logLevel'] = LogLevel.WARN;
    const expected = 'info log';
    Log.info(expected);
    expect(infoSpy).toBeCalledTimes(0);
  });
  it('should print warn log', async () => {
    Log['_logLevel'] = LogLevel.WARN;
    const expected = 'warn log';
    Log.warn(expected);
    expect(warnSpy).toBeCalledTimes(1);
    expect(warnSpy).toHaveBeenLastCalledWith(expected);
  });
  it('should not print warn log', async () => {
    Log['_logLevel'] = LogLevel.ERROR;
    const expected = 'warn log';
    Log.warn(expected);
    expect(warnSpy).toBeCalledTimes(0);
  });
  it('should print error log', async () => {
    Log['_logLevel'] = LogLevel.ERROR;
    const expected = 'error log';
    Log.error(expected);
    expect(errorSpy).toBeCalledTimes(1);
    expect(errorSpy).toHaveBeenLastCalledWith(expected);
  });
});