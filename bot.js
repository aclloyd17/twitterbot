// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// This is the URL of a search for the latest tweets on the '#georgiatech' hashtag.
var georgiaTechSearch = {q: "#georgiatech", count: 10, result_type: "recent"}; 

// This function finds the latest tweet with the #georgiatech hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', georgiaTechSearch, function (error, data) {
	  // log out any errors and responses - if the tweet will not be tweeted, there's one error
		//if there is an error getting to twitter, there is another.
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
	  // However, if our original search request had error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

// ADDED MATERIAL

// This variable contains strings that we will want to tweet at regular intervals while the bot is running.
// they're meant to be jokes, mainly inside jokes to GT Students.
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

//this function chooses a random string from the variable above
Array.prototype.pick = function() {
	return this[Math.floor(Math.random()*this.length)];
}

var debug = false;

// calls pick() to get the tweet, then sends it out to twitter. DEBUG provides context for errors, if it isn't tweeted properly.
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
				//logs if there are no errors!
				console.log('Tweeted: ', tweetText);
			}
		});
}

// // GETTING DATA FROM TWITTER
// // looks for the hashtag for georgiatech
var getParams = {
	q: "#georgiatech",
	count: 10
	// lang: en
}

// //the tweets that were found, which will be logged to the console.
function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}

T.get('search/tweets', getParams, gotData);

// // POSTING
// //this function is what actually posts the tweets.
// //it is called in a few of the methods in order to actually push the tweets we create into the twitterverse.

function tweetIt(text) { // General tweet method
	var tweet = {
		status: text
	}

	function tweeted(err, data, response) {
		//errors if the tweet doesn't work
		if (err) {
			console.log("Something went wrong while trying to tweet!");
		} else {
			console.log("It worked!");
		}
	}

	T.post('statuses/update', tweet, tweeted);
}

// // USING THE TWITTER STREAM

// //this will look for a user that follows us and tweet to mention them.
// //it will say "@username thank you for following!"

// var stream = T.stream('user'); // Tweet after follow

// const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAP38iQEAAAAAMYRbZea1BUsjI9IjH1kDMIoPDVg%3D40yzUSBBxfcDBcVUT3jSC885f2OAOOqeK4ZvwUrDBKQBf0bLHd";

// const client = process.env.BEARER_TOKEN;
// const stream = T.stream('tweets/sample/stream');
// var stream = T.stream('statuses/filter', { track: '@005botlmc' }); // Tweet after follow

// function followed(eventMsg) {
// 	let name = eventMsg.source.name;
// 	let screenName = eventMsg.source.screen_name;
// 	tweetIt("@" + screenName + " thank you for following!");
// }

// stream.on('follow', followed);

// var stream2 = T.stream('user'); // Tweet after mention
// // var stream2 = T.stream('statuses/filter', { track: '@005botlmc' });

// function tweetEvent(eventMsg) {
// 	let replyTo = eventMsg.in_reply_to_screen_name;
// 	let text = eventMsg.text;
// 	let from = eventMsg.user.screen_name;

// 	if (replyTo == "005botlmc") {
// 		let newTweet = "@" + from + " i am here";
// 		tweetIt(newTweet);
// 	}
// }

// //uses the stream in order to create the tweet in the event that our bot is followed.
// stream2.on('tweet', tweetEvent);

// POSTING OTHER MEDIA
//takes a picture from the pictures file (linked through the path) and tweets it.

// function postPicture(filePath) { // Post a picture

// 	function picturePost(err, data, response) {
// 		if (err) {
// 			console.log("Error: " + err);
// 		} else {
// 			console.log("Picture posted!");
// 		}
// 	}

// 	T.postMediaChunked({ file_path: filePath }, picturePost); 
// }

// // POSTS
// postPicture("./Pictures/buzz_fisheye.jpg");

// END OF ADDED MATERIAL

// Try to retweet something as soon as we run the program...
// retweetLatest();
// tweetRandom();
// tweetIt("i'm alive!");
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60

// POSTING INTERVALS

setInterval(retweetLatest, 1000 * 60 * 2); // Every 2 minutes
setInterval(tweetRandom, 1000 * 60 * 5); // Every 5 minutes
