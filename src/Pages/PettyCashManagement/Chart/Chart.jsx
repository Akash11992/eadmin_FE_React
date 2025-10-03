import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

// Register the required components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const Chart = ({ filteredData, allData, voucherTypeRecords }) => {
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const typeChartRef = useRef(null);

  //   const dispatch = useDispatch();
  const baseColors = [
    "rgba(45, 168, 48, 0.92)",
    "rgba(255, 0, 17, 0.92)",
    "rgba(255, 206, 86, 0.85)",
    "rgba(69, 54, 152, 0.8)",
  ];

  const getRandomDarkColor = () => {
    const r = Math.floor(Math.random() * 156);
    const g = Math.floor(Math.random() * 156);
    const b = Math.floor(Math.random() * 156);
    const a = (Math.random() * (1 - 0.8) + 0.8).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Dummy data
  const data = {
    Group: [
      { service_group: "Ambit Capital Private Limited", count: 40 },
      { service_group: "Ambit Wealth Private Limited", count: 15 },
      { service_group: "Ambit Private Limited", count: 25 },
    ],
  };

  const department = [
    { service_group: "Capital Markets & Trading", count: 40 },
    { service_group: "Human Resources", count: 15 },
    { service_group: "Asset Management", count: 25 },
    { service_group: "IT", count: 15 },
    { service_group: "Admin", count: 25 },
  ];
  const prepareChartData = (data) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label: "Petty Cash",
        data: Object.values(data),
        backgroundColor: "rgba(0, 143, 251, 0.85)",
        borderColor: "rgba(0, 143, 251, 0.85)",
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  });
  const prepareChartDepartmentData = useMemo(() => {
    const departmentData = department?.reduce((acc, curr) => {
      acc[curr.service_group] = curr.count;
      return acc;
    }, {});

    return {
      labels: Object.keys(departmentData),
      datasets: [
        {
          label: "Departments",
          data: Object.values(departmentData),
          backgroundColor: "rgba(0, 143, 251, 0.85)",
          borderColor: "rgba(0, 143, 251, 0.85)",
          borderWidth: 1,
          barThickness: 50,
        },
      ],
    };
  }, [department, baseColors]);
  // Prepare data for the Group Doughnut chart
  const prepareGroupChartData = useMemo(() => {
    // allData is your JSON array
    const labels = allData?.map((item) => item.company_name) || [];
    const dataValues =
      allData?.map((item) => Number(item.available_balance) || 0) || [];
    const backgroundColors = labels.map((_, index) =>
      index < baseColors.length ? baseColors[index] : getRandomDarkColor()
    );
    return {
      labels,
      datasets: [
        {
          label: "Available Balance",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  }, [allData, baseColors]);
  const prepareTypeChartData = useMemo(() => {
    const filteredRecords =
      voucherTypeRecords?.filter((item) => Number(item?.total_vouchers) > 0) ||
      [];
    const labels = filteredRecords?.map((item) => item.voucher_name) || [];
    const dataValues =
      filteredRecords?.map((item) =>
        item?.total_vouchers ? Number(item.total_vouchers) : 0
      ) || [];
    const backgroundColors = labels.map((_, index) =>
      index < baseColors.length ? baseColors[index] : getRandomDarkColor()
    );
    return {
      labels,
      datasets: [
        {
          label: "Count",
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  }, [voucherTypeRecords, baseColors]);
  return (
    <>
      <Row>
        <Col md={12} xs={12}>
          <Card className="shadow height-card">
            <Bar
              ref={barChartRef}
              data={prepareChartData(filteredData)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row className="mt-1">
        {" "}
        {allData?.length > 1 && (
          <Col md={6} xs={12}>
            {" "}
            <Card className="shadow height-card">
              <Doughnut
                ref={doughnutChartRef}
                data={prepareGroupChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "left", // Moves legend to the right
                      align: "start", // Aligns the legend vertically
                    },
                  },
                }}
              />
            </Card>
          </Col>
        )}
        <Col md={6}>
          <Card className="shadow height-card">
            <Doughnut
              ref={typeChartRef}
              data={prepareTypeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "left", // Moves legend to the right
                    align: "start", // Aligns the legend vertically
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Chart;
