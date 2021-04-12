const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncCatcher = require('../utilities/asyncCatcher');
const { reviewSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const {validateReview, isAuthenticated, isReviewCreator } = require("../middleware/middleware");

const PeopleThank = require('../models/peopleThank');
const Review = require('../models/reviews');

// const validateReview = (req, res, next) => {
// 	const { error } = reviewSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((e) => e.message).join(',');
// 		throw new AppError(msg, 400);
// 	} else {
// 		next();
// 	}
// };

router.post('/', isAuthenticated, validateReview, asyncCatcher(async (req, res)  =>  {
	const {id} = req.params;
	const peoplethank = await PeopleThank.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	peoplethank.reviews.push(review);
	await review.save();
	await peoplethank.save();
	req.flash('success', 'New Review was successfully added!');
	res.redirect(`/peoplethank/${id}`);

}) );

router.delete(
	'/:reviewId',
	isAuthenticated,
	isReviewCreator,
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await PeopleThank.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'A Review was successfully deleted!');
		res.redirect(`/peoplethank/${id}`);
	})
);

module.exports = router