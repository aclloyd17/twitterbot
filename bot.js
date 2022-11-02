// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var GTSearch = {q: "#georgiatech", count: 10, result_type: "recent"}; 

var pre;

pre = [
	"I'm about to give sideways more than a penny to pass this final",
	"happy end of add/drop season!",
	"hours spent in the culc are starting to outweigh hours in bed",
	"can't wait for thanksgiving break",
	"javascript is a new beast. i wasn't prepared for this :)",
	"it's a huge honor to ride onto the field in the ramblin' reck",
	"bobby dodd must be dissapointed in our football team",
	"bot bot bot ",
	"i still don't know what an eigenvalue is",
	"bring back T-night",
	"ya'll ever just remember that west campus is a real place?",
	"check out the kendeda toiilets",
	"best spot on campus is the hammocks",
	"sweethut has singlehandedly kept me alive this semester"
]

Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}

function tweet() {

	var tweetText = pre.pick();

	if(debug) 
		console.log('Debug mode: ', tweetText);
	else
		T.post('statuses/update', {status: tweetText }, function (err, reply) {
			if (err != null){
				console.log('Error: ', err);
			}
			else {
				console.log('Tweeted: ', tweetText);
			}
		});
}


// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', GTSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// Try to retweet something as soon as we run the program...
retweetLatest();
tweet();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);
