const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOSTNAME || 'localhost';
const url = `http://${host}:${port}`;
process.env.APP_NAME = 'index-A';
const newrelic = require('newrelic');

app.use(express.json());

app.get('/', (req, res) => {
    console.log('OK');
    res.send('OK');
});

app.get('/error', (req, res) => {
    console.log('Erro na api');
    res.status(500).send('Erro na api');
});

app.listen(port, () => {
    console.log(`Aplicação rodando na url => ${url}`);
});