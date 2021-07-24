import { config } from 'dotenv';

config();

import { ScheduleTask } from './services/schedule-task';

(async () => {
  const scheduleTask = new ScheduleTask();
  scheduleTask.runMonitorTask();
})();