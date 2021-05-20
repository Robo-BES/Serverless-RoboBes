const chromium = require("chrome-aws-lambda");
const db = require("./database");
const fs = require('fs');
const readline = require('readline');
//Our main function which makes the search

module.exports.getDailyData = async function (codes) {
  //Launching chrome with script

  try {
    const browser = await chromium.puppeteer.launch({ 
      args: chromium.args, 
      defaultViewport: chromium.defaultViewport, 
      executablePath: await chromium.executablePath });
    const page = await browser.newPage(); // Creating a new page
    const allData = []
    for (let i = 0; i < codes.length; i++) {
      console.log("Scraping : ", codes[i]);
      await page.goto(
        "https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=" + codes[i]
      );
      await page.click("#MainContent_RadioButtonListPeriod_7");
      await page.waitForSelector(".highcharts-axis-labels");
		
      await delay(2000);
      //let yields = await getYields(page);
      let price = await getPrice(page);
      let update = {
        code: codes[i],
        price: price
      }
      let affected = await db.updateValues(update)
      allData.push(affected)
    }

    page.close();

    return allData;
  } catch (e) {
    console.log("Our error ", e);
  }
};

const getYields = async (page) => {
  return await page.evaluate(async () => {
    return await new Promise((resolve) => {
      let priceIndicator = $(".price-indicators li span");
      let data = priceIndicator.text().split("%");
      priceIndicator = $(".top-list li span");
      let dailyYield = priceIndicator[1].innerText.substring(1)
      let yields = {
        daily_yield: dailyYield,
        monthly_yield: data[1],
        three_monthly_yield: data[2],
        six_monthly_yield: data[3],
        yearly_yield: data[4],
      };

      resolve(yields);
    });
  });
};



const getPrice = async (page) => {
  return await page.evaluate(async () => {
    return await new Promise((resolve) => {
      let priceIndicator = $(".top-list li span");
      let price = priceIndicator.text().split("%")[0];
      resolve(price);
    });
  });
};


const processLineByLine = async (filename) => {
    let codes = []
    var readMe = fs.readFileSync(filename, 'utf8').split('\n');
    for(let i = 0; i<Object.keys(readMe).length;i++ ){
        
        codes.push(readMe[Object.keys(readMe)[i]].replace('\r', ''))
    }

    return codes
}

async function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
