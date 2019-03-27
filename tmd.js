const fs = require('fs');
const papa = require('papaparse');
const file = fs.createReadStream('pol_accounts.csv');
const tweets = fs.createReadStream('pol_tweets.csv');

// Process Tweets
const processTweets = (data, ids) => {
	console.log(ids);
	data = data.slice(1)
		.filter(d => ids.includes(d[1]));

	console.log(data.length);
	const json = JSON.stringify(data);
	fs.writeFile('tweets.json', json, 'utf8', () => console.log('success!'));
}

// Process IDs
const processData = data => {
	const frame = data[0];
	// data = data.slice(1).filter(e => e.description.includes("senator"));

	let count = 0;
	const ids = data.slice(1)
		.filter(d => d[2].includes("senator") || d[2].includes("Senator"))
		.map(d => d[0]);

	papa.parse(tweets, {
		complete: res => processTweets(res.data, ids)
	})
}

papa.parse(file, {
	complete: res => processData(res.data)
});