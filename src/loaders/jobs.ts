// Do Scheduling
// https://github.com/node-schedule/node-schedule
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
// Execute a cron job every 5 Minutes = */5 * * * *
// Starts from seconds = * * * * * *

import config from '../config';
import { Container } from 'typedi';
import schedule from 'node-schedule';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';

import fs from 'fs';
const utils = require('../helpers/utilsHelper');


export default async ({ logger }) => {

  // 0. DEFINE TIME FORMATS
  const startTime = new Date(new Date().setHours(0, 0, 0, 0));
  // const startTime = new Date(Date.now());
  // console.log(startTime, Date.now())

  const fiveSecRule = new schedule.RecurrenceRule();
  fiveSecRule.second = new schedule.Range(0, 0, 0, 5);

  const twoAndHalfMinRule = new schedule.RecurrenceRule();
  twoAndHalfMinRule.minute = new schedule.Range(0, 59, 2);
  twoAndHalfMinRule.second = 30;

  const tenMinuteRule = new schedule.RecurrenceRule();
  tenMinuteRule.minute = new schedule.Range(0, 59, 10);

  const thirtyMinuteRule = new schedule.RecurrenceRule();
  thirtyMinuteRule.minute = new schedule.Range(0, 59, 30);

  const oneHourRule = new schedule.RecurrenceRule();
  oneHourRule.hour = new schedule.Range(0, 23);
  oneHourRule.minute = 0;
  oneHourRule.second = 0;

  const sixHourRule = new schedule.RecurrenceRule();
  sixHourRule.hour = new schedule.Range(0, 23, 6);
  sixHourRule.minute = 0;
  sixHourRule.second = 0;

  const dailyRule = new schedule.RecurrenceRule();
  dailyRule.hour = 0;
  dailyRule.minute = 0;
  dailyRule.second = 0;
  dailyRule.dayOfWeek = new schedule.Range(0, 6);

  // 1. SHOWRUNNERS SERVICE
  logger.info(`    -- Checking and Loading Dynamic Jobs...`);
  const channelFolderPath = `${__dirname}/../showrunners/`
  const directories = utils.getDirectories(channelFolderPath)

  for (const channel of directories) {
    const absPath = `${channelFolderPath}${channel}/${channel}Jobs.${config.fileSuffix}`
    const relativePath = `../showrunners/${channel}/${channel}Jobs.${config.fileSuffix}`

    if (fs.existsSync(absPath)) {
      const cronning = await import(absPath)
      cronning.default();

      logger.info(`     ✔️  ${relativePath} Loaded!`)
    }
    else {
      logger.info(`     ❌  ${relativePath} Not Found... skipped`)
    }
  }

   // 2. EVENT DISPATHER SERVICE
  const eventDispatcher = Container.get(EventDispatcherInterface);
  eventDispatcher.on("newBlockMined", async function (data) {
    // Disabled for now
    // // 2.1 Wallet Tracker Service
    // // Added condition to approx it at 10 blocks (150 secs approx)
    // if (data % 10 == 0) {
    //   const walletTracker = Container.get(WalletTrackerChannel);
    //   const taskName = 'Track wallets on every new block mined';
    //
    //   try {
    //     await walletTracker.sendMessageToContract(false);
    //     logger.info(`🐣 Cron Task Completed -- ${taskName}`);
    //   }
    //   catch (err) {
    //     logger.error(`❌ Cron Task Failed -- ${taskName}`);
    //     logger.error(`Error Object: %o`, err);
    //   }
    // }
  })

  

};
