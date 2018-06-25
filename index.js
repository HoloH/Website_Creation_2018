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

//IsEmpty Function
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//ObjectId
var ObjectId = require('mongodb').ObjectId;

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

//Home - Retrieves the Three Last Hikes
app.get('/', function (req, res) {
    dbh.collection("hikedata").find({}).sort({_id:-1}).limit(3).toArray(function(err, result) {
    if (err) throw (err);
    res.render('home', {hikedata:result});
    });
});

//Other Pages
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
app.get('/no_result', function (req, res) {
    res.render('no_result', {});
});
app.get('/404', function (req, res) {
    res.render('404', {});
});


//_____________SUBMIT_HIKE______________

//Post Submit Hike Page
app.post('/share_hike_form', function (req, res) {
    //Collect Info
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let hikeName = req.body.hikeName;
    let email = req.body.email;
    let region = req.body.region;
    let duration = req.body.duration;
    let difficulty = req.body.difficulty;
    let description = req.body.description;
    let descripShort = ""
    let photoURL = req.body.photoURL;
    if (description.length < 100) {
        descripShort = description
    }
    else {
        descripShort = description.substr(0,99) + "..."
    }

//Add to Mongo
dbh.collection("hikedata").insertOne({firstName:firstName, lastName:lastName, email:email, hikeName:hikeName, region:region,
duration:duration, difficulty:difficulty, description:description, photoURL:photoURL}, function(err, respo) {
    if (err) throw err;
    res.render('share_hike_form', {post:true});
    });
});
//_____________END_SUBMIT______________



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
        if (isEmpty(result)) {
            res.render('no_result', {});
        }
    else {
        res.render('discover_hike', {post:true, region:region, duration:duration, difficulty:difficulty, hikedata:result});
        }
    })
});


//________________HIKE_PAGE____________________
app.get('/hike:id', function(req, res) {
    dbh.collection("hikedata").find({"_id":ObjectId(req.params.id)}).toArray(function(err, result) {
        if (err) throw err;
        res.render('hike', {hikedata:result, hikeid:req.params.id});
    });
});
//________________END_HIKE_PAGE____________________



//________________USE_EXPRESS____________________
app.use(express.static('client'));

//404
app.use(function(req, res, next){
    res.status(404).render('404', {});
});


//________________LISTEN_TO_PORT____________________
app.listen(3056, () => console.log('TheHikeExchange listening on port 3056!'));
});