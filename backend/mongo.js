const mongoose = require('mongoose');

const mongoURI = 'mongodb://mongo:27017/locations';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err.message);
});
