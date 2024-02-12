import { useState, useRef } from "react";
import React from "react";
import Tippy from "@tippyjs/react";
import { Modal } from "office-ui-fabric-react";
const PopupCellRenderer = (props: any) => {
  const tippyRef = useRef();
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const [shows, setShow] = useState<boolean>(false);

  const dropDownContent = (
    <div className="menu-container">
      <div onClick={() => onClickHandler("Edit")} className="menu-item">
        Edit
      </div>
      <div onClick={() => onClickHandler("View")} className="menu-item">
        View
      </div>
      <div onClick={() => setShow(true)} className="menu-item">
        Add on Bench
      </div>
    </div>
  );

  const onClickHandler = (option: any) => {
    hide();
    if (option === "Edit") {
      props.api.applyTransaction({
        add: [{}],
      });
    }
    if (option === "View") {
      props.api.applyTransaction({ remove: [props.data] });
    }

    if (option === "AddonBench") {
      props.api.startEditingCell({
        rowIndex: props.rowIndex,
        colKey: "make",
      });
    }
  };

  return (
    <>
      <Tippy
        ref={tippyRef}
        content={dropDownContent}
        visible={visible}
        onClickOutside={hide}
        allowHTML={true}
        arrow={false}
        appendTo={document.body}
        interactive={true}
        placement="right"
      >
        {/* <button className="btn btn-primary" onClick={visible ? hide : show}>
        Action
      </button> */}
        <svg
          onClick={visible ? hide : show}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-three-dots-vertical  dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          viewBox="0 0 16 16"
        >
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </Tippy>

      {
        <Modal
          isOpen={shows}
          onDismiss={() => setShow(false)}
          isBlocking={true}
          containerClassName="create-event-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5">
                Employee Name:<span className="fw-bold">popupData?.Name</span>
              </p>
            </div>

            <hr />
            <form>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Is Bench
                    </label>
                    <div className="input-group mb-3">
                      <select
                        className="form-select"
                        //   defaultValue={popupData?.IsBench}
                        //   onChange={(e) => {
                        //     onChangeFormVal(e, "IsBench");
                        //   }}
                      >
                        <option hidden selected>
                          --Select--
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Start Date
                    </label>
                    <input
                      // defaultValue={popupData?.StartDate?.slice(0, 10)}
                      type="date"
                      className="form-control"
                      // onChange={(e) => {
                      //   onChangeFormVal(e, "StartDate");
                      // }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      End Date
                    </label>
                    <input
                      // defaultValue={popupData?.EndDate?.slice(0, 10)}
                      type="date"
                      className="form-control"
                      // onChange={(e) => {
                      //   onChangeFormVal(e, "EndDate");
                      // }}
                    />
                  </div>
                </div>
              </div>

              <hr />
              <footer className="d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary me-2 btn-size"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary ms-2 btn-size"
                  // onClick={() => {
                  //   setShow(false),
                  //    update(parseInt(popupData?.ID));
                  // }}
                >
                  Update
                </button>
              </footer>
            </form>
          </div>
        </Modal>
      }
    </>
  );
};

export default PopupCellRenderer;
