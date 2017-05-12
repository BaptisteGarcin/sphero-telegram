

// Simple route middleware to create a cookie containing the remote address of the client
exports.cookieMiddleware =  function (req, res, next) {
    //check if client sent cookie
    let cookie = req.cookies.userID;
    if (cookie === undefined) {
        //set a new cookie
        res.cookie('userID', req.connection.remoteAddress.substring(7));
    }
    return next();
};