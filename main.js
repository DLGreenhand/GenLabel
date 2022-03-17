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
      fs.ensureDirSync(savePath);

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
      const { url = "http://10.214.199.218:8087/", savePath, pages, times } = args;
      const abSavePath = resolve(savePath);
      fs.ensureDirSync(savePath);

      const browser = await puppeteer.launch(
        {
          args: ['--start-maximized'],
          ignoreDefaultArgs: ['--enable-automation']
        });

      await genUIComponentLabel(browser, url, abSavePath, pages, times)

      await browser.close();
      break;
    }
    default: {
      console.error(`${args.tool} not supported.`)
    }
  }
})()
