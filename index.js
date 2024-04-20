require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const app = express();

// Middlewares
const logger = require('./middlewares/morgan.js');
app.use(helmet());
app.use(logger);


// Variables
const BASE_URL = 'https://sefinek.net/genshin-impact-reshade';


// Routes
app.get('*', (req, res) => {
	const fullPath = BASE_URL + req.originalUrl.replace(/\/$/, '');
	res.set('Referrer', 'https://stella.sefinek.net');
	res.redirect(301, fullPath);
});


// Start server
app.listen(process.env.PORT, () => {
	console.log(`Running on http://127.0.0.1:${process.env.PORT}`);

	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			console.error('Failed to signal readiness:', err);
		}
	}
});
