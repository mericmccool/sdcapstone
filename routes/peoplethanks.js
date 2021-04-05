const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utilities/asyncCatcher');
const { peoplethankSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');

const PeopleThank = require('../models/peopleThank');

const validatePeopleThank = (req, res, next) => {
	const { error } = peoplethankSchema.validate(req.body);
	if(error) {
		const msg = error.details.map((e) => e.message).join(",")
		throw new AppError(msg, 400)
	} else {
		next()
	}
	};
	
router.get('/peoplethank', asyncCatcher(async (req, res) => {
    const peopleThanks = await PeopleThank.find({});
    res.render('peopleThank/index', {peopleThanks})
}));

router.get('/peoplethank/new', (req, res) => {
	res.render("peopleThank/new");
});

router.get('/peoplethank/:id', asyncCatcher(async (req, res, next)  => {
	const { id } = req.params;
	const peopleThank = await PeopleThank.findById(id).populate("reviews");
	if (!peopleThank) {
		return next(new AppError('Error with input of new People Thanks', 404));
	}

	res.render('peopleThank/show', { peopleThank});
}));

// edit

router.get('/peoplethank/:id/edit', asyncCatcher(async (req, res)  => {
	const { id } = req.params;
	const peopleThank = await PeopleThank.findById(id);
	res.render('peopleThank/edit', {peopleThank});
}));

// the code below makes the new.ejs code viewable on the browser
router.post('/peoplethank', validatePeopleThank, asyncCatcher(async (req, res) => {
	const peoplethank = new PeopleThank(req.body.peoplethank);
	await peoplethank.save();
	res.redirect(`peopleThank/${peoplethank.id}`);
}));



router.put("/peoplethank/:id", validatePeopleThank, asyncCatcher(async (req, res) => {
	const { id } = req.params;
	const peoplethank = await PeopleThank.findByIdAndUpdate(id, {
		...req.body.peoplethank,
	});
	res.redirect(`/peoplethank/${id}`);
}));



router.delete('/peoplethank/:id/delete', asyncCatcher(async (req, res ) => {
	const { id } = req.params;
	await PeopleThank.findByIdAndDelete(id);
	res.redirect('/peoplethank');
}));
// app.use((req, res) => {
// 	res.status(404).send("Page not found.")
// });

module.exports = router;