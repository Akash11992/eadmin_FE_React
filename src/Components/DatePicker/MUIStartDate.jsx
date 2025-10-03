import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; 
const MUIStartDate = (props) => {
  const { Label, mandatoryIcon, onChange, value, MaxValue, MinValue} = props;
  return (
    <>
      <label className="mb-2">{Label}</label>
      {mandatoryIcon && <span className="text-danger">*</span>}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={onChange}
          format="DD-MM-YYYY"
          slotProps={{
            textField: {
              size: "small",
              sx: { fontSize: "12px" },
              fullWidth: true,
            },
          }}
          maxDate={MaxValue ? dayjs(MaxValue) : null} 
          minDate={MinValue ? dayjs(MinValue) : undefined} 
        />
      </LocalizationProvider>
    </>
  );
};

export default MUIStartDate;
