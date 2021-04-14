if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');

const MongoStore = require('connect-mongo');

// const PeopleThank = require('./models/peopleThank');
// const Review = require('./models/reviews');

const methodOverride = require('method-override');
const AppError = require('./utilities/AppError');
const asyncCatcher = require('./utilities/asyncCatcher');


const User = require('./models/user'); //moved up above routes

//Import Routes
const peopleThankRoutes = require('./routes/peoplethanks');
const reviewsRoutes = require('./routes/reviews');
const authRoutes = require('./routes/users');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const PassportLocal = require('passport-local');


// 'mongodb://localhost:27017/peopleThank'
// process.env.DB_STRING

const url = process.env.DB_STRING || 'mongodb://localhost:27017/peopleThank';


mongoose
	.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

// Making public folder available
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

const secret = process.env.SECRET || 'drake'


const store = MongoStore.create({
	// mongoUrl: 'mongodb://localhost:27017/peopleThank',
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret, //: 'drake',
	},
});

// This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});

const sessionConfig = {
	store,	
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//--------Middleware-----------

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	// console.log(res.locals.success);
	next();
});
// app.use((req, res, next) => {
// 	res.locals.success = req.flash('success');
// 	res.locals.error = req.flash('error');
// 	next();
// });

//parsing the form body

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('home');
});
//--------------ROUTES------------------
//------------peoplethanks routes-------
app.use('/peoplethank', peopleThankRoutes);

//----------------Review routes---------
app.use('/peoplethank/:id/reviews', reviewsRoutes);
//---------------AUTH Routes
app.use('/', authRoutes);

// ----------------Middleware------------

app.use('*', (req, res, next) => {
	next(new AppError('Page not found', 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err });
});

const port = process.env.PORT || 3000


app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});