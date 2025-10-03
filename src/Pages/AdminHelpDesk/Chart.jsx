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
import {
  getGroupDropdown,
  getticketOwnerDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";

// Register the required components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const Chart = ({
  filteredData,
  data,
  setGroup,
  group,
  owner,
  setOwner,
  IsActive,
}) => {
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const serviceChartRef = useRef(null);
  const ownerChartRef = useRef(null);

  const dispatch = useDispatch();
  const { groupDropdown, employeeDropdown } = useSelector(
    (state) => state.AdminHelpDesk
  );

  const ticketOwnerPayload = {
    type: "TicketOwner",
    id: 0,
  };
  useEffect(() => {
    dispatch(getGroupDropdown({ type: "group", id: 0 }));
    dispatch(getticketOwnerDropdown(ticketOwnerPayload));
  }, [dispatch]);

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

  const prepareChartData = (data) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label: "Total Tickets",
        data: Object.values(data),
        backgroundColor: "rgba(0, 143, 251, 0.85)",
        borderColor: "rgba(0, 143, 251, 0.85)",
        borderWidth: 1,
        barThickness: 50,
      },
    ],
  });

  // Prepare data for the Group Doughnut chart
  const prepareGroupChartData = useMemo(() => {
    const groupData = data?.Group || []; // Use empty array if Group is undefined
    const filteredGroupData = groupData.reduce((acc, curr) => {
      acc[curr.service_group] = curr.count;
      return acc;
    }, {});
    const backgroundColors = Object.keys(filteredGroupData).map((_, index) =>
      index < baseColors.length ? baseColors[index] : getRandomDarkColor()
    );

    return {
      labels: Object.keys(filteredGroupData),
      datasets: [
        {
          label: "Group Counts",
          data: Object.values(filteredGroupData),
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  }, [data?.Group]);

  // Prepare data for the Service Doughnut chart
  const prepareServiceChartData = useMemo(() => {
    const serviceData = data?.Service || []; // Use empty array if Service is undefined
    const filteredServiceData = serviceData.reduce((acc, curr) => {
      acc[curr.service_type] = curr.count;
      return acc;
    }, {});
    const backgroundColors = Object.keys(filteredServiceData).map((_, index) =>
      index < baseColors.length ? baseColors[index] : getRandomDarkColor()
    );

    return {
      labels: Object.keys(filteredServiceData),
      datasets: [
        {
          label: "Service Counts",
          data: Object.values(filteredServiceData),
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };
  }, [data?.Service]);

  const prepareOwnerChartData = useMemo(() => {
    const OwnerData = data?.Owner || []; // Use empty array if Service is undefined
    const labels = OwnerData.map((item) => item.Name);
    const counts = OwnerData.map((item) => item.count);

    return {
      labels,
      datasets: [
        {
          label: "Ticket Owner",
          data: counts,
          backgroundColor: "rgba(0, 143, 251, 0.85)",
          borderColor: "rgba(0, 143, 251, 0.85)",
          borderWidth: 1,
          barThickness: 50,
        },
      ],
    };
  }, [data?.Owner]);

  return (
    <>
      <Row>
        <Col md={7} xs={12}>
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
        <Col md={5} xs={12}>
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
      </Row>
      <Row className="justify-content-between mt-2 mb-2">
        <Col md={2}>
          <CustomDropdown
            options={groupDropdown}
            labelKey="label"
            valueKey="value"
            selectedValue={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </Col>
        {IsActive === true && (
          <Col md={3}>
            <CustomDropdown
              options={[
                { Employee: "Select Ticket Owner", Emp_id: "" },
                ...employeeDropdown,
              ]}
              labelKey="Employee"
              valueKey="Emp_id"
              selectedValue={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </Col>
        )}
      </Row>
      <Row className="mt-1">
        <Col md={6}>
          <Card className="shadow height-card">
            <Doughnut
              ref={serviceChartRef}
              data={prepareServiceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right", // Moves legend to the right
                    align: "start", // Aligns the legend vertically
                  },
                },
              }}
            />
          </Card>
        </Col>
        {IsActive === true && (
          <Col md={6}>
            <Card className="shadow height-card">
              <Bar
                ref={ownerChartRef}
                data={prepareOwnerChartData}
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
        )}
      </Row>
    </>
  );
};

export default Chart;
