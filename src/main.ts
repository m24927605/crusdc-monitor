import { config } from 'dotenv';

config();

import { Monitor } from './service/monitor';
import { Log } from './service/base/log';

(async () => {
  try {
    const monitor = new Monitor();
    await monitor.execute();
    Log.debug('Monitor is running.');
  } catch (e) {
    Log.error(e.message);
  }
})();