import React from "react"
import ReactApexChart from "react-apexcharts"

function StackedColumnChart(props) {

  let chartData = []
  for (let index = 0; index < props.dataBarChart.length; index++) {
    chartData.push(props.dataBarChart[index]);
  }

  let labelsData = []
  for (let index = 0; index < props.dataLabels.length; index++) {
    labelsData.push(props.dataLabels[index]);
  }
  
  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },

    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "15%",
        endingShape: "rounded",
      },
    },

    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labelsData,
    },
    colors: ["#556ee6"],
    legend: {
      position: "bottom",
    },
    fill: {
      opacity: 1,
    },
  }
  
  const series = [
    {
      name: "Anggota",
      data: chartData,
    },
    
  ]
    return (
      <React.Fragment>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="360"
          className= "apex-charts"
        />
      </React.Fragment>
    )
}

export default StackedColumnChart
