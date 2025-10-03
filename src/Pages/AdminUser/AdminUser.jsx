import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import { Title } from "../../Components/Title/Title";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";

const AdminUser = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    travelRequestNo: "",
    travelName: "",
    travelMode: "",
    bookingDate: "",
  });
  const [tableData, setTableData] = useState([
    {
      travelRequestNo: "TR001",
      travelName: "John Doe",
      travelMode: "Air",
      bookingDate: "2023-12-01",
      remark: "Urgent",
    },
    {
      travelRequestNo: "TR002",
      travelName: "Jane Smith",
      travelMode: "Train",
      bookingDate: "2023-12-05",
      remark: "Business",
    },
  ]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredData = tableData.filter((item) => {
    return (
      item.travelRequestNo
        .toLowerCase()
        .includes(filters.travelRequestNo.toLowerCase()) &&
      item.travelName
        .toLowerCase()
        .includes(filters.travelName.toLowerCase()) &&
      item.travelMode
        .toLowerCase()
        .includes(filters.travelMode.toLowerCase()) &&
      item.bookingDate.includes(filters.bookingDate)
    );
  });

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const mergedData = filteredData.map((item, index) => ({
    serialNo: index + 1,
    ...item,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <CommonLoader />
  ) : (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <div className="row">
        <div className="col" id="main">
          <div className="container-fluid mt-3">
            <Title title="Travel Request" />
            <hr />
            <Row className="mt-4">
              <Col md={3}>
                <CustomInput
                  labelName="Travel Request No"
                  value={filters.travelRequestNo}
                  onChange={(e) =>
                    handleFilterChange("travelRequestNo", e.target.value)
                  }
                  type="text"
                  placeholder="Search Request No"
                />
              </Col>
              <Col md={3}>
                <CustomInput
                  labelName="Travel Name"
                  value={filters.travelName}
                  onChange={(e) =>
                    handleFilterChange("travelName", e.target.value)
                  }
                  type="text"
                  placeholder="Search Travel Name"
                />
              </Col>
              <Col md={3}>
                <CustomInput
                  labelName="Travel Mode"
                  value={filters.travelMode}
                  onChange={(e) =>
                    handleFilterChange("travelMode", e.target.value)
                  }
                  type="text"
                  placeholder="Search Travel Mode"
                />
              </Col>
              <Col md={3}>
                <CustomInput
                  labelName="Booking Date"
                  value={filters.bookingDate}
                  onChange={(e) =>
                    handleFilterChange("bookingDate", e.target.value)
                  }
                  type="date"
                  placeholder="Select Booking Date"
                />
              </Col>
            </Row>

            {mergedData.length > 0 && (
              <div className="mt-4">
                <CustomTable
                  data={mergedData}
                  exportIconVisibility={true}
                  headingText={true}
                  //   searchVisibility={true}
                  //   selectColumnData={true}
                  //   placeholder="Search..."
                  firstColumnVisibility={true}
                  dataContained={mergedData.length || 0}
                  //   actionVisibility={true}
                  pageCount={page}
                  exportToExcelBtnVisiblity={true}
                  handlePageClick={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  handleItemsPerPageChange={handleChangeRowsPerPage}
                  //   actions={actions}
                  tableHeaders={[
                    "Serial No",
                    "Travel Request No",
                    "Travel Name",
                    "Travel Mode",
                    "Booking Date",
                    "Remark",
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;
