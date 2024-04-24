import React from "react";
import ReactApexChart from "react-apexcharts";

const DoughnutChart = ({ series, labels, width, height }) => {
  const options = {
    chart: {
      type: "donut",
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width={width}
          height={height}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default DoughnutChart;
