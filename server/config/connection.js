const mongoose = require('mongoose');

MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reduxStore_db';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = mongoose.connection;
