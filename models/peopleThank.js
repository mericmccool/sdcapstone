const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const PeopleThankSchema = new Schema({
    name: String,
    description: String,
    image: String,
    resonation: String,
    company: String,
    submittedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
   
        reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        }
    ],
});

PeopleThankSchema.post('findOneAndDelete', async function (data) {
	if (data) {
		await Review.deleteMany({
			_id: {
				$in: data.reviews,
			},
		});
	}
});


module.exports = mongoose.model("peoplethank",PeopleThankSchema);
