const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const join = require('path').join;
const cookieParser = require('cookie-parser');


module.exports = function (app) {
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(cookieParser());

	app.set('views', join(__dirname, './views'));

	app.use(favicon( join(__dirname, '../public/icons/favicon.ico')));

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });
};