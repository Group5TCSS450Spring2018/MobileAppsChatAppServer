//express is the framework we're going to use to handle requests
const express = require('express');
//Create a new instance of express
const app = express();

const FormData = require("form-data");

const bodyParser = require("body-parser");
//This allows parsing of the body of POST requests, that are encoded in JSON
app.use(bodyParser.json());


var reg = require('./routes/register.js');
app.use('/register', reg);

var login = require('./routes/login.js');
app.use('/login', login);

var verify = require('./routes/verify.js');
app.use('/verify', verify);

var deleteMember = require('./routes/deleteMember.js');
app.use('/deleteMember', deleteMember);

var sendMessages = require('./routes/sendMessages.js');
app.use('/sendMessages', sendMessages);

var getMessages = require('./routes/getMessages.js');
app.use('/getMessages', getMessages);

var addConnection = require('./routes/addConnection.js');
app.use('/addConnection', addConnection);

var removeConnection = require('./routes/removeConnection.js');
app.use('/removeConnection', removeConnection);

var acceptConnection = require('./routes/acceptConnection.js');
app.use('/acceptConnection', acceptConnection);

var getConnectionRequests = require('./routes/getConnectionRequests.js');
app.use('/getConnectionRequests', getConnectionRequests);

var getConnections = require('./routes/getConnections.js');
app.use('/getConnections', getConnections);

var currentWeather = require('./routes/currentWeather.js');
app.use('/currentWeather', currentWeather);

var hourlyWeather = require('./routes/hourlyWeather.js');
app.use('/hourlyWeather', hourlyWeather);

var forecast10Weather = require('./routes/forecast10Weather.js');
app.use('/forecast10Weather', forecast10Weather);

var saveWeather = require('./routes/saveWeather.js');
app.use('/saveWeather', saveWeather);

var getSavedWeather = require('./routes/getSavedWeather.js');
app.use('/getSavedWeather', getSavedWeather);

var addChat = require('./routes/addChat');
app.use('/addChat', addChat);

var resetPassword = require('./routes/resetPassword.js');
app.use('/resetPassword', resetPassword);

var updatePassword = require('./routes/updatePassword.js');
app.use('/updatePassword', updatePassword);

var searchConnections = require('./routes/searchConnections');
app.use('/searchConnections', searchConnections);

var sentOutRequests = require('./routes/sentOutRequests');
app.use('/sentOutRequests', sentOutRequests);

var getChats = require('./routes/getChats');
app.use('/getChats', getChats);

var getConnections = require('./routes/getConnections');
app.use('/getConnections', getConnections);

var leaveChat = require('./routes/leaveChat');
app.use('/leaveChat', leaveChat);

var resendCode = require('./routes/resendCode');
app.use('/resendCode', resendCode);

var denyConnection = require('./routes/denyConnection');
app.use('/denyConnection', denyConnection);

var recentSent = require('./routes/recentSent');
app.use('/recentSent', recentSent);

var getChatId = require('./routes/getChatId.js');
app.use('/getChatId', getChatId);

var everyChatParticipant = require('./routes/everyChatParticipant');
app.use('/everyChatParticipant', everyChatParticipant);

var getChatMembers = require('./routes/getChatMembers');
app.use('/getChatMembers', getChatMembers);

var getChatNotifications = require('./routes/getChatNotifications');
app.use('/getChatNotifications', getChatNotifications);

var getConnectionRequestsNotifications = require('./routes/getConnectionRequestsNotifications');
app.use('/getConnectionRequestsNotifications', getConnectionRequestsNotifications);
/* 
* Heroku will assign a port you can use via the 'PORT' environment variable
* To accesss an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined)
* If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000} 
*/
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});