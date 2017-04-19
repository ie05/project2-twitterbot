var removeRegexChars = require('../helpers/regex');
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
var T = new Twit({
 consumer_key: process.env.BOT_CONSUMER_KEY,
 consumer_secret: process.env.BOT_CONSUMER_SECRET,
 access_token: process.env.BOT_ACCESS_TOKEN,
 access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET,
 timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
});

var Bot = new TwitterBot({
 consumer_key: process.env.BOT_CONSUMER_KEY,
 consumer_secret: process.env.BOT_CONSUMER_SECRET,
 access_token: process.env.BOT_ACCESS_TOKEN,
 access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});


// random default phrases if twit object fails for any reason
     var phraseArray = [ 
                              'It\'s all in the reflexes',
                         'Is it getting hot in here, or is it just me?',
                         'Ol\' Jack always says... what the hell?',
                         'Have ya paid your dues, Jack? "Yessir, the check is in the mail."',
                         'Like I told my last wife, I says, "Honey, I never drive faster than I can see."',
                         'Everybody relax, I\'m here.',
                         'Tall guy, weird clothes. First you see him, then you don\'t.',
                         'If we\'re not back by dawn... call the president',
                         'Just look that big ol\' storm right square in the eye and say, "Give me your best shot, pal."',
                         'I was born ready'
                        ];
          
     // use Math.floor and Math.random to
     // select a random Jack Burton Quote
     function chooseRandom(myArray) {
       return myArray[Math.floor(Math.random() * myArray.length)];
     }

     var generateRandomPhrase = function(){
          return chooseRandom(phraseArray);
     };

// get the current date's value
// and subtract 24 hours (86400000 ms)
var yesterdaysTimeInMilliseconds = new Date().getTime() - 86400000;

// create a new date obj and convert to ISO time
// which is twitter's perferred time format
var previousDay = new Date(yesterdaysTimeInMilliseconds).toISOString().substring(0, 10);

// the base of the bot's tweet that will be
// appended to with the twit obj's text
var basePhrase = 'You know what ol\' Jack Burton always says?';

// call the chooseRandom {f} and 
// store in a variable
var randomPhrase = generateRandomPhrase();

// use twit obj to make twitter api request
// currently, restricts return to 10 tweets
// made in the last 24 hours that came from
// the @TheOnion twitter handle
T.get('search/tweets', { q: '@TheOnion since:' + previousDay, count: 10 }, function(err, data, response) {
      if (err) {
          return next(err);
      }
          
     // if the returned obj has a
     // statuses property that is not
     // null, use query to generate a bot tweet
     // else use default logic to generate tweet
      if (data.statuses.length > 0 ) {
           
           // create local variable to hold status
           // returned by Twit object query
           var statuses = [];

           // create empty string to hold status text
           // once it has been parsed.
           var text = '';
           
           // declaring final tweet string
           // this will be used to make the bot's tweet
           var tweet = '';

           // loop over the data.statuses obj and push
           // to the statuses arr. I could have just
           // used the data.statuses arr, but to be less
           // destructive with my data, I choose to creat a
           // new array
           for (var i = 0; i < data.statuses.length; i++) {
               statuses.push(data.statuses[i].text);
           }

           // loop over the stauses array with map, and 
           // apply regex {f} to each index in
           // statuses array. Return a new array called trimmedStatuses
           // trimmedStatuses will hold tweets with tags, urls,
           // and @twitter handles removed
           var trimmedStatuses = statuses.map(removeRegexChars);
            
           // get the first trimmedStatus that is short enough
           // for a tweet, and use the text at its index
           for (var i = 0; i < trimmedStatuses.length; i++) {
               trimmedStatuses[i].length <  95 ? text = trimmedStatuses[i] : text = randomPhrase;
               // the first status that meets character
               // requirements, break loop and return
               break;
           }

           // var trimTextLengthIfTooLong
           var data = JSON.stringify(trimmedStatuses);
           tweet = basePhrase + ' ' + text;
            
           // get current date
           // used to check if date is
           // Saturday
           var d = new Date().getDay();
            
           // I like the real movie quotes so much
           // on Saturdays, I like my bot to say actual
           // quotes, not info pulled from twitter 
           if (d === 6) {
            tweet = basePhrase + ' ' + randomPhrase; 
           }
           
           Bot.tweet(tweet);
           
      }else{
          
          var twitText = basePhrase + ' ' + randomPhrase; 
          
          Bot.tweet(twitText);
      }

});