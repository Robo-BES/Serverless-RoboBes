<!--
title: 'Running Puppeteer on AWS Lambda'
description: 'Puppeteer app that search for given keyword and returns links and titles on google as json'
framework: v1
platform: AWS
language: nodeJS
authorName: 'Oguz B.'
-->

### Running Puppeteer on AWS Lambda Using Serverless Framework

### Instructions to run locally 

 - Make sure you installed all dependencies!
```
$ npm install 
$ sls offline 
```

### To Deploy on AWS 

- Add your profile in `serverless.yml` and run

```
$ sls deploy
```
___________
# About Project 
I had a big problem with AWS Lambda limits(both for function code and layer).
When you try to use Puppeteer your deployment package size(unzipped)  easily go's above 250 mb because when you install Puppeteer, it downloads a recent version of Chromium (~170MB Mac, ~282MB Linux, ~280MB Win) that is guaranteed to work with the API.

## Solution 

Best solution I found for this problem is using this Serverless-framework Headless Chrome Plugin i.e 
`serverless-plugin-chrome`

Since you give project requirements as AWS Lambda Serverless Chromium, i didnt mention you anything about deploying the api on ec2 and send requests to that ec2 instance through AWS Lambda. I strongly recommend using EC2 as APi for these kind of projects. Sending request part can be done through AWS Lambda function without any difficulties. Let me know your thoughts

# How we solved the problem ??

## 1. Added the Plugin in your serverless.yml

```
plugins:
  - serverless-plugin-chrome
```

## 2. Installed Following Dependencies 

- superagent 
- @serverless-chrome/lambda 
- puppeteer 

```
 $ npm i superagent @serverless-chrome/lambda puppeteer 
```

## 3.Excluded Chromium Dist that comes with puppeteer by default which increases folder size to 400MB

We can do this in package section of our `serverless.yml`

```
package:
  exclude:
    - node_modules/puppeteer/.local-chromium/**
```


## 4. Created a new file and name it chrome-script.js

Add the following lines to chrome-script.js

```
const launchChrome = require  ("@serverless-chrome/lambda");
const request = require  ("superagent");

module.exports.getChrome = async () => {
  const chrome = await launchChrome();

  const response = await request
    .get(`${chrome.url}/json/version`)
    .set("Content-Type", "application/json");

  const endpoint = response.body.webSocketDebuggerUrl;

  return {
    endpoint,
    instance: chrome
  };
};
```



## 5.Connected Puppeteer With Headless Chrome

- imported chrome in our `./helper/puppeteer.js`

```
const {getChrome} = require('./chrome-script')
```

- connected it with puppeteer 

```
  const browser = await puppeteer.connect({
    browserWSEndpoint: chrome.endpoint
  });
```

Now we are ready to use puppeteer on aws lambda 


### To Test It Locally 



- "http://localhost:3000/search/:PARAM" for example "http://localhost:3000/search/karsiyaka"

```

```



### To Deploy on AWS

```
  $  sls deploy
```



```
Dont forget to replace lambda url with localhost!
```




