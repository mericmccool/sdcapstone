

const Joi = require('joi');

module.exports.peoplethankSchema = Joi.object({
     
     peoplethank: Joi.object({
    name: Joi.string().required(),
description: Joi.string().required(),
image: Joi.string().required(),
resonation: Joi.string().required(),
company: Joi.string().required(),
}).required(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});
