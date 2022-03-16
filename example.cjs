const puppeteer = require('puppeteer');
const fs=require('fs');
// const csv = require('csvtojson');
// const { resolve } = require('path');
// const schedule = require('node-schedule');
const url = 'http://localhost:3333/#/';

const times = process.argv[3];
const mode = process.argv[2];
const time=Math.floor(times/5);

// function scheduleCancel(url,i,page){
//   var counter = 1
  
//   var j=schedule.scheduleJob('* * * * * *',async function(){
//     console.log(counter)
//     counter++
//       await page.screenshot({ path: `./screenshot/example${5*i+counter}.png` });
//   });
//   setTimeout(function() {
//       console.log('定时器取消')
//       j.cancel();   
//   }, 6000);
// }


(async () => {
  if(mode!='screenshot'&&mode!='label')
  {
    console.log("无此模式！")
    return;
  }
  const browsers=await (mode=='label')?5:1;
  for (let i = 0; i < browsers; i++)
  {
    const browser = await puppeteer.launch(
      {
      // headless:false,
      args: ['--start-maximized'],
      ignoreDefaultArgs: ['--enable-automation']
    });
    if(mode=='screenshot')
    {
      const urls=[];
      await new Promise(resolve => {
        fs.createReadStream(times)
            .on('data', (data) => {
                const datastr=data.toString()
                var rows=datastr.split('\r\n')
                for(let i=0;i<rows.length;i++)
                {
                  urls.push(rows[i])
                  urls.push(rows[i])
                  urls.push(rows[i])
                  urls.push(rows[i])
                  urls.push(rows[i])
                }
            })
            .on('end', () => {
                resolve();
            })
      });//urls正常获得


//定时截图的功能
      for(let i = 0;i<urls.length;i++)
      { 
        await (async(i)=>{
          const page=await browser.newPage()
          await page.setDefaultNavigationTimeout(0)
          await page.goto(urls[i],{waitUntil: 'networkidle0',timeout:0})
          await page.setViewport({height:802,width:1707})
          await page.screenshot({ path: `./screenshot/example${i}.png` })
          .then(()=>{
            setTimeout(()=>{
              var t=new Date().getTime();
              console.log(t)
              console.log(i)
            },1000*i)
          })
        })(i)
        // for(let j=0;j<5;j++)
        // {
        //   await page.setDefaultNavigationTimeout(0)
        //   await page.goto(urls[i],{waitUntil: 'load',timeout:0})
        //   await page.setViewport({height:802,width:1707})
          
        //   await setTimeout(async()=>{
        //     await page.screenshot({ path: `./screenshot/example${5*i+j}.png` })
        //     var t=new Date().getTime();
        //     console.log(t)
        //     console.log(j)
        //   },1000*(5*i+j))
        // }
          
          // await setTimeout(()=>{
          //   console.log(`wait${i}`)
          // },1000)
      }
    }



//生成Label的功能
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
