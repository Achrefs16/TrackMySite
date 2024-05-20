import React from "react";
import ReactApexChart from "react-apexcharts";

const HorBarChart = ({ series, categories, width, height, title }) => {
  const integer = series.map((dataObj) => ({
    ...dataObj,
    data: dataObj.data.map((dataPoint) => Math.round(dataPoint)),
  }));
  console.log(series);
  console.log(integer);
  const chartHeight = height;
  const options = {
    chart: {
      type: "bar",
      height: chartHeight,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    fill: {
      gradient: {
        shade: "light",
        type: "horizontal",
      },
    },
    tooltip: {
      enabled: true,
      formatter: function (val) {
        return parseInt(val); // Format tooltip to display integers
      },
    },
    labels: {
      show: false,
      formatter: function (val) {
        return parseInt(val);
      },
    },
  };

  return (
    <div className=" bg-white rounded-md border border-gray-300 w-full h-fit  p-4">
      <div id="chart">
        <h1>{title}</h1>
        <ReactApexChart
          options={options}
          series={integer}
          type="bar"
          height={chartHeight}
          width={width}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default HorBarChart;
