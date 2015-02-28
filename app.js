var express = require('express');
var path = require('path');
var instagram = require('instagram-node').instagram();
var Twitter = require('twitter');
//var favicon = require('serve-favicon');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/static', express.static(__dirname + '/static'));

instagram.use({ client_id: 'INSTAGRAM_ID',
    client_secret: 'INSTAGRAM_SECRET' });

app.get("/instagram", function (req, res, next) {
    instagram.user_search('classickristie', function(err, users, remaining, limit) {
        //console.log(users);
        res.type('html');
        var user = users[0];
        res.render('index.ejs', user);
    });

});

var twitterClient = new Twitter({
    consumer_key: 'TWITTER_KEY',
    consumer_secret: 'TWITTER_SECRET',
    access_token_key: '',
    access_token_secret: ''
});

var params = {screen_name: 'shokolaet'};

app.get("/twitter", function (req, res, next) {
    twitterClient.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            console.log(tweets);
        } else {
            console.log("Twitter error");
        }
    });
});

module.exports = app;

var port = Number(process.env.PORT || 1337);
var server = app.listen(port, function () {
    //var host = server.address().address;
    //var port = server.address().port;
});