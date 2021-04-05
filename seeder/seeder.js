const mongoose = require('mongoose');
const PeopleThank = require('../models/peoplethank');

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

    const sampleData = [
        {
            name: " Dr. Samler", 
            description: "The best teacher",
            image:
                  'https://images.unsplash.com/photo-1503610594381-aed30c818b8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhZGl0dWRlfGVufDB8fDB8&auto=format&fit=crop&w=600&q=60',
            resonation:"&",
            company:"isdfs",  
               
        },
        {
            name: " Dr. Lindsay", 
            description: "Formost understanding of etc",
            image:
                  'https://images.unsplash.com/photo-1503610594381-aed30c818b8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhZGl0dWRlfGVufDB8fDB8&auto=format&fit=crop&w=600&q=60',
            resonation:"&",
            company:"isdfs", 
                 
        },
        {
            name: " Daivd Price", 
            description: "Because of your methods I am all better",
            image:
                  'https://images.unsplash.com/photo-1503610594381-aed30c818b8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhZGl0dWRlfGVufDB8fDB8&auto=format&fit=crop&w=600&q=60',
            resonation:"&",
            company:"isdfs", 
            
        },
        {
            name: " Chris Chandler", 
            description: "Funny person",
            image:
                  'https://images.unsplash.com/photo-1503610594381-aed30c818b8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhZGl0dWRlfGVufDB8fDB8&auto=format&fit=crop&w=600&q=60',
            resonation:"&",
            company:"isdfs", 
                 
        },
        {
            name: " Johnny James", 
            description: "The best parent",
            image:
                  'https://images.unsplash.com/photo-1503610594381-aed30c818b8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JhZGl0dWRlfGVufDB8fDB8&auto=format&fit=crop&w=600&q=60',
            resonation:"&",
            company:"isdfs",
            
        },
    ]

// We first clear our database and then add in our peopleThanx sample
const seedDB = async () => {
	await PeopleThank.deleteMany({});
	const res = await PeopleThank.insertMany(sampleData)
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {
	mongoose.connection.close();
});
