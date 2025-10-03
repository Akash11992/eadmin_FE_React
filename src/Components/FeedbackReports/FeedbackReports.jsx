import React from "react";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomSingleButton from "../CustomSingleButton/CustomSingleButton";
const FeedbackReports = (props) => {
  return (
    <div className="align-items-end justify-content-between d-flex flex-wrap">
      <CustomInput
        labelName="From Date"
        type="date"
        value={props?.fromDateValue}
        onChnage={props?.toDateChange}
      />
      <CustomInput
        labelName="To Date"
        type="date"
        value={props?.fromDateValue}
        onChnage={props?.toDateChange}
      />
      <CustomInput
        labelName="Form Name"
        type="text"
        placeholder="Enter Form Name"
        value={props?.fromDateValue}
        onChnage={props?.toDateChange}
      />
      <CustomInput
        labelName="Form Name"
        type="text"
        placeholder="Enter Form Name"
        value={props?.fromDateValue}
        onChnage={props?.toDateChange}
      />
      <CustomDropdown
        dropdownLabelName="Category"
        options={props?.reportsCategory}
      />
      <CustomDropdown
        dropdownLabelName="Status"
        options={props?.reportsStatus}
      />
      <CustomSingleButton
        _ButtonText="Search"
        height={40}
        width="8%"
        onPress={props?.onPress}
      />
    </div>
  );
};

export default FeedbackReports;
