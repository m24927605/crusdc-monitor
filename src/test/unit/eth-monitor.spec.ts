import { config } from 'dotenv';

config();

import { ETHMonitor, ETHMonitorSingleton } from '../../service/coin/eth/monitor';

jest.setTimeout(30000);
describe('test ETHMonitorSingleton class', () => {
  it('if ETHMonitorSingleton instance is not exists,renew one', () => {
    const instance = ETHMonitorSingleton.getInstance();
    expect(instance).toBeInstanceOf(ETHMonitor);
  });
});
describe('test ETHMonitor class', () => {
  it('catch error when running _execLogStatus method', async () => {
    const spy = jest.spyOn(ETHMonitor['_crUSDCMonitorSingleton'], 'logStatus');
    spy.mockRejectedValue(new Error('error message'));
    await ETHMonitor['_execLogStatus'](123456);
    await expect(ETHMonitor['_crUSDCMonitorSingleton'].logStatus(123456))
      .rejects.toThrow(new Error('error message'));
  });
});