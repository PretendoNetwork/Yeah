import path from 'node:path';
import express from 'express';
import { renderFile } from '../../../dist/server';

const app = express();
const PORT = process.env.PORT || 8080;

app.engine('js', renderFile);
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'js');

app.get('/', (_, response) => {
	response.render('home', {
		username: 'PN_Jon'
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});