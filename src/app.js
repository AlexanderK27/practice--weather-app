// Require Node modules
const path = require('path')

// Require NPM modules
const express = require('express')
const hbs = require('hbs')

// Require selfmade files
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

// Save express function as a variable
const app = express()
// Set port to use: other host or localhost
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Oleksandr Kolomiichuk'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Oleksandr Kolomiichuk'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Oleksandr Kolomiichuk',
        helpText: 'Here is some helpful text'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Provide an address to get a forecast!'
        })
    }

    geocode(req.query.address, (error, response) => {
        if (error) {
            return res.send({ error: error })
        }
        forecast(response.latitude, response.longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location: response.location,
                address: req.query.address,
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Oleksandr Kolomiichuk',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Oleksandr Kolomiichuk',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})