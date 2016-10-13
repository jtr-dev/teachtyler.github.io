title: Getting Started with Bot Framework  (Node.js)
author: Tyler Roberts
tags:
  - node.js
  - bot framework
  - bot
  - microsoft
  - framework
  - Getting
  - Started
  - quick
  - azure
  - node
  - js
categories:
  - Bot Framework
date: 2016-08-29 11:10:00
---
This post will go over how to quickly get a bot up and running, in Node.js (in Azure, other CMS will be another day).

If you don't already have an Azure account, please go make one. These bots can be ran on a free subscription plan. Make sure you select `show all` when looking at price tiers. Free plan will be at the very bottom, which usually caps out at 1gb of memory per hour. A simple bot won't reach that cap. I have one that calls API's of 2 different services while performing multiple responses and making a POST/GET response with every prompt. It genereally hits that limit in about 20 min. Just to give you an idea of the threshhold.


___

# Node.js

For Node we'll be using the [Skype sample.](
https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/demo-skype/app.js)
You'll notice in this folder, there's no package.json file. For some reason they expected you to download the entire respository and cast `npm install` on all of their examples. You can do this if you want but you'll need to register each example seperately and things can get confusing when pushing to Azure. So we're just going to focus on this one skype sample.

Create a folder. Then `> cd` into it. 
```
> npm init
> git init
```
```bash
> npm install --save botbuilder
> npm install --save restify
```


package.json file should have updated and look similar to this:

```json
{
  "name": "nodeskypebot",
  "version": "0.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "test"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "botbuilder": "^3.2.3",
    "restify": "^4.1.1"
  }
}

```
The package.json file is important to reflect actual packages. When we `> git push` to Azure, it will run through and install modules on its end. So if you've required something in your local node_modules and it's not a package dependency. Azure will not know to install it, and the app will break.  

Now change app.js to reflect actual location of required paths (diff):
```javascript
var restify = require('restify');
- var builder = require('../../core/');
+ var builder = require('botbuilder');
```





Now you could test locally, with [Bot framework emulator](https://docs.botframework.com/en-us/tools/bot-framework-emulator/). 
We're going to skip ahead to Azure, where we can test things out in Skype. Because we're confident! 
____

First we need an azure website. 
```
> npm install -g azure-cli
> azure login
```
You'll be asked to enter a code here at [https://aka.ms/devicelogin](https://aka.ms/devicelogin). Login with your email that is tied to your azure account.  Command prompt should continue after logging in. 


`> azure site create --git {appname}`

Follow prompt(s)
```
> git add .
> git commit -m "init"
> git push azure master
```
You will be presented with Login credentials. ( These are deployment credentials )

##### If you have never set site credentials before on any other web app,
Go to [portal.azure.com]( https://portal.azure.com) and select deployment credentials on the bot sample you just made, these credentials will be the same for every web app on azure. This will be used to login for FTP and pushing to azure. 
![alt text](http://i.imgur.com/GxOpC8a.png)

___

Now that we have a website, with a bot. Let's [Register the Bot.](https://dev.botframework.com/bots/new)

Messaging endpoint is defined in app.js. 
https://mydomain.azurewebsites.net/api/messages
```javascript
server.post('/api/messages', connector.listen());
```
![configuration](http://i.imgur.com/PusWEcI.png)


Click create Microsoft App ID and password. You'll be provided with an app ID and a button to generate password.
Replace these values in app.js
```javascript
// Create chat bot
var connector = new builder.ChatConnector({
   - appId: process.env.MICROSOFT_APP_ID,
   - appPassword: process.env.MICROSOFT_APP_PASSWORD
   + appId: '533d42ca-f4b2-49d5-df10-B92bea4eccb6',
   + appPassword: 'hq3U2proPAT18Ov3m12a3AQ'
});
```

After completing form and registering bot successfully, update your azure site where bot is hosted repeat git push steps above and add the bot on skype.

This is the breakdown of the inital setup. 
Next time you add a node.js bot, you should only need to

1. get app.js sample
2. `npm init`
3. `git init`
4. `npm install`  (required dependencies)
5. `azure site create --git {site name}`
6. `git add .`
7. `git commit -m "{message}"`
8. `git push azure master`
9. [Register the bot](https://dev.botframework.com/bots/new), place supplied ID and password in app.js
10. `git push azure master`