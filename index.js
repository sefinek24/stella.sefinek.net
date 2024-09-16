require('dotenv').config();
const http = require('http');
const helmet = require('helmet');
const { parse } = require('url');
const morganMiddleware = require('./middlewares/morgan.js');

const renderHtml = (err, req, res, msg, status) => {
	res.writeHead(status, { 'Content-Type': 'text/html' });
	res.end(`<h1>${status} ${msg}</h1>`);
	if (err) console.error(err);
};

const helmetMiddleware = helmet();
const applyMiddlewares = async (req, res) => {
	try {
		helmetMiddleware(req, res, err => {
			if (err) throw err;
		});
		morganMiddleware(req, res, err => {
			if (err) throw err;
		});
	} catch (err) {
		renderHtml(err, req, res, 'Internal Server Error', 500);
		return false;
	}
	return true;
};

const BASE_URL = 'https://sefinek.net/genshin-stella-mod';

const server = http.createServer(async (req, res) => {
	const middlewaresApplied = await applyMiddlewares(req, res);
	if (!middlewaresApplied) return;

	if (req.method === 'GET') {
		const { pathname } = parse(req.url);
		res.setHeader('Referrer', 'https://stella.sefinek.net');
		res.writeHead(301, { Location: `${BASE_URL}${pathname.replace(/\/$/, '')}` });
		res.end();
	} else {
		renderHtml(null, req, res, 'Method Not Allowed', 405);
		res.writeHead(405, { 'Content-Type': 'text/plain' });
	}
});

server.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			console.error('Failed to send ready signal to parent process.', err.message);
		}
	} else {
		console.log(`Server running at http://127.0.0.1:${process.env.PORT}`);
	}
});