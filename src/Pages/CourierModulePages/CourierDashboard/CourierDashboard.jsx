import React, { useState } from "react";
import { Dropdown, Card, Button, Row, Col, Container } from "react-bootstrap";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import "./CourierDashboard.css";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CourierDashboard = () => {
  const [Company, setCompany] = useState([]);
  const [Widget, setWidget] = useState([]);

  // Company and widget dropdown data
  const companies = [
    { label: "Company select company", value: "" },
    { label: "Ambit Capital Private Ltd", value: "1" },
    { label: "Ambit Investment Advisors Private Ltd", value: "2" },
    { label: "Ambit Private Ltd", value: "3" },
    { label: "Ambit Finvest Private Ltd", value: "4" },
    { label: "Ambit Singapore Pte. Ltd", value: "5" },
    { label: "Ambit Investment Managers Private Ltd", value: "6" },
  ];

  const widgets = [
    { label: "Widgets select Widgets", value: "" },
    { label: "All Type Courier", value: "1" },
    { label: "Total Courier", value: "2" },
    { label: "Total Inward Couriers", value: "3" },
    { label: "Total Outward Couriers", value: "4" },
    { label: "Total Reverse Pickup Couriers", value: "5" },
    { label: "Couriers Date Wise Chart", value: "6" },
  ];

  const ChartData = {
    labels: [
      "Amit Capital Private Ltd",
      "Amit International Advisors Private Ltd",
      "Amitat Private Ltd",
      "Amitat Finvest Private Ltd",
      "Amitat Singapore Pte. Ltd",
      "Amitat Investment Managers Private Ltd",
    ],
    datasets: [
      {
        label: "Inward Couriers",
        backgroundColor: "#007bff",
        data: [25, 30, 45, 40, 30, 50],
      },
      {
        label: "Outward Couriers",
        backgroundColor: "#28a745",
        data: [30, 40, 35, 45, 35, 55],
      },
      {
        label: "Reverse Pickup Couriers",
        backgroundColor: "#ff9f40",
        data: [20, 25, 30, 35, 25, 40],
      },
    ],
  };

  const ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "All Type Courier",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  const data = {
    labels: ["Local Courier", "International Courier", "Domestic Courier"],
    datasets: [
      {
        label: "Inward Courier",
        data: [10, 15, 5],
        borderColor: "#2F3C7E",
        backgroundColor: "rgba(47, 60, 126, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Outward Courier",
        data: [20, 25, 10],
        borderColor: "#F85C50",
        backgroundColor: "rgba(248, 92, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Reverse Pickup Courier",
        data: [5, 10, 3],
        borderColor: "#4CB944",
        backgroundColor: "rgba(76, 185, 68, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const CourierTypeData = {
    labels: [
      "Total Couriers",
      "Inward Couriers",
      "Outward Couriers",
      "Reverse Pickup Couriers",
    ],
    datasets: [
      {
        data: [50, 27.9, 9.5, 12.5],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
        hoverBackgroundColor: ["#0056b3", "#1e7e34", "#e0a800", "#c82333"],
      },
    ],
  };

  const CourierTypeOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 12,
          padding: 20,
          font: {
            size: 14,
            family: "'Arial', sans-serif",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  return (
    <Container fluid>
      <Card className="p-2">
        <h4 className="pageTitle mt-2">Courier Dashboard</h4>

        {/* Dropdowns */}
        <Row className="mt-3">
          <Col md={3} className="my-3">
            <CustomDropdown
              labelKey="label"
              valueKey="value"
              options={companies}
              selectedValue={Company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Col>
          <Col md={3} className="my-3">
            <CustomDropdown
              labelKey="label"
              valueKey="value"
              options={widgets}
              selectedValue={Widget}
              onChange={(e) => setWidget(e.target.value)}
            />
          </Col>
        </Row>

        {/* Courier Summary Cards */}
        <Row className="text-center">
          <Col md={3}>
            <Card className="my-3 p-2 custom-card">
              <h6>Total Couriers</h6>
              <h4>150</h4>
              <Button variant="success" className="py-0">
                View
              </Button>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="my-3 p-2 custom-card">
              <h6>Inward Couriers</h6>
              <h4>80</h4>
              <Button variant="success" className="py-0">
                View
              </Button>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="my-3 p-2 custom-card">
              <h6>Outward Couriers</h6>
              <h4>50</h4>
              <Button variant="success" className="py-0">
                View
              </Button>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="my-3 p-2 custom-card">
              <h6>Reverse Pickup Couriers</h6>
              <h4>20</h4>
              <Button variant="success" className="py-0">
                View
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Chart Section */}
        <Row className="mt-4">
          <Col md={6}>
            <Card className="my-3 p-3 custom-card chart-container">
              <div className="chart-center">
                <Line data={data} options={options} />
              </div>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="my-3 p-3 custom-card chart-container">
              <h5 className="mt-3">All Type Courier</h5>
              <Doughnut data={CourierTypeData} options={CourierTypeOptions} />
            </Card>
          </Col>
        </Row>

        <div className="mt-4">
          <Card className="my-3 p-3 custom-card">
            <Bar data={ChartData} options={ChartOptions} />
          </Card>
        </div>
      </Card>
    </Container>
  );
};

export default CourierDashboard;
