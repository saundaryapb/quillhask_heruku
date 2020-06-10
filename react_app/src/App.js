import React, { Component } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";
import io from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    document.title = "Quillhash technologies - Chart";
    this.getData();
  }

  getData = () => {
    const chartProperties = {
      width: 1500,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      priceScale: {
        autoScale: true,
        invertScale: true,
        alignLabels: true,
        borderVisible: true,
        // borderColor: '#555ffd',
      },
    };

    const domElement = this.myRef.current;
    const chart = createChart(domElement, chartProperties);
    const candleSeries = chart.addCandlestickSeries();
    axios
      .get(
        "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000"
      )
      .then((response) => {
        // console.log(response);
        const cdata = response.data.map((d) => {
          return {
            time: d[0] / 1000,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          };
        });
        candleSeries.setData(cdata);
      })
      .catch((error) => {
        console.log("error", error);
      });


    //Dynamic Chart
    const socket = io.connect(`http://127.0.0.1:${process.env.PORT || 5000}/`);
   chart.addCandlestickSeries();
    
    socket.on('chartSocket',(pl)=>{
      // console.log(pl)
      candleSeries.update(pl);
    })
  };

  render() {
    return (
      <div>
        <h2>BTCUSD Chart</h2>
        <div ref={this.myRef}></div>
      </div>
    );
  }
}
