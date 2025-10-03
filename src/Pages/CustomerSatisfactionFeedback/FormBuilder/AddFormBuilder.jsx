import $ from "jquery";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { Title } from "../../../Components/Title/Title";
import { useNavigate, useLocation } from "react-router-dom";
import { getFormsCategoryDropdown, getFormsStatusDropdown, saveFormDetails, updateFormDetails, getFormDataById,getMainCategoryLists } from "../../../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice"
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { toast, ToastContainer } from "react-toastify";
import UnderlinedClickableText from '../../../Components/Atoms/UnderlinedClickableText/UnderlinedClickableText';
import { QRCodeCanvas } from "qrcode.react"

import { faL } from "@fortawesome/free-solid-svg-icons";
window.jQuery = $;
window.$ = $;

require("jquery-ui-sortable");
require("formBuilder");

const formData = [];

const AddFormBuilder = ({ form, handleFormChange }) => {
    const currentBaseUrl = new URL(window.location.href).origin;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const fb = useRef(null);
    const [selectedcategory, setselectedcategory] = useState(0);
    const [selectedstatus, setselectedstatus] = useState(0);
    const [categoryList, setcategoryList] = useState([]);
    const [publishURL, setpublishURL] = useState('');
    const [showQRcode, setshowQRcode] = useState(false);
    const [formName, setformName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formBuilderInstanceRef = useRef(null);
    const { _Data } = location.state || {};

    const allCategoryDetails = useSelector(
        (state) => state?.CSFSevices?.getTypeOfFormsCategoryDropdown
    );
    const statusDropDownData = useSelector(
        (state) => state?.CSFSevices?.getFormsStatusDropdown
    );
    // console.log('______getTypeOfFormsCategoryDropdown______')
    // console.log(JSON.stringify(allCategoryDetails))
    // console.log('______statusDropDownData______')
    // console.log(JSON.stringify(statusDropDownData))

    useEffect(() => {
        //alert(_Data?.categoryId)
       // console.log('edit form', JSON.stringify(_Data))
        //dispatch(getFormsCategoryDropdown("FORM_CATEGORY"));
        dispatch(getFormsStatusDropdown("FORM_STATUS"));
        fetchMainCategoryListsDetails();
        // Only initialize formBuilder if it hasn't been initialized yet
        if (fb.current && !formBuilderInstanceRef.current) {
            try {
                if (_Data?.FormID > 0) {
                    setformName(_Data?.FormName);
                    setselectedcategory(_Data?.categoryId)
                    setselectedstatus(_Data?.statusID)
                   // setpublishURL("http://localhost:3000/dynamicformrender/" + _Data?.FormID)
                    setpublishURL(`${currentBaseUrl}/dynamicformrender/${_Data?.FormID}`)
                    let formData = JSON.parse(_Data?.FormJson)
                    formBuilderInstanceRef.current = $(fb.current).formBuilder({ formData });
                }
                else {
                    formBuilderInstanceRef.current = $(fb.current).formBuilder({ formData });
                    
                }
            } catch (error) {
                console.error('Error initializing formBuilder:', error);
            }
        } else if (!fb.current) {
            console.error('formBuilder element not found');
        }
    }, []);

    const fetchMainCategoryListsDetails = async () => {
       // setLoading(true)
        try {
          let _dataresponse = await dispatch(getMainCategoryLists());
         // console.log("_dataresponse",_dataresponse)
          let FinalOutput=_dataresponse?.payload
    
          const tableData =
          FinalOutput?.map((_data, index) => ({
           
                "value": _data?.category_id,
                "label": _data?.category_name,
            
  
          //"created_at": _data?.created_at,
          // "FormJson": JSON.parse(_data?.FormJson),
        })) || [];
    console.log("tableData",tableData)
    setcategoryList(tableData)
    //alert(tableData[0]?.value)
    setselectedcategory( _Data?.FormID > 0?_Data?.categoryId:tableData[0]?.value)
          //setcategoryData(tableData)
         // setLoading(false)
        } catch (error) {
          toast.error(error);
          //setLoading(false)
        }
    
      };
    // Handle Save button click
    const handleSave = async () => {
        //alert(selectedcategory)
        setIsSubmitting(true);
        if (formBuilderInstanceRef.current) {
            const formJson = formBuilderInstanceRef.current.actions.getData('json'); // Get form data as JSON
           // console.log('Saved Form Data:', formJson);  // Log the form data
           console.log('testing formJson',JSON.parse(formJson))
           const emailRow = JSON.parse(formJson).find(item => item.name === "Email");
           console.log("emailRow",emailRow?.name);

            if (formName == '' || formName == 'undefined') {
                toast.error("Please fill all mandatory fields.");
                setIsSubmitting(false);
            }
            else if(selectedcategory== ''||selectedcategory== 0||selectedcategory== undefined){
                toast.error("Please fill all mandatory fields.");
                setIsSubmitting(false);
            }
            else if(emailRow?.name ==undefined) 
                {
                    toast.error("Please add Email field in form builder and Named as Email only!");
                    setIsSubmitting(false);
                }
            else if(emailRow?.name != "Email" || emailRow?.required==false) 
            {
                toast.error("Email field should be mandatory and Named as Email only!");
                setIsSubmitting(false);
            }
            else {
                if (_Data?.FormID > 0) {
                    let data = {
                        formID: _Data?.FormID,
                        formName: formName,
                        formJson: formJson,
                        categoryId: selectedcategory,
                        status: selectedstatus||1,
                        publishURL: publishURL,
                        qrCode: "",
                        isActive: 1
                    }
                    console.log('update Form Details Payload..........')
                    console.log(JSON.stringify(data))
                    const response = await dispatch(updateFormDetails(data));
                   // console.log('response update Form Details Payload..........', response)
                   // console.log(JSON.stringify(data))
                    if (response?.payload?.statusCode === 200) {
                        toast.success(response?.payload?.data?.message);
                        setTimeout(() => {
                            navigate("/formbuilderlist");
                        }, 3000);
                    } else {
                        setIsSubmitting(false);
                        toast.error("Failed to update form, Please Try Again");
                    }
                }
                else {

                    let data = {
                        formName: formName,
                        formJson: formJson,
                        categoryId: selectedcategory,
                        status: selectedstatus ||1,
                        publishURL: publishURL,
                        qrCode: "",
                        isActive: 1
                    }
                    console.log('Add Form Details Payload..........')
                    console.log(JSON.stringify(data))
                   // let response=''
                    const response = await dispatch(saveFormDetails(data));
                    if (response?.payload?.statusCode === 200) {
                        toast.success(response?.payload?.data?.message);
                        setTimeout(() => {
                            navigate("/formbuilderlist");
                        }, 3000);
                    } else {
                        setIsSubmitting(false);
                        toast.error("Failed to create form, Please Try Again");
                    }
                }
            }
        } else {
            setIsSubmitting(false);
            console.error('formBuilderInstance is not available');
        }
    };
    const showQRCode = () => {
        setshowQRcode(true)
    };
    const downloadQRCode = () => {
        const url = "https://anshsaini.com"
        const canvas = document.querySelector("#qrcode-canvas")
        if (!canvas) throw new Error("<canvas> not found in the DOM")

        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream")
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = "QR code.png"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    };

    return (

        <Container fluid className="card">
            <Title title="Add Form " />
            <hr />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={true}
            />
            <Row>
                <Col md={6} className="my-2">
                    <CustomDropdown
                        mandatoryIcon={true}
                        dropdownLabelName="Category"
                        labelKey="label"
                        valueKey="value"
                        options={categoryList}
                        selectedValue={selectedcategory == 0 ? categoryList[0]?.value : selectedcategory}
                        onChange={(e) =>
                            // alert(e.target.value)
                            setselectedcategory(e.target.value)
                        }
                    // isDisable={form.disable}
                    />
                </Col>
                <Col md={6} className="my-2">
                    <CustomInput
                        type="text"
                        mandatoryIcon={true}
                        labelName="Form Name"
                        placeholder="Enter Form Name"
                        value={formName}
                        onChange={(e) => {
                            setformName(e.target.value)
                        }}
                    />
                </Col>
            </Row>
            <p>Configure Form</p>
            <div id="fb-editor" ref={fb} />
            <hr />
            <Row>
                <Col md={6} className="my-2">
                    <CustomDropdown
                        dropdownLabelName="Status"
                        labelKey="label"
                        valueKey="value"
                        options={statusDropDownData}
                        selectedValue={selectedstatus}
                        onChange={(e) =>
                            // alert(e.target.value)
                            setselectedstatus(e.target.value)
                        }
                    // isDisable={form.disable}
                    />
                </Col>
                <Col md={6} className="my-2">
                    <Row>
                        <Col md={8} className="my-12">
                            <CustomInput
                                type="text"
                                labelName="Publish URL"
                                placeholder=" Publish URL"
                                value={publishURL}
                                isDisable={true}
                                onChange={(e) => {
                                    setpublishURL(e.target.value)
                                }}
                            />
                        </Col>
                        {publishURL ?
                            <Col md={4} style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'end', marginTop: 31 }}>
                                <Button style={{ alignSelf: 'flex-end' }}
                                    onClick={showQRCode}
                                    variant="secondary">Generate QR</Button>
                            </Col>
                            : null}
                    </Row>
                </Col>
            </Row>
            {showQRcode ?
                <QRCodeCanvas style={{ height: "auto", maxWidth: "25%", width: "25%", alignSelf: 'center' }}
                    id="qrcode-canvas" level="H" size={300} value={publishURL} />
                : null}
            {showQRcode ?
                <UnderlinedClickableText
                    text="Download QR Code"
                    onClick={downloadQRCode}
                    style={{ alignSelf: 'center', color: '#0d6efd', fontWeight: 'bold' }}
                />
                : null}
            <Row className="text-start mb-3">
                <Col md={12}>
                    <Button onClick={()=>navigate("/formbuilderlist")} variant="outline-secondary" className="me-2">Cancel</Button>
                    <Button disabled={isSubmitting} onClick={handleSave} variant="secondary">{_Data?.FormID > 0?"Edit & Save":"Save"} </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AddFormBuilder;
