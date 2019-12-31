const axios = require('axios');
const dotenv = require('dotenv');
const Weather = require('../models/Weather');
const colors = require('colors');
const schedule = require('node-schedule');

// Load env variables
dotenv.config({
    path: './config/config.env'
});

// @desc    Get current weather from Open Weather API and store it to DB
// @route   GET /weather/v1/update/:city
exports.fetchWeather = async (req, res) => {
    const city = req.params.city;

    let weather = await Weather.fetchData(city);

    if (!weather) {
        return res.status(404).send(`Weather for ${city} not found`);
    }

    res.status(201).json({ success: true, weather });
};

// @desc    Get weather from DB
// @route   GET weather/v1/:city
exports.getWeather = async (req, res) => {
    try {
        let weather = await Weather.findOne({ city: req.params.city });

        if (!weather) {
            return res
                .status(404)
                .send(`Weather for ${req.params.city} not available`);
        }

        res.status(200).json({ success: true, weather });
    } catch (error) {
        console.log(error);
    }
};

// @desc    Get weather data and save it to database
// @route   POST weather/v1/:city
exports.addWeather = async (req, res) => {
    const city = req.body.city;

    let weather = await Weather.findOne({ city });

    if (!weather) {
        const data = await Weather.fetchData(city);
        if (!data) {
            return res.status(404).send(`Weather for ${city} not available`);
        }
        weather = await Weather.create(data);
        console.log(`Weather for ${city} added to database`);
    }

    res.status(201).json({ success: true });
};

// @desc    Get weather data and save it to database
// @route   PUT weather/v1/
exports.updateWeather = async (req, res) => {
    const city = req.body.city;

    let weather = await Weather.findOne({ city });

    if (!weather) {
        return res.status(404).send(`Weather for ${city} not found`);
    }

    const data = await Weather.fetchData(city);

    if (!data) {
        return res.status(404).send(`Weather for ${city} not available`);
    }

    weather = await Weather.findByIdAndUpdate(weather._id, data);

    res.status(201).json({ success: true, weather });
};

// Update weathers in database
let job = schedule.scheduleJob('*/1 * * * *', async () => {
    let weathers = await Weather.find();

    for (let i in weathers) {
        let weather = weathers[i];

        let response = await axios.put(`http://localhost:3002/v1/weather`, {
            city: weather.city
        });

        if (!response) {
            console.log(`Unable to update weather for ${city}`.red);
        }
    }
    console.log('Database updated...'.bold);
});
