const log = console.log;
const api = require('binance');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'react_app/build')));

// const server = app.listen('4000',() => log(`Dyanamic Chart Data Server started on port 4000`));
const server = app.listen(port,"0.0.0.0");
console.log('App is listening on port ' + port);

const socket = require('socket.io');
const io = socket(server);

const bRest = new api.BinanceRest({
        timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
        recvWindow: 20000, // Optional, defaults to 5000, increase if you're getting timestamp errors
        disableBeautification: false,
        handleDrift: true
});
const binanceWS = new api.BinanceWS(true);
const bws = binanceWS.onKline('BTCUSDT', '1m', (data) => {
    io.sockets.emit('chartSocket',{time:Math.round(data.kline.startTime/1000),open:parseFloat(data.kline.open),high:parseFloat(data.kline.high),low:parseFloat(data.kline.low),close:parseFloat(data.kline.close)});
});