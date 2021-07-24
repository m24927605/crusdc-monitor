import { config } from 'dotenv';

config();

import { CrUSDCMonitor } from './services/tokens/crusdc/monitor';

(async () => {
  const crUSDCMonitor = new CrUSDCMonitor();
})();