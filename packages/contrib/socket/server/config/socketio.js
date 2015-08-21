'use strict';

var config = require('meanio').loadConfig(),
    cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    socketio = require('socket.io');

module.exports = function(http) {

    var io = socketio.listen(http);

    io.use(function(socket, next) {
        var data = socket.request;

        if (!data.headers.cookie) {
            console.log('No cookie transmitted.');
            return next(new Error('No cookie transmitted.'));
        }

        console.log('data.headers.cookie:', data.headers.cookie);

        var parsedCookie = cookie.parse(data.headers.cookie);
        var sessionID = parsedCookie[config.sessionName];

        console.log(config.sessionName);
 
        try {
             var parsedSessionID = cookieParser.signedCookie(parsedCookie[config.sessionName], config.sessionSecret);
    
            } catch (err) {
                // handle the error safely
                console.log(err);
                var parsedSessionID = "";
            }

       

        if (sessionID === parsedSessionID) {
            console.log('Cookie is invalid.');
            return next(new Error('Cookie is invalid.'));
        }

        next();
    });

    return io;
};
