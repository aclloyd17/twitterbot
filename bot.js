// This is our Twitterbot, funny.gt ! It's job is to tweet funny things relating to Georgia Tech and engaging with the campus community!
// It tweets, retweets, replies to mentions, gets info from Twitter, and favorites posts related to Georgia Tech.
// All of these things happen on timed intervals that you'll see at the bottom of this file.
// There are also a couple of individual tests commented at the bottom in case you would like to use those to test instead of the intervals.

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

// GETTING DATA FROM TWITTER
// looks for posts with the hashtags for #georgiatech AND #gatech making it more likely to be directly related to the school
var getParams = {
	q: "#georgiatech, #gatech",
	count: 10
	// lang: en
}

//the tweets that were found, which will be logged to the console.
function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++) {
		console.log(tweets[i].text);
	}
}

T.get('search/tweets', getParams, gotData);

// FAVORITING
// This uses the twitter stream to help us favorite posts related to GT
var favoriteTweet = function() {
	var fParams = { // Here are the parameters for finding tweets to favorite
		q: '#georgiatech, #gatech',
		result_type: 'recent',
		lang: 'en'
	}
  
	// This finds the tweet with the set parameters
	T.get('search/tweets', fParams, function(err,data){
  
	  var tweet = data.statuses;
	  var randomTweet = randomTweetPicker(tweet);   // picks a random tweet to favorite
  
	  if(typeof randomTweet != 'undefined'){
		T.post('favorites/create', {id: randomTweet.id_str}, function(err, response){ // Favorites the tweet
		  if(err){
			console.log('This cannot be favorited!'); // If there's an error, we receive this.
		  }
		  else{
			console.log('You favorited a post!'); // Otherwise, it's a success!
		  }
		});
	  }
	});
  }
  // function to generate a random tweet tweet
  function randomTweetPicker (arr) {
	var index = Math.floor(Math.random()*arr.length);
	return arr[index];
  };

// POSTING
//this function is what actually posts the tweets.
//it is called in a few of the methods in order to actually push the tweets we create into the twitterverse.

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

// USING THE TWITTER STREAM

//this will look for a user that mentions us and tweet to mention them.
//it will say "@username thank you for mentioning me!"

var mParams = { // These are the parameters to search for the mention
	q: "@005botlmc",
	count: 10,
	lang: 'en'
}

function replyToMention() { // This function helps to dissect the tweet we mention and reply to the mentioner
	T.get('search/tweets', mParams, function (error, data) {
	  console.log(error, data);
	  if (!error) {
		var mentionID = data.statuses[0].id_str;
		var replyTo = data.statuses[0].in_reply_to_screen_name; // This is our bot's screen name
		var from = data.statuses[0].user.screen_name; // This is who mentioned us
		if (replyTo == "005botlmc") {
			tweetIt("@" + from + " thank you for mentioning me!");
		}
	  }
	  else {
	  	console.log('There was an error with your mention search:', error); // If there's an error, it sends us this in the console
	  }
	});
}

// THESE ARE VARIOUS TESTS WE RAN

// retweetLatest();
// tweetRandom();
// tweetIt("i'm alive!");

// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60

// POSTING INTERVALS

setInterval(retweetLatest, 1000 * 60 * 120); // Every 2 hours
setInterval(tweetRandom, 1000 * 60 * 1440); // Every day
setInterval(favoriteTweet, 1000 * 60 * 60); // Every hour
setInterval(replyToMention, 1000 * 60 * 1440); // Every day
