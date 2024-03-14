import * as React from 'react'
import { IAllocatorProps } from '../IAllocatorProps';
import { useState } from 'react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Modal } from '@fluentui/react';
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
const EditAllocation: React.FunctionComponent<IAllocatorProps> = (props: any) => {
    const { getProjectAllocationListData } = props;
    const _SharepointServiceProxy: SharepointServiceProxy =
        new SharepointServiceProxy(props?.context, props?.webURL);
    const [shows, setShows] = useState<boolean>(false);
    const [editData, SetEditData] = useState<any>();
    const [ediManager2, setEditManagerdata2] = useState<string>("");
    const [managerdata, setManagerdata] = useState<any[]>([]);
    const [managerdata2, setManagerdata2] = useState<any[]>([]);
    const EditClick = (editData: any) => {
        SetEditData(editData)
        setShows(true)
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



    const handleManager1 = (PickerData: any) => {
        setManagerdata(PickerData);
    };
    const handleManager2 = (PickerData: any) => {
        setManagerdata2(PickerData);
    };
    const AddProjectManager1 = (id: any, Year: any) => {

        if (managerdata.length > 0 || managerdata2.length > 0) {
            try {
                _SharepointServiceProxy
                    .updateItem(
                        "ProjectsAllocations",
                        id,
                        { Manager1Id: managerdata[0]?.id, Manager2Id: managerdata2[0]?.id },
                        [],
                        true
                    )
                    .then(() => {
                        setShows(false);
                        (managerdata2.length > 0 && managerdata.length > 0) ? alert("Both Managers updated") : (managerdata2.length > 0) ? alert("Manager 2 updated") : alert("MAnager 1 updated")
                        if (Year === '2023') {
                            getProjectAllocationListData(Year)
                        }
                        else {
                            getProjectAllocationListData("")
                        }
                    });
            } catch (error) {
                console.log("Error....")
            }
        }
    }
    return (
        <>
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


            </div>
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
                            {/* <div className="row mb-3"> */}
                            {/* <div className="col-md-4">
                                    <label htmlFor="inputEmail4" className="form-label ">
                                        Employee Name
                                    </label>
                                    <input
                                        className="form-control"
                                        defaultValue={editData?.Name}
                                        onChange={(e) => {
                                            onChangeFormVal(e, "Name");
                                        }}
                                    />
                                </div> */}

                            {/* <div className="col-md-4">
                                    <label className="form-label ">
                                        Practice
                                    </label>
                                    <input className="form-control" defaultValue={editData?.Practice}
                                        onChange={(e) => {
                                            onChangeFormVal(e, "Practice");
                                        }}
                                    />
                                </div> */}
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
                            {/* <div className="col-md-4">
                                    <label className="form-label ">
                                        Experience
                                    </label>
                                    <input className="form-control" defaultValue={monthDifferenceFormatter(editData?.JoiningDate)}
                                        onChange={(e) => {
                                            onChangeFormVal(e, "JoiningDate");
                                        }}
                                    />
                                </div> */}

                            {/* </div> */}
                            <div className="row">

                                <div className="">
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
                                            defaultSelectedUsers={[editData?.Manager1?.title]}
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
                                <div className="">
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
                                            defaultSelectedUsers={[editData?.Manager2?.title]}
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
                                    setShows(false), AddProjectManager1(editData?.ID, editData?.Year);
                                }}
                            >
                                Update
                            </button>

                        </footer>
                    </form>
                </div>
            </Modal>

        </>
    )
}

export default EditAllocation