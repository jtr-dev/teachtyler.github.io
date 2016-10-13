title: Using API Search Queries with Bot Framework (Node.js)
tags:
  - 'botframework, node.js, API, request'
categories: []
date: 2016-08-02 09:21:00
---
**This is built on-top of [BotBuilder/Node/Examples/demo-skype-app.js](https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/demo-skype/app.js)**

The bot framework is a really cool sdk. If you're not using it currently, [I strongly suggest you take a look.](https://github.com/Microsoft/BotBuilder) Even if you're not a node.js type of person. There's also the C# sdk, because well of-course it's Microsoft. However, it's pretty cool that there exists a node.js version so.. thanks!

 I spent a week raking my head trying to understand how the bot performs in node.js and honestly. I suck at node.  My javascript skills are not exactly something I use to pick up chicks with yet, but I understand some core stuff. With node however, it's been taking some getting used to.

So I have an API, and the goal is to tell the bot something my URL can actually hit. I started with request.



```javascript
var request = require('request'),
    err,
    SearchDetail,
    url;

function getMyData (Name, ID, Rows) {
url = "http://example.api.com/API/Search/?Name="+Name+"&ID="+ID+"&Skip=0&Rows="+Rows;
request({url: url,json: true}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            SearchDetail = body;
        }else{
            err = error;
      }
  })
}





```

This worked well for me, but I had a problem updating SearchDetail for the longest, because of how the framework and node co-operate, in asynchronicity. The [IDialog Waterfall](https://docs.botframework.com/en-us/node/builder/chat/dialogs/), is a very powerful thing that lets you continue your session with the bot, to a results portion of the session. Which looks like:

```javascript
bot.dialog('/', [
function (session) {
    builder.Prompts.text(session, 'How old are you?');
}, function (session, results){
    session.send("Really.. you're only "+ results.response + "!?");
}
]);

```
Well turns out you can chain these together with `next()` inside one dialog. For, a really long time, it's pretty crazy.


```javascript
bot.dialog('/SearchByName', [
    function (session) {
        builder.Prompts.text(session, "Type a search query.." );
    },
    function (session, results, next) {
        if (results.response) {
              session.userData._Name = results.response;
              getMyData(session.userData._Name,'','10');           
            if(err){
              session.send(err);
            }
            next();
        }
    }, function (session){
        builder.Prompts.text(session, "Is "+session.userData._Name+" correct?" );
    }, function (session,results, next){
        if (results.reponse = 'yes' ||  'y' ){
          next();
        }else{
          session.beginDialog('/SearchByName');
        }

   }, function (session){
        var msg = new builder.Message(session)

            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.list)
            .attachments([

                new builder.HeroCard(session)
                    .title( SearchDetail.myAPI.List[0].NAME)
                    .text( SearchDetail.myAPI.List[0].ADDR1)
                    .buttons([
                        builder.CardAction.imBack(session, "select:0",  SearchDetail.myAPI.List[0].ID)
                    ]),
                new builder.HeroCard(session)
                    .title( SearchDetail.myAPI.List[1].NAME)
                    .text( SearchDetail.myAPI.List[1].ADDR1)
                    .buttons([
                        builder.CardAction.imBack(session, "select:1",  SearchDetail.myAPI.List[1].ID)
                    ])

            ]);
             builder.Prompts.choice(session, msg, "select:0|select:1");    
    },
    function (session, results, next) {
        if (results.response) {
            _rows = '1';
            var action, item;
            var kvPair = results.response.entity.split(':');
            switch (kvPair[0]) {
                case 'select':
                    action = 'selected';
                    break;
            }

            switch (kvPair[1]) {
                case "0":
                    UserID =  SearchDetail.myAPI.List[0].ID;
                    break;
                case '1':
                    UserID =  SearchDetail.myAPI.List[1].ID;
                    break;
             }

        } else {
            session.endDialog("You canceled.");
        }
        getMyData('', UserID, '1');    // With my API I need to clear Name and Update rows to 1 instead of 10
       next();
       // Now that an ID has been selected let's confirm it and update the SearchDetail object
    }, function (session){
        builder.Prompts.text(session, "Is "+UserID+" correct?" );
    }, function (session,results, next){
        if (results.reponse = 'yes' ||  'y' ){
          next();
        }else{
            session.beginDialog('/SearchByName');
        }
      },function (session, results){
        session.send("searching "+' '+_rows+' ' +session.userData._Name + "... ");
           msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Receipt for "+session.userData._Name+"...")
                    .items([
                        builder.ReceiptItem.create(session, SearchDetail.myAPI.List.ADDR1, "Address 1"),
                        builder.ReceiptItem.create(session,  SearchDetail.myAPI.List.ADDR2, "Address 2")
                    ])
                    .facts([
                        builder.Fact.create(session, SearchDetail.myAPI.List.ID, "ID"),
                        builder.Fact.create(session, SearchDetail.myAPI.List.DOB, "Date of Birth"),
                        builder.Fact.create(session, SearchDetail.myAPI.List.NAME, "Name")
                    ])
                    .tax(SearchDetail.myAPI.List.STATUS)
                    .total(SearchDetail.myAPI.List.ROLLTYPE)
            ]);
        session.endDialog(msg);
    }
]);

```

If you notice, I use `next()` which is always third arugment => `function (session, arg, next)` to persist to next session. You don't always have to do this. When you have a `builder.Prompts.text(session, '')` Then you can persist to `function (session,results)` and get the results.response back.  
I also use `session.userData._Name` [[Adding Dialogs and Memory]](https://docs.botframework.com/en-us/node/builder/guides/core-concepts/#adding-dialogs-and-memory) which works about the same to having a global variable `_Name` and calling that instead, but I wanted to make sure my search string was fresh :)

The main reason i'm chaining these together in the first place, is to knock out 2 birds with one stone. What I mean is, my `SearchDetail` object doesn't update until `function (session, results)`  before that, it's blank. The URL is updated, but I need the data from it.  Before I had been using multiple `bot.dialog()`'s that still continued to never update `SearchDetail`, until after the bot restarted, this is currently the only way I have found to persist the data from the URL, without worrying about a delay. This also let's me confirm that this is in fact the correct response, because mistakes will be made I'm sure.