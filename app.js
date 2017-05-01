var express = require('express');

var port = 8999;

var app = express.createServer();

const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://localhost:27017/twitter', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port, () => {
    console.log('listening on ' + port);
  })
})

app.configure(function () {
    app.use(express.bodyParser());
    app.use(app.router);
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
});


app.get('/', function (req, res, next) {
	res.render('index');
}); 

app.get('/users', function (req, res, next) {
	db.collection('tweets').distinct('user', (err, data) => {
	    if (err) {
			console.log("error ", err);
	    } else {
			res.send(data.length + " distinct users");
	    }
	});
});

app.get('/linker', function (req, res, next) {
	db.collection('tweets').aggregate({$match: {text: {$regex: /@\S+/g}}}, {$group: {_id: "$user", count:{$sum:1}}}, {$sort: {"count":-1}}, {$limit: 10}, (err, data) => {
	    if (err) {
			console.log("error ", err);
	    } else {
			res.send(JSON.stringify(data));
	    }
	});
});

app.get('/mentioned', function (req, res, next) {
	db.collection('tweets').aggregate({$match: {text: {$regex: /@\S+/g}}}, {$group: {_id: "$user", texts:{ $addToSet: '$text'}, count:{$sum:1}}}, {$sort: {"count":-1}}, {$limit: 10}, (err, data) => {
	    if (err) {
			console.log("error ", err);
	    } else {

			res.send(JSON.stringify(data));
	    }
	});
});

app.get('/active', function (req, res, next) {
	db.collection('tweets').aggregate({$group: {_id: "$user", count:{$sum:1}}}, {$sort: {"count": -1}}, {$limit:10}, (err, data) => {
	    if (err) {
			console.log("error ", err);
	    } else {
			res.send(data);
	    }
	});
});

app.get('/positive', function (req, res, next) {
	db.collection('tweets').aggregate({ $match: { polarity: 4 } }, { $group: { _id: '$user', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }, (err, data) => {
	    if (err) {
			console.log("error ", err);
	    } else {
			res.send("Top 5 positive users: " + JSON.stringify(data));
	    }
	});
});

app.get('/negative', function (req, res, next) {
	db.collection('tweets').aggregate({ $match: { polarity: 2 } }, { $group: { _id: '$user', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }, (err, data) => {
	    if (err) {
			console.log("error ", err);
	    } else {
			res.send("Top 5 negative users: " + JSON.stringify(data));
	    }
	});
});

function sortMostActive(data) {
	for (var i = data.length - 1; i >= 0; i--) {
		data.text
	}
}


// 1) db.tweets.distinct("User").length
// 2) db.tweets.aggregate({$match: {Text: {$regex: /@\S+/g}}}, {$group: {_id: "$User", count:{$sum:1}}}, {$sort: {"count":-1}}, {$limit: 10});
// 3) db.tweets.aggregate({$match: {Text: {$regex: /@\S+/g}}}, {$group: {"_id": null, "user": {$push: {$substr: ["$Text", {$indexOfCP: ["$Text","@"]}, -1]}}}});
// 4) db.tweets.aggregate({$group: {_id: "$User", count:{$sum:1}}}, {$sort: {"count": -1}}, {$limit:10})
// 5) db.tweets.aggregate([{ $match: { polarity: 4 } },{ $group: { _id: '$user', count: { $sum: 1 } } },{ $sort: { count: -1 } },{ $limit: 5 }])};
// 5) db.tweets.aggregate([{ $match: { polarity: 2 } },{ $group: { _id: '$user', count: { $sum: 1 } } },{ $sort: { count: -1 } },{ $limit: 5 }])};