const AppError = require('../utilities/AppError');

const PeopleThank = require('../models/peopleThank');
const Review = require('../models/reviews')

const { peoplethankSchema, reviewSchema } = require('../joiSchemas');


module.exports.isReviewCreator = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that'); 		return res.redirect(`/peopleThanks/${id}`);
     	}
        next();
    };

module.exports.isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in to do that');
		return res.redirect('/login');
	}
	next();
};

module.exports.isCreator = async (req, res, next) => {
     	const { id } = req.params;
        const peoplethank = await PeopleThank.findById(id);
        if (!peoplethank.submittedBy.equals(req.user._id)) {
            req.flash('error', 'You are not authorized to do that'); 		return res.redirect(`/peopleThank/${id}`);
        }
        next();
     };

module.exports.validatePeopleThank = (req, res, next) => {
	const { error } = peoplethankSchema.validate(req.body);
	if(error) {
		const msg = error.details.map((e) => e.message).join(",")
		throw new AppError(msg, 400)
	} else {
		next()
	}
	};

    module.exports.validateReview = (req, res, next) => {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            const msg = error.details.map((e) => e.message).join(',');
            throw new AppError(msg, 400);
        } else {
            next();
        }
    };