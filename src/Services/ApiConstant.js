import axios from "axios";
import { toast } from "react-toastify";
const API = `${process.env.REACT_APP_API}/api`;
const API1 = `${process.env.REACT_APP_API}`;

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const savedUserData = JSON.parse(localStorage.getItem("userData"));

    const token = savedUserData ? savedUserData.token : null;
    // const empId = "0001";

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // config.headers["emp_id"] = empId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
let isToastVisible = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (!isToastVisible) {
        // Check if toast is already visible
        isToastVisible = true; // Set the flag to true
        localStorage.removeItem("userData");
        toast.error("Session Expired! Please Login Again");
        setTimeout(() => {
          isToastVisible = false; // Reset the flag after redirection
          window.location.href = "/";
        }, 3000);
      }
    }
    return Promise.reject(error);
  }
);

export const API_GET_DROPDOWN_DETAILS = {
  DATA: `${API}/dropdowns`,
};

export const API_UPLOAD_FILE = {
  DATA: `${API}/upload`,
};

export const API_ADMIN_HELP_DESK_GET_TICKET_DETAILS = {
  DATA: `${API}/adminHelpDesk/ticketDetails`,
};

export const API_ADMIN_HELP_DESK_GET_DROPDOWN_DETAILS = {
  DATA: `${API}/adminHelpDesk/dropdowns`,
};

export const API_ADMIN_HELP_DESK_INSERT_DETAILS = {
  DATA: `${API}/adminHelpDesk/insertTicketDetails`,
};
export const API_ADMIN_HELP_DESK_UPDATE_DETAILS = {
  DATA: `${API}/adminHelpDesk/updateTicketDetails`,
};
export const API_ADMIN_HELP_DESK_SEND_APPROVER = {
  DATA: `${API}/adminHelpDesk/sendApprover`,
};
export const API_ADMIN_HELP_DESK_GET_EMAIL_BY_ID = {
  DATA: (id) => `${API}/adminHelpDesk/email/${id}`,
};
export const API_ADMIN_HELP_DESK_GET_TICKET_DETAILS_BY_ID = {
  DATA: (id) => `${API}/adminHelpDesk/ticketDetails/${id}`,
};
export const API_ADMIN_HELP_DESK_GET_REPLY_DETAILS = {
  DATA: `${API}/adminHelpDesk/getReplyDetails`,
};
export const API_LOGIN_USER = {
  DATA: `${API}/login`,
};
export const API_REGISTRATION_USER = {
  DATA: `${API}/registerUser`,
};
export const API_COMPANYREGISTRATION_USER = {
  DATA: `${API}/register-company`,
};
export const API_GET_INDUSTRY_TYPES = {
  DATA: `${API}/getIndutryTypes`,
};
export const API_GET_EMPLOYEE_COUNT = {
  DATA: `${API}/getEmployeeCount`,
};
export const API_GET_COMPANY_TYPE = {
  DATA: `${API}/getCompanyType`,
};
export const API_GET_Designations = {
  DATA: `${API}/designations`,
};
export const API_GET_COUNTRIES = {
  DATA: `${API}/countriesDropdown`,
};
export const API_COMPANY_LIST = {
  DATA: `${API}/getDropdownByGroupName`,
};
export const API_GET_STATES = {
  DATA: `${API}/statesDropdown/`,
};
export const API_GET_CITIES = {
  DATA: `${API}/citiesDropdown`,
};

export const API_CREATE_USER = {
  DATA: `${API}/create-user`,
};
export const API_GET_USER_LIST = {
  DATA: `${API}/getUserList`,
};
export const API_UPDATE_USER = {
  DATA: `${API}/update-user`,
};
export const API_DELETE_USER = {
  DATA: `${API}/delete-user`,
};
export const API_GET_USER = {
  DATA: `${API}/get-user`,
};
export const API_GET_DEPARTMENTS = {
  DATA: `${API}/departments`,
};
export const API_GET_COMPANY_DETAILS = {
  DATA: `${API}/company-details`,
};
export const API_CATEGORY_DROPDOWN = {
  DATA: `${API}/categorydropdown`,
};
// export const API_CATEGORY_DROPDOWN = {
//   DATA: `${API}/categorydropdown`,
// };

export const API_GET_PROFILE = {
  DATA: `${API}/edit-profile`,
};
export const API_GET_PROFILE_DETAILS = {
  DATA: `${API}/profiledetails`,
};
export const API_GET_RM_NAME = {
  DATA: `${API}/getRMname`,
};

// role apiConstant define here....
export const API_ROLE_TYPE = {
  DATA: `${API}/get-roles`,
};
export const API_CREATE_ROLE = {
  DATA: `${API}/create-role`,
};
export const API_UPDATE_ROLE = {
  DATA: `${API}/update-Role`,
};
export const API_GET_COUNTRY_BY_COMPANY_ID = {
  DATA: `${API}/getCompanyById`,
};
export const API_DELETE_ROLE = {
  DATA: `${API}/delete-role`,
};
export const API_PERMISSION_BY_ID_ROLE = {
  DATA: `${API}/create`,
};
export const API_FIND_BY_ID_ROLE = {
  DATA: `${API}/findById`,
};
export const API_GET_ROLE_COUNT = {
  DATA: `${API}/getCount`,
};
export const API_GET_PAGES_AND_MODULES = {
  DATA: `${API}/pagesAndModules`,
};
export const API_GET_UPDATE_ROLE = {
  DATA: `${API}/update`,
};
export const API_MODULE_NAME = {
  DATA: `${API}/getmodules`,
};
export const API_PAGES_NAME = {
  DATA: `${API}/getforms`,
};
export const API_UPLOAD_ATTACHMENTS = {
  DATA: `${API}/uploadAttachment`,
};

export const API_INWARD_COURIER_GET_DATA = {
  DATA: `${API}/inwardCourierList`,
};

export const API_INWARD_COURIER_INSERT_DATA = {
  DATA: `${API}/insertinwardcourier`,
};

export const API_UPDATE_INWARD_COURIER_DETAILS = {
  DATA: `${API}/updateinwardcourier`,
};

export const API_SHIPPER_NAME_DROPDOWN_DETAILS = {
  DATA: `${API}/shipperdropdown`,
};
export const API_DEPARTMENT_DROPDOWN_DETAILS = {
  DATA: `${API}/departmentList`,
};
export const API_LOCATION_DROPDOWN_DETAILS = {
  DATA: `${API}/locationList`,
};
export const API_DELETE_INWARD_COURIER = {
  DATA: (reference_no) => `${API}/courierService/deletecourier/${reference_no}`,
};
export const API_GET_OUTWARD_DETAILS = {
  DATA: `${API}/outwardCourierList`,
};
export const API_INSERT_OUTWARD_DETAILS = {
  DATA: `${API}/insertoutwardcourier`,
};

export const API_ADMIN_HELP_DESK_GET_DASHBOARD_DETAILS = {
  DATA: `${API}/adminHelpDesk/dashboardDetails`,
};
export const API_UPLOAD_COURIER_REPORT = {
  DATA: `${API}/v1/CourierReportupload`,
};
export const API_UPLOAD_PIN_CODE = {
  DATA: `${API}/add-pincode`,
};
export const API_UPDATE_PIN_CODE = {
  DATA: `${API}/update-pincode`,
};
export const API_DELETE_PIN_CODE = {
  DATA: `${API}/delete-pincode`,
};

// company details api constant define here..
export const API_CREATE_BUSSINESS = {
  DATA: `${API}/addBusiness`,
};
export const API_GET_BUSSINESS = {
  DATA: `${API}/getBusiness`,
};
export const API_GET_PINCODE = {
  DATA: `${API}/get-pincodes`,
};
export const API_UPDATE_BUSINESS = {
  DATA: `${API}/updateBusiness`,
};
export const API_DELETE_BUSINESS = {
  DATA: `${API}/deleteBusiness`,
};
export const API_CREATE_COMPANY_DETAILS = {
  DATA: `${API}/registerSubCompany`,
};
export const API_COMPANY_DETAILS = {
  DATA: `${API}/getCompanyByGroupName`,
};
export const API_UPDATE_BY_ID_COMPANY_DETAILS = {
  DATA: `${API}/getCompanyById`,
};
export const API_UPDATE_COMPANY_DETAILS = {
  DATA: `${API}/edit-company`,
};
export const API_DELETE_COMPANY_DETAILS = {
  DATA: `${API}/deleteSubCompany`,
};
export const API_REQUEST_INSERT_OUTWARD_DETAILS = {
  DATA: `${API}/insertInsertRequestOutwardCourier`,
};

// OLA/UBER
export const API_OLA_UBER_FILE_UPLOAD = {
  DATA: `${API}/olaupload`,
};
export const API_GET_OLA_UBER_FILESUMMARY = {
  DATA: `${API}/getOlalogfilesummary`,
};
export const API_GET_OLA_UBER_FILE_DETAILS = {
  DATA: `${API}/getOlaFilelog`,
};
export const API_DELETE_OLA_UBER_UPLOAD_FILE = {
  DATA: (id) => `${API}/deleteOlaFilelog/${id}`,
};

// International travel request form

export const API_INSERT_TRAVELREQUEST = {
  DATA: `${API}/insert_travel_request`,
};
export const API_GET_TRAVEL_DETAILS_BY_USER_ID = {
  DATA: `${API}/get_details_by_user_id`,
};
export const API_GET_TRAVEL_DETAILS_BY_Id = {
  DATA: `${API}/get_by_id`,
};
export const API_INSERT_VENDOR_DETAILS = {
  DATA: `${API}/insert_vendor_details`,
};
export const API_EMP_DROPDOWN = {
  DATA: `${API}/getEmpDropdown`,
};
export const API_ADD_PREREFERENCES = {
  DATA: `${API}/add_prereferences`,
};
export const API_GET_PREREFERENCES_DETAILS = {
  DATA: `${API}/get_prereferences_details`,
};
export const API_GET_VENDORNAME_DETAILS = {
  DATA: `${API}/vendor-details`,
};
export const API_GET_RM_DETAILS = {
  DATA: `${API}/getRmDetails`,
};
export const API_GET_DEPARTMENT_SUBDEPARTMENT = {
  DATA: `${API}/departments`,
};
export const API_FINAL_HOD_APPROVAL = {
  DATA: `${API}/final_hod_approval`,
};

// Customer satisfaction feedback
export const API_CUSTOMER_SATISFACTION_FEEDBACK_GET_DATA = {
  DATA: `${API}/getCustomerSatisfaction`,
};
export const API_FORM_GET_DATA = {
  DATA: `${API}/getCustomerSatisfaction/`,
};
export const API_ADD_CUSTOMER_SATISFACTION_FEEDBACK_DATA = {
  DATA: `${API}/insertCustomerSatisfaction`,
};
export const API_UPDATE_CUSTOMER_SATISFACTION_FEEDBACK_DATA = {
  DATA: `${API}/updateCustomerSatisfaction`,
};
export const API_DELETE_CUSTOMER_SATISFACTION_FEEDBACK = {
  DATA: `${API}/deleteCustomerSatisfaction`,
};
export const API_SAVE_CUSTOMER_FEEDBACK = {
  DATA: `${API}/addCustomerSatisfactionFormData`,
};
export const API_CUSTOMERS_FEEDBACK_DATA = {
  DATA: `${API}/getCustomerSatisfactionFormData/`,
};
//category Module of customer feedback
export const API_GET_CATEGORY_LIST_DATA = {
  DATA: `${API}/get_details_by_id`,
};
export const API_DELETE_CATEGORY_DATA = {
  DATA: `${API}/delete_category_by_id`,
};
export const API_ADD_CATEGORY_DATA = {
  DATA: `${API}/category_details_add_update`,
};
/// permission by id...
export const API_GET_PERMISSION_BY_ID_DETAILS = {
  DATA: `${API}/permissionById`,
};
export const API_GET_VENDOR_DROPDOWN_DETAILS = {
  DATA: `${API}/vendordropdown`,
};
export const API_GET_DEPARTMENTS_DROPDOWN_DETAILS = {
  DATA: `${API}/departments`,
};
export const API_GET_DESTINATION_DETAILS = {
  DATA: `${API}/destination/`,
};
export const API_GET_RECEIVER_DROPDOWN_DETAILS = {
  DATA: `${API}/receiverdropdown`,
};
export const API_GET_EMPLOYEE_NAME_DETAILS = {
  DATA: `${API}/userId/`,
};
export const API_GET_EMPLOYEE_ID_DETAILS = {
  DATA: `${API}/userName/`,
};
export const API_GET_REASON_DROPDOWN_DETAILS = {
  DATA: `${API}/reasondropdown`,
};
export const API_UPDATE_OUTWARD_COURIER_DETAILS = {
  DATA: `${API}/updateOutwardCourier`,
};
export const API_DELETE_OUTWARD_COURIER = {
  DATA: (reference_no) =>
    `${API}/courierService/deleteoutcourier/${reference_no}`,
};
export const API_INSERT_DOM_DETAILS = {
  DATA: `${API}/v1/insert_domestic_details`,
};
export const API_INSERT_INTER_DETAILS = {
  DATA: `${API}/v1/insert_international_details`,
};
export const API_GETREVERSEPICKUP_DETAILS = {
  DATA: `${API}/v1/get_all_userwise_details`,
};
export const API_GETREVERSEPICKUPBYID = {
  DATA: `${API}/v1/get_id_international_details`,
};
export const API_DELETEREVERSEPICKUPBYID = {
  DATA: `${API}/v1/delete_international_details`,
};
export const API_ADD_SCHEDULER = {
  DATA: `${API1}/addScheduler`,
};

export const API_GET_ATTACHMENT = {
  DATA: `${API}/getAttachments`,
};
export const API_LOGOUT = {
  DATA: `${API}/logout`,
};
export const API_GET_COMPANY = {
  DATA: `${API}/accountNoDropdown`,
};
export const API_INSERT_COURIER_ACCOUNT_CODE = {
  DATA: `${API}/insertacccode`,
};
export const API_UPDATE_COURIER_ACCOUNT_CODE = {
  DATA: `${API}/updateAccountCode`,
};
export const API_DELETE_COURIER_ACCOUNT_CODE = {
  DATA: `${API}/deleteAccountCode`,
};
export const API_BULK_UPLOAD_OUTWARD = {
  DATA: `${API}/v1/OutwardCourierReportupload`,
};
export const API_TRAVELBOOK_BOOK_VENDOR = {
  DATA: `${API}/book_vendor`,
};
export const API_GET_COURIER_REPORT = {
  DATA: `${API}/v1/getCourierGenerateReport`,
};
export const API_INSERT_ALERT_TRAVEL = {
  DATA: `${API}/insertAlertTravelManagement`,
};
export const API_GET_ALERT_TRAVEL = {
  DATA: `${API}/getAlertTravelManagement`,
};
export const API_DELETE_ALERT_TRAVEL = {
  DATA: (id) => `${API}/deleteAlertTravelManagement/${id}`,
};
export const API_OLA_UBER_MAIL_DETAILS = {
  DATA: `${API}/getOlaUberSummayMapping`,
};
export const API_UPDATE_OLA_UBER_MAIL_DETAILS = {
  DATA: `${API}/updateOlaUberSummayMapping`,
};
export const API_GET_MAPPED_ID = {
  DATA: `${API}/getMappedSummaryID`,
};
export const API_BULK_UPLOAD_INWARD = {
  DATA: `${API}/v1/inwardwardCourierReportupload`,
};
export const API_GET_APPROVAL_SUMMARY = (id, status, remark, createdBy) => {
  return `${API}/getApprovalSummary/${id}/${status}/${encodeURIComponent(
    remark
  )}/${createdBy}`;
};
export const API_OLA_UBER_AMOUNT = {
  DATA: `${API}/getUberPaymentsummary`,
};
// Vendor Management
export const API_GET_VENDOR_LIST = {
  DATA: `${API}/vendorLists`,
};
export const API_CREATE_VENDOR = {
  DATA: `${API}/createVendor`,
};
export const API_GET_VENDOR_BYID = {
  DATA: `${API}/getVendorById`,
};
export const API_DELETE_VENDOR = {
  DATA: `${API}/deleteVendor`,
};
export const API_UPDATE_VENDOR = {
  DATA: `${API}/updateVendor`,
};
// officesupply api here...
export const API_GET_OFFICESUPPLY_DROPDOWN = {
  DATA: `${API}/officesuppliceDropdown`,
};
export const API_ADD_OFFICESUPPLY_ITEMS = {
  DATA: `${API}/addOfficeSupplyItem`,
};
export const API_GET_OFFICESUPPLY_ITEMLIST = {
  DATA: `${API}/getOfficeSupplyItemsList`,
};
export const API_DELETE_OFFICESUPPLYITEM = {
  DATA: `${API}/deleteOfficeSupplyItem`,
};
export const API_UPDATE_OFFICESUPPLY = {
  DATA: `${API}/updateOfficeSupply`,
};
export const API__OFFICESUPPLY_REQUEST = {
  DATA: `${API}/officesupliceRequest`,
};
export const API_ADD_INVENTORY = {
  DATA: `${API}/addinventory`,
};
export const API_GET_INVENTORY_LIST = {
  DATA: `${API}/getinventory`,
};
export const API_DELETE_INVENTORY = {
  DATA: `${API}/deleteInventoryRecords`,
};
export const API__OFFICESUPPLY_GET_DATA = {
  DATA: `${API}/officesupliceRequestgetdata`,
};
export const API_DELETE_OFFICE_REQ = {
  DATA: `${API}/deleteOfficeReq`,
};
// Activity Report
export const API_ACTIVITY_LOG = {
  DATA: `${API}/getActivity-log`,
};

export const API_GET_TRAVEL_REPORT_TYPE_DROPDOWN = {
  DATA: `${API}/getTravelReportType`,
};
export const API_VISITOR_MANAGEMENT_INSERT = {
  DATA: `${API}/visitors`,
};
export const API_VISITOR_MANAGEMENT_GET = {
  DATA: `${API}/getvisitors`,
};
export const API_VISITOR_MANAGEMENT_UPDATE = {
  DATA: `${API}/updatevisitors`,
};
export const API_VISITOR_MANAGEMENT_DELETE = {
  DATA: (visitor_id) => `${API}/deletevisitor/${visitor_id}`,
};
export const API_INWARD_COURIER_UPDATE_STATUS = {
  DATA: (reference_no) =>
    `${API}/courierService/updatestatusinwardcourier/${reference_no}`,
};
export const API_GET_COURIER_COMPANY_NAME = {
  DATA: `${API}/courierService/getcouriercompanyname`,
};
export const API_UPDATE_ATTACHMENTS = {
  DATA: `${API}/updateAttachment`,
};
export const API_GET_USER_DETAILS_BY_CONTACT = {
  DATA: (contactNumber) => `${API}/visitorcontact/${contactNumber}`,
};

export const API_INSERT_INVOICE_DETAILS = {
  DATA: `${API}/travelairCarReconcile/reconcileTravelUpload`,
};
export const API_GET_INVOICE_DETAILS = {
  DATA: `${API}/travelairCarReconcile/getreconcileFileDetails`,
};
export const API_DELETE_INVOICE_DETAILS = {
  DATA: (id) => `${API}/travelairCarReconcile/deleteReconcileFileDetails/${id}`,
};
export const API_MISSING_AWB_RECORDS = {
  DATA: `${API}/missingAwbRecords`,
};
export const API_GET_EMAIL_DETAILS = {
  DATA: `${API}/getemailscheduler`,
};
export const API_GET_EMAIL_STATUS_DETAILS = {
  DATA: `${API}/getemailstatus`,
};

export const API_GET_TRAVEL_RECONCILE_RECORDS = {
  DATA: `${API}/travelairCarReconcile/getreconcilerecords`,
};

export const API_AMC_DROPDOWN_DETAILS = {
  DATA: (type, id) => `${API}/amc/getDropdown/${type}/${id}`,
};

export const API_AMC_INSERT_UPDATE_DETAILS = {
  DATA: `${API}/amc/insertUpdateMumAdmin`,
};
export const API_AMC_GET_MUM_ADMIN_DETAILS = {
  DATA: `${API}/amc/getMumAdmin`,
};
export const API_AMC_MUM_ADMIN_DELETE_DETAILS = {
  DATA: (id) => `${API}/amc/deleteMumAdmin/${id}`,
};
export const API_AMC_INSERT_UPDATE_LICENSE_DETAILS = {
  DATA: `${API}/amcLicense/addLicense`,
};
export const API_AMC_GET_LICENSE_DETAILS = {
  DATA: `${API}/amcLicense/getAllLicenses`,
};
export const API_AMC_LICENSE_DELETE_DETAILS = {
  DATA: (id) => `${API}/amcLicense/deleteLicense/${id}`,
};
// petty cash management constant define here...
export const API_PETTY_CASH_CREATE_VOUCHER = {
  DATA: `${API}/insert-vouchers`,
};
export const API_PETTY_CASH_GET_VOUCHER = {
  DATA: `${API}/get-voucher-pettycash`,
};
export const API_PETTY_CASH_UPDATE_VOUCHER = {
  DATA: `${API}/update-voucher`,
};
export const API_PETTY_CASH_DELETE_VOUCHER = {
  DATA: `${API}/delete-voucher`,
};
export const API_PETTY_CASH_APPROVAL_VOUCHER = {
  DATA: `${API}/insert-send-vouchers`,
};
export const API_PETTY_CASH_USER_VOUCHER_APPROVAL = {
  DATA: `${API}/update-status`,
};
export const API_PETTY_CASH_DROPDOWN = {
  DATA: `${API}/petty-dropdown`,
};
export const API_PETTY_CASH_CREATED_BY_LIST = {
  DATA: `${API}/office-boys`,
};

export const API_LOGIN_SSO = {
  DATA: `${API1}/sso`,
};
export const API_AMC_INSERT_UPDATE_OFFICE_LEASE = {
  DATA: `${API}/amcOffcieLease/addOffcieLease`,
};

export const API_AMC_GET_OFFICE_LEASE = {
  DATA: `${API}/amcOffcieLease/getOffcieLease`,
};

export const API_AMC_OFFICE_LEASE_DELETE_DETAILS = {
  DATA: (id) => `${API}/amcOffcieLease/deleteLease/${id}`,
};

export const API_AMC_INSERT_UPDATE_CONTRACT = {
  DATA: `${API}/amcContract/addContract`,
};

export const API_AMC_GET_CONTRACT = {
  DATA: `${API}/amcContract/getAllContract`,
};

export const API_AMC_DELETE_CONTRACT = {
  DATA: (id) => `${API}/amcContract/deleteContract/${id}`,
};

export const API_OFFICE_LEASE_APPROVE_STATUS = {
  DATA: `${API}/approvalStatus`,
};

export const API_GET_OFFICE_SUPPLY_REPORT = {
  DATA: `${API}/getReport`,
};

export const API_INSERT_PETTYCASH_CONVEYANCE = {
  DATA: `${API}/insert-vouchers`,
};
export const API_BALANCE_SUMMARY_PETTYCASH = {
  DATA: `${API}/summary-balance`,
};
export const API_GET_BALANCE_SUMMARY_PETTYCASH = {
  DATA: `${API}/get-summary-balance`,
};
export const API_UPDATE_BALANCE_SUMMARY_PETTYCASH = {
  DATA: `${API}/balance-update`,
};
export const API_GET_PETTYCASH_DASHBOARD = {
  DATA: `${API}/get-dashboard-data`,
};

export const API_ALERT_PETTYCASH = {
  DATA: `${API}/alert_petty_cash`,
};
export const API_GET_ALERT_PETTYCASH = {
  DATA: `${API}/get_all_alert_petty_cash`,
};
export const API_ALERT_PETTYCASH_DELETE = {
  DATA: `${API}/alert_petty_cash_delete`,
};
export const API_PETTYCASH_EMAIL_RECORD_STATUS = {
  DATA: `${API}/statusClose`,
};
export const API_GET_ALL_EMAIL_RECORD_PETTY_CASH = {
  DATA: `${API}/get_all_email_petty_cash_alert`,
};
export const API_PETTY_CASH_PAYMENT_PAID = {
  DATA: `${API}/payemntPaid`,
};

export const API_OFFICE_SUPPLY_APPROVER = {
  DATA: `${API}/approvalStatus1`,
};
export const API_OFFICE_SUPPLY_ADD_ITEM = {
  DATA: `${API}/addItem`,
};
export const API_OFFICE_SUPPLY_BULK_INVENTORY = {
  DATA: `${API}/bulkInventory`,
};
export const API_PETTY_CASH_ADD_COMPANY = {
  DATA: `${API}/add-company`,
};
export const API_OFFICE_SUPPLY_CHECK_STOCK = {
  DATA: `${API}/check-stock`,
};
export const API_PETTY_CASH_RESEND_EMAIL = {
  DATA: `${API}/resend-email`,
};
export default axiosInstance;
