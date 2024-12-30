const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/locations', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error:', err));

const locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    intensity: { type: Number, default: 1 }
});
const Location = mongoose.model('Location', locationSchema);

app.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch locations' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
