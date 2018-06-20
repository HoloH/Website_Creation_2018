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



//_____________RETRIEVE ALL______________
app.get('/list', function (req, res) {
    dbh.collection("hikedata").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.render('list', {hikedata:result});
      });
});
//_____________END_OF_TEST______________



//_____________SEARCH_PAGE______________
app.post('/discover_hike', function (req, res) {
    //Collect search info
    let region = req.body.region;
    let duration = req.body.duration;
    let difficulty = req.body.difficulty;
    //test
    //res.render('discover_hike', {post:true, region:region, duration:duration, difficulty:difficulty});

    //Retrieve matches from Mongo
    dbh.collection("hikedata").find({region:region, duration:duration, difficulty:difficulty}).toArray(function(err, result) {
        if (err) throw err;
        res.render('discover_hike', {post:true, hikedata:result});
    })
});


//________________USE_EXPRESS____________________
app.use(express.static('client'));

//404
app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});


//________________LISTEN_TO_PORT____________________
app.listen(3000, () => console.log('TheHikeExchange listening on port 3000!'));
});