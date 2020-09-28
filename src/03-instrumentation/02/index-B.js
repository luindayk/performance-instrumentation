const log = require('./log');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || 'localhost';
const url = `http://${host}:${port}`;
const got = require('got');
const CircuitBreaker = require('opossum');
const redis = require('redis');
const util = require('util');
const clientRedis = redis.createClient({ host: '127.0.0.1', port: 6379 });
const redisSetPromise = util.promisify(clientRedis.set).bind(clientRedis);
const redisGetPromise = util.promisify(clientRedis.get).bind(clientRedis);
const REDISCACHEKEY = "get-api";

process.env.APP_NAME = 'index-B';
const newrelic = require('newrelic');

const circuitBreakerOptions = {
    timeout: 5000,
    errorThresholdPercentage: 10,
    resetTimeout: 10000
};

const breaker = new CircuitBreaker(requestApi, circuitBreakerOptions);
breaker.on('open', () => console.log(`OPEN: The breaker`));
breaker.on('halfOpen', () => console.log(`HALF_OPEN: The breaker`));
breaker.on('close', () => console.log(`CLOSE: The breaker`));

async function requestFallbackRedis() {
    let response = "OK Default";
    try {
        const responseRedis = await redisGetPromise(REDISCACHEKEY);
        if (responseRedis) {
            response = JSON.parse(responseRedis);
        }
    } catch (error) {
        console.error("Erro ao consultar cache no Redis");
    }
    return response;
}

breaker.fallback(requestFallbackRedis);

app.use(express.json());

async function requestApi(maxRetryCount = 1) {
    const urlApi = 'http://localhost:3000';
    const { body } = await got(urlApi, { retry: maxRetryCount });

    try {
        await redisSetPromise(REDISCACHEKEY, JSON.stringify(body));
    } catch (error) {
        console.error("Erro ao salvar informações no cache do redis");
    }

    return body;
}

async function requestCB() {
    return breaker.fire();
}

app.use((req, res, next) => {
    const { params, body, query, method, url, headers } = req;
    log.info({
        req: {
            method,
            url,
            headers: JSON.stringify(headers),
            params: JSON.stringify(params),
            query: JSON.stringify(query),
            body: JSON.stringify(body),
        }
    });
    next();
});

app.get('/log', async (req, res) => {
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