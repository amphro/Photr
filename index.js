var express = require('express');
var https = require('https');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Usually I would use a templating engine, but not for a single page app.


/**
 * Get the response text from a GET rest call to a specific url
 */
function get(url, cb) {
    https.get(url, function callback(response) {
        var str = '';
        response.on('data', function (chunk) { str += chunk; });
        response.on('end', function () { cb(str); });
    }).end();
}

/**
 * A very simple Url class to make building GET urls easier.
 * Takes the base url (with no url query parameters);
 */
function Url(baseUrl) {
    this.url = baseUrl;
    this.params = [];
}

/**
 * Add a url query parameter to the url. This will look like
 * "name=val" in the built url.
 */
Url.prototype.param = function(name, val) {
    this.params.push(name + '=' + val);
    return this;
}

/**
 * Build the url, adding all the params to the base url in the
 * form of baseUrl?name1=val&name2=val2&...
 */
Url.prototype.build = function() {
    // If params is empty, we will just return the url with a '?'
    // at the end, which is still a valid url
    return this.url + '?' + this.params.join('&');
}

/**
 * A route to get photos via flickr. We could make the API request
 * from the client, but then our API key would in out client side JS,
 * and checked into git hub.
 */
app.get('/flickrPhotos', function(req, res) {
    var url = new Url('https://api.flickr.com/services/rest/')
        .param('method', 'flickr.photosets.getPhotos')
        // Use an enviornment variable for api keys
        .param('api_key', process.env.FLICKR_API_KEY)
        .param('photoset_id', '72157626579923453')
        .param('format', 'json')
        .param('extras', 'url_m')
        .build();

    function parseFlickResponse(data) {
        // Flickr wraps their JSON data in a function call. Let's remove that.
        var rawJson = data.match(/^jsonFlickrApi\((.*)\)$/);
        if (!rawJson || rawJson.length != 2) {
            throw new Error('Invalid flickr response data: ' + data);
        }
        return rawJson[1];
    }

    get(url, function(data) {
        res.send(parseFlickResponse(data))
    });
});

app.listen(port);
console.log('Listening on ' + port);
