const exporess = require('express');

const {
    fetchWeather,
    getWeather,
    addWeather,
    updateWeather,
    getWeathers
} = require('../controllers/weather');

const router = exporess.Router();

router.route('/api/:city').get(fetchWeather);
router.route('/city').get(getWeather);
router
    .route('/')
    .post(addWeather)
    .put(updateWeather);

router.get('/all', getWeathers);

module.exports = router;
