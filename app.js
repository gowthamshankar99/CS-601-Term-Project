const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const dynamodb = new AWS.DynamoDB();
const myVars = {
    domain: 'monishamani.auth0.com',
    clientID: 'RnWM4jn92UnEfBSBguuBkKNwmEbuNKAq',
    clientSecret: 'wiQDHJlYwIuMKckjakvFshjbfD8dMHgzW_K-TR-ASbJugU78xa2q8HIbNyxFxR9P',
    callbackURL: 'http://localhost:3001/callbackurl'
}
const strategy = new Auth0Strategy(
    {
        domain: 'monishamani.auth0.com',
        clientID: 'RnWM4jn92UnEfBSBguuBkKNwmEbuNKAq',
        clientSecret: 'wiQDHJlYwIuMKckjakvFshjbfD8dMHgzW_K-TR-ASbJugU78xa2q8HIbNyxFxR9P',
        callbackURL: 'http://localhost:3001/callbackurl'
    }, function (accessToken, refreshToken, extraParam, profile, done) {
        return done(null, profile);
    });

passport.use(strategy);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const app = express();
//app.set('view engine','pug')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'secret_key',
        resave: true,
        saveUninitialized: true
    })
)

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/client"));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.loggedIn = false;
    if (req.session.passport && typeof req.session.passport.user != 'undefined') {
        console.log("if logged")
        res.locals.loggedIn = true;
    }
    next();
})

app.listen(3001, function () {
    console.log("Server running on 3001 port");
})

app.get("/", function (req, res) {
    console.log("in index home page")
    if (req.user) {
        res.sendFile(path.join(__dirname + "/views/index2.html"));
    }
    else {
        res.redirect("/login");
    }



});

app.get("/logout2", function (req, res) {
    console.log("in index home page")
    //    if(req.user)
    //    {
    //        res.sendFile(path.join(__dirname + "/views/index2.html")); 
    //    }
    //    else{
    res.sendFile(path.join(__dirname + "/views/logoutPage.html"));
    //    }



});

app.get("/education", function (req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname + "/views/education.html"));
    }
    else {
        res.redirect("/login");
    }



});

app.get("/admin", function (req, res) {
    if (req.user) {


        res.sendFile(path.join(__dirname + "/views/admin.html"));
    }
    else {
        res.redirect("/login");
    }



});

app.get("/getMessages", function (req, res) {
    if (req.user) {

            // TODO implement
            var params = {

                TableName: "messages"
            };
            dynamodb.scan(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }   // an error occurred
                else {
                    console.log(data);
                    const response = {
                        statusCode: 200,
                        body: data
                    }
                    res.send(response);
                }// successful response

            });

    }
    else {
        res.redirect("/login");
    }



});

app.get("/projects", function (req, res) {
    console.log("in index home page")
    if (req.user) {
        res.sendFile(path.join(__dirname + "/views/projects.html"));
    }
    else {
        res.redirect("/login");
    }



});

app.get("/gallery", function (req, res) {
    console.log("in index home page")
    if (req.user) {
        res.sendFile(path.join(__dirname + "/views/pictures.html"));
    }
    else {
        res.redirect("/login");
    }



});


app.get("/contact", function (req, res) {

    if (req.user) {
        res.sendFile(path.join(__dirname + "/views/contact_me.html"));
    }
    else {
        res.redirect("/login");
    }



});

app.post("/contact",function(req,res) {
    if (req.user) {
        console.log(req.body.firstName);
        console.log(req.body.lastName);
        submitDataToDynamoDB(req.body.firstName,req.body.lastName,req.body.email,req.body.message);
        res.sendFile(path.join(__dirname + "/views/contact_me.html"));
    }
    else {
        res.redirect("/login");
    }
})



app.get("/sample", function (req, res) {
    if (req.user) {
        res.redirect("/");
    }
    else {
        res.redirect("/login");
    }
})

app.get("/login", passport.authenticate('auth0', {
    clientID: myVars.clientID,
    domain: myVars.domain,
    redirectUri: myVars.callbackURL,
    responseType: 'code',
    audience: 'https://monishamani.auth0.com/userinfo',
    scope: 'openid profile'
}),
    function (req, res) {
        res.redirect('/');
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/logout2");
})

app.get('/callbackurl',
    passport.authenticate('auth0', {
        failureRedirect: "/failure"
    }), function (req, res) {
        res.redirect("/");
        //       res.sendFile(path.join(__dirname + "/index.html"));
    }
)

app.get('/user', function (req, res, next) {
    //console.log(req.user);
    res.sendFile(path.join(__dirname + "/views/user.html"));
});


app.get('/failure', function (req, res, next) {
    res.sendFile(path.join(__dirname + "/failure.html"));
});

app.get('/deleteRecords/:datetime', function(req,res) {
    if(req.user)
    {
        var dateTimeCard = req.params.datetime;   
        dateTimeCard = dateTimeCard.split("_").join(" ");
        deleteRecordsFromDynamoDBTable(dateTimeCard);
        res.send("/admin");
    }else
    {
        res.redirect("/login");
    }
})


app.get('/username', function (req, res) {
    const response = {
        statusCode: 200,
        body: req.user
    }
    //console.log(req.user);
    res.send(response);
});

function deleteRecordsFromDynamoDBTable(keyRecord)
{
    var params = {
        Key: {
         "datetime": {
           S: keyRecord
          }
        }, 
        TableName: "messages"
       };
       dynamodb.deleteItem(params, function(err, data) {
         if (err)   
         {
             console.log(err, err.stack);
          } // an error occurred
         else    {
            console.log("Delete successfully");
            console.log(data);  
         }          // successful response

       });
}

function submitDataToDynamoDB(firstName, lastName, email, Message)
{
    var date2 = new Date();
    console.log(date2.toString());
    var params = {
        Item: {
         "datetime": {
           S: date2.toString()
          }, 
         "FirstName": {
           S: firstName
          }, 
         "LastName": {
           S: lastName
          }, 
          "Email": {
            S: email
           }, 
           "Message": {
             S: Message
            }
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: "messages"
       };
       dynamodb.putItem(params, function(err, data) {
         if (err) {
             console.log(err, err.stack); 
         }
         else    {
            console.log(data);    
         }      

       });
}