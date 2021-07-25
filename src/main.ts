import { config } from 'dotenv';

config();

import { Monitor } from './service/monitor';
import { Log } from './service/base/log';

(async () => {
  try {
    const monitor = new Monitor();
    monitor.execute();
    Log.info('Monitor is running.');
  } catch (e) {
    Log.error(e.message);
  }
})();