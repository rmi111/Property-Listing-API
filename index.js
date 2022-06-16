const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
   extended: false
}));
const UserRouter = require('./users/routes.config');
const AuthorizationRouter = require('./authorization/routes.config');

app.use(function (req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());

AuthorizationRouter.routesConfig(app);
UserRouter.routesConfig(app);

app.listen(config.port, function() {
    console.log('app listening at port %s', config.port);
});