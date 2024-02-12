import * as React from "react";
import { IAllocatorProps } from "../IAllocatorProps";
import SharepointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { Modal } from "office-ui-fabric-react";

const EmployeeIcons: React.FunctionComponent<IAllocatorProps> = (
  props: any
) => {
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);
  console.log(_SharepointServiceProxy);
  const [show, setShow] = React.useState<boolean>(false);

  const handleClick = (modalData: any) => {
    // setPopupData(modalData);
    setShow(true);
  };
  return (
    <>
      <svg
        onClick={() => {
          handleClick(props?.data), console.log("data......", props?.data);
        }}
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
      <svg
        onClick={() => {
          handleClick(props?.data), console.log("data......", props?.data);
        }}
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
      <svg
        onClick={() => {
          handleClick(props?.data), console.log("data......", props?.data);
        }}
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

      <Modal
        isOpen={show}
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
    </>
  );
};

export default EmployeeIcons;
