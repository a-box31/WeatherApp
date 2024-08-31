if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");

const PORT = process.env.PORT;

// Create express app
const app = express();

// Create a multer instance
const upload = multer();

// Set up the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a route
app.get("/", (req, res) => {
  res.render("index");
});

// Create a route
app.post("/api", upload.none(), async (req, res) => {
  try {
    const {city, state} = req.body;
    // call latitute and longitude
    const coords = await getLatLong(city, state);
    // get weather data
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,hourly&appid=${process.env.WEATHER_API_KEY}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

// Get weather data
async function getLatLong(city, state) {
  // get longitude and latitude of the city
  try{
    cityState = city + ", " + state;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${cityState}&key=${process.env.GEO_CODING_API_KEY}`
    );
    const data = await response.json();
    const lat = data.results[0].geometry.location.lat;
    const lon = data.results[0].geometry.location.lng;
    return { lat: lat, lon: lon };
  } catch (error) {
    console.error(error);
  }

}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
