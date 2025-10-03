import { configureStore } from "@reduxjs/toolkit";
import NavbarReducer from "../Pages/Navbar/NavbarSlice";
import AdminHelpDeskReducer from "../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import AuthenticationReducer from "../Slices/Authentication/AuthenticationSlice";
import LoginReducer from "../Slices/Authentication/AuthenticationSlice";
import CompanyReducer from "../Slices/Authentication/AuthenticationSlice";
import CommondropdownReducer from "../Slices/Commondropdown/CommondropdownSlice";
import RoleReducer from "../Slices/Role/RoleSlice";
import CourierServiceReducer from "../Slices/CourierSevices/CourierSevicesSlice";
import TravelManagementReducer from "../Slices/TravelManagementSlice/TravelManagementsSlice";
import CustomerSatisfactionReducer from "../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice";
import CompanyDetailReducer from "../Slices/CompanyDetails/CompanyDetailSlice";
import ManageUserReducer from "../Slices/ManageUserSlice/ManageUserSlice";
import profileReducer from "../Slices/Profile/ProfileSlice";
import ReversePickupReducer from "../Slices/ReversePickup/ReversePickupSlice";
import VendorManagementReducer from "../Slices/VendorManagement/VendorManagementSlice";
import SchedulerReducer from "../Slices/Scheduler/schedulerSlice";
import AttachmentReducer from "../Slices/Attachment/attachmentSlice";
import AlertTravelManagementReducer from "../Slices/Alert/AlertTravelManagement/AlertTravelManagementSlice";
import ActivityReportReducer from "../Slices/ActivityReport/ActivityReportSlice";
import VisitorManagementReducer from "../Slices/VisitorManagement/VisitorManagementSlice";
import OfficeSupplyReducer from "../Slices/OfficeSupply/OfficeSupplySlice";
import EmailSevicesReducer from "../Slices/Emails/EmailSlice";
import PettyCashDropdownReducer from "../Slices/PettyCashManagement/PettyCashDropdownSlice";
import PettyCashReducer from "../Slices/PettyCashManagement/PettyCashSlice";
import AMCReducer from "../Slices/AMC/AMCSlice";
export default configureStore({
  reducer: {
    Navbar: NavbarReducer,
    AdminHelpDesk: AdminHelpDeskReducer,
    Authentication: AuthenticationReducer,
    Authentication: LoginReducer,
    Authentication: CompanyReducer,
    CommonDropdownData: CommondropdownReducer,
    Role: RoleReducer,
    CourierService: CourierServiceReducer,
    companyDetail: CompanyDetailReducer,
    Role: RoleReducer,
    TravelManagement: TravelManagementReducer,
    CSFSevices: CustomerSatisfactionReducer,
    ManageUser: ManageUserReducer,
    profile: profileReducer,
    ReversePickup: ReversePickupReducer,
    Scheduler: SchedulerReducer,
    Attachment: AttachmentReducer,
    AlertTravelManagement: AlertTravelManagementReducer,
    VendorManagementData: VendorManagementReducer,
    ActivityReportData: ActivityReportReducer,
    VisitorManagement: VisitorManagementReducer,
    OfficeSupply: OfficeSupplyReducer,
    EmailService: EmailSevicesReducer,
    PettyCashDropdown: PettyCashDropdownReducer,
    PettyCash: PettyCashReducer,
    AMC: AMCReducer,
  },
});
