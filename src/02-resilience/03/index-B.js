const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost';
const url = `http://${host}:${port}`;
const got = require('got');
const CircuitBreaker = require('opossum');

const circuitBreakerOptions = {
    timeout: 5000,
    errorThresholdPercentage: 10,
    resetTimeout: 10000
};

const breaker = new CircuitBreaker(requestApi, circuitBreakerOptions);
breaker.on('open', () => console.log(`OPEN: The breaker`));
breaker.on('halfOpen', () => console.log(`HALF_OPEN: The breaker`));
breaker.on('close', () => console.log(`CLOSE: The breaker`));

breaker.fallback(() => console.log('called fallback'));

app.use(express.json());

async function requestApi(maxRetryCount = 1) {
    const urlApi = 'http://localhost:3000';
    return got(urlApi, { retry: maxRetryCount });
}

async function requestCB() {
    return breaker.fire();
}

app.get('/circuitbreak', async (req, res) => {
    try {
        await requestCB();
        res.send('OK');
    } catch (error) {
        res.status(500).send('Erro na chamada da api A');
    }
});

app.listen(port, () => {
    console.log(`Aplicação rodando na url => ${url}`);
});