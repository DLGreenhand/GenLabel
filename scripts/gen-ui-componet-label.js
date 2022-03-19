const fs = require('fs-extra');

const pageScreenshot = ({ batch, browser, url, abSavePath, times, type }) =>
    new Promise(async (resolve) => {
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
        });
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
        let classes;
        for (let i = 0; i < times; i++) {
            await page.screenshot({
                path: `${abSavePath}/images/${type}/${type}-${`${
                    batch * times + i
                }`.padStart(5, '0')}.jpg`,
            });

            const [arr, cpnArr] = await page.$$eval('.component', (items) => {
                var myCanvas = document.createElement('canvas');
                myCanvas.setAttribute('width', 390);
                myCanvas.setAttribute('height', 844);
                myCanvas.setAttribute('id', 'canvas');
                myCanvas.setAttribute('style', 'position:fixed;top:0;left:0');

                const cpnArr = JSON.parse(
                    window.localStorage.getItem('cpnArr')
                );
                const cpns = document.getElementById('components');
                cpns.appendChild(myCanvas);

                return [
                    items.map((item) => {
                        const test = document.getElementById('canvas');
                        const ctx = test.getContext('2d');
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 2;
                        const tmp = {
                            Type: item.id,
                            Position: {
                                left: item.getBoundingClientRect().left,
                                top: item.getBoundingClientRect().top,
                                right: item.getBoundingClientRect().right,
                                bottom: item.getBoundingClientRect().bottom,
                            },
                            Text: item.title,
                        };
                        const centerX =
                            (tmp.Position.left + tmp.Position.right) / 780;
                        const centerY =
                            (tmp.Position.bottom + tmp.Position.top) / 1688;
                        const cpnWidth =
                            (tmp.Position.right - tmp.Position.left) / 390;
                        const cpnHeight =
                            (tmp.Position.bottom - tmp.Position.top) / 844;

                        const strTmp = `${cpnArr.indexOf(
                            tmp.Type
                        )} ${centerX} ${centerY} ${cpnWidth} ${cpnHeight}\n`;
                        ctx.strokeRect(
                            tmp.Position.left - 2,
                            tmp.Position.top - 2,
                            tmp.Position.right - tmp.Position.left + 4,
                            tmp.Position.bottom - tmp.Position.top + 4
                        );
                        const width = ctx.measureText(tmp.Type).width;
                        const padding = 4;
                        const fontSize = 16;
                        ctx.fillStyle = 'white';
                        ctx.fillRect(
                            tmp.Position.left - padding,
                            tmp.Position.top - 5 - fontSize - padding / 2,
                            width + padding,
                            fontSize + padding
                        );
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillStyle = 'brown';
                        ctx.fillText(
                            tmp.Type,
                            tmp.Position.left - padding / 2,
                            tmp.Position.top - 5 - padding / 2
                        );
                        return strTmp;
                    }),
                    cpnArr,
                ];
            });
            await page.screenshot({
                path: `${abSavePath}/images-gnd/${type}/${type}-${`${
                    batch * times + i
                }`.padStart(5, '0')}-gnd.jpg`,
            });
            let fileData = '';
            for (let i = 0; i < arr.length; i++) {
                fileData += arr[i];
            }
            fs.writeFile(
                `${abSavePath}/labels/${type}/${type}-${`${
                    batch * times + i
                }`.padStart(5, '0')}.txt`,
                fileData
            );
            classes = cpnArr;

            await page.reload({
                waitUntil: ['networkidle0', 'domcontentloaded'],
            });
        }

        fs.writeFile(
            `${abSavePath}/labels/classes.txt`,
            JSON.stringify(classes)
        );

        await page.close();

        resolve();
    });

const genUIComponentLabel = async ({
    browser,
    url,
    abSavePath,
    pages = 5,
    times = 3000,
    type = 'train',
}) => {
    fs.ensureDirSync(`${abSavePath}/labels/${type}`);
    fs.ensureDirSync(`${abSavePath}/images/${type}`);
    fs.ensureDirSync(`${abSavePath}/images-gnd/${type}`);

    console.time(`单页${times}次截图共耗时：`);

    let promises = [];
    for (let i = 0; i < pages; ++i) {
        promises.push(
            pageScreenshot({
                batch: i,
                browser,
                url,
                abSavePath,
                times: Math.ceil(times / pages),
                type,
            })
        );
    }
    await Promise.all(promises);

    console.timeEnd(`单页${times}次截图共耗时：`);
};

export default genUIComponentLabel;
