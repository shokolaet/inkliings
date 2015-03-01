var express = require('express');
var path = require('path');
var env = require('./env');
//var favicon = require('serve-favicon');

var app = express();

// load environmental variables
env.loadEnvVariables();

var instagram = require('instagram-node').instagram();
var Twitter = require('twitter');
//var Linkedin = require('node-linkedin')(process.env['LINKEDIN_KEY'], process.env['LINKEDIN_SECRET'], 'linkedinCallback');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/static', express.static(__dirname + '/static'));

instagram.use({
    client_id: process.env['INSTAGRAM_CLIENT_ID'],
    client_secret: process.env['INSTAGRAM_CLIENT_SECRET']
});

app.get("/instagram", function (req, res) {
    var data = {
        LINKEDIN_KEY: process.env['LINKEDIN_KEY'],
        instagramUserError: false,
        instagramMediaError: false
    };

    // TODO: change username
    instagram.user_search('taylorswift', function (err, users, remaining, limit) {
        if (err || users.length == 0) {
            data['instagramUserError'] = true;
        } else {
            data['instagramUser'] = users[0];
        }
        //Test people:
        //kristie: 16303615 (private user)
        //swift: 11830955 (public user)

        // TODO: change id
        instagram.user_media_recent('11830955', function (err, medias, pagination, remaining, limit) {
            if (err) {
                data['instagramMediaError'] = err;
            } else {
                if (medias.length > 5) { // get 5 photos max
                    data['instagramNumPhotos'] = 5;
                } else {
                    data['instagramNumPhotos'] = medias.length;
                }
                data['instagramPhotos'] = medias.slice(0, data['instagramNumPhotos']);
            }

            res.type('html');
            res.render('index.ejs', data);
        });
    });
});

//var linkedinCallback = function () {
//    app.get('/oauth/linkedin', function(req, res) {
//        // This will ask for permisssions etc and redirect to callback url.
//        Linkedin.auth.authorize(res, ['r_basicprofile']);
//    });
//
//    app.get('/oauth/linkedin/callback', function(req, res) {
//        Linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {
//            if ( err )
//                return console.error(err);
//
//            /**
//             * Results have something like:
//             * {"expires_in":5184000,"access_token":". . . ."}
//             */
//
//            console.log(results);
//            return res.redirect('http://localhost:1337/instagram');
//        });
//    });
//};

var twitterClient = new Twitter({
    consumer_key: process.env['TWITTER_CONSUMER_KEY'],
    consumer_secret: process.env['TWITTER_CONSUMER_SECRET'],
    access_token_key: '',
    access_token_secret: ''
});

var params = {screen_name: 'shokolaet'};

app.get("/twitter", function (req, res) {
    twitterClient.get('statuses/user_timeline', params, function (error, tweets, response) {
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