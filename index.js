var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Usually I would use a templating engine, but not for a single page app.

app.listen(port);
console.log('Listening on ' + port);
