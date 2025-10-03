import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Form } from "react-bootstrap";
import "./Main.css";

const CustomAutoComplete = ({
  field,
  data,
  onChange,
  placeholder,
  minLength = 1,
  delay = 250,
  value,
  customRenderItem,
  labelName,
  textcolor,
  mandatoryIcon,
  disabled = false,
}) => {
  const [filteredData, setFilteredData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(value || null);

  const search = (event) => {
    setTimeout(() => {
      let _filteredData;
      if (!event.query.trim().length) {
        _filteredData = [...data];
      } else {
        // _filteredData = data.filter((item) => {
        //   return item[field]
        //     .toLowerCase()
        //     .startsWith(event.query.toLowerCase());
        // });
        _filteredData = data.filter((item) => {
          const fieldValue = item[field];
          if (fieldValue === undefined) {
            console.error(`Field ${field} is undefined in item`, item);
            return false;
          }
          return fieldValue
            ?.toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }
      setFilteredData(_filteredData.length ? _filteredData : []);
    }, delay);
  };

  useEffect(() => {
    if (selectedItem !== value) {
      onChange(selectedItem);
      // console.warn('Field username is undefined in item', value);
    }
  }, [selectedItem]);

  const renderItem = (item) => {
    return customRenderItem ? (
      customRenderItem(item)
    ) : (
      <span>{item[field]}</span>
    );
  };

  return (
    <div>
      {labelName && <Form.Label className={textcolor}>{labelName}</Form.Label>}
      {mandatoryIcon && <span className="text-danger">*</span>}
      <AutoComplete
        field={field}
        value={selectedItem}
        suggestions={filteredData}
        completeMethod={search}
        onChange={(e) => setSelectedItem(e.value)}
        placeholder={placeholder}
        minLength={minLength}
        itemTemplate={renderItem}
        className="shadow-none border-secondary-subtle"
        emptyMessage="No records found"
        style={{
          height: "38px",
          width: "100%",
          backgroundColor: disabled ? "#ced4da" : "transparent",
          opacity:disabled ? 1 : 'none',
          borderRadius:'8px'
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default CustomAutoComplete;
