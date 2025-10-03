import $ from "jquery";
import React, { useState, useEffect } from "react";
import { Form, Card, Button, Container, Row, Col } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import { useNavigate, useLocation } from "react-router-dom";
import { saveCategoryDetails } from "../../../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
const AddCategory = ({ form, handleFormChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { _Data } = location.state || {};
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CategoryStatusDropdowndata = [
    { value: 1, label: "Active" },
    { value: 0, label: "InActive" },
  ];

  useEffect(() => {
    console.log(JSON.stringify(_Data));
    if (_Data?.["Category Id"] > 0) {
      reset({
        category_id: _Data?.["Category Id"],
        category_name: _Data?.["Category Name"],
        category_status: _Data?.["Status"] == "Active" ? 1 : 0,
        category_description: _Data?.["Category description"],
      });
      console.log("Data after reset:", getValues());
    }
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      let finalData = {
        ...data,
        category_id: 0,
      };
      console.log("finalData", finalData);

      let editData = getValues();
      const response = await dispatch(
        saveCategoryDetails(_Data?.["Category Id"] > 0 ? editData : finalData)
      );

      if (response?.payload?.statusCode === 200) {
        if (
          response?.payload?.data?.message ===
          "Category with the same name already exists for this company."
        ) {
          toast.error(response?.payload?.data?.message);
          setIsSubmitting(false);
        } else {
          toast.success(response?.payload?.data?.message);
          setTimeout(() => {
            navigate("/categorylist");
          }, 3000);
        }
      } else {
        setIsSubmitting(false);
        toast.error("Failed to create form, Please Try Again");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Container fluid className="card">
      <Title title="Add Category " />
      <hr />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={2} className="my-2"></Col>
          <Col md={8} className="my-2">
            <Card className="mycard p-3">
              <h4>Add Category Form</h4>
              <hr />
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Label>
                      Category Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      placeholder="Enter Category Name"
                      className="shadow-none border-secondary-subtle"
                      type="text"
                      {...register("category_name", {
                        required: "Category Name is required!",
                      })}
                    />
                    {errors.category_name && (
                      <small className="text-danger">
                        {errors.category_name.message}
                      </small>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Category Status <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        {...register("category_status", {
                          required: "Category Status is required!",
                        })}
                      >
                        <option value="">Select Status Type</option>
                        {CategoryStatusDropdowndata.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Control>
                      {/* Validation message */}
                      {errors.category_status && (
                        <small className="text-danger">
                          {errors.category_status.message}
                        </small>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Feedback</Form.Label>
                      <textarea
                        placeholder="Enter your feedback here"
                        className="form-control"
                        {...register("category_description")} // No validation rules here
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="text-start mb-6 mt-4">
                  <Col md={12}>
                    <Button
                      onClick={() => navigate("/categorylist")}
                      className="me-2 btn btn-danger"
                    >
                      Cancel
                    </Button>
                    <input
                      disabled={isSubmitting}
                      value={_Data?.["Category Id"] > 0 ? "Update" : "Save"}
                      className="btn btn-dark"
                      type="submit"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} className="my-2"></Col>
        </Row>
      </form>
    </Container>
  );
};

export default AddCategory;
