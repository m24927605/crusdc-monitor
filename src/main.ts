import { config } from 'dotenv';

config();

import { CrUSDCMonitorSingleton } from './services/tokens/crusdc/monitor';

(async () => {
  const crUSDCMonitor = CrUSDCMonitorSingleton.getInstance();
})();