import React from "react";
import ReactApexChart from "react-apexcharts";

const AreaChart = ({ series, categories, width, height }) => {
  const options = {
    chart: {
      height: 200,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },

    xaxis: {
      type: "datetime",
      categories: categories, // Assuming categories is an array of datetime strings
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        formatter: function (value) {
          // Rounds the value to the nearest integer and returns it
          return Math.round(value);
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={height}
          width={width}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default AreaChart;
