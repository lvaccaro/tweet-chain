const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const program = require('commander');



// Parse parameters

var pageToVisit = "";
var height = 0;
var debug = false;
var pageToLink = "";

program
    .version(require('./package.json').version)
    .option('-v, --verbose', 'Show intermediate tweet')
  	.option('-t, --tweet [link]', 'Tweet selected')
    .parse(process.argv);

if (program.tweet == undefined){
	program.help();
	return;
} else {
	pageToVisit = program.tweet;
	pageToLink = pageToVisit;
}

if (program.verbose !== undefined ){
	debug = true;
}



if (debug){
	console.log("Visiting page: " + pageToVisit);
}

var parse = function (error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     if(debug){
     	console.log("Url: "+pageToLink);
     	console.log("Height: "+height);
     	console.log("Title:  " + $('title').text());
     }
     
     height++;
     var tag = $("div.permalink-tweet-container div.tweet div.QuoteTweet div.QuoteTweet-container a.QuoteTweet-link ");
     if(tag.length > 0){
     	// next
     	pageToLink = "https://twitter.com"+tag.attr('href');
     	request(pageToLink, parse);
     } else {
     	// finish
	height--;
		console.log("Visit tweet: "+pageToVisit);
		console.log("Genesis tweet: "+pageToLink);
		console.log("Height: "+height);
     }
     
   } else {
   	 console.log("Status code: " + response.statusCode);
   }
};
   
request(pageToVisit, parse);

