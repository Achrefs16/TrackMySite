import React from "react";
import ReactApexChart from "react-apexcharts";

const DoughnutChart = ({ series, labels }) => {
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
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default DoughnutChart;
