var express = require('express');
var path = require('path');
var instagram = require('instagram-node').instagram();
var Twitter = require('twitter');
var env = require('./env');
//var favicon = require('serve-favicon');

var app = express();

// load environmental variables
env.loadEnvVariables();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/static', express.static(__dirname + '/static'));

instagram.use({ client_id: process.env['INSTAGRAM_CLIENT_ID'],
    client_secret: process.env['INSTAGRAM_CLIENT_SECRET'] });

app.get("/linkedin", function (req, res) {
    var data = {
        LINKEDIN_KEY: process.env['LINKEDIN_KEY']
    };
    res.render('index.ejs', data);
});

app.get("/instagram", function (req, res) {
    instagram.user_search('classickristie', function(err, users, remaining, limit) {
        //console.log(users);
        res.type('html');
        var data = {
            LINKEDIN_KEY: process.env['LINKEDIN_KEY'],
            user: users[0]
        };
        res.render('index.ejs', data);
    });

});

var twitterClient = new Twitter({
    consumer_key: process.env['TWITTER_CONSUMER_KEY'],
    consumer_secret: process.env['TWITTER_CONSUMER_SECRET'],
    access_token_key: '',
    access_token_secret: ''
});

var params = {screen_name: 'shokolaet'};

app.get("/twitter", function (req, res) {
    twitterClient.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            console.log(tweets);
        } else {
            console.log(error);
        }
    });
});

module.exports = app;

var port = Number(process.env.PORT || 1337);
var server = app.listen(port, function () {
    //var host = server.address().address;
    //var port = server.address().port;
});