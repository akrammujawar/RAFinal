import { Modal } from "office-ui-fabric-react";
import * as React from "react";
import { useState } from "react";
// import { ITimesheetProps } from '../ITimesheetProps';
// import AlertBox from './AlertBox';
import { IAllocatorProps } from "../IAllocatorProps";
import SharepointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import _ from "lodash";
import PeoplePicker from "../common/PeoplePicker";
import SuccessModal from "../common/SuccessModal";
// import { differenceInMonths } from "date-fns";

const EmployeeEdit: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);
  const [show, setShow] = useState<boolean>(false);
  const [shows, setShows] = useState<boolean>(false);
  const [view, SetView] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<any>();
  const [Viewdata, SetViewData] = useState<any>();
  const [editData, SetEditData] = useState<any>();
  const [updateDetails, setUpdateDetails] = useState<any>({});
  const [hidedate, setHideDate] = useState<boolean>();
  const [Hideinput, setHideinput] = useState<string>('');
  const [Hide, setHide] = useState<string>('Hide');
  const [Hidemanagerone, setHidemanagerone] = useState<string>('');
  const [HideoneManager, setHideoneManager] = useState<string>('HideoneManager');
  const [updatemodal, setUpdateModal] = useState<string>("");


  // Add bench function //
  const handleClick = (modalData: any) => {
    setPopupData(modalData);
    if (modalData?.IsBench === "Yes") {
      setHideDate(false);
    } else {
      setHideDate(true);
    }
    setShow(true);
    // console.log(".......modaldata", modalData);
  };

  const ViewClick = (viewData: any) => {
    SetViewData(viewData)
    SetView(true)
  };

  const EditClick = (editData: any) => {
    SetEditData(editData)
    setShows(true) 
  };

  React.useEffect(() => {

  }, []);

  const onChangeStartDate =(e: any, colName: string) => {
    setUpdateDetails((prev: any) => {
         return { ...prev, [colName]: e.target.value };
       });
      }

  const onChangeFormVal = (e: any, colName: string) => {
     setUpdateDetails((prev: any) => {
          return { ...prev, [colName]: e.target.value };
        });

    if (e.target.value === "Yes") {
      setHideDate(false);
    } 
    else {
      setHideDate(true);
    }
  };

  async function update (itemId: number)  {
    await _SharepointServiceProxy.updateItem(
      "Employee",
      itemId,
      updateDetails,
      [],
      true
    )
    .then(() => {
      setUpdateModal("EmployeeUpdated");
    })
    
  
   

    if (updateDetails?.IsBench === "Yes") {
      let obj = {
        Department: popupData?.DeptName,
        ProjectManager: popupData?.Manager1?.Title,
        EmpName: popupData?.Name,
        BenchStartDate: updateDetails?.StartDate,
        BenchEndDate: updateDetails?.EndDate,
      };
      // console.log("Object.......", obj);
      _SharepointServiceProxy.addItem("BenchReport", obj, [], true).then(() => {
        setShow(false);
        // setOpenModal("updatedSuccessfully")
      });
    } else {
      null;
    }
  };


//  Implementing PeoplePicker //
const Manager1=(PeoplePicker:any)=>{
  setUpdateDetails((prev: any) => {
    return { ...prev, Manager1Id: PeoplePicker[0].key};
  });
  // console.log("PeoplePicker..........",PeoplePicker)

  // setUpdateDetails()

  
}

const Manager2=(Peopledata:any)=>{
  setUpdateDetails((prev: any) => {
    return { ...prev, Manager2Id: Peopledata[0].key};
  });
  // console.log("Peopledata.......",Peopledata)
  // setUpdateDetails(Peopledata[0]?.key);
  
}

const Hideinputfunction=()=>{
  setHideinput('Hideinput')
  setHide('')
}
const managerfirst=()=>{
 setHidemanagerone('Hidemanagerone')
  setHideoneManager('')
}

// Lets find out the experience//



  return (
    <div>
      <div>
        <svg
          onClick={() => {
            EditClick(props?.data), console.log("data......", props?.data);
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#229ed9"
          className="bi bi-pencil-fill color-icon"
          viewBox="0 0 16 16"
        >
          <rect>
            <title>Edit</title>
          </rect>
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>

        <svg
          onClick={() => {
            ViewClick(props?.data), console.log("data......", props?.data);
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#229ed9"
          className="bi bi-eye-fill ms-3 color-icon"
          viewBox="0 0 16 16"
        >
          <rect>
            <title>View</title>
          </rect>
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
        </svg>

        <svg
          onClick={() => {
            handleClick(props?.data), console.log("data......", props?.data);
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#229ed9"
          className="bi bi-plus-square-fill ms-3 color-icon"
          viewBox="0 0 16 16"
        >
          <rect>
            <title>Add on bench</title>
          </rect>
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
        </svg>
      </div>
      {/* </TooltipHost> */}

      {/* {openModal === 'updatedSuccessfully' && <AlertBox setModal={setOpenModal} message={"Updated Successfully"} showModal={true} alertType={'success'}/>} */}

      {/* <div className="dropdown-center">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Centered dropdown
        </button>
      </div> */}

      <>
      {/* Add on bench */}
        <Modal
          isOpen={show}
          onDismiss={() => setShow(false)}
          isBlocking={true}
          containerClassName="create-event-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5">
                Employee Name:<span className="fw-bold">{popupData?.Name}</span>
              </p>
            </div>
            {/* <div>
                <h4 className="fw-bold">Employee Name : Riyaz.Nadaf</h4>
            </div> */}
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
                        defaultValue={popupData?.IsBench}
                        onChange={(e) => {
                          onChangeFormVal(e, "IsBench");
                        }}
                      >
                        <option hidden selected>
                          --Select--
                        </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  {/* { hidedate === "hidedate" && */}
                  <>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                        Start Date
                      </label>
                      <input
                        disabled={hidedate}
                        defaultValue={
                          hidedate === false
                            ? popupData?.StartDate?.slice(0, 10)
                            : null || ""
                        }
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          onChangeStartDate(e, "StartDate");
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                        End Date
                      </label>
                      <input
                        disabled={hidedate}
                        defaultValue={
                          hidedate === false
                            ? popupData?.EndDate?.slice(0, 10)
                            : null || ""
                        }
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          onChangeStartDate(e, "EndDate");
                        }}
                      />
                    </div>
                  </>
                  {/* } */}
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
                  onClick={() => {
                    setShow(false), update(parseInt(popupData?.ID));
                  }}
                >
                  Update
                </button>
              </footer>
            </form>
          </div>
        </Modal>

        {/* Edit Employee */}
        <Modal
          isOpen={shows}
          onDismiss={() => setShows(false)}
          isBlocking={true}
          containerClassName="create-event-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5">
                Employee Name:&nbsp;&nbsp;<span className="fw-bold">{editData?.Name}</span>
              </p>
              <p className="modal-title fs-5">Employee ID:<span className="fw-bold">{editData?.Employee_Id}</span></p>
            </div>
            {/* <div>
                <h4 className="fw-bold">Employee Name : Riyaz.Nadaf</h4>
            </div> */}
            <hr />
            <form>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Primary Skill
                    </label>
                      <input                         
                        className="form-control"
                        defaultValue={editData?.Primary_Skills}
                        onChange={(e) => {
                          onChangeFormVal(e, "Primary_Skills");
                        }}
                        />                 
                  </div>

                    <div className="col-md-4">
                      <label  className="form-label ">
                        Secondary Skill
                      </label>                     
                      <input  className="form-control" defaultValue={editData?.Secondary_Skills}
                      onChange={(e) => {
                        onChangeFormVal(e, "Secondary_Skills");
                      }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label ">
                        Designation
                      </label>
                      <input  className="form-control" defaultValue={editData?.Designation}
                      onChange={(e) => {
                        onChangeFormVal(e, "Designation");
                      }}
                      />
                    </div>
                 
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label ">
                    Active
                    </label>
                      <select
                      onChange={(e) => {
                        onChangeFormVal(e, "Active");
                      }}
                        className="form-control"
                        defaultValue={editData?.Active} >
                          <option hidden value="">--select--</option>
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                                          
                  </div>

                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                       Certification
                      </label>
                      <input
                      onChange={(e) => {
                        onChangeFormVal(e, "Certification");
                      }}
                      className="form-control"
                      defaultValue={editData?.Certification}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                        Department Name
                      </label>
                      <input
                      onChange={(e) => {
                        onChangeFormVal(e, "DeptName");
                      }}
                      className="form-control"
                       defaultValue={editData?.DeptName}
                      />
                    </div>
                 
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                     Location
                    </label>
                      <input
                      onChange={(e) => {
                        onChangeFormVal(e, "Location");
                      }}
                        className="form-control"
                        defaultValue={editData?.Location}
                        />                     
                  </div>

                    <div className="col-md-4">
                      <label className="form-label ">
                       ProjectManager1
                      </label>
                      {HideoneManager === 'HideoneManager' &&
                        <input
                      onClick={managerfirst}
                      className="form-control"
                       defaultValue={editData?.Manager1?.Title}
                      />}
                      {Hidemanagerone === 'Hidemanagerone' &&
                       <PeoplePicker
                        onItemsChange={Manager1}
                        onBlrCalled={undefined}
                        selectionAriaLabel={undefined}
                        description={""}
                        isDarkTheme={false}
                        environmentMessage={""}
                        hasTeamsContext={false}
                        userDisplayName={""}
                        webURL={""}
                        context={undefined}
                      />}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label ">
                      ProjectManager2
                      </label>
                     { Hide === 'Hide' &&
                     <input
                      onClick={Hideinputfunction}
                      className="form-control"
                        defaultValue={editData?.Manager2?.Title}
                     />}
                       {Hideinput === 'Hideinput' &&
                        <PeoplePicker
                        onItemsChange={Manager2}
                        onBlrCalled={undefined}
                        selectionAriaLabel={undefined}
                        description={""}
                        isDarkTheme={false}
                        environmentMessage={""}
                        hasTeamsContext={false}
                        userDisplayName={""}
                        webURL={""}
                        context={undefined}
                      />}
                      {/* </input> */}
                    </div>
                 
                </div>
              </div>

              <hr />
              <footer className="d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary me-2 btn-size"
                  onClick={() => setShows(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary ms-2 btn-size"
                  onClick={() => {
                    setShows(false), update(parseInt(editData?.ID));
                  }}
                >
                  Update
                </button>
                {updatemodal === "EmployeeUpdated" && (
                  <SuccessModal
                    pageType={"success"}
                    setModal={setUpdateModal}
                    message={"Project Updated Successfully"}
                    showModal={true}
                  />
                )}
              </footer>
            </form>
          </div>
        </Modal>



        

        {/* View Employee */}
        <Modal
          isOpen={view}
          onDismiss={() => SetView(false)}
          isBlocking={true}
          containerClassName="create-event-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5">
                Employee Name:<span className="fw-bold">{Viewdata?.Name}</span>
              </p>
              <p className="modal-title fs-5">Employee ID:<span className="fw-bold">{Viewdata?.Employee_Id}</span></p>
            </div>
            {/* <div>
                <h4 className="fw-bold">Employee Name : Riyaz.Nadaf</h4>
            </div> */}
            <hr />
            <form>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Primary Skill
                    </label>
                      <input
                         disabled
                        className="form-control"
                        defaultValue={Viewdata?.Primary_Skills}/>                 
                  </div>

                    <div className="col-md-4">
                      <label  className="form-label ">
                        Secondary Skill
                      </label>                     
                      <input disabled className="form-control" defaultValue={Viewdata?.Secondary_Skills}/>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label ">
                        Designation
                      </label>
                      <input disabled className="form-control" defaultValue={Viewdata?.Designation}/>
                    </div>
                 
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label ">
                    Active
                    </label>
                      <input
                      disabled
                        className="form-control"
                        defaultValue={Viewdata?.Active} />                     
                  </div>

                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                       Certification
                      </label>
                      <input
                      disabled
                      className="form-control"
                      defaultValue={Viewdata?.Certification}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                        Department Name
                      </label>
                      <input
                      disabled
                      className="form-control"
                       defaultValue={Viewdata?.DeptName}
                      />
                    </div>
                 
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                     Location
                    </label>
                      <input
                      disabled
                        className="form-control"
                        defaultValue={Viewdata?.Location}
                        />                     
                  </div>

                    <div className="col-md-4">
                      <label className="form-label ">
                       ProjectManager1
                      </label>
                      <input
                      disabled
                      className="form-control"
                       defaultValue={Viewdata?.Manager1?.Title}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label ">
                      ProjectManager2
                      </label>
                      <input
                      disabled
                      className="form-control"
                        defaultValue={Viewdata?.Manager2?.Title}
                      />
                    </div>
                 
                </div>
              </div>

              <hr />
              <footer className="d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary me-2 btn-size"
                  onClick={() => SetView(false)}
                >
                  Close
                </button>
                {/* <button
                  type="button"
                  className="btn btn-primary ms-2 btn-size"
                  onClick={() => {
                    SetView(false), update(parseInt(popupData?.ID));
                  }}
                >
                  Update
                </button> */}
              </footer>
            </form>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default EmployeeEdit;
