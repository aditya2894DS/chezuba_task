import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, BarElement } from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);

export default function OrderByStatusWidget() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ labels: "", data: [] }],
  });

  useEffect(() => {
    fetch("http://localhost:3001/order/orderstatuscount")
      .then((res) => res.json())
      .then((json) => createChartData(json.msg));
  }, []);

  function createChartData(obj) {
    let myData = {
      labels: obj.map((el) => el.status),
      datasets: [
        {
          label: "Order count",
          data: obj.map((el) => el.count),
        },
      ],
    };
    setChartData(myData);
  }

  return (
    <>
    <div className="widget-container">
      <h5>OrderByStatus Widget</h5>
        <Bar data={chartData} />
        </div>
    </>
  );
}
