const express = require('express')
const { Pool } = require('pg')

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const REACT_APP_BASE_URL= process.env.REACT_APP_BASE_URL || "http://localhost:3000"



app.use(cors({
    origin: `${REACT_APP_BASE_URL}`,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.options('*', cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome to Tor's Registration API" })
})

app.get('/api/v1', (req, res) => {
    res.json({ message: "Welcome to Tor's Registration API" })
})

app.post('/api/v1', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

app.post('/api/v1/nearbySearch', async (req, res) => {
    const {latitude, longitude, radius} = req.body
    try {
        await fetch("https://places.googleapis.com/v1/places:searchNearby", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.REACT_APP_PLACES_API_KEY,
                'X-Goog-FieldMask': 'places.name,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.websiteUri,places.regularOpeningHours,places.shortFormattedAddress,places.photos,places.generativeSummary,places.editorialSummary,places.priceRange,places.userRatingCount'
            },
            body: JSON.stringify({
                includedTypes: ["restaurant", "seafood_restaurant"], //can add more based on Table A https://developers.google.com/maps/documentation/places/web-service/place-types#table-b
                excludedTypes: ["hotel"],
                maxResultCount: 3,
                locationRestriction: {
                    circle: {
                        center: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        radius: radius
                    }
                }
            })
        })
            .then(response => response.json())
            .then(data => res.status(200).json(data))
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    //
});

app.post('/api/v1/photo', async (req, res) => {
    const {name} = req.body
    const widthPx = 1000;
    const heightPx = 1000;
    try {
        await fetch(`https://places.googleapis.com/v1/${name}/media?maxHeightPx=${heightPx}&maxWidthPx=${widthPx}&key=${process.env.REACT_APP_PLACES_API_KEY}&skipHttpRedirect=true`, {
            method: "GET"
        })
            .then(response => response.json())
            .then(data => res.status(200).json(data))
            
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
    //
});

app.listen(PORT,  () => {
    console.log(`Listening on PORT: ${PORT}...`)
})