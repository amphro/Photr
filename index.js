var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var url = require("url");

app.use(express.static(path.join(__dirname, 'public')));

// Usually I would use a templating engine, but not for a single page app.


/**
 * Get the response text from a GET rest call to a specific url
 */
function get(protocol, url, cb) {
    protocol.get(url, function callback(response) {
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
        .param('photoset_id', req.query.photosetId)
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

    get(https, url, function(data) {
        res.send(parseFlickResponse(data))
    });
});

/**
* A route to get photos via google search. We could make the API request
* from the client, but then our API key would in out client side JS,
* and checked into git hub.
*/
app.get('/searchGoogleImages', function(req, res) {
    var proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL);

    var target = url.parse(new Url('https://www.googleapis.com/customsearch/v1')
    .param('searchType', 'image')
    // Use an enviornment variable for api keys
    .param('key', process.env.GOOGLE_API_KEY)
    .param('q', req.query.searchString)
    .param('imgSize', 'medium')
    .param('cx', '014185715683879608906:mznjafyz2sg')
    .build());

    var options = {
        hostname: proxy.hostname,
        port: proxy.port || 80,
        path: target.href,
        headers: {
            "Proxy-Authorization": "Basic " + (new Buffer(proxy.auth).toString("base64")),
            "Host" : target.hostname
        }
    };

    get(http, options, function(data) {
        res.send(data)
    });
});

app.listen(port);
console.log('Listening on ' + port);
