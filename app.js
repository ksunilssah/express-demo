const express = require('express'),
    exphbs = require('express-handlebars'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    session = require('express-session'),
    path = require('path');

const port = '5050';
const app = express();


mongoose.connect('mongodb://localhost/ideas')
    .then(() => {
        console.log('MongoDB connected ...');
    }).catch(error => console.log(error));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Middleware setup 
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

// override POST method
app.use(methodOverride('_method'))

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Flash connect middleware
app.use(flash());

//Global variables will be avilable after page reload or next page
app.use((request, response, next) => {
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg = request.flash('error_msg');
    next();
});



//Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Index route
app.get('/', (request, response) => {
    /* response.send({
         'id': 1,
         'name': 'index page'
     });*/

    const title = 'Welcome1';
    response.render('index', {
        title
    });
});

//About route
app.get('/about', (request, response) => {
    /*response.send({
        'id': 1,
        'name': 'About us'
    });*/
    response.render('about');
});


//Load   idea routes
const ideas = require('./routes/ideas');
//Use ideas route
app.use('/ideas', ideas);

//Load users route
const users = require('./routes/users');
//Use users route
app.use('/users', users);



app.listen(port, () => console.log(`Express Server is listening at ${port} `))