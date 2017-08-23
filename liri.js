/**
 * Created by zdayar on 8/21/17.
 */
var request = require('request');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
        id: 'cda125c164944b30935d9fe3f2065b21',
        secret: '3d1d2faffb22404fa4ca7d94f07400fa'
});

var Twitter = require('twitter');
var twitterClient = new Twitter({
    consumer_key: 'G4OAcciMxx5bp3DBJAwDTDagE',
    consumer_secret: '2VMbohZ6x2zdtXjdXZ6fNdQvPTzrwFH5wyxQnz5dWD99PWqq4g',
    access_token_key: '899670418705043456-oMMUoWZ465ar4mtajwzfwmpeHFyKqOD',
    access_token_secret: 'g7O3UtQ2WwGSgexKmr5MPoh3IXBK01ECncqg1Ej1ILLLI'
});

var words;
var command = process.argv[2];
var reqUrl;

liriProcess(command);

function liriProcess(command) {
    switch (command) {
        case 'movie-this':
            movie_search();
            break;

        case 'spotify-this-song':
            track_search();
            break;

        case 'my-tweets':
            display_tweets();
            break;

        case 'do-what-it-says':
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }

                // Then split it by commas
                var dataArr = data.split(",");
                command = dataArr[0];

                process.argc = dataArr.length;
                for (var l = 0; l < dataArr.length; l++) {
                    process.argv[l+2] = dataArr[l];
                }

                liriProcess(command);
            });
            break;

        default:
            break;
    }
}

function movie_search() {
    var movieName = 'Mr. Nobody'; // default movie name
    if (process.argv.length > 3) {
        words = process.argv.slice(3, process.argv.length);
        movieName = words.join(' ');
    }

    reqUrl = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieName;
    request(reqUrl, function (error, response, body) {

        if (error) {
            console.log("some error happened");
        }
        // If the request was successful...
        else if (response.statusCode === 200) {
            var movieData = JSON.parse(body);
            var ratings = movieData['Ratings'];
            var IMDBRating;
            var RottenTomatoesRating;
            for (var i=0; i< ratings.length; i++) {
                if (ratings[i]['Source'] === 'Internet Movie Database') {
                    IMDBRating = ratings[i]['Value'];
                }
                else if (ratings[i]['Source'] === 'Rotten Tomatoes') {
                    RottenTomatoesRating = ratings[i]['Value'];
                }
            }

            console.log('Year: ' + movieData['Year']);
            console.log('IMDB rating: ' + IMDBRating);
            console.log('Rotten Tomatoes rating: ' + RottenTomatoesRating);
            console.log('Country produced: ' + movieData['Country']);
            console.log('Language: ' + movieData['Language']);
            console.log('Plot: ' + movieData['Plot']);
            console.log('Actors: ' + movieData['Actors']);

        }
        else {
            console.log(response.statusCode);
        }
    });
}

function track_search() {
    var songName = 'The Sign Ace of Base'; // default song name
    if (process.argv.length > 3) {
        words = process.argv.slice(3, process.argv.length);
        songName = words.join(' ');
    }

    spotify
        .search({ type: 'track', query: songName })
        .then(function(response) {
            var trackInfo = response.tracks.items[0];
            console.log('Artist(s):');
            for (var j=0; j<trackInfo.artists.length; j++) {
                console.log(' ' + trackInfo.artists[j].name);
            }
            console.log('Song: ' + trackInfo.name);
            console.log('Preview URL: ' + trackInfo.preview_url);
            console.log('Album: ' + trackInfo.album.name);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function display_tweets() {
    var timestamp;
    var params = {screen_name: 'zeynep_dayar', count: 20};
    twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var k=0; k<tweets.length; k++) {
                console.log('Tweet: ' + tweets[k].text);
                timestamp = new Date(Date.parse(tweets[k].created_at));
                console.log('@: ' + timestamp);
            }
        }
    });

}
