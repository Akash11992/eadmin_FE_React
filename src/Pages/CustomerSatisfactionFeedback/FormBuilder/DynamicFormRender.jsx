import React, {useLayoutEffect, useEffect, useState } from 'react';
import { useLocation,useParams } from "react-router-dom";
import {saveCustomerFeedbackData ,getFormDataById} from "../../../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice";
import { useDispatch } from "react-redux";

const DynamicFormRender = ({ formData }) => {
  const [formValues, setFormValues] = useState({});
  const [JsonData, setJsonData] = useState();
 
  const [isFeedbackDone, setisFeedbackDone] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isData, setisData] = useState(false);
  const [_formID, set_formID] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  //const { JsonData } = location.state || {};  // Accessing the passed data
  //console.log('getData from navigation',JSON.parse(JsonData?.FormJson))
 
  useLayoutEffect(() => {
    //const url = new URL("	http://localhost:3000/dynamicformrender/50");
    const url = new URL( window.location.href);
   
    // Get the pathname and split it to get the ID
    const id = url.pathname.split("/").pop();
    
    console.log(id); // Output: 50

    console.log('testing2',id);
   
    
    set_formID(id)
    fetchDynamicFormsDetails(id)
    //alert(param)
   // alert(JSON.stringify(JsonData?.FormJson))
  }, []);
 
  const fetchDynamicFormsDetails = async (_formID) => {
    let _response = await dispatch(getFormDataById(_formID))
    let finalres = _response?.payload?.data?.data[0][0]
    let extractedData = {
      "Form Id": finalres?.FormID,
      "Form Name": finalres?.FormName,
      "Category": finalres?.category,
      //"Response count": finalres["response count"],
      "Status": finalres?.status,
      // "Publish Url": finalres?.publishURL,
      "created_at": finalres?.created_at,
      "FormJson": JSON.parse(finalres?.FormJson),
    }    
      setJsonData(extractedData)
      const initialValues = {};
      JSON.parse(extractedData?.FormJson).forEach((field) => {
        if (field.type === 'select') {
          initialValues[field.name] = field.values.find((option) => option.selected)?.value || '';
        } else {
          initialValues[field.name] = '';
        }
      });
      setFormValues(initialValues);
      setisData(true)
  
   // navigate("/dynamicformrender", { state: { JsonData: extractedData } })
  }
  
  // Handle input change
  const handleChange = (e, field) => {
    
    const { name, value, type, checked } = e.target;
    //alert(checked)
    // setFormValues({
    //   ...formValues,
    //   [name]: type === 'checkbox' ? value : value,
    // });
    if (type === 'text' && field.requireValidOption && e.target.list) {
      const isValid = Array.from(e.target.list.options).some(
        (option) => option.value === value
      );
      if (!isValid) {
        alert("Please select a valid option from the list.");
        return; // Prevent updating if not a valid option
      }
    }

    setFormValues((prevValues) => {
      if (type == 'checkbox') {
        // const prevCheckedValues = prevValues[name] || [];
        // return {
        //   ...prevValues,
        //   [name]: checked
        //     ? [...prevCheckedValues,value+','] // Add value if checked
        //     : prevCheckedValues.filter((v) => v !== value), // Remove if unchecked
        // };

        const fieldValues = prevValues[name] || [];

        // Add value if checked, remove if unchecked
        const updatedValues = checked
          ? [...fieldValues, value ] // Add value if checked
          : fieldValues.filter((val) => val !== value); // Remove if unchecked
  
        // Return the new form values with the updated field
        return {
          ...prevValues,
          [name]: updatedValues,
        };
      } else {
        return {
          ...prevValues,
          [name]: value, // For non-checkbox inputs
        };
      }
    });

    // setFormValues((prevValues) => {
    //   const prevCheckedValues = prevValues[name] || [];
      
    //   return {
    //     ...prevValues,
    //     [name]: checked
    //       ? [...prevCheckedValues, value] // Add value if checked
    //       : prevCheckedValues.filter((v) => v !== value), // Remove if unchecked
    //   };
    // });
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key]) => !key.includes("button") && !key.includes("undefined"))
    );

    const emailEntry = Object.entries(formValues).find(([key]) => key === "Email");
    try {
      let data= {
        formID: _formID,
        emailId:emailEntry[1],
        Datajson:[filteredFormValues]
      }
      // Example of sending formValues to API
      let _data=  await dispatch(saveCustomerFeedbackData(data));
      if(_data?.payload?.data.statusCode==201)
      {
        alert("Your feedback Submitted Successfully.")
        setisFeedbackDone(true)
        setFormValues({})
      }
      else if(_data?.payload?.statusCode==400){
        alert("Your have already submitted your feedback.")
      }
    } catch (error) {
      alert(error)
    }
   

   // console.log(JSON.stringify(_data))


  };

  // Render form elements based on the JSON
  const renderFormElement = (field) => {
    const isRequired = field.required ? " *" : ""; // Add asterisk if required
   
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
        return (
          <div className='mt-2' key={field.name}>
            <label>{field.label.replace(/&nbsp;/g, ' ')}   {isRequired && (
        <span className="text-danger">*</span>
      )}</label>
            <input
              type={field.type}
              name={field.name}
              className={field.className}
             // onChange={handleChange}
              onChange={(e) => handleChange(e, field)}
              placeholder={field.placeholder} // Show placeholder
              required={field.required} // Set required attribute if true
            />
          </div>
        );
      case 'textarea':
        return (
          <div className='mt-2' key={field.name}>
            <label>{field.label.replace(/&nbsp;/g, ' ')}{isRequired && (
        <span className="text-danger">*</span>
      )}</label>
            <textarea
              name={field.name}
              className={field.className}
             // onChange={handleChange}
              onChange={(e) => handleChange(e, field)}
              placeholder={field.placeholder} // Show placeholder
              required={field.required} // Set required attribute if true
            />
          </div>
        );
      case 'select':
        return (
          <div className='mt-2' key={field.name}>
          <label>
            {field.label.replace(/&nbsp;/g, ' ')}
            {isRequired && <span className="text-danger">*</span>}
          </label>
          <select
            name={field.name}
            className={field.className}
            
            value={field.values.find((option) => option.selected)?.value}
            //checked={formValues[field.name] === option.value}
            onChange={(e) => handleChange(e, field)}
            required={field.required} // Set required attribute if true
          >
            {field.values.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

      );
      case 'radio-group':
        return (
          <div className='mt-2' key={field.name}>
            <label>{field.label.replace(/&nbsp;/g, ' ')}{isRequired && (
        <span className="text-danger">*</span>
      )}</label>
            {field.values.map((option) => (
              <div key={option.value}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                 // onChange={handleChange}
                  onChange={(e) => handleChange(e, field)}
                  //checked={option.selected}
                  checked={formValues[field.name] === option.value}
                  required={field.required} // Set required attribute if true
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox-group':
        return (
          <div className='mt-2' key={field.name}>
            <label>{field.label.replace(/&nbsp;/g, ' ')}{isRequired && (
        <span className="text-danger">*</span>
      )}</label>
            {field.values.map((option) => (
              <div key={option.value}>
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  //onChange={handleChange}
                  onChange={(e) => handleChange(e, field)}
                 // checked={option.value || false}
                  //defaultChecked={option.selected}
                  required={field.required} // Set required attribute if true
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        );
      case 'autocomplete':
        return (
          <div className='mt-2' key={field.name}>
            <label>{field.label.replace(/&nbsp;/g, ' ')}{isRequired && (
        <span className="text-danger">*</span>
      )}</label>
            <input
              list={field.name}
              name={field.name}
              className={field.className}
              //onChange={handleChange}
              onChange={(e) => handleChange(e, field)}
              placeholder={field.placeholder} // Show placeholder
              required={field.required} // Set required attribute if true
            />
            <datalist id={field.name}>
              {field.values.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  selected={option.selected}
                >
                  {option.label}
                </option>
              ))}
            </datalist>
          </div>
        );
      case 'button':
        return (
          <div className='mt-3' key={field.name}>
            <button type="submit" className={field.className}>
              {field.label.replace(/&nbsp;/g, ' ')}
            </button>
          </div>
        );
      case 'file':
        return (
          <div key={field.name}>
            <label>{field.label.replace(/&nbsp;/g, ' ')}{isRequired && (
        <span className="text-danger">*</span>
      )}</label>
            <input type="file" name={field.name} 
            //onChange={handleChange}
            onChange={(e) => handleChange(e, field)}
             required={field.required} />
          </div>
        );
      case 'header':
        return <h1 key={field.name}>{field.label.replace(/&nbsp;/g, ' ')}</h1>;
      case 'paragraph':
        return <p key={field.name}>{field.label.replace(/&nbsp;/g, ' ')}</p>;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxHeight: windowHeight, overflowY: 'auto', padding: '2rem' }}>
    <form onSubmit={handleSubmit}>
      {isFeedbackDone?
          <h1 className='text-align: center'>Your feedback submitted successfully.</h1>
          :
          <>
          {isData?
          <>
      {JSON.parse(JsonData?.FormJson).map((field) => renderFormElement(field))}
      </>
      :null}
      </>}
    </form>
    </div>
  );
};

// Example usage of DynamicForm
const formJson =[{"type":"header","subtype":"h1","label":"Car parking Review Form","access":false},{"type":"number","required":true,"label":"Car Number","placeholder":"Car Number","className":"form-control","name":"Car-Number","access":false,"subtype":"number"},{"type":"text","required":true,"label":"Car Name","placeholder":"Car Name","className":"form-control","name":"Car-Name","access":false,"subtype":"text"},{"type":"select","required":true,"label":"Select parking floor","placeholder":"Select parking floor","className":"form-control","name":"parking-floor","access":false,"multiple":false,"values":[{"label":"Floor 1","value":"Floor-1","selected":true},{"label":"Floor 2","value":"Floor-2","selected":false},{"label":"Floor 3","value":"Floor-3","selected":false}]},{"type":"button","subtype":"submit","label":"Button","className":"btn-success btn","name":"button-1730184535824-0","access":false,"style":"success"}]
const formJson1 = [
  {
    type: 'text',
    label: 'First Name',
    className: 'form-control',
    name: 'first-name',
    subtype: 'text',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    type: 'date',
    label: 'Date of Birth',
    className: 'form-control',
    name: 'dob',
    required: true,
  },
  {
    type: 'radio-group',
    label: 'Gender',
    name: 'gender',
    required: true,
    values: [
      { label: 'Male', value: 'male', selected: false },
      { label: 'Female', value: 'female', selected: false },
    ],
  },
  {
    type: 'button',
    label: 'Submit',
    subtype: 'submit',
    className: 'btn btn-primary',
    name: 'submit-button',
  },
];

export default function App() {
  return (
    <div>
       <h1 style={{marginTop:10}}></h1> 
      <DynamicFormRender  />
    </div>
  );
}
