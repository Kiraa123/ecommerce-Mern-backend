const express = require('express')
const app = express()
const error = function(req, res, next){
    const error = new Error("Not found");
    error.status = 404;
    next(error)
}

const errorHandling = function(err, req, res, next){
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: app.get("env") === "development"? err: {}
    })
}

module.exports = {error, errorHandling}