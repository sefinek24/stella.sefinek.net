require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const app = express();

// Middlewares
const logger = require('./middlewares/morgan.js');
app.use(helmet());
app.use(logger);


// Variables
const BASE_URL = 'https://sefinek.net/genshin-stella-mod';


// Routes
app.get('*', (req, res) => {
	res.set('Referer', 'https://stella.sefinek.net');
	res.redirect(301, `${BASE_URL}${req.originalUrl.replace(/\/$/, '')}`);
});


// Start the server
app.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			console.error('Failed to send ready signal to parent process.', err.message);
		}
	}

	console.log(`Running on http://127.0.0.1:${process.env.PORT}`);
});