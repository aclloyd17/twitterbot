// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var georgiaTechSearch = {q: "#georgiatech", count: 10, result_type: "recent"}; 

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', georgiaTechSearch, function (error, data) {
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

// ADDED MATERIAL

var pre = [
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

function tweetRandom() {

	let tweetText = pre.pick();

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

// GETTING DATA FROM TWITTER

var getParams = {
	q: "#georgiatech",
	count: 10
	// lang: en
}

function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}

T.get('search/tweets', getParams, gotData);

// POSTING

function tweetIt(text) { // General tweet method
	var tweet = {
		status: text
	}

	function tweeted(err, data, response) {
		if (err) {
			console.log("Something went wrong while trying to tweet!");
		} else {
			console.log("It worked!");
		}
	}

	T.post('statuses/update', tweet, tweeted);
}

// USING THE TWITTER STREAM

var stream = T.stream('user'); // Tweet after follow

stream.on('follow', followed);

function followed(eventMsg) {
	let name = eventMsg.source.name;
	let screenName = eventMsg.source.screen_name;
	tweetIt("@" + screenName + " thank you for following!");
}

var stream2 = T.stream('user'); // Tweet after mention

stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
	let replyTo = eventMsg.in_reply_to_screen_name;
	let text = eventMsg.text;
	let from = eventMsg.user.screen_name;

	if (replyTo == "005botlmc") {
		let newTweet = "@" + from + " i am here";
		tweetIt(newTweet);
	}
}

// POSTING OTHER MEDIA

function postPicture(filePath) { // Post a picture
	T.postMediaChunked({ file_path: filePath }, picturePost); 

	function picturePost(err, data, response) {
		if (err) {
			console.log("Error: " + err);
		} else {
			console.log("Picture posted!");
		}
	}
}

// POSTS
postPicture("./buzz_fisheye");

// END OF ADDED MATERIAL

// Try to retweet something as soon as we run the program...
// retweetLatest();
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 60);

// POSTING INTERVALS

setInterval(tweetRandom(), 1000 * 60 * 1440); // Every 24 hours

