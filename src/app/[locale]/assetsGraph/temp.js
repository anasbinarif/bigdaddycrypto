"use client"
import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import { getAssets } from "@/lib/data";
import { Box } from "@mui/material";

// Ensure Highcharts modules are properly initialized
if (typeof Highcharts === 'object') {
    HighchartsMore(Highcharts);
}

const MyHighchartsBubbleChart = () => {
    useEffect(() => {
        getAssets()
            .then(data => {
                const data1 = data.data;
                const filteredData = data1.filter(item => item.Potential != null && item.Sicherheit != null);
                console.log("filteredData", filteredData);
                const newData = filteredData.map(item => ({
                    x: item.Potential,
                    y: item.Sicherheit,
                    z: 2,
                    marker: {
                        symbol: `url(${item.cgImageURL})`,
                    }
                }));
                console.log("newData", newData);
                setChartOptions(prevOptions => ({
                    ...prevOptions,
                    series: [{
                        data: newData
                    }]
                }));
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy',
            height: 800,
        },
        legend: {
            enabled: false
        },
        title: {
            text: 'Market Metrics by Cryptocurrency'
        },
        subtitle: {
            text: 'Source: Cryptocurrency Data API'
        },
        xAxis: {
            title: {
                text: 'Potential'
            },
            labels: {
                format: '{value}'
            }
        },
        yAxis: {
            title: {
                text: 'Sicherheit'
            },
            labels: {
                format: '{value}'
            }
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
                '<tr><th>Potential:</th><td>{point.x}</td></tr>' +
                '<tr><th>Sicherheit:</th><td>{point.y}</td></tr>' +
                '<tr><th>Market Cap:</th><td>{point.z}</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                marker: {
                    symbol: 'circle'
                }
            }
        },
        series: [{
            data: [] // Initialize with empty data
        }]
    });

    return (
        <Box style={{ width: '100%', height: '100%' }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
        </Box>
    );
};

export default MyHighchartsBubbleChart;
