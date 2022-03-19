const { ArgumentParser } = require('argparse');

const { version } = require('../package.json');

const argparser = new ArgumentParser({
    description: 'Dataset Toolbox',
    add_help: true,
});
argparser.add_argument('-v', '--version', { action: 'version', version });

const subparsers = argparser.add_subparsers({ help: 'Dataset Tools', dest: 'tool' });

const batchScreenshot = subparsers.add_parser('bs', { help: 'batch screenshot' });
batchScreenshot.add_argument('-csv', '--csvPath', { type: 'str', help: 'csv file path of urls' });
batchScreenshot.add_argument('-sp', '--savePath', { type: 'str', default: 'screenshots/', help: 'dir path to save screenshots' });
batchScreenshot.add_argument('-p', '--pages', { type: 'int', default: 5, help: 'num of pages to open at once in puppeteer browser' });
batchScreenshot.add_argument('-t', '--times', { type: 'int', default: 5, help: 'screenshot times' });
batchScreenshot.add_argument('-i', '--interval', { type: 'int', default: 500, help: 'intervals to screenshot (ms)' });

const genUIComponentLabel = subparsers.add_parser('gui', { help: 'generate UI component labels' });
genUIComponentLabel.add_argument('-url', '--url', { type: 'str', help: 'url to generate ui component labels' });
genUIComponentLabel.add_argument('-sp', '--savePath', { type: 'str', default: "screenshots/ui-components", help: 'dir path to save screenshots' });
genUIComponentLabel.add_argument('-p', '--pages', { type: 'int', default: 5, help: 'num of pages to open at once in puppeteer browser' });
genUIComponentLabel.add_argument('-t', '--times', { type: 'int', default: 300, help: 'screenshot times' });
genUIComponentLabel.add_argument('-tp', '--type', { type: 'str', default: 'train', help: 'dataset type, train/val/test' });

export default argparser;