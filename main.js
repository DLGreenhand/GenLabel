import { batchScreenshot, genUIComponentLabel } from './scripts';
import { parseCSV, argparser } from './utils';
import { resolve } from 'path';
const fs = require('fs-extra');

const puppeteer = require('puppeteer');

const args = argparser.parse_args();
console.table(args);

(async () => {
  switch (args.tool) {
    case 'bs': {
      const { csvPath = 'data/test.csv', savePath, pages, times, interval } = args;
      const urls = await parseCSV(csvPath);
      const abSavePath = resolve(savePath);
      fs.ensureDirSync(abSavePath);

      const browser = await puppeteer.launch(
        {
          args: ['--start-maximized'],
          ignoreDefaultArgs: ['--enable-automation']
        });

      await batchScreenshot({ browser, urls, pages, abSavePath, interval, times });

      await browser.close();
      break;
    }
    case 'gui': {
      const { url = "http://localhost:3333/#/", savePath, pages, times, type } = args;
      const abSavePath = resolve(savePath);
      
      const browser = await puppeteer.launch(
        {
          args: ['--start-maximized'],
          ignoreDefaultArgs: ['--enable-automation']
        });

      await genUIComponentLabel({ browser, url, abSavePath, pages, times, type })

      await browser.close();
      break;
    }
    default: {
      console.error(`${args.tool} not supported.`)
    }
  }
})()
