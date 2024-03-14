import { Modal } from "office-ui-fabric-react";
import * as React from "react";
import { useState } from "react";
// import { ITimesheetProps } from '../ITimesheetProps';
// import AlertBox from './AlertBox';
import { IAllocatorProps } from "../IAllocatorProps";
import SharepointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import _ from "lodash";
// import PeoplePicker from "../common/PeoplePicker";
// import SuccessModal from "../common/SuccessModal";
import { differenceInMonths } from "date-fns";
// import PeoplePicker from "../common/PeoplePicker";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

const EditEmployee: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const { getToken } = props;
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);
  const [show, setShow] = useState<boolean>(false);
  const [shows, setShows] = useState<boolean>(false);
  const [showAlert, setShowalert] = useState<boolean>(true);
  const [popupData, setPopupData] = useState<any>();
  // const [Viewdata, SetViewData] = useState<any>();
  const [editData, SetEditData] = useState<any>();
  const [updateDetails, setUpdateDetails] = useState<any>({});
  const [hidedate, setHideDate] = useState<boolean>();
  const [showmandatory, setShowmadatoryFilds] = useState<any>(false);
  // const [Hide, setHide] = useState<string>('Hide');
  // const [Hidemanagerone, setHidemanagerone] = useState<string>('');
  const [managerdata, setManagerdata] = useState<any[]>([]);
  const [managerdata2, setManagerdata2] = useState<any[]>([]);

  const [updatemodal, setUpdateModal] = useState<string>("");
  const [ediManager2, setEditManagerdata2] = useState<string>("");


  // Add bench function //
  // const handleClick = (modalData: any) => {
  //   setPopupData(modalData);
  //   if (modalData?.IsBench === "Yes") {
  //     setHideDate(false);
  //   } else {
  //     setHideDate(true);
  //   }
  //   setShow(true);
  //   // console.log(".......modaldata", modalData);
  // };

  // const ViewClick = (viewData: any) => {
  //   SetViewData(viewData)
  //   SetView(true)
  // };

  const EditClick = (editData: any) => {
    SetEditData(editData)
    setShows(true)
  };

  React.useEffect(() => {

  }, []);

  const onChangeStartDate = (e: any, colName: string) => {
    if (e && colName) {
      setShowmadatoryFilds(false)
      setUpdateDetails((prev: any) => {
        return { ...prev, [colName]: e.target.value };
      });
    }

  }
  const onChangeFormVal = (e: any, colName: string) => {
    if (e && colName) {
      setShowmadatoryFilds(false)
      setUpdateDetails((prev: any) => {
        return { ...prev, [colName]: e.target.value };
      });
    }
    if (e.target.value === "Yes") {
      setHideDate(false);
      setShowmadatoryFilds(false)
    }
    else {
      setHideDate(true);
      setShowmadatoryFilds(false)
    }
  };
  //.................... People picker update..........................//
  const handleManager1 = (PickerData: any) => {
    setManagerdata(PickerData);
  };
  const handleManager2 = (PickerData: any) => {
    setManagerdata2(PickerData);
  };
  const AddProjectManager1 = (id: any) => {

    if (managerdata.length > 0 || managerdata2.length > 0) {
      try {
        _SharepointServiceProxy
          .updateItem(
            "Employee",
            id,
            { Manager1Id: managerdata[0]?.id, Manager2Id: managerdata2[0]?.id },
            [],
            true
          )
          .then(() => {
            setShow(false);
            (managerdata2.length > 0 && managerdata.length > 0) ? alert("Both Managers updated") : (managerdata2.length > 0) ? alert("Manager 2 updated") : alert("MAnager 1 updated")
            getToken()
            // setOpenModal("updatedSuccessfully")
            // setUpdateModal("EmployeeUpdated");

          });
      } catch (error) {
        console.log("Error....")
      }
    }
  }



  async function update(itemId: number) {
    // if (updateDetails.length > 0) {
      _SharepointServiceProxy.updateItem(
        "Employee",
        itemId,
        updateDetails,
        [],
        true
      )
        .then(() => {
          setShows(false)
          if(Object.keys(updateDetails).length > 0){
          setUpdateModal("EmployeeUpdated");
        }
        })
    // }

    // let benchreport: any = await _SharepointServiceProxy.getItems({
    //   listName: "BenchReport",
    //   fields: ["EmpName", "Department", "BenchStartDate", "BenchEndDate", "EmpEmail", "ID"],
    //   filter: `EmpName eq '${popupData?.Name}'`,
    //   isRoot: true,
    // });

    // if (benchreport.length > 0 && Object.keys(updateDetails).length > 0) {
    //   try {
    //     _SharepointServiceProxy.updateItem(
    //       "BenchReport",
    //       benchreport[0]?.ID,
    //       updateDetails,
    //       [],
    //       true
    //     )
    //       .then(() => {
    //         setShow(false)
    //         setUpdateModal("EmployeeUpdated");
    //       })
    //   }
    //   catch (error) {
    //     console.log(error, "Error....")
    //   }
    // }
    // else if (Object.keys(updateDetails).length > 0)
    // UPDATE BENCH REPORT ABOVE CODE-----------------------------------------------//

    if (Object.keys(updateDetails).length > 0 && updateDetails?.IsBench === "Yes")
    // if (updateDetails?.IsBench === "Yes")
    {
      let obj = {
        Department: popupData?.DeptName,
        ProjectManager: popupData?.Manager1?.Title,
        EmpName: popupData?.Name,
        EmpEmail: popupData?.EmpEmail,
        BenchStartDate: updateDetails?.BenchStartDate,
        BenchEndDate: updateDetails?.BenchEndDate,
      };
      // console.log("Object.......", obj);
      _SharepointServiceProxy.addItem("BenchReport", obj, [], true).then(() => {
        setShow(false);
        // alert("Added Successfully")
        setUpdateModal("EmployeeAdded")
      });
    }
    else {
      setShowmadatoryFilds(true);
    }
  };


  //  Implementing PeoplePicker //
  // const Manager1=(PeoplePicker:any)=>{
  //   setUpdateDetails((prev: any) => {
  //     return { ...prev, Manager1Id: PeoplePicker[0].key};
  //   });
  //   // console.log("PeoplePicker..........",PeoplePicker)

  //   // setUpdateDetails()


  // }

  // const Manager2=(Peopledata:any)=>{
  //   setUpdateDetails((prev: any) => {
  //     return { ...prev, Manager2Id: Peopledata[0].key};
  //   });
  //   // console.log("Peopledata.......",Peopledata)
  //   // setUpdateDetails(Peopledata[0]?.key);

  // }

  // const Hideinputfunction=()=>{
  //   setHideinput('Hideinput')
  //   setHide('')
  // }
  // const managerfirst=()=>{
  //  setHidemanagerone('Hidemanagerone')
  //   setHideoneManager('')
  // }

  // Lets find out the experience//
  const getCurrentDate = () => {
    return new Date();
  };
  const monthDifferenceFormatter = (params: any) => {
    // if (params.value) {
    const existingDate = new Date(params);
    const currentDate = getCurrentDate();
    const monthDifference = differenceInMonths(currentDate, existingDate);
    const years = (monthDifference / 12).toFixed(1);
    return `${years} year${years === '1.0' ? '' : 's'}`;
    // }
    // else {
    //   null
    // }
  };

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


  const [editBtn, setEditBtn] = useState<any>("")
  const editRow = (type: string, id: any, EmployeeName: string) => {
    if (type === "Manager1") {
      setEditBtn(type)
    }
    else if (type === "Manager2") {
      setEditManagerdata2(type)
    }
  }
  return (
    <div>
      <div>
        <svg
          onClick={() => {
            EditClick(props?.data), console.log("data......", props?.data);
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="16" height="16"
          fill="#229ed9"
          className="bi bi-pencil-square edit-pencil ms-2 mb-1"
          viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        </svg>

        {/* <svg
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
        </svg> */}

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

            <hr />
            <form>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Is Bench
                    </label>
                    {/* <div className="input-group mb-3"> */}
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
                    {showmandatory && <p className="text-danger">*this field is mandatory</p>}
                    {/* </div> */}

                  </div>


                  <>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                        Start Date
                      </label>
                      <input
                        disabled={hidedate}
                        defaultValue={
                          hidedate === false
                            ? popupData?.BenchStartDate?.slice(0, 10)
                            : null || ""
                        }
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          onChangeStartDate(e, "BenchStartDate");
                        }}
                      />
                      {showmandatory && <p className="text-danger">*this field is mandatory</p>}

                    </div>
                    <div className="col-md-4">
                      <label htmlFor="inputEmail4" className="form-label ">
                        End Date
                      </label>
                      <input
                        disabled={hidedate}
                        defaultValue={
                          hidedate === false
                            ? popupData?.BenchEndDate?.slice(0, 10)
                            : null || ""
                        }
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          onChangeStartDate(e, "BenchEndDate");
                        }}
                      />
                      {showmandatory && <p className="text-danger">*this field is mandatory</p>}
                    </div>
                  </>

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
                    update(parseInt(popupData?.ID));
                  }}
                >
                  Update
                </button>
              </footer>
            </form>
          </div>
        </Modal>

        {/* Edit Employee */}
        {updatemodal === "EmployeeUpdated" && (
          <Modal
            className="del-pad"
            isOpen={showAlert}
            onDismiss={() => setShowalert(false)}
            isBlocking={true}
            containerClassName="delete-event-modal"
          >
            <form className="create-modal">
              <div className="m-3">
                <p
                  className={

                    "modal-title-custom text-success"

                  }
                >
                  Success
                </p>
              </div>
              <hr className="HRline"></hr>
              <div className="m-3">
                <div className="modal-content-custom">
                  <p>Employee Updated successfully</p>
                </div>
              </div>
              <hr className="HRline"></hr>
              <footer className="d-flex justify-content-end align-items-center m-3">
                <button
                  onClick={() => { setShowalert(false), getToken() }}
                  className="btn btn-primary btn-footer"
                >
                  Ok
                </button>
              </footer>
            </form>
          </Modal>
        )}
        {updatemodal === "EmployeeAdded" && (
          // <SuccessModal
          //   // EditModalClose = {setShows(false)}
          //   pageType={"success"}
          //   setModal={setUpdateModal}
          //   message={"Employee Addded to the bench Successfully"}
          //   showModal={true}
          // />
          <Modal
            className="del-pad"
            isOpen={showAlert}
            onDismiss={() => setShowalert(false)}
            isBlocking={true}
            containerClassName="delete-event-modal"
          >
            <form className="create-modal">
              <div className="m-3">
                <p
                  className={

                    "modal-title-custom text-success"

                  }
                >
                  Success
                </p>
              </div>
              <hr className="HRline"></hr>
              <div className="m-3">
                <div className="modal-content-custom">
                  <p>Employee Addded to the bench Successfully</p>
                </div>
              </div>
              <hr className="HRline"></hr>
              <footer className="d-flex justify-content-end align-items-center m-3">
                <button
                  onClick={() => { setShowalert(false), getToken() }}
                  className="btn btn-primary btn-footer"
                >
                  Ok
                </button>
              </footer>
            </form>
          </Modal>
        )}
        <Modal
          isOpen={shows}
          onDismiss={() => setShows(false)}
          isBlocking={true}
          containerClassName="create-event-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5 fw-bold">
                Update Employee Details
                {/* Employee Name:&nbsp;&nbsp;<span className="fw-bold">{editData?.Name}</span> */}
              </p>
              {/* <p className="modal-title fs-5">Employee ID:<span className="fw-bold">{editData?.Employee_Id}</span></p> */}
            </div>

            <hr />
            <form>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Employee Name
                    </label>
                    <input
                      className="form-control"
                      defaultValue={editData?.Name}
                      onChange={(e) => {
                        onChangeFormVal(e, "Name");
                      }}
                      disabled
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label ">
                      Practice
                    </label>
                    <input className="form-control" defaultValue={editData?.Practice}
                      onChange={(e) => {
                        onChangeFormVal(e, "Practice");
                      }}
                      disabled
                    />
                  </div>
                  {/* <div className="col-md-4">
                    <label className="form-label ">
                      Secondary_Skills
                    </label>
                    <input className="form-control" defaultValue={editData?.Secondary_Skills}
                      onChange={(e) => {
                        onChangeFormVal(e, "Secondary_Skills");
                      }}
                    />
                  </div> */}
                   <div className="col-md-4">
                    <label className="form-label ">
                      Experience
                    </label>
                    <input className="form-control" defaultValue={monthDifferenceFormatter(editData?.JoiningDate)}
                      onChange={(e) => {
                        onChangeFormVal(e, "JoiningDate");
                      }}
                      disabled
                    />
                  </div>

                </div>
                <div className="row mb-3">
                 
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Manager 1
                    </label>

                    {editBtn === "Manager1" ?
                      <PeoplePicker
                        context={props.context}
                        personSelectionLimit={1}
                        groupName={""} // Leave this blank in case you want to filter from all users    
                        // showtooltip={true}
                        // required={true}
                        defaultSelectedUsers={[editData?.Manager1.title]}
                        disabled={false}
                        ensureUser={true}
                        onChange={handleManager1}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}

                      />
                      :
                      <p onClick={() => editRow('Manager1', editData?.ID, editData?.EmployeeName)} className='d-flex justify-content-between rounded-2' style={{ border: "1px solid lightgrey" }}>
                        {/* <img src="../SiteAssets/AssetImages/edit_calendar.svg" className="cursor-point" /> */}

                        {editData?.Manager1?.Title}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16" height="16"
                          fill="#229ed9"
                          className="bi bi-pencil-square edit-pencil ms-2 mb-1"
                          viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                      </p>
                    }
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Manager 2
                    </label>
                    {ediManager2 === "Manager2" ?
                      <PeoplePicker
                        context={props.context}
                        personSelectionLimit={1}
                        groupName={""} // Leave this blank in case you want to filter from all users    
                        // showtooltip={true}
                        // required={true}
                        defaultSelectedUsers={[editData?.Manager2.title]}
                        disabled={false}
                        ensureUser={true}
                        onChange={handleManager2}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}

                      />
                      :
                      <p onClick={() => editRow('Manager2', editData?.ID, editData?.EmployeeName)} className='d-flex justify-content-between rounded-2' style={{ border: "1px solid lightgrey" }}>
                        {/* <img src="../SiteAssets/AssetImages/edit_calendar.svg" className="cursor-point" /> */}

                        {editData?.Manager2?.Title}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16" height="16"
                          fill="#229ed9"
                          className="bi bi-pencil-square edit-pencil ms-2 mb-1"
                          viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                      </p>
                    }

                  </div>


                </div>
                <div className="row mb-3">


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
                    setShows(false), update(parseInt(editData?.ID)), AddProjectManager1(editData?.ID);
                  }}
                >
                  Update
                </button>

              </footer>
            </form>
          </div>
        </Modal>





        {/* View Employee */}
        {/* <Modal
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
                
              </footer>
            </form>
          </div>
        </Modal> */}
      </>
    </div>
  );
};

export default EditEmployee;
