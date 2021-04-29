
const express = require('express') 
const sls = require('serverless-http') 
const puppetHelper = require('./helper/scraper');
const db = require('./helper/database');
const app = express() 
var bodyParser = require('body-parser');
const { puppeteer } = require('chrome-aws-lambda');
const codes = ["AEC","AEE","AEN","AEP","AEU","AEZ","AGL","ALH","ALI","ALR","ALS","ALU","AMA","AMB","AMF","AMG","AMP","AMR","AMS","AMY","AMZ","APG","AUA","AUG","AZA","AZB","AZD","AZH","AZK","AZL","AZM","AZN","AZO","AZS","AZT","AZY","FYU","FYY","KOE"]



app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json())

app.post('/scrape/daily', async (req, res) => {
  console.log("REQUEST RECEIVED", req.body.codes)
  let codes = req.body.codes;
  console.log(codes)
  let scrapedData = await puppetHelper.getDailyData(codes);
 
  res.json(JSON.stringify(scrapedData))

})

app.post('/markowitz', async (req, res) => {
  console.log("Allocation RECEIVED", req.body.result)
  let {result} = req.body;
  console.log(result)
  res.json(result)

})

app.get('/markowitz', async(req,res) => {
  let markowitzAllocation = await db.getMarkowitz()

  console.log(markowitzAllocation)
  res.json(markowitzAllocation)
})


//Our function "server" actually starts the server. We will use 
module.exports.server = sls(app)

// 11.11.2020
// Return success when we are able to save the cookies(signed user) else failure(BOOLEAN)
// For the second one succesfull login sent response, filtering, downloading and finally adding the