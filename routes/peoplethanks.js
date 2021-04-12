const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utilities/asyncCatcher');
const { peoplethankSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const {
	isAuthenticated,
	isCreator,
	validatePeopleThank,
	} = require("../middleware/middleware");


const PeopleThank = require('../models/peopleThank');

// const isCreator = async (req, res, next) => { 	const { id } = req.params; 	const peoplethank = await PeopleThank.findById(id); 	if (!peoplethank.submittedBy.equals(req.user._id)) { 		req.flash('error', 'You are not authorized to do that'); 		return res.redirect(`/restaurants/${id}`); 	} 	next(); };

// const validatePeopleThank = (req, res, next) => {
// 	const { error } = peoplethankSchema.validate(req.body);
// 	if(error) {
// 		const msg = error.details.map((e) => e.message).join(",")
// 		throw new AppError(msg, 400)
// 	} else {
// 		next()
// 	}
// 	};
	
router.get('/', asyncCatcher(async (req, res) => {
    const peopleThanks = await PeopleThank.find({});
    res.render('peopleThank/index', {peopleThanks})
}));

router.get(
	'/new',
	 isAuthenticated, (req, res) => {
	res.render("peopleThank/new");
});

router.get('/:id', asyncCatcher(async (req, res, next)  => {
	const { id } = req.params;
	const peopleThank = await PeopleThank.findById(id)
	.populate({
		path: "reviews",
		populate: { 
			path:"author"
		}
	})
	.populate('submittedBy');
	if (!peopleThank) {
		req.flash('error', 'People Thank does not exist!');
		res.redirect("/peopleThank")
		// return next(new AppError('Error with input of new People Thanks', 404));
	}

	res.render('peopleThank/show', { peopleThank});
}));

// edit

router.get('/:id/edit', isAuthenticated, isCreator, asyncCatcher(async (req, res)  => {
	const { id } = req.params;
	const peopleThank = await PeopleThank.findById(id);
	if (!peopleThank) {
		req.flash('error', 'People Thank does not exist!');
		res.redirect("/peopleThank")
		
	}
	res.render('peopleThank/edit', {peopleThank});
}));

// the code below makes the new.ejs code viewable on the browser
router.post('/', isAuthenticated,  validatePeopleThank, asyncCatcher(async (req, res) => {
	const peoplethank = new PeopleThank(req.body.peoplethank);
	peoplethank.submittedBy = req.user._id;
	await peoplethank.save();
	req.flash('success', 'New People Thank was successfully added!');

	res.redirect(`peopleThank/${peoplethank.id}`);
}));



router.put("/:id", isAuthenticated, isCreator,  validatePeopleThank, asyncCatcher(async (req, res) => {
	const { id } = req.params;
	const peoplethank = await PeopleThank.findByIdAndUpdate(id, {
		...req.body.peoplethank,
	});
	req.flash('success', 'New People Thank was successfully updated!');
	res.redirect(`/peoplethank/${id}`);
}));



router.delete('/:id/delete', isAuthenticated, isCreator,  asyncCatcher(async (req, res ) => {
	const { id } = req.params;
	await PeopleThank.findByIdAndDelete(id);
	req.flash('success', 'New People Thank was successfully deleted!');
	res.redirect('/peoplethank');
}));
// app.use((req, res) => {
// 	res.status(404).send("Page not found.")
// });

module.exports = router;