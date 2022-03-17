const intervalScreenshot = (page, url, savePath, interval, times) => new Promise(async (resolve) => {
    let cnt = 0;
    await page.goto(url.address, { waitUntil: 'networkidle0', timeout: 0 });

    const intervalId = setInterval(async () => {
        await page.screenshot({ path: `${savePath}/u_${`${url.id}`.padStart(5, "0")}_${`${cnt}`.padStart(3, "0")}.png` });
        ++cnt;
        if (times === cnt) {
            clearInterval(intervalId);
            resolve();
        }
    }, interval)
})

const pageScreenshot = (batch, browser, urls, savePath, interval = 1000, times = 5) => new Promise(async (resolve) => {
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
        width: 1440,
        height: 900,
    });

    for (let i = 0; i < urls.length; i++) {
        await intervalScreenshot(page, { id: batch + i, address: urls[i] }, savePath, interval, times);
    }

    await page.close();

    resolve();
})

const batchScreenshot = async ({ browser, urls, savePath, pages = 5, interval = 1000, times = 5 }) => {

    console.time(`每隔${interval}ms截图一次，${times}次/网站，${urls.length}个网站共耗时：`)

    let promises = [];
    const batchSIze = Math.floor(urls.length / pages);
    for (let i = 0; i < urls.length; i = i + batchSIze) {
        promises.push(pageScreenshot(i, browser, urls.slice(i, i + batchSIze), savePath, interval, times))
    }

    await Promise.all(promises);

    console.timeEnd(`每隔${interval}ms截图一次，${times}次/网站，${urls.length}个网站共耗时：`)
}

export default batchScreenshot;
