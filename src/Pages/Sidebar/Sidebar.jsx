import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { FaCircleChevronDown, FaCircleChevronUp } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import "../../Assets/css/Sidebar/Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutCookie } from "../../Slices/Authentication/AuthenticationSlice";
import { toast } from "react-toastify";
const Sidebar = (props) => {
  const { handleSubMenuClick } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [userData, setUserData] = useState(null);
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || {}
  );
  const createdBy = userData?.data?.role_name;
  // handle logout code here...
  const handleLogout = async () => {
    const response = await dispatch(logoutCookie());
    console.log(response, "response");
    if (response?.payload?.code === 200) {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      toast.success(response.payload.message);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const {
    Vendor_Management,
    Courier_Service,
    Travel_Management,
    Admin_Helpdesk,
    Customer_Satisfaction_Feedback,
    Request_Form,
    Outward_Courier,
    Inward_Courier,
    Form_Builder,
    Category,
    Form_Reports,
    Reverse_Pickup,
    Visitor_Management_System,
    Annual_Maintenance_Contract,
    Contracts,
    Petty_Cash_Dashboard,
    Voucher_Creation,
    User_Approval,
    Admin_Approval,
    Account_Voucher_Approval,
    Balance_Summary_Report,
    Email_Approval_Tracking,
    Petty_Cash_Reports,
    Office_Lease,
    License,
    Mum_Admin_AMC,
    AMC_Dashboard,
    Office_Supply,
    Item_Master,
    Office_Supply_Report,
    Office_Report_Form,
    Office_Supply_Request,
    Inventory_Management,
    International_Travel_Request,
    Report,
    Ola_Uber_File_Upload,
    Air_Car_Upload_Invoice,
    Admin_User,
    Upload_Invoices,
    Generate_Report,
    Office_Upload_Invoices,
    Car_Hire_Request,
    Maintenance_Request,
    Repair_Maintenance_Request,
    Approval_Requests
  } = permissionDetailData.data || {};
  const items = useMemo(
    () =>
      [
        Vendor_Management?.view && {
          id: 1,
          menu: "Vendor Management",
          subMenu: "Vendor Management",
          url: "/vendorManagement",
        },
        // Vendor_Management?.view && {
        //   id: 2,
        //   menu: "Vendor Management",
        //   subMenu: "Bill Management",
        //   url: "/vendorManagement",
        // },
        // Vendor_Management?.view && {
        //   id: 3,
        //   menu: "Vendor Management",
        //   subMenu: "PO Management",
        //   url: "/poManagement",
        // },
        Courier_Service?.view && { id: 4, menu: "Courier Service" },
        Inward_Courier?.view && {
          id: 5,
          menu: "Courier Service",
          subMenu: createdBy !== "admin" ? "Inward History" : "Inward Courier",
          // subMenu: "Inward Courier",
          url: "/inwardCourier",
        },
        Outward_Courier?.view && {
          id: 6,
          menu: "Courier Service",
          subMenu:
            createdBy !== "admin" ? "Outward History" : "Outward Courier",
          // subMenu: "Outward Courier",
          url: "/outwardCourier",
        },
        Reverse_Pickup?.view && {
          id: 7,
          menu: "Courier Service",
          subMenu: createdBy !== "admin" ? "Reverse Pickup History" : "Reverse Pickup",
          url: "/reversePickup",
        },
        Request_Form?.view && {
          // createdBy !== "admin" &&
          id: 7,
          menu: "Courier Service",
          subMenu: "Courier Request Form",
          url: "/requestForm",
        },
        Upload_Invoices?.view && {
          id: 8,
          menu: "Courier Service",
          subMenu: "Upload Invoices",
          url: "/courierReport",
        },
        // Courier_Service?.view &&{
        //   id: 8,
        //   menu: "Courier Service",
        //   subMenu: "Upload Document",
        //   url: "/uploaddocument",
        // },
        Generate_Report?.view && {
          id: 9,
          menu: "Courier Service",
          subMenu: "Generate Report",
          url: "/courierGenerateReport",
        },
        // {
        //   id: 9,
        //   menu: "PPM Schedule Management",
        //   subMenu: "PPM Management",
        //   url: "/ppmManagement",
        // },
        // {
        //   id: 10,
        //   menu: "PPM Schedule Management",
        //   subMenu: "Reminder",
        //   url: "/ppmReminder",
        // },
        // {
        //   id: 11,
        //   menu: "PPM Schedule Management",
        //   subMenu: "Report",
        //   url: "/ppmReport",
        // },
        // Travel_Management?.view &&{
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/internationalTravelRequest",
        //   subMenu: "International Travel Request",
        // },
        // Travel_Management?.view &&{
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/tourApproval",
        //   subMenu: "Tour Approval",
        // },
        // Travel_Management?.view &&{
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/travelDesk",
        //   subMenu: "Travel Desk",
        // },
        // Travel_Management?.view &&{
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/travelBillApprovedByAdmin",
        //   subMenu: "Travel Bill Approved By Admin",
        // },
        // Travel_Management?.view &&{
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/olaUberTravelRequest",
        //   subMenu: "Ola/Uber Travel Request",
        // },

        International_Travel_Request?.view && {
          id: 12,
          menu: "Travel Management",
          url: "/internationalTravelRequest",
          subMenu: "International Travel Request",
        },
        Car_Hire_Request?.view && {
          id: 12,
          menu: "Travel Management",
          url: "/carHire",
          subMenu: "Car Hire Request",
        },
        Ola_Uber_File_Upload?.view && {
          id: 12,
          menu: "Travel Management",
          url: "/olaUberFileUpload",
          subMenu: "Ola/Uber File Upload",
        },

        Report?.view && {
          id: 12,
          menu: "Travel Management",
          url: "/report",
          subMenu: "Report",
        },
        // Don`t remove this code we will uncomment this in future.

        Air_Car_Upload_Invoice?.view && {
          id: 12,
          menu: "Travel Management",
          url: "/TravelUploadInvoice",
          subMenu: "Air/Car Upload Invoice",
        },

        // {
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/emailConfiguration",
        //   subMenu: "Email Configuration",
        // },
        // Travel_Management?.view &&{
        //   id: 12,
        //   menu: "Travel Management",
        //   url: "/report",
        //   subMenu: "Report",
        // },
        // {
        //   id: 13,
        //   menu: "Attendance of Support Staff",
        //   subMenu: "Attendance",
        //   url: "/attendance",
        // },
        // { id: 14, menu: "Office Supplies" },
        // { id: 15, menu: "AMC/Contracts" },
        //  {
        //   id: 16,
        //   menu: "AMC/Contracts",
        //   subMenu: "Contract & Aggreements",
        //   url: "/businessagreement",
        // },
        // {
        //   id: 17,
        //   menu: "AMC/Contracts",
        //   subMenu: "Upload Aggreements",
        //   url: "/agreementupload",
        // },
        // {
        //   id: 18,
        //   menu: "AMC/Contracts",
        //   subMenu: "Report",
        //   url: "/agreementreport",
        // },
        // { id: 19, menu: "Visitor Management System" },
        // { id: 20, menu: "Repair & Maintenance Works" },
        Customer_Satisfaction_Feedback?.view && {
          id: 21,
          menu: "Customer Satisfaction Feedback",
        },
        Form_Builder?.view && {
          id: 26,
          menu: "Customer Satisfaction Feedback",
          subMenu: "Create New Form",
          url: "/formbuilderlist",
        },

        Category?.view && {
          id: 27,
          menu: "Customer Satisfaction Feedback",
          subMenu: "Category",
          // url: "/dynamicformrender",
          url: "/categorylist",
        },
        // Form_Reports?.view &&
        // {
        //   id: 28,
        //   menu: "Customer Satisfaction Feedback",
        //   subMenu: "Reports",
        //   url: "/dynamicformrender",
        // },

        Admin_Helpdesk?.view && {
          id: 22,
          menu: "Admin Helpdesk",
          subMenu: "Dashboard",
          url: "/adminDashboard",
        },
        Admin_Helpdesk?.view && {
          id: 22,
          menu: "Admin Helpdesk",
          subMenu: "Tickets",
          url: "/ticketsManagement",
        },
        Admin_Helpdesk?.view && {
          id: 22,
          menu: "Admin Helpdesk",
          subMenu: "Reports",
          url: "/ticketReport",
        },
        // {
        //   id: 23,
        //   menu: "Checklist+Requisition",
        //   subMenu: "Admin Login",
        //   url: "/",
        // },
        // {
        //   id: 24,
        //   menu: "Petty Cash Management",
        //   subMenu: "",
        //   url: "/",
        // },
        // {
        //   id: 25,
        //   menu: "User Management",
        //   subMenu: "",
        //   url: "/",
        // },
        Visitor_Management_System?.view && {
          id: 22,
          menu: "Visitor Management System",
          subMenu: "Visitor Management System",
          url: "/visitorManagementSystem",
        },

        AMC_Dashboard?.view && {
          id: 28,
          menu: "Annual Maintenance Contract",
          subMenu: "AMC Dashboard",
          url: "/amcDashboard",
        },
        // Annual_Maintenence_Contract?.view &&
        // {
        //   id: 29,
        //   menu: "Annual Maintenance Contract",
        //   subMenu: "Annual Mantenance Contract",
        //   url: "/annualMantenenceContract",
        // },
        Mum_Admin_AMC?.view && {
          id: 32,
          menu: "Annual Maintenance Contract",
          subMenu: "Mum Admin AMC",
          url: "/mumAdminAmc",
        },
        Office_Lease?.view && {
          id: 30,
          menu: "Annual Maintenance Contract",
          subMenu: "Office Lease",
          url: "/ambitOfficeLease",
        },
        License?.view && {
          id: 31,
          menu: "Annual Maintenance Contract",
          subMenu: "License",
          url: "/license",
        },
        Contracts?.view && {
          id: 32,
          menu: "Annual Maintenance Contract",
          subMenu: "Contracts",
          url: "/contracts",
        },
        Petty_Cash_Dashboard?.view &&
        {
          id: 33,
          menu: "Petty Cash Management",
          subMenu: "Petty Cash Dashboard",
          url: "/pettyCashDashboard",
        },
        Voucher_Creation?.view &&
        {
          id: 34,
          menu: "Petty Cash Management",
          subMenu: "Voucher Creation",
          url: "/voucherCreation",
        },
        User_Approval?.view && {
          id: 38,
          menu: "Petty Cash Management",
          subMenu: "User Approval",
          url: "/userApproval",
        },
        Admin_Approval?.view && 
        {
          id: 38,
          menu: "Petty Cash Management",
          subMenu: "Admin Approval",
          url: "/adminApproval",
        },
        Account_Voucher_Approval?.view &&
        {
          id: 35,
          menu: "Petty Cash Management",
          subMenu: "Accounts Voucher Approval",
          // url: "/voucherApproval",
          url: "/adminVouchers",
        },
        Balance_Summary_Report?.view &&
        {
          id: 37,
          menu: "Petty Cash Management",
          subMenu: "Balance Summary Report",
          url: "/pettyCashbalanceReport",
        },
        Email_Approval_Tracking?.view &&
        {
          id: 37,
          menu: "Petty Cash Management",
          subMenu: "Email Approval Tracking",
          url: "/emailStatus",
        },
        Petty_Cash_Reports?.view &&
        {
          id: 36,
          menu: "Petty Cash Management",
          subMenu: "Reports",
          url: "/reports",
        },
        Office_Supply?.view && { id: 22, menu: "Office Supplies" },
        Item_Master?.view && {
          id: 22,
          menu: "Office Supplies",
          subMenu: "Item Master",
          url: "/itemMaster",
        },

        Office_Supply_Request?.view && {
          id: 22,
          menu: "Office Supplies",
          subMenu: "Office Supplies Request",
          url: "/officeSupplyRequest",
        },
        Approval_Requests?.view && {
          id: 22,
          menu: "Office Supplies",
          subMenu: "Approval Requests",
          url: "/approvalRequests",
        },
        Inventory_Management?.view && {
          id: 22,
          menu: "Office Supplies",
          subMenu: "Inventory Management",
          url: "/inventoryManagement",
        },
        Office_Supply_Report?.view && {
          id: 22,
          menu: "Office Supplies",
          subMenu: "Report",
          url: "/officeSupplyReport",
        },
        Office_Upload_Invoices?.view && {
          id: 22,
          menu: "Office Supply",
          subMenu: "Office Upload Invoices",
          url: "/officeUploadInvoices",
        },
        Admin_User?.view && {
          id: 22,
          menu: "Admin User",
          subMenu: "Admin User",
          url: "/adminUser",
        },
        Repair_Maintenance_Request?.view && {
          id: 22,
          menu: "Repair & Maintenance",
          subMenu: "Repair & Maintenance Request",
          url: "/maintenanceRequest",
        },
        
      ].filter(Boolean),
    [
      Vendor_Management,
      Courier_Service,
      Request_Form,
      Reverse_Pickup,
      Outward_Courier,
      Inward_Courier,
      Travel_Management,
      Admin_Helpdesk,
      createdBy,
      Visitor_Management_System,
      Annual_Maintenance_Contract,
      Contracts,
      License,
      Mum_Admin_AMC,
      Office_Lease,
      AMC_Dashboard,
      Office_Supply,
      Item_Master,
      Office_Supply_Report,
      Office_Report_Form,
      Office_Supply_Request,
      Inventory_Management,
      Customer_Satisfaction_Feedback,
      Form_Builder,
      Category,
      Form_Reports,
      Admin_User,
      Upload_Invoices,
      Generate_Report,
      License,
      Maintenance_Request
    ]
  );
  const sidebarMenu = useMemo(() => {
    const menuMap = new Map();

    items.forEach((item) => {
      if (!menuMap.has(item.menu)) {
        menuMap.set(item.menu, {
          id: item.id,
          menu: item.menu,
          subMenus: [],
          url: item.url,
        });
      }
      if (item.subMenu) {
        menuMap.get(item.menu).subMenus.push({
          id: item.id,
          subMenu: item.subMenu,
          url: item.url,
        });
      }
    });

    return Array.from(menuMap.values());
  }, [items]);
  const handleOpen = (index) => {
    if (open === index) {
      setOpen(-1);
    } else {
      setOpen(index);
    }
  };
  return (
    <Card className="sidebar_card">
      <ListGroup>
        {sidebarMenu.map((item, index) => (
          <ListGroup.Item key={item.menu} className="border-0">
            {item.subMenus?.length > 0 ? (
              <Button
                variant="dark"
                className="w-100 d-flex text-start justify-content-between align-items-center"
                onClick={() => handleOpen(index)}
              >
                {item.menu}
                {open === index ? (
                  <FaCircleChevronUp className="ms-3" />
                ) : (
                  <FaCircleChevronDown className="ms-3" />
                )}
              </Button>
            ) : (
              <NavLink
                to={item.url}
                className="btn btn-dark text-start bg-black w-100"
              >
                {item.menu}
              </NavLink>
            )}

            {open === index && item.subMenus && (
              <ListGroup>
                {item.subMenus.map((subMenu) => (
                  <ListGroup.Item key={subMenu.subMenu} className="border-0">
                    <NavLink
                      to={subMenu.url}
                      className="btn btn-dark w-100"
                      onClick={handleSubMenuClick}
                    >
                      {subMenu.subMenu}
                    </NavLink>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}

        <div
          className="d-flex justify-content-between align-items-center mt-2 mb-2"
          id="setting_logout"
          onClick={handleLogout}
        >
          {/* <span
            className="ms-md-5 ms-0"
            onClick={() => navigate("/allSettings")}
          >
            <img
              src="/images/settings.svg"
              alt="Logo"
              className="me-2 settings_part"
            />
            <span className="setting_text">Setting</span>
          </span> */}

          <span className="me-3 logout_image">
            <img
              src="/images/logout.svg"
              alt="Logo"
              className="logout_image_img"
            />
            <span className="setting_text">Logout</span>
          </span>
        </div>
      </ListGroup>
    </Card>
  );
};

export default Sidebar;
