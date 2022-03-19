const fs = require("fs-extra");

const pageScreenshot = (batch, browser, url, abSavePath, times) =>
  new Promise(async (resolve) => {
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
      width: 390,
      height: 844,
    });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 0 });
    let cpnsArr;
    for (let i = 0; i < times; i++) {
      await page.screenshot({
        path: `${abSavePath}/images/${`${batch * times + i}`.padStart(
          5,
          "0"
        )}.jpg`,
      });

      const [arr, cpnArr] = await page.$$eval(".component", (items) => {
        var myCanvas = document.createElement("canvas");
        myCanvas.setAttribute("width", 390);
        myCanvas.setAttribute("height", 844);
        myCanvas.setAttribute("id", "canvas");
        myCanvas.setAttribute("style", "position:fixed;top:0;left:0");

        const cpnArr = JSON.parse(window.localStorage.getItem("cpnArr"));
        console.log(cpnArr);
        const cpns = document.getElementById("components");
        cpns.appendChild(myCanvas);

        return [
          items.map((item) => {
            const test = document.getElementById("canvas");
            const ctx = test.getContext("2d");
            ctx.strokeStyle = "red";
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
            const centerX = (tmp.Position.left + tmp.Position.right) / 780;
            const centerY = (tmp.Position.bottom + tmp.Position.top) / 1688;
            const cpn_width = (tmp.Position.right - tmp.Position.left) / 390;
            const cpn_height = (tmp.Position.bottom - tmp.Position.top) / 844;

            const str_tmp = `${cpnArr.indexOf(
              tmp.Type
            )} ${centerX} ${centerY} ${cpn_width} ${cpn_height}\n`;
            ctx.strokeRect(
              tmp.Position.left,
              tmp.Position.top,
              tmp.Position.right - tmp.Position.left,
              tmp.Position.bottom - tmp.Position.top
            );
            const width = ctx.measureText(tmp.Type).width;
            const padding = 4;
            const fontSize = 16;
            ctx.fillStyle = "white";
            ctx.fillRect(
              tmp.Position.left - padding,
              tmp.Position.top - 5 - fontSize - padding / 2,
              width + padding,
              fontSize + padding
            );
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = "brown";
            ctx.fillText(
              tmp.Type,
              tmp.Position.left - padding / 2,
              tmp.Position.top - 5 - padding / 2
            );
            return str_tmp;
          }),
          cpnArr,
        ];
      });
      await page.screenshot({
        path: `${abSavePath}/images-gnd/${`${batch * times + i}`.padStart(
          5,
          "0"
        )}_gnd.jpg`,
      });
      let file_data = "";
      for (let i = 0; i < arr.length; i++) {
        file_data += arr[i];
      }
      fs.writeFile(
        `${abSavePath}/labels/${`${batch * times + i}`.padStart(5, "0")}.txt`,
        file_data
      );
      cpnsArr = cpnArr;

      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }
    fs.writeFile(`${abSavePath}/labels/classes.txt`, JSON.stringify(cpnsArr));
    await page.close();

    resolve();
  });

const genUIComponentLabel = async ({
  browser,
  url,
  abSavePath,
  pages = 5,
  times = 3000,
}) => {
  console.time(`单页${times}次截图共耗时：`);

  let promises = [];
  for (let i = 0; i < pages; ++i) {
    promises.push(
      pageScreenshot(i, browser, url, abSavePath, Math.ceil(times / pages))
    );
  }
  await Promise.all(promises);

  console.timeEnd(`单页${times}次截图共耗时：`);
};

export default genUIComponentLabel;
