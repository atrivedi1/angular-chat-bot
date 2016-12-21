//dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var responder = require('./server/bot');

//create instance of express
var app = express();
var expressWs = require('express-ws')(app)

//middleware
app.use(express.static('client'));
app.use(cookieParser());

//adding web sockets functionality to server
app.ws('/', function(ws, req) {
  ws.on('message', function(message) {
    console.log("cookies --->", req.cookies);
    var username = req.cookies.username;
    var messageObj = JSON.parse(message);
    
    var response = responder(messageObj.user, messageObj.content, messageObj.id, messageObj.submissionType);

    response.then(function(responseObj){
        ws.send(JSON.stringify(responseObj));
    });
  });
});     

//set up port to listen on
var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Chat bot listening on port ' + port + '!');
});