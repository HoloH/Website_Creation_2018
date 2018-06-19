//Requirements
//const mongo = require ('mongodb');
//const express = require('express');
//const exphbs  = require('express-handlebars');
//const bodyParser = require('body-parser');

//Mongo?
//let MongoClient = require ('mongodb').MongoClient;
//let url = 'mongodb://localhost:27017/students';

//Handlebars Layout
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');


//app.get('/home', function (req, res) {
//    res.render('home', {});
//});

const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/game', function (req, res) {
    res.render('game', {});
});

//Render Contact and About
app.get('/home', function (req, res) {
    res.render('home', {});
});

app.get('/about', function (req, res) {
    res.render('about', {});
});

app.get('/contact', function (req, res) {
    res.render('contact', {});
});

//Game post
app.post('/game', function (req, res) {
    //Setup of Choices
    let userChoice = req.body.userChoice;
    let computerRand = Math.ceil(Math.random()*3)
    
    //Computerchoice >> Word
    switch(computerRand) {
        case 1:
        computerChoice = "Rock";
        break;
        case 2:
        computerChoice = "Paper";
        break;
        case 3:
        computerChoice = "Scissors";
        break;        
    }

    //Userchoice >> Number
    switch(userChoice) {
        case "Rock":
        userNumb = 1;
        break;
        case "Paper":
        userNumb = 2;
        break;
        case "Scissors":
        userNumb = 3;
        break;        
    }

    //Compare to find winner
    if (userNumb === computerRand) {
        winner = "The game is a draw.";
    }
    else if (userNumb - computerRand === 1||userNumb - computerRand === -2) {
        winner = "You won!";
    }
    else {
        winner = "The computer won!";
    }

    //Render
    res.render('game', {post:true, userChoice: userChoice,
    computerChoice: computerChoice, winner: winner});
});


app.get('/:users', function (req, res) {
    res.render('home', {users:req.params.users.split(",")});
});
app.get('/mysecret', (req, res) => res.send('Tu ne devrais pas être là!!!'));



app.use(express.static('client'));

app.listen(3056, () => console.log('Example app listening on port 3056!'));