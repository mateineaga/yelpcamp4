const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('connetion database open')
    })
    .catch(err => {
        console.log('oh no error')
        console.log(err)
    })
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '65278dc5700f688c7c496587',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'descriere !',
            price,    //price: price
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/divcfahah/image/upload/v1697290583/YelpCamp/vlwmjkfohsflvgbzecir.jpg',
                    filename: 'YelpCamp/vlwmjkfohsflvgbzecir',
                }

            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})