import { CrUSDCMonitor, CrUSDCMonitorSingleton } from './token/crusdc/monitor';
import { ETHMonitor, ETHMonitorSingleton } from './coin/eth/monitor';

export class Monitor {
  private static _ethSingleton: ETHMonitor;
  private static _crUSDCSingleton: CrUSDCMonitor;

  execute() {
    Monitor._ethSingleton = ETHMonitorSingleton.getInstance();
    Monitor._crUSDCSingleton = CrUSDCMonitorSingleton.getInstance();
  }
}