import { CrUSDCMonitor, CrUSDCMonitorSingleton } from './token/crusdc/monitor';
import { ETHMonitor, ETHMonitorSingleton } from './coin/eth/monitor';

export class Monitor {
  private static _ethSingleton: ETHMonitor;
  private static _crUSDCSingleton: CrUSDCMonitor;

  async execute() {
    Monitor._ethSingleton = ETHMonitorSingleton.getInstance();
    Monitor._crUSDCSingleton = CrUSDCMonitorSingleton.getInstance();

    await Monitor._ethSingleton.ready();
    await Monitor._crUSDCSingleton.ready();

    await Monitor._ethSingleton.run();
    await Monitor._crUSDCSingleton.run();
  }
}