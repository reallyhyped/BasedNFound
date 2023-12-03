"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
import DropdownMenu from "../components/businessDropdown"; // Adjust the path as needed

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const BusinessGraph = () => {
    const chartRef = useRef(null);
    const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        let url = 'http://localhost:8000/log/daily_counts/';
        if (selectedBusiness) {
            url += selectedBusiness; // Append business ID if a specific business is selected
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setChartData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [selectedBusiness]);

    useEffect(() => {
        if (chartRef && chartRef.current && chartData.length > 0) {
            const chartInstance = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: chartData.map(item => item.date),
                    datasets: [{
                        label: 'Found',
                        data: chartData.map(item => item.found),
                        backgroundColor: 'rgba(75, 192, 192, 1)',
                    }, {
                        label: 'Lost',
                        data: chartData.map(item => item.lost),
                        backgroundColor: 'rgba(61,133,198,1)',
                    }, {
                        label: 'Claimed',
                        data: chartData.map(item => item.claim),
                        backgroundColor: 'rgba(255,220,83,1)',
                    }, {
                        label: 'Rejected',
                        data: chartData.map(item => item.reject),
                        backgroundColor: 'rgba(255,99,132,1)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            return () => chartInstance.destroy();
        }
    }, [chartRef, chartData]);

    const handleBusinessSelect = (businessId: number) => {
        setSelectedBusiness(businessId);
    };

    return (
        <div className="flex flex-col items-center">
            <DropdownMenu onBusinessSelect={handleBusinessSelect} />
            <h1 className="text-2xl font-bold mt-4">Business Lost/Found Graph</h1>
            <div className="flex flex-wrap justify-center items-start w-5/6">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-4 text-center">
                <p><span className="text-green-600 font-bold">Green bar: </span>Number of items found</p>
                <p><span className="text-blue-600 font-bold">Blue bar: </span>Number of items lost</p>
                <p><span className="text-yellow-300 font-bold">Yellow bar: </span>Number of items claimed</p>
                <p><span className="text-red-600 font-bold">Red bar: </span>Number of claims rejected</p>

            </div>
        </div>
    );
};

export default BusinessGraph;
