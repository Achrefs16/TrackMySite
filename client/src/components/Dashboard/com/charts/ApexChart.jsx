import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ series }) => {
  const maxValue = 100; // Assuming the maximum possible value is 100
  const fillPercentage = 80; // Desired fill percentage

  const seriesValue = (fillPercentage / 100) * maxValue;

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "radialBar",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: function (val) {
              return parseInt(val);
            },
            color: "#111",
            fontSize: "36px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Minute"],
  });

  return (
    <div>
      <div id="card">
        <div id="chart">
          <ReactApexChart
            options={options}
            series={[seriesValue]} // Use the calculated seriesValue
            type="radialBar"
            height={350}
          />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
