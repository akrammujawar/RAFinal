import * as React from "react";
import { useState } from "react";
import { Modal } from "office-ui-fabric-react";
import "./CreateModal.css";

type appProps = {
  setModal: React.SetStateAction<any>;
  message: any;
  showModal: any;
  pageType: any;
};

// function reload() {
// window.location.reload();
// }

const CreateEditPopupModal = ({
  showModal,
  message,
  setModal,
  pageType,
}: appProps) => {
  // const navigate = useNavigate()
  // const _sharePointServiceProxy: SharePointServiceProxy = new SharePointServiceProxy(props.context, props.webURL);
  const [show, setShow] = useState<any>(showModal);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(showModal);
  const closeModal = () => {
    setShow(false);
    setModal("");
    // reload();
  };
  return (
    <>
      <Modal
        className="del-pad"
        isOpen={show}
        onDismiss={() => setShow(false)}
        isBlocking={true}
        containerClassName="delete-event-modal"
      >
        <form className="create-modal">
          <div className="m-3">
            <p
              className={
                pageType === "warning"
                  ? "modal-title-custom text-danger"
                  : "modal-title-custom text-success"
              }
            >
              {pageType === "warning"
                ? "Warning"
                : pageType === "success" && "Success"}
            </p>
          </div>
          <hr className="HRline"></hr>
          <div className="m-3">
            <div className="modal-content-custom">
              <p>{message}</p>
            </div>
          </div>
          <hr className="HRline"></hr>
          <footer className="d-flex justify-content-end align-items-center m-3">
            <button
              onClick={() => closeModal()}
              className="btn btn-primary btn-footer"
            >
              Ok
            </button>
          </footer>
        </form>
      </Modal>
    </>
  );
};

export default CreateEditPopupModal;
