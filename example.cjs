const puppeteer = require('puppeteer');
const fs=require('fs');
const url = 'http://localhost:3333/#/';

const times = process.argv[2];
const time=Math.floor(times/5);
let start;
(async () => {
  for (let i = 0; i < 5; i++)
  {
    const browser = await puppeteer.launch(
      {
      // headless:false,
      args: ['--start-maximized'],
      ignoreDefaultArgs: ['--enable-automation']
    });
    for(let j=0;j<time;j++)
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(url,{waitUntil: 'networkidle0'});
      await page.screenshot({ path: `./example/example${time*i+j}.png` });


      // await page.evaluate(()=>{
      //   const test=document.getElementById('canvas');
      //   const ctx = test.getContext('2d')
      //   ctx.strokeStyle='red';
      //   ctx.lineWidth = 2;

      //   const arr=document.querySelectorAll('.component');
      //   for(let k=0;k<arr.length;k++)
      //   {
      //     ctx.strokeRect(arr[k].getBoundingClientRect().left,
      //     arr[k].getBoundingClientRect().top,
      //     (arr[k].getBoundingClientRect().right-arr[k].getBoundingClientRect().left),
      //     (arr[k].getBoundingClientRect().bottom-arr[k].getBoundingClientRect().top));
      //   }
      // })
      // await page.screenshot({ path: `./exa/exa${time*i+j}.png` });
      const arr=await page.$$eval('.component', (items)=>{
        var myCanvas = document.createElement("canvas");
        myCanvas.setAttribute("width", 390);
        myCanvas.setAttribute("height", 844);
        myCanvas.setAttribute("id", "canvas");
        myCanvas.setAttribute("style", "position:fixed;top:0;left:0")
        const cpns=document.getElementById('components');
        cpns.appendChild(myCanvas)
        return items.map(item=>{
          const test=document.getElementById('canvas');
          const ctx = test.getContext('2d')
          ctx.strokeStyle='red';
          ctx.lineWidth = 2;
          const tmp = {
            Type: item.id,
            Position: {
              left: item.getBoundingClientRect().left,
              top: item.getBoundingClientRect().top,
              right: item.getBoundingClientRect().right,
              bottom: item.getBoundingClientRect().bottom
            },
            Text:item.title,
          }
          ctx.strokeRect(tmp.Position.left,
                         tmp.Position.top,
                         (tmp.Position.right-tmp.Position.left),
                         tmp.Position.bottom-tmp.Position.top);
          return tmp;
        })
      })
      let jsonObject={cpn_infos:arr};
      await page.screenshot({ path: `./exa/exa${time*i+j}.png` });
      fs.writeFile(`./example_text/example${time*i+j}.json`,JSON.stringify(jsonObject),(err)=>{})
    }
    await browser.close();
  }
})();
