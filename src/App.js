import { Route, Routes } from "react-router-dom";
import Navbars from "./Pages/Navbar/Navbars";
import Sidebar from "./Pages/Sidebar/Sidebar";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./Pages/DashboardModulePages/Dashboard/Dashboard";
import InwardCourier from "./Pages/CourierModulePages/InwardCourier/InwardCourier";
import AddInwardCourier from "./Pages/CourierModulePages/InwardCourier/AddInwardCourier";
import OutwardCourier from "./Pages/CourierModulePages/OutwardCourier/OutwardCourier";
import AddOutwardCourier from "./Pages/CourierModulePages/OutwardCourier/AddOutwardCourier";
import ReversePickup from "./Pages/CourierModulePages/ReversePickup/ReversePickup";
import CourierReport from "./Pages/CourierModulePages/CourierReport/CourierReport";
import UploadDocument from "./Pages/CourierModulePages/UploadDocument";
import VendorManagement from "./Pages/VendorManagement/VendorManagement/VendorManagement";
import AddVendor from "./Pages/VendorManagement/VendorManagement/AddVendor";
import BusinessAgreement from "./Pages/Contract & Aggreements/BusinessAgreement";
import PPMMangement from "./Pages/PPMMangement/PPMMangement";
import PPMSchedule from "./Pages/PPMMangement/PPMSchedule";
import PPMReports from "./Pages/PPMMangement/PPMReports";
import AgreementUpload from "./Pages/Contract & Aggreements/AgreementUpload";
import AgreementReport from "./Pages/Contract & Aggreements/AgreementReport";
import Attendance from "./Pages/AttendanceOfSupport/Attendance";
//import TravelManagement from "./Pages/TrevalManagement/TravelManagement/TravelManagement";
//import AirTravelManagement from "./Pages/TrevalManagement/AirTravelManagement/AirTravelManagement";
//import ForexTravelManagement from "./Pages/TrevalManagement/ForexTravelManagement/ForexTravelManagement";
//import RoadTravelManagement from "./Pages/TrevalManagement/RoadTravelManagement/RoadTravelManagement";
//import VisaTravelManagement from "./Pages/TrevalManagement/VisaTravelManagement/VisaTravelManagement";
import FormBuilderList from "./Pages/CustomerSatisfactionFeedback/FormBuilder/FormBuilderList";
import AddFormBuilder from "./Pages/CustomerSatisfactionFeedback/FormBuilder/AddFormBuilder";
import CategoryList from "./Pages/CustomerSatisfactionFeedback/Category/CategoryList";
import AddCategory from "./Pages/CustomerSatisfactionFeedback/Category/AddCategory";

import InternationalTravelRequest from "./Pages/TravelManagement/InternationalTravelRequest/InternationalTravelRequest";
import OlaUberFileUpload from "./Pages/TravelManagement/OlaUberFileUpload/OlaUberFileUpload";
import Report from "./Pages/TravelManagement/Report/Report";
import TravelRequestForm from "./Pages/TravelManagement/InternationalTravelRequest/TravelRequestForm/TravelRequestForm";
import OlaUberSummaryReport from "./Pages/TravelManagement/OlaUberSummaryReport/OlaUberSummaryReport";

import OutwardRequestForm from "./Pages/CourierModulePages/RequestForm/OutwardRequestForm/OutwardRequestForm";
import AllSettings from "./Pages/Setting/AllSettings/AllSettings";
import Profile from "./Pages/Setting/AllSettings/General/Profile/Profile";
import CompanyDetails from "./Pages/Setting/AllSettings/General/CompanyDetails/CompanyDetails";
import AddCompanyDetails from "./Pages/Setting/AllSettings/General/CompanyDetails/AddCompanyDetails/AddCompanyDetails";
import AddBusinessDetails from "./Pages/Setting/AllSettings/General/CompanyDetails/Add BusinessDetails/AddBusinessDetails";
import Role from "./Pages/Setting/AllSettings/Role/Role";
import AddRole from "./Pages/Setting/AllSettings/Role/AddRole/AddRole";
import Permissions from "./Pages/Setting/AllSettings/Role/Permissions/Permissions";
import ManageUser from "./Pages/Setting/AllSettings/User&Control/ManageUser/ManageUser";
import AddUserForm from "./Pages/Setting/AllSettings/AddUserForm/AddUserForm/AddUserForm";
import Alert from "./Pages/Setting/AllSettings/Notifications/Alert/Alert";
import Integration from "./Pages/Setting/AllSettings/Configurations/Integration/Integration";
import HrmsInnovation from "./Pages/Setting/AllSettings/Configurations/HrmsInnovation/HrmsInnovation";
import "./App.css";
import Registration from "./Pages/Authentication/Registration/Registration";
import Login from "./Pages/Authentication/Login/Login";
import CompanyRegistration from "./Pages/Authentication/CompanyRegistration/CompanyRegistration";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TicketsDashboard from "./Pages/AdminHelpDesk/TicketsDashboard";
import TicketsForm from "./Pages/AdminHelpDesk/TicketsForm";
import AdminDashboard from "./Pages/AdminHelpDesk/AdminDashboard";
import RequestForm from "./Pages/CourierModulePages/RequestForm/RequestForm";
import BusinessDetails from "./Pages/Setting/AllSettings/General/CompanyDetails/BusinessDetails/BusinessDetails";
import Reports from "./Pages/AdminHelpDesk/Reports";
import DynamicFormRender from "./Pages/CustomerSatisfactionFeedback/FormBuilder/DynamicFormRender";
import UsersFeedbackResponses from "./Pages/CustomerSatisfactionFeedback/FormBuilder/UsersFeedbackResponses";
import ProtectedRoutes from "./Services/ProtectedRoutes/ProtectedRoutes";
import NoPageFound from "./Pages/NoPageFound/NoPageFound";
import AlertTravelManagement from "./Pages/Setting/AllSettings/Notifications/Alert/AlertTravelManagement/AlertTravelManagement";
import AllReports from "./Pages/Setting/AllSettings/AllReports/AllReports";
import EmailAnalytics from "./Pages/Setting/AllSettings/AllReports/EmailAnalytics/EmailAnalytics";
import SentEmailStatus from "./Pages/Setting/AllSettings/AllReports/SentEmailStatus/SentEmailStatus";
import BounceReport from "./Pages/Setting/AllSettings/AllReports/BounceReport/BounceReport";
import UnsubscribeUser from "./Pages/Setting/AllSettings/AllReports/UnsubscribeUser/UnsubscribeUser";
import AuditReport from "./Pages/Setting/AllSettings/AllReports/AuditReport/AuditReport";
import ScheduleReport from "./Pages/Setting/AllSettings/AllReports/ScheduleReport/ScheduleReport";
import AlertCourierServices from "./Pages/Setting/AllSettings/Notifications/Alert/AlertCourierServices/AlertCourierServices";
import ActivityReport from "./Pages/Setting/AllSettings/AllReports/ActivityReport/ActivityReport";
import CourierDashboard from "./Pages/CourierModulePages/CourierDashboard/CourierDashboard";
import CourierGenerateReport from "./Pages/CourierModulePages/CourierGenerateReport/CourierGenerateReport";
import VisitorManagementSystem from "./Pages/VisitorManagementSystem/VisitorManagementSystem";
import AddVisitor from "./Pages/VisitorManagementSystem/AddVisitor";
import AmcDashboard from "./Pages/AnnualMaintenenceContract/AmcDashboard/AmcDashboard";
import AmbitOfficeLease from "./Pages/AnnualMaintenenceContract/AmbitOfficeLease/AmbitOfficeLease";
import AddAmbitOfficeLease from "./Pages/AnnualMaintenenceContract/AmbitOfficeLease/AddAmbitOfficeLease";
import License from "./Pages/AnnualMaintenenceContract/License/License";
import AddLicense from "./Pages/AnnualMaintenenceContract/License/AddLicense";
import MumAdminAmc from "./Pages/AnnualMaintenenceContract/MumAdminAmc/MumAdminAmc";
import AddMumAdminAmc from "./Pages/AnnualMaintenenceContract/MumAdminAmc/AddMumAdminAmc";
import Contracts from "./Pages/AnnualMaintenenceContract/Contracts/Contracts";
import AddContracts from "./Pages/AnnualMaintenenceContract/Contracts/AddContracts";
import ApprovalWorkflow from "./Pages/Setting/AllSettings/Notifications/Alert/ApprovalWorkflow/ApprovalWorkflow";
import AddNewApprovalWorkflow from "./Pages/Setting/AllSettings/Notifications/Alert/ApprovalWorkflow/AddNewApproval";
import AddNewApproval from "./Pages/Setting/AllSettings/Notifications/Alert/ApprovalWorkflow/AddNewApproval";
import ItemMaster from "./Pages/OfficeSupply/ItemMaster";
import InventoryManagement from "./Pages/OfficeSupply/InventoryManagement";
import OfficeSupplyReport from "./Pages/OfficeSupply/OfficeSupplyReport";
// import OfficeRequestForm from "./Pages/OfficeSupply/OfficeRequestForm";
import OfficeSupplyRequest from "./Pages/OfficeSupply/OfficeSupplyRequest";
import AddNewOfficeSupply from "./Pages/OfficeSupply/AddNewOfficeSupply";
import UploadInvoice from "./Pages/TravelManagement/UploadInvoice/UploadInvoice";
import ReversePickupRequest from "./Pages/CourierModulePages/RequestForm/ReversePickupRequestForm/ReversePickupRequest";
import PettyCashDashboard from "./Pages/PettyCashManagement/PettyCashDashboard/PettyCashDashboard";
import VoucherCreation from "./Pages/PettyCashManagement/VoucherCreation/VoucherCreation";
import AddVoucherCreation from "./Pages/PettyCashManagement/VoucherCreation/AddVoucherCreation";
import PettyCashReport from "./Pages/PettyCashManagement/Reports/Reports";
import AddPettyCashReport from "./Pages/PettyCashManagement/Reports/AddReports";
import AdminUser from "./Pages/AdminUser/AdminUser";
import ManagePinCode from "./Pages/Setting/AllSettings/ManagePinCode/ManagePinCode";
import EditPinCode from "./Pages/Setting/AllSettings/ManagePinCode/EditPinCode";
import AccountCodeMaster from "./Pages/Setting/AllSettings/AccountCodeMaster/AccountCodeMaster";
import EditAccountCodeMaster from "./Pages/Setting/AllSettings/AccountCodeMaster/EditAccountCodeMaster";
import CarTravelRequest from "./Pages/TravelManagement/Car Hire/CarTravelRequest";
import CarTravelRequestForm from "./Pages/TravelManagement/Car Hire/CarTravelRequestForm";
import Remark from "./Components/Remark/Remark";
import VoucherApproval from "./Pages/PettyCashManagement/VoucherCreation/VoucherAdminApproval/VoucherApproval";
import PettyCashbalanceReport from "./Pages/PettyCashManagement/VoucherCreation/PettyCashbalance/PettyCashbalanceReport";
import UserApproval from "./Pages/PettyCashManagement/VoucherCreation/UserApproval/UserApproval";
import AdminVouchers from "./Pages/PettyCashManagement/VoucherCreation/AdminVouchers/AdminVouchers";
import MaintenanceReport from "./Pages/Repair&Maintenance/MaintenanceReport";
// import AddMaintenance from "./Pages/Repair&Maintenance/AddMaintenance";
import AdminApproval from "./Pages/PettyCashManagement/AdminApproval/AdminApproval";
import OlaUberRemark from "./Components/TravelManegementComponets/Reports/ReportSearchForm/OlaUberRemark";
import RejectRemarksForm from "./Pages/PettyCashManagement/VoucherCreation/RejectRemarksForm";
import RaiseQueryForm from "./Pages/PettyCashManagement/AdminApproval/RaiseQueryForm";
import RejectForm from "./Pages/PettyCashManagement/AdminApproval/RejectForm";
import EmailStatus from "./Pages/PettyCashManagement/EmailStatus/EmailStatus";
import EmailRejectForm from "./Pages/PettyCashManagement/EmailStatus/EmailRejectForm";
import OfficeSupplyRemark from "./Components/OfficeSupply/OfficeSupplyRemark";
import MaintenanceRequestForm from "./Pages/Repair&Maintenance/MaintenanceRequestForm";
import ApprovalRequests from "./Pages/OfficeSupply/ApprovalRequests";

function App() {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.Navbar.show);
  const handleIsMobile = useSelector((state) => state.Navbar.handleIsMobile);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const noLayoutPaths = [
    "/",
    "/registration",
    "/companyRegistration",
    "/remark",
    "/olauberremark",
    "/reject-remarks",
    "/rejectAdmin",
    "/raiseQueryAdmin",
    "/emailReject",
    "/officeSupplyRemark"
  ];
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || {}
  );
  // console.log('permissionDetailData in app',permissionDetailData)
  useEffect(() => {
    const isNoLayoutPath =
      noLayoutPaths.includes(location.pathname) ||
      /^\/dynamicformrender\/\d+$/.test(location.pathname);

    setIsVisible(!isNoLayoutPath);
  }, [location]);

  // useEffect(() => {
  //   const isNewTab = !document.referrer;
  //   if (isNewTab) {
  //     localStorage.removeItem("userData");
  //     window.location.href = "/";
  //   }
  // }, []);

  const [showSidebar, setShowSidebar] = useState(true);
  const handleSideBar = (e) => {
    e.preventDefault();
    setShowSidebar(!showSidebar);
  };

  const handleSubMenuClick = () => {
    if (window?.innerWidth <= 428) {
      // console.log("Closing sidebar2",showSidebar);
      // console.log('window?.innerWidth',window?.innerWidth)
      setShowSidebar(true);
    }
  };
  useEffect(() => {
    if (!showSidebar) {
      setTimeout(() => setShowSidebar(false), 50);
      // console.log("Closing sidebar11",showSidebar);
    }
  }, [showSidebar]);
  // console.log('window?.innerWidth',window?.innerWidth)
  // console.log('window',window?.screen.width)
  return (
    <>
      {isVisible ? <Navbars handleSideBar={handleSideBar} /> : ""}
      <Container fluid className={isVisible ? "py-3 p" : "p-0"}>
        {/* <div className={isVisible ?  "" :`${show ? "d-flex" : ""}` }> */}
        <div>
          {isVisible && (
            <div className={`sidebar ${showSidebar ? "open" : ""}`}>
              <Sidebar handleSubMenuClick={handleSubMenuClick} />
            </div>
          )}

          <div
            style={{
              overflowY: isVisible ? "auto" : "hidden",
              height: isVisible ? "85vh" : "100vh",
              width: "auto",
            }}
            className={
              isVisible
                ? `dashboard-container ${showSidebar ? "reduced-width" : ""}`
                : ""
            }
          >
            <Routes>
              {/* <Route path = "*" element= {<NoPageFound/>}/> */}
              <Route path="/" element={<Login />} />
              <Route
                path="/inwardcourier"
                element={<ProtectedRoutes element={<InwardCourier />} />}
              />
              <Route
                path="/addinwardcourier"
                element={<ProtectedRoutes element={<AddInwardCourier />} />}
              />
              <Route
                path="/outwardcourier"
                element={<ProtectedRoutes element={<OutwardCourier />} />}
              />
              <Route
                path="/addoutwardcourier"
                element={<ProtectedRoutes element={<AddOutwardCourier />} />}
              />
              <Route path="/reversepickup" element={<ReversePickup />} />
              <Route path="/courierreport" element={<CourierReport />} />
              <Route path="/uploaddocument" element={<UploadDocument />} />
              <Route path="/CourierDashboard" element={<CourierDashboard />} />
              <Route path="/vendormanagement" element={<VendorManagement />} />

              <Route path="/addvendor" element={<AddVendor />} />
              <Route
                path="/businessagreement"
                element={<BusinessAgreement />}
              />
              <Route
                path="/dashboard"
                element={<ProtectedRoutes element={<Dashboard />} />}
              />
              <Route path="/ppmManagement" element={<PPMMangement />} />
              <Route path="/ppmSchedule" element={<PPMSchedule />} />
              <Route path="/ppmReport" element={<PPMReports />} />
              <Route path="/agreementupload" element={<AgreementUpload />} />
              <Route path="/agreementreport" element={<AgreementReport />} />
              <Route path="/attendance" element={<Attendance />} />

              <Route
                path="/InternationalTravelRequest"
                element={<InternationalTravelRequest />}
              />
              <Route
                path="/olaUberFileUpload"
                element={<OlaUberFileUpload />}
              />
              <Route
                path="/olaUberSummaryReport"
                element={<OlaUberSummaryReport />}
              />
              <Route path="/report" element={<Report />} />
              <Route
                path="/travelRequestForm"
                element={<TravelRequestForm />}
              />

              <Route
                path="/outwardRequestForm"
                element={<OutwardRequestForm />}
              />
              <Route
                path="/allSettings"
                element={<ProtectedRoutes element={<AllSettings />} />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoutes element={<Profile />} />}
              />
              <Route
                path="/companyDetails"
                element={<ProtectedRoutes element={<CompanyDetails />} />}
              />
              <Route
                path="/addCompanyDetails"
                element={<ProtectedRoutes element={<AddCompanyDetails />} />}
              />
              <Route
                path="/addBusinessDetails"
                element={<ProtectedRoutes element={<AddBusinessDetails />} />}
              />
              <Route
                path="/role"
                element={<ProtectedRoutes element={<Role />} />}
              />
              <Route
                path="/addRole"
                element={<ProtectedRoutes element={<AddRole />} />}
              />
              <Route
                path="/permissions"
                element={<ProtectedRoutes element={<Permissions />} />}
              />
              <Route
                path="/manageUser"
                element={<ProtectedRoutes element={<ManageUser />} />}
              />
              <Route
                path="/addUserForm"
                element={<ProtectedRoutes element={<AddUserForm />} />}
              />
              <Route
                path="/alert"
                element={<ProtectedRoutes element={<Alert />} />}
              />
              <Route path="/integration" element={<Integration />} />
              <Route path="/hrmsInnovation" element={<HrmsInnovation />} />
              <Route path="/registration" element={<Registration />} />

              {isVisible ? null : (
                <Route
                  path="/companyRegistration"
                  element={<CompanyRegistration />}
                />
              )}
              <Route
                path="/ticketsManagement"
                element={<ProtectedRoutes element={<TicketsDashboard />} />}
              />
              <Route
                path="/ticketsEdit"
                element={<ProtectedRoutes element={<TicketsForm />} />}
              />
              <Route
                path="/adminDashboard"
                element={<ProtectedRoutes element={<AdminDashboard />} />}
              />
              {/* <Route
                path="/airTravelManagement"
                element={<AirTravelManagement />}
              />
              <Route
                path="/forexTravelManagement"
                element={<ForexTravelManagement />}
              />
              <Route
                path="/roadTravelManagement"
                element={<RoadTravelManagement />}
              />
              <Route
                path="/visaTravelManagement"
                element={<VisaTravelManagement />}
              /> */}
              <Route
                path="/outwardRequestForm"
                element={<OutwardRequestForm />}
              />

              {/* //Customer satisfaction feedback */}

              <Route
                path="/formbuilderlist"
                element={<ProtectedRoutes element={<FormBuilderList />} />}
              />
              <Route
                path="/categorylist"
                element={<ProtectedRoutes element={<CategoryList />} />}
              />

              <Route
                path="/addcategory"
                element={<ProtectedRoutes element={<AddCategory />} />}
              />
              <Route
                path="/addformbuilder"
                element={<ProtectedRoutes element={<AddFormBuilder />} />}
              />
              <Route
                path="/dynamicformrender/:id"
                element={<DynamicFormRender />}
              />
              <Route
                path="/usersfeedbackresponses"
                element={
                  <ProtectedRoutes element={<UsersFeedbackResponses />} />
                }
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<div>404 Not Found</div>} />
              <Route path="/allSettings" element={<AllSettings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/companyDetails" element={<CompanyDetails />} />
              <Route
                path="/addCompanyDetails"
                element={<AddCompanyDetails />}
              />
              <Route
                path="/addBusinessDetails"
                element={<AddBusinessDetails />}
              />
              <Route path="/role" element={<Role />} />
              <Route path="/addRole" element={<AddRole />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/manageUser" element={<ManageUser />} />
              <Route path="/addUserForm" element={<AddUserForm />} />
              <Route path="/alert" element={<Alert />} />
              <Route path="/integration" element={<Integration />} />
              <Route path="/hrmsInnovation" element={<HrmsInnovation />} />
              <Route path="/registration" element={<Registration />} />

              <Route path="/" element={<Login />} />
              {isVisible ? null : (
                <Route
                  path="/companyRegistration"
                  element={<CompanyRegistration />}
                />
              )}
              {/* <Route path="/airTravelManagement" element={<AirTravelManagement />} />
              <Route path="/forexTravelManagement" element={<ForexTravelManagement />} />
              <Route path="/roadTravelManagement" element={<RoadTravelManagement />} /> */}
              {/* <Route path="/visaTravelManagement" element={<VisaTravelManagement />} /> */}
              <Route path="/ticketsManagement" element={<TicketsDashboard />} />
              <Route path="/ticketsEdit" element={<TicketsForm />} />
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              <Route
                path="/outwardRequestForm"
                element={<OutwardRequestForm />}
              />
              <Route path="/requestForm" element={<RequestForm />} />
              <Route path="/ticketReport" element={<Reports />} />

              <Route
                path="/reversepickuprequestForm"
                element={<ReversePickupRequest />}
              />
              <Route
                path="/ticketReport"
                element={<ProtectedRoutes element={<Reports />} />}
              />
              <Route
                path="/businessDetails"
                element={<ProtectedRoutes element={<BusinessDetails />} />}
              />
              <Route
                path="/alertTravelManagement"
                element={<AlertTravelManagement />}
              />
              <Route
                path="/allReports"
                element={<ProtectedRoutes element={<AllReports />} />}
              />
              <Route
                path="/emailAnalytics"
                element={<ProtectedRoutes element={<EmailAnalytics />} />}
              />
              <Route
                path="/sentEmailStatus"
                element={<ProtectedRoutes element={<SentEmailStatus />} />}
              />
              <Route
                path="/bounceReport"
                element={<ProtectedRoutes element={<BounceReport />} />}
              />
              <Route
                path="/unsubscribeUser"
                element={<ProtectedRoutes element={<UnsubscribeUser />} />}
              />
              <Route
                path="/auditReport"
                element={<ProtectedRoutes element={<AuditReport />} />}
              />
              <Route
                path="/scheduleReport"
                element={<ProtectedRoutes element={<ScheduleReport />} />}
              />
              <Route
                path="/alertCourierServices"
                element={<ProtectedRoutes element={<AlertCourierServices />} />}
              />
              <Route
                path="/activityReport"
                element={<ProtectedRoutes element={<ActivityReport />} />}
              />
              <Route
                path="/courierGenerateReport"
                element={
                  <ProtectedRoutes element={<CourierGenerateReport />} />
                }
              />
              <Route
                path="/visitorManagementSystem"
                element={
                  <ProtectedRoutes element={<VisitorManagementSystem />} />
                }
              />
              <Route
                path="/addVisitor"
                element={<ProtectedRoutes element={<AddVisitor />} />}
              />
              <Route
                path="/amcDashboard"
                element={<ProtectedRoutes element={<AmcDashboard />} />}
              />
              <Route
                path="/ambitOfficeLease"
                element={<ProtectedRoutes element={<AmbitOfficeLease />} />}
              />
              <Route
                path="/addambitOfficeLease"
                element={<ProtectedRoutes element={<AddAmbitOfficeLease />} />}
              />
              <Route
                path="/license"
                element={<ProtectedRoutes element={<License />} />}
              />
              <Route
                path="/addlicense"
                element={<ProtectedRoutes element={<AddLicense />} />}
              />
              <Route
                path="/mumAdminAmc"
                element={<ProtectedRoutes element={<MumAdminAmc />} />}
              />
              <Route
                path="/addMumAdminAmc"
                element={<ProtectedRoutes element={<AddMumAdminAmc />} />}
              />
              <Route
                path="/contracts"
                element={<ProtectedRoutes element={<Contracts />} />}
              />
              <Route
                path="/addContracts"
                element={<ProtectedRoutes element={<AddContracts />} />}
              />
              <Route
                path="/approvalWorkflow"
                element={<ProtectedRoutes element={<ApprovalWorkflow />} />}
              />
              <Route
                path="/addNewApproval"
                element={<ProtectedRoutes element={<AddNewApproval />} />}
              />
              <Route
                path="/license"
                element={<ProtectedRoutes element={<License />} />}
              />
              <Route
                path="/addlicense"
                element={<ProtectedRoutes element={<AddLicense />} />}
              />
              <Route
                path="/mumAdminAmc"
                element={<ProtectedRoutes element={<MumAdminAmc />} />}
              />
              <Route
                path="/addMumAdminAmc"
                element={<ProtectedRoutes element={<AddMumAdminAmc />} />}
              />
              <Route
                path="/contracts"
                element={<ProtectedRoutes element={<Contracts />} />}
              />
              <Route
                path="/addContracts"
                element={<ProtectedRoutes element={<AddContracts />} />}
              />
              <Route
                path="/approvalWorkflow"
                element={<ProtectedRoutes element={<ApprovalWorkflow />} />}
              />
              <Route
                path="/addNewApproval"
                element={<ProtectedRoutes element={<AddNewApproval />} />}
              />
              <Route
                path="/inventoryManagement"
                element={<ProtectedRoutes element={<InventoryManagement />} />}
              />
              <Route
                path="/itemMaster"
                element={<ProtectedRoutes element={<ItemMaster />} />}
              />
              <Route
                path="/officeSupplyReport"
                element={<ProtectedRoutes element={<OfficeSupplyReport />} />}
              />
              {/* <Route
                path="/officeRequestForm"
                element={<ProtectedRoutes element={<OfficeRequestForm />} />}
              /> */}
              <Route
                path="/officeSupplyRequest"
                element={<ProtectedRoutes element={<OfficeSupplyRequest />} />}
              />
              <Route
                path="/addNewOfficeSupply"
                element={<ProtectedRoutes element={<AddNewOfficeSupply />} />}
              />
              <Route
                path="/TravelUploadInvoice"
                element={<ProtectedRoutes element={<UploadInvoice />} />}
              />
              <Route
                path="/pettyCashDashboard"
                element={<ProtectedRoutes element={<PettyCashDashboard />} />}
              />
              <Route
                path="/voucherCreation"
                element={<ProtectedRoutes element={<VoucherCreation />} />}
              />
              <Route
                path="/addVoucherCreation"
                element={<ProtectedRoutes element={<AddVoucherCreation />} />}
              />
              <Route
                path="/reports"
                element={<ProtectedRoutes element={<PettyCashReport />} />}
              />
              <Route
                path="/addPettyCashReport"
                element={<ProtectedRoutes element={<AddPettyCashReport />} />}
              />
              <Route
                path="/adminUser"
                element={<ProtectedRoutes element={<AdminUser />} />}
              />
              <Route
                path="/managePincode"
                element={<ProtectedRoutes element={<ManagePinCode />} />}
              />
              <Route
                path="/editPinCode"
                element={<ProtectedRoutes element={<EditPinCode />} />}
              />
              <Route
                path="/accountCodeMaster"
                element={<ProtectedRoutes element={<AccountCodeMaster />} />}
              />
              <Route
                path="/editAccountCodeMaster"
                element={
                  <ProtectedRoutes element={<EditAccountCodeMaster />} />
                }
              />
              <Route
                path="/carHire"
                element={<ProtectedRoutes element={<CarTravelRequest />} />}
              />
              <Route
                path="/carHireRequestForm"
                element={<ProtectedRoutes element={<CarTravelRequestForm />} />}
              />
              <Route
                path="/voucherApproval"
                element={<ProtectedRoutes element={<VoucherApproval />} />}
              />
              <Route
                path="/pettyCashbalanceReport"
                element={
                  <ProtectedRoutes element={<PettyCashbalanceReport />} />
                }
              />
              <Route
                path="/userApproval"
                element={<ProtectedRoutes element={<UserApproval />} />}
              />
              <Route
                path="/adminVouchers"
                element={<ProtectedRoutes element={<AdminVouchers />} />}
              />
              <Route
                path="/remark"
                element={<ProtectedRoutes element={<Remark />} />}
              />
              
              {/* <Route path="/maintenanceRequest" element={<ProtectedRoutes element={<MaintenanceReport />} />} /> 
              <Route path="/addMaintenance" element={<ProtectedRoutes element={<AddMaintenance />} />} /> */}
              <Route
                path="/maintenanceRequest"
                element={<ProtectedRoutes element={<MaintenanceReport />} />}
              />
              {/* <Route path="/maintenanceRequest" element={<ProtectedRoutes element={<MaintenanceReport />} />} />  */}
              {/* <Route path="/addMaintenance" element={<ProtectedRoutes element={<AddMaintenance />} />} /> */}
              <Route
                path="/adminApproval"
                element={<ProtectedRoutes element={<AdminApproval />} />}
              />
              <Route path="/olauberremark" element={<OlaUberRemark />} />
              <Route
                path="/raiseQueryAdmin"
                 element={<RaiseQueryForm />} 
              />
              <Route
                path="/rejectAdmin"
                element={<RejectForm />} 
              />
              <Route
                path="/reject-remarks"
               element={<RejectRemarksForm />}
              />
              <Route
                path="/emailStatus"
                element={<ProtectedRoutes element={<EmailStatus />} />}
              />
              <Route
                path="/emailReject"
                element={<EmailRejectForm />}
              />

              <Route path="/officeSupplyRemark" element={<OfficeSupplyRemark />} />

              <Route
                path="/MaintenanceRequestForm"
                element={<ProtectedRoutes element={<MaintenanceRequestForm />} />}
              />
                <Route
                path="/approvalRequests"
                element={<ProtectedRoutes element={<ApprovalRequests />} />}
              />
            </Routes>
          </div>
        </div>
      </Container>
    </>
  );
}

export default App;
