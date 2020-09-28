const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost';
const url = `http://${host}:${port}`;
const requestPromise = require('request-promise');

app.use(express.json());

async function requestApi(retryCount = 0, maxRetryCount = 2) {
    const urlApi = 'http://localhost:3000';
    retryCount++;

    try {
        await requestPromise(urlApi);
    } catch (error) {
        if(retryCount <= maxRetryCount) {
            return await requestApi(retryCount, maxRetryCount);
        } else {
            throw error;
        }
    }

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