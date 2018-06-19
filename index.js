//________________REQUIREMENTS____________________
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

//Mongo DB
let url = "mongodb://localhost:27017";
const mongo = require('mongodb');

//Launch handlebars
const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



//________________MONGO_DB____________________
//Connect to Mongo Server
mongo.connect(url, function(err, db) {
    if (err) throw err;
    var dbh = db.db("hikes");

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//________________RENDER_PAGES____________________
//Render Pages
app.get('/', function (req, res) {
    res.render('home', {});
});
app.get('/about', function (req, res) {
    res.render('about', {});
});
app.get('/contact', function (req, res) {
    res.render('contact', {});
});
app.get('/thank_you_page', function (req, res) {
    res.render('thank_you_page', {});
});
app.get('/share_hike_form', function (req, res) {
    res.render('share_hike_form', {});
});
app.get('/discover_hike', function (req, res) {
    res.render('discover_hike', {});
});

//Render List ---> TEST PAGE
app.get('/list', function (req, res) {
    res.render('list', {});
});
//END TEST

//_____________SUBMIT_HIKE______________
//Post Submit Hike Page
app.post('/share_hike_form', function (req, res) {
    //Collect Info
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let region = req.body.region;
    let duration = req.body.duration;
    let difficulty = req.body.difficulty;
    let description = req.body.description;

//Add to Mongo
dbh.collection("hikedata").insertOne({firstName:firstName, lastName:lastName, email:email, region:region,
duration:duration, difficulty:difficulty, description:description},function(err, respo) {
    if (err) throw err;
    res.render('share_hike_form', {post:true});
    });
});
//_____________END_SUBMIT______________

//RETRIEVE NOT WORKING!!!!
//TEST
app.get('/list', function (req, res) {
    dbh.collection("hikedata").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.render('list', {hikedata:result});
      });
});
//END OF TEST
//________!!!!!___________

//_____________GAME______________
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
//_____________GAME______________




//________________USE_EXPRESS____________________
app.use(express.static('client'));

//404
app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

//________________LISTEN_TO_PORT____________________
app.listen(3000, () => console.log('Example app listening on port 3000!'));
});