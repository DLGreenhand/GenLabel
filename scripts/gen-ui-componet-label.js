const fs = require('fs-extra');

const pageScreenshot = (batch, browser, url, abSavePath, times) => new Promise(async (resolve) => {
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
        width: 390,
        height: 844,
    });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

    for (let i = 0; i < times; i++) {
        await page.screenshot({ path: `${abSavePath}/u_${`${batch * times + i}`.padStart(5, "0")}.png` });

        const arr = await page.$$eval('.component', (items) => {
            var myCanvas = document.createElement("canvas");
            myCanvas.setAttribute("width", 390);
            myCanvas.setAttribute("height", 844);
            myCanvas.setAttribute("id", "canvas");
            myCanvas.setAttribute("style", "position:fixed;top:0;left:0")

            const cpns = document.getElementById('components');
            cpns.appendChild(myCanvas)

            return items.map(item => {
                const test = document.getElementById('canvas');
                const ctx = test.getContext('2d')
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                const tmp = {
                    Type: item.id,
                    Position: {
                        left: item.getBoundingClientRect().left,
                        top: item.getBoundingClientRect().top,
                        right: item.getBoundingClientRect().right,
                        bottom: item.getBoundingClientRect().bottom
                    },
                    Text: item.title,
                }
                ctx.strokeRect(tmp.Position.left,
                    tmp.Position.top,
                    (tmp.Position.right - tmp.Position.left),
                    tmp.Position.bottom - tmp.Position.top);
                const width = ctx.measureText(tmp.Type).width;
                const padding = 4;
                const fontSize = 16;
                ctx.fillStyle = "white";
                ctx.fillRect(tmp.Position.left - padding, tmp.Position.top - 5 - fontSize - padding / 2, width + padding, fontSize + padding);
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = "brown";
                ctx.fillText(tmp.Type, tmp.Position.left - padding / 2, tmp.Position.top - 5 - padding / 2);
                return tmp;
            })

        })

        await page.screenshot({ path: `${abSavePath}/u_${`${batch * times + i}`.padStart(5, "0")}_gnd.png` });

        const jsonObject = { cpn_infos: arr };
        fs.writeFile(`${abSavePath}/u_${`${batch * times + i}`.padStart(5, "0")}_lb.json`, JSON.stringify(jsonObject))

        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }

    await page.close();

    resolve();
})

const genUIComponentLabel = async ({ browser, url, abSavePath, pages = 5, times = 3000 }) => {

    console.time(`单页${times}次截图共耗时：`)

    let promises = [];
    for (let i = 0; i < pages; ++i) {
        promises.push(pageScreenshot(i, browser, url, abSavePath, Math.ceil(times / pages)))
    }
    await Promise.all(promises);

    console.timeEnd(`单页${times}次截图共耗时：`)
}

export default genUIComponentLabel;
