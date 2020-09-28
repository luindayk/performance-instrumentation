const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost';
const url = `http://${host}:${port}`;
const got = require('got');

app.use(express.json());

async function requestApi(maxRetryCount = 2) {
    const urlApi = 'http://localhost:3000';
    return got(urlApi, { retry: maxRetryCount });
}

app.get('/retry', async (req, res) => {
    try {
        await requestApi();
        res.send('OK');
    } catch (error) {
        res.status(500).send('Erro na chamada da api A');
    }
});

app.listen(port, () => {
    console.log(`Aplicação rodando na url => ${url}`);
});