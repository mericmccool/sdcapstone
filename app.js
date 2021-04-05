const express = require('express');
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');

const PeopleThank = require('./models/peoplethank');
const Review = require('./models/reviews');

const methodOverride = require('method-override');
const AppError = require("./utilities/AppError");
const asyncCatcher = require('./utilities/asyncCatcher');
const {reviewSchema} = require('./joiSchemas');

//Import Routes
const peopleThankRoutes = require("./routes/peoplethanks")

mongoose
	.connect('mongodb://localhost:27017/peopleThank', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true, 
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));




app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

// Making public folder available
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));


const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};


// }
//parsing the form body

app.use(express.urlencoded({exte3nded: true}));

app.get('/',(req,res) => {
    res.render('home');
});

//------------peoplethanks routes-------
app.use("/", peopleThankRoutes )

//----------------Review routes---------


// posting for reviews
app.post('/peoplethank/:id/reviews', validateReview, asyncCatcher(async (req, res)  =>  {
	const {id} = req.params;
	const peoplethank = await PeopleThank.findById(id);
	const review = new Review(req.body.review);
	peoplethank.reviews.push(review);
	await review.save();
	await peoplethank.save();
	res.redirect(`/peoplethank/${id}`);

}) );

app.delete(
	'/peoplethank/:id/reviews/:reviewId',
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await PeopleThank.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/peoplethank/${id}`);
	})
);


app.use('*', (req, res, next)  =>{
	next(new AppError('Page not found', 404));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err });
});



app.listen(3000, ()  => {
    console.log("Listening on port 3000")
})

