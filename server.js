// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/museum', { useNewUrlParser: true, useUnifiedTopology: true });

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    visitDate: Date,
    ticketType: String,
    numTickets: Number,
    events: [String],
    tourGuide: Boolean,
    lunch: Boolean,
    grandTotal: Number,
    userqr: String
});

const Booking = mongoose.model('Booking', bookingSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/display', (req, res) => {
    const query = req.query;
    res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const booking = new Booking({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        visitDate: req.body['visit-date'],
        ticketType: req.body['ticket-type'],
        numTickets: req.body['num-tickets'],
        events: req.body.events || [],
        grandTotal: req.body['grand-total'],
        userqr: req.body.userqr
    });

    try {
        const savedBooking = await booking.save();
        res.redirect(`/display?id=${savedBooking._id}`);
    } catch (err) {
        res.status(500).send('Error saving booking');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/booking/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.json(booking);
    } catch (err) {
        res.status(500).send('Error retrieving booking');
    }
});
