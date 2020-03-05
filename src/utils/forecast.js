const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/adabb2223562484b08be2a038ac7d54e/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}?units=si&lang=en`

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to wheather service', undefined)
        } else if (response.body.error) {
            callback('Unable to find location', undefined)
        } else {
            const temperature = response.body.currently.temperature
            const precipProbability = response.body.currently.precipProbability
            const summary = response.body.daily.data[0].summary
            callback(undefined, `${summary} It is currently ${temperature} degrees out. There is ${precipProbability}% chance of rain.`)
        }
    })
}

module.exports = forecast