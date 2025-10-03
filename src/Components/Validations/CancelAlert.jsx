import Swal from "sweetalert2";
import "../../Assets/css/Utils/Validations/DeleteAlert.css"
const CancelAlert = ({ onCancel,btntext }) => {
  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "black",
      confirmButtonText: btntext ? btntext : "Yes, Cancel it!",
      customClass: {
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onCancel();
      }
    });
  };

  return (
    <div>
      {handleCancel()}
    </div>
  );
};

export default CancelAlert;
