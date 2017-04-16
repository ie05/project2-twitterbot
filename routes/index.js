var express = require('express');
var router = express.Router();
var Twit = require('twit');
var T = new Twit({
  consumer_key:         '2ep9JxmzJZWRFsHBMEUjhcR0m',
  consumer_secret:      '8SiofFEtnWsA7LStjCbXV7xsJh2wXGCr3yqCXR0dTqY3ejTbpw',
  access_token:         '851970802543144961-IuygBxGwSjUwKokUyArh2yX4m8fEvCn',
  access_token_secret:  'SKv5ZNUZEe5BB817TravMp3W3Rii3fhoh0oILNVfKWC6K',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
})

// 86400000 in 24 hours;
//RT @DuncanCastles: Conte: 'I think the fault is mine because I wasn't able to transfer the right desire, the right motivation, to play this… &gt;&gt;&gt; https://t.co/g8cIa6SXOy &lt;&lt;&lt; http://t.co/g8cIa6SXOy
router.get('/', function(req, res, next) {
	var yesterdaysTimeInMilliseconds = new Date().getTime() - 86400000;
	var previousDay = new Date(yesterdaysTimeInMilliseconds).toISOString().substring(0, 10);
	
	// the base of the bot's tweet that will be
    // appended to with the twit obj's text
    var basePhrase = 'You know what ol\' Jack Burton always says?';

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
		
		function chooseRandom(myArray) {
		  return myArray[Math.floor(Math.random() * myArray.length)];
		}
		var randomPhrase = chooseRandom(phraseArray);

	T.get('search/tweets', { q: '@TheOnion since:' + previousDay, count: 10 }, function(err, data, response) {
	 if (err) {
	 	return next(err);
	 }
		// console.log(data);
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
	 		 // need to add logic to watch out for undefined
			 // or not returned tweets, throws off the whole
			 // program with TypeError otherwise

			 // var text = data.statuses[0].text;

			 for (var i = 0; i < data.statuses.length; i++) {
			  	statuses.push(data.statuses[i].text);
			 }
			 // var text = "RT @DuncanCastles: ... @DuncanCastles &amp; We ... work hard! #Entrepreneur #Startup #MakeYourOwnLane #defstar5 #Mpgvip #spdc #Fridayfeeling #motivation #quote #Leadership…";
			  
			  var removeRegexChars = function(text){
			  	var regex = [
			  		/\b^[RT @]+\s/igm, // reTweets 
			  		/\B#[a-z0-9_-]+/igm, // hashTags
			  		/(&amp;)|(&lt;)|(&gt;)/igm, // encodedChars
			  		/[<>{}()\[\]]/igm, // malChar
			  		/\B@[\:a-z0-9_-]+\s/igm, // atUsers
			  		/https?:\/\/(www\.)?[-a-z\/A-Z0-9@:%._\+~#=]{2,256}\.?[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/igm, // links
			  		/\.\.\./igm, // real ellipses
			  		/…/igm // non- utf ellipses
			  	];
				
				// loop over the regex array
				// and apply .replace method to passed in
				// string, return the string that has been
				// parsed and cleaned of invalid
				// or misc. characters
				var regexMap = regex.map(function(item){
					text = text.replace(item,'');
			  	});
			  	// string to return after every loop
			  	return text;
			  }

			  // loop over the stauses array with map, and 
			  // apply removeRegexChars {f} to each index in
			  // statuses array. Return a new array called trimmedStatuses
			  var trimmedStatuses = statuses.map(removeRegexChars);
			  
			  // get the first trimmedStatus that is short enough
			  // for a tweet, and use the text at its index
			  for (var i = 0; i < trimmedStatuses.length; i++) {
			  	trimmedStatuses[i].length <  95 ? text = trimmedStatuses[i] : text = randomPhrase;
			  	break;
			  }
			  // trimmedStatuses.map(function(item){
			  // 		item.length < 95 ? text = item : false;
			  // });

			  // console.log("text is " + text);
			  // console.log("length is " + text.length);
			  // need logic to check if tweet has already been tweeted
			  // need logic to check if char string is longer than 95 char
			  // for now, just exclude tweets by date.
			  // You can add a database with logic if time permits
			  // text = removeRegexChars(text);
			  // before sendng tweet, make sure it's short enough.
			  // var trimTextLengthIfTooLong
			  var data = JSON.stringify(trimmedStatuses);
			  tweet = basePhrase + ' ' + text;
			  
			  var d = new Date().getDay();
			  
			  // I like the moving quotes so much
			  // on Saturdays, I like my bot to say actual
			  // quotes, not info pulled form twitter 
			  if (d === 6) {
			  	tweet = basePhrase + ' ' + randomPhrase; 
			  }
			  console.log('tweet length is ' + tweet.length);
		  	 res.render('index', { title: 'I.H. Botman', description: 'Does Something Yet Undecided by Author', text: tweet, data: data});
	 }else{
	 	
	 	var twitText = basePhrase + ' ' + randomPhrase; 
	 	res.render('index', { title: 'I.H. Botman', description: 'Does Something Yet Undecided by Author', text: twitText });
	 }

	});

});



router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', description: 'Does Something Yet Undecided by Author' });
});

module.exports = router;
