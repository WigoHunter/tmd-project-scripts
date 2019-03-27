const fs = require('fs');
const papa = require('papaparse');
const tweets = fs.createReadStream('tweets.csv');

// Process IDs
const processData = data => {
	let copy = data.slice(1);
	// let sets = [];
	let count = 0;
	let total = 0;

	console.log("start");

	copy.forEach(t => {
		// Getting word cloud data prepared
		if (t[4].length) {
			const words = t[4].slice(1, t[4].length - 1).split(',');
			words.forEach(word => {
				sets.push(word);
			});
		}

		// Counting number of tweets with hashtags
		if (t[4].length > 2) {
			count++;
		}

		total++;
	});

	console.log(`out of ${total} tweets, ${count} has hashtags`);

	const obj = {
		words: sets.join(" ")
	};

	fs.writeFile('words.json', JSON.stringify(obj), 'utf8', () => console.log('success'));

	// Sort by number of likes
	copy.sort((a, b) => b[6] - a[6]);
	let top1000favorite = copy.slice(0, 1000);
	fs.writeFile('top_1000_favorite.json', JSON.stringify(top1000favorite), 'utf8', () => console.log('favs success!'));
	copy = copy.map(row => ({ "counts": row[6] }));
	fs.writeFile('favs.json', JSON.stringify(copy), 'utf8', () => console.log("done #1"));

	// top 1000 favorited tweets

	// Sort by number of retweets
	copy = data.slice(1);
	copy.sort((a, b) => b[7] - a[7]);
	let top1000retweeted = copy.slice(0, 1000);
	fs.writeFile('top_1000_rts.json', JSON.stringify(top1000retweeted), 'utf8', () => console.log('rts success!'));
	copy = copy.map(row => ({ "counts": row[7] }));
	fs.writeFile('rts.json', JSON.stringify(copy), 'utf8', () => console.log("done #2"));
	
	// Number of tweets every year
	let years = {};
	for (let i = 2008; i <= 2017; i++) {
		years[i] = 0;
	}

	data.forEach(tweet => {
		years[new Date(tweet[2]).getFullYear()]++;
	});

	console.log(years);
	fs.writeFile('tweets_each_year.json', JSON.stringify(years), 'utf8', () => console.log("years success!"));
}

papa.parse(tweets, {
	complete: res => processData(res.data)
});