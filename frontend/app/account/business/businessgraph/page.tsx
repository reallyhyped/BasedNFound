"use client";
import React, { useEffect, useRef } from 'react';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale } from 'chart.js';
import { dateFnsAdapter } from 'chartjs-adapter-date-fns';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, dateFnsAdapter, TimeScale, TimeSeriesScale);



const BusinessGraph = () => {
    const chartRef = useRef(null);

    //abstracted data
    const sampleData = [
        { date: '2022-01-01', found: 5, lost: 2 },
        { date: '2022-01-02', found: 7, lost: 3 },
        { date: '2022-01-03', found: 8, lost: 4 },
        { date: '2022-01-04', found: 9, lost: 5 },
        { date: '2022-01-05', found: 10, lost: 6 },
        { date: '2022-01-06', found: 11, lost: 7 },
        { date: '2022-01-07', found: 12, lost: 8 },
        { date: '2022-01-08', found: 13, lost: 9 },
        { date: '2022-01-09', found: 14, lost: 10 },
        { date: '2022-01-10', found: 15, lost: 11 },
        { date: '2022-01-11', found: 16, lost: 12 },
        { date: '2022-01-12', found: 17, lost: 13 },
        { date: '2022-01-13', found: 18, lost: 14 },
        { date: '2022-01-14', found: 19, lost: 15 },
        { date: '2022-01-15', found: 20, lost: 16 },
        { date: '2022-01-16', found: 21, lost: 17 },
        { date: '2022-01-17', found: 22, lost: 18 },
        { date: '2022-01-18', found: 23, lost: 19 },
        { date: '2022-01-19', found: 24, lost: 20 },
        { date: '2022-01-20', found: 25, lost: 21 },
        { date: '2022-01-21', found: 26, lost: 22 },
        { date: '2022-01-22', found: 27, lost: 23 },
        { date: '2022-01-23', found: 28, lost: 24 },
        { date: '2022-01-24', found: 29, lost: 25 },
        
        
      ];


    useEffect(() => {
        if (chartRef && chartRef.current) {
          const chartInstance = new Chart(chartRef.current, {
            type: 'line',
            data: {
              labels: sampleData.map(item => item.date),
              datasets: [{
                label: 'Found',
                data: sampleData.map(item => item.found),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
              }, {
                label: 'Lost',
                data: sampleData.map(item => item.lost),
                borderColor: 'rgba(255,99,132,1)',
                fill: false
              }]
            },
            options: {
              responsive: true,
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day'
                  }
                },
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      }, [chartRef]);
    
      return (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mt-4">Business Graph</h1>
          <div className="flex flex-wrap justify-center items-start w-5/6">
            <canvas ref={chartRef} />
          </div>
        </div>
      );
    };
    
    export default BusinessGraph;