# MongoDbTweets

The project I have created run on:
Database - MongoDB
Server - Node.js (with express.js)
frontend - Jade (templating)

1) db.tweets.distinct("User").length

659774

2) db.tweets.aggregate({$match: {Text: {$regex: /@\S+/g}}}, {$group: {_id: "$User", count:{$sum:1}}}, {$sort: {"count":-1}}, {$limit: 10});

{"_id" : "lost_dog", "count: : 548}

{"_id" : "tweetpet", "count: : 310}

{"_id" : "VioletsCRUK", "count: : 251}

{"_id" : "what_bugs_u", "count: : 246}

{"_id" : "tsarnick", "count: : 245}

{"_id" : "SallytheShizzle", "count: : 229}

{"_id" : "mcraddictal", "count: : 217}

{"_id" : "Karen230683", "count: : 216}

{"_id" : "keza34", "count: : 211}

{"_id" : "TraceyHewins", "count: : 202}

3) db.tweets.aggregate({$match: {Text: {$regex: /@\S+/g}}}, {$group: {"_id": null, "user": {$push: {$substr: ["$Text", {$indexOfCP: ["$Text","@"]}, -1]}}}});

4) db.tweets.aggregate({$group: {_id: "$User", count:{$sum:1}}}, {$sort: {"count": -1}}, {$limit:10});

{"_id" : "lost_dog", "count: : 549}

{"_id" : "webwoke", "count: : 345}

{"_id" : "tweetpet", "count: : 310}

{"_id" : "SallytheShizzle", "count: : 281}

{"_id" : "VioletsCRUK", "count: : 279}

{"_id" : "mcraddictal", "count: : 276}

{"_id" : "tsarnick", "count: : 248}

{"_id" : "what_bugs_u", "count: : 246}

{"_id" : "Karen230683", "count: : 238}

{"_id" : "DarkPiano", "count: : 236}

5) db.tweets.aggregate([{ $match: { polarity: 4 } },{ $group: { _id: '$user', count: { $sum: 1 } } },{ $sort: { count: -1 } },{ $limit: 5 }])};

{"_id" : "what_bugs_u", "count: : 246}

{"_id" : "DarkPiano", "count: : 231}

{"_id" : "VioletsCRUK", "count: : 218}

{"_id" : "tsarnick", "count: : 212}

{"_id" : "keza34", "count: : 211}

5) db.tweets.aggregate([{ $match: { polarity: 0 } },{ $group: { _id: '$user', count: { $sum: 1 } } },{ $sort: { count: -1 } },{ $limit: 5 }])};

{"_id" : "lost_dog", "count: : 549}

{"_id" : "tweetpet", "count: : 310}

{"_id" : "webwoke", "count: : 264}

{"_id" : "mcraddictal", "count: : 210}

{"_id" : "wowlew", "count: : 210}
