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
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
            <DropdownMenu onBusinessSelect={handleBusinessSelect} className="mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Business Lost/Found Graph</h1>
            <div className="bg-white p-4 rounded-lg shadow-sm w-full md:w-3/4 lg:w-5/6">
                <canvas ref={chartRef} />
            </div>
            <div className="mt-8 text-center">
                <p className="text-sm"><span className="text-green-600 font-semibold">Green bar: </span>Number of items found</p>
                <p className="text-sm"><span className="text-blue-600 font-semibold">Blue bar: </span>Number of items lost</p>
                <p className="text-sm"><span className="text-yellow-500 font-semibold">Yellow bar: </span>Number of items claimed</p>
                <p className="text-sm"><span className="text-red-600 font-semibold">Red bar: </span>Number of claims rejected</p>
            </div>
        </div>
    );


};

export default BusinessGraph;
