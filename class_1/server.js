//server initiate
const express = require('express');
const app = express();

// used to parse req.body in express -> PUT or POST
const bodyParser = require('body-parser');

// specifically parse JSON data & add it to the request.Body object
app.use(bodyParser.json());


// activate the server on 3000 port
app.listen(3000, () => {
    console.log("sevrer start listning on port 3000");
});

// Routes
app.get('/', (req, res) => {
    res.send("Hello ji");
})

app.post('/api/cars', (request, response) => {
    const {name, brand} = request.body;
    console.log(name);
    console.log(brand);
    response.send("Car submitted successfully");
})


const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/myDatabase')
  .then(() => { console.log("connection successful") })
  .catch((error) => { console.log("Received an error", error) });
