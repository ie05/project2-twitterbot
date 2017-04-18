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


module.exports = removeRegexChars;