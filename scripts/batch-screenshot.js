const fs = require('fs-extra');

const intervalScreenshot = (page, url, abSavePath, interval, times) =>
    new Promise(async (resolve, reject) => {
        let cnt = -1;
        await page
            .goto(url.address, { waitUntil: 'networkidle0', timeout: 0 })
            .catch((err) => reject(err));

        const intervalId = setInterval(async () => {
            ++cnt;
            // 截图与保存是异步过程，若最后一张未保存好，则一直空等，以免关闭page早于保存
            if (cnt >= times) {
                let flag = true;
                for (let i = 0; i < times && flag; i++) {
                    flag =
                        flag &&
                        fs.existsSync(
                            `${abSavePath}/${`${url.id}`.padStart(5, '0')}-${`${
                                times - 1
                            }`.padStart(3, '0')}.png`
                        );
                }
                if (!flag) return;
                clearInterval(intervalId);
                resolve();
            } else {
                await page
                    .screenshot({
                        path: `${abSavePath}/${`${url.id}`.padStart(
                            5,
                            '0'
                        )}-${`${cnt}`.padStart(3, '0')}.png`,
                    })
                    .catch((err) => reject(err));
            }
        }, interval);
    });

const pageScreenshot = (
    batch,
    browser,
    urls,
    abSavePath,
    interval = 1000,
    times = 5
) =>
    new Promise(async (resolve) => {
        const page = await browser.newPage();

        let errUrls = [];

        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({
            width: 1440,
            height: 900,
        });

        for (let i = 0; i < urls.length; i++) {
            await intervalScreenshot(
                page,
                { id: batch + i, address: urls[i] },
                abSavePath,
                interval,
                times
            ).catch((err) => {
                console.log(err, `\n\nERR: [${batch + i}] ${urls[i]}\n\n`);
                errUrls.push({ id: batch + i, address: urls[i] });
            });
        }

        await page.close();

        resolve(errUrls);
    });

const batchScreenshot = async ({
    browser,
    urls,
    abSavePath,
    pages = 5,
    interval = 1000,
    times = 5,
}) => {
    console.time(
        `每隔${interval}ms截图一次，${times}次/网站，${urls.length}个网站共耗时：`
    );

    let promises = [];
    let batchSize = Math.floor(urls.length / pages);
    batchSize = batchSize >= 1 ? batchSize : 1;
    for (let i = 0; i < urls.length; i = i + batchSize) {
        promises.push(
            pageScreenshot(
                i,
                browser,
                urls.slice(i, i + batchSize),
                abSavePath,
                interval,
                times
            )
        );
    }

    let errUrls = await Promise.all(promises);
    errUrls = errUrls.flat();

    console.timeEnd(
        `每隔${interval}ms截图一次，${times}次/网站，${urls.length}个网站共耗时：`
    );

    console.log(`其中${errUrls.length}个网站失败：${JSON.stringify(errUrls)}`);

    fs.writeFileSync(`${abSavePath}/errUrls.log`, `${JSON.stringify(errUrls)}`);

    return;
};

export default batchScreenshot;
