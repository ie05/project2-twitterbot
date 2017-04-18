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
		

	module.exports = generateRandomPhrase;