import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomInput from "../CustomInput/CustomInput";
import { useDispatch } from "react-redux";
import { addItem } from "../../Slices/OfficeSupply/OfficeSupplySlice";
import { toast } from "react-toastify";

export const ItemModal = (props) => {
  const [formData, setFormData] = useState({
    selectedCategory: "",
    item: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const resetForm = () => {
    setFormData({
      selectedCategory: "",
      item: "",
      category: "",
    });
    setErrors({});
  };

  useEffect(() => {
    if (props.show) {
      resetForm();
    }
  }, [props.show]);

  const handleChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error on change
    }));
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!formData.selectedCategory) {
      newErrors.selectedCategory = "Please select a category";
    }
    if (formData.selectedCategory === "new" && !formData.category) {
      newErrors.category = "Please enter category name";
    }
    if (!formData.item) {
      newErrors.item = "Please enter item name";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        categoryId:
          formData.selectedCategory === "new"
            ? null
            : formData.selectedCategory,
        category: formData.category,
        item: formData.item,
      };
      const response = await dispatch(addItem(payload));
      if (response.payload.statusCode === 200) {
        toast.success("Item added successfully!");
        props.onHide();
        resetForm();
      } else if (response.payload.statusCode === 400) {
        toast.warning(response?.payload?.message);
      }
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row
          className={`${
            formData.selectedCategory === "new"
              ? "justify-content-around"
              : "justify-content-center"
          }`}
        >
          <Col md={4}>
            <CustomDropdown
              dropdownLabelName="Category"
              mandatoryIcon
              options={[
                { label: "Select Categories", value: "" },
                ...props.category?.map((item) => ({
                  label: item.TOSCM_CATEGORY_NAME,
                  value: item.TOSCM_CATEGORY_ID,
                })),
                { label: "Add New", value: "new" },
              ]}
              labelKey="label"
              valueKey="value"
              selectedValue={formData.selectedCategory}
              onChange={(e) => handleChange("selectedCategory", e.target.value)}
            />
            {errors.selectedCategory && (
              <div className="text-danger mt-1">{errors.selectedCategory}</div>
            )}
          </Col>

          {formData.selectedCategory === "new" && (
            <Col md={4}>
              <CustomInput
                labelName="Category Name"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                type="text"
                placeholder="Enter Category"
                mandatoryIcon
              />
              {errors.category && (
                <div className="text-danger mt-1">{errors.category}</div>
              )}
            </Col>
          )}

          <Col md={4}>
            <CustomInput
              labelName="Item Name"
              value={formData.item}
              onChange={(e) => handleChange("item", e.target.value)}
              type="text"
              placeholder="Enter Item"
              mandatoryIcon
            />
            {errors.item && (
              <div className="text-danger mt-1">{errors.item}</div>
            )}
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={props.onHide}
          className="bg-danger text-white border-0"
        >
          Close
        </Button>
        <Button
          onClick={handleSave}
          className="bg-dark border-0"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
