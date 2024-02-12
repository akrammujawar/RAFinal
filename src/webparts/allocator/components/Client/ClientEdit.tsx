import { Modal } from '@fluentui/react';
import React, { useState } from 'react'
import SuccessModal from '../common/SuccessModal';
import { IAllocatorProps } from '../IAllocatorProps';
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';




const ClientEdit: React.FunctionComponent<IAllocatorProps> = (props: any) => {
    const _SharepointServiceProxy: SharepointServiceProxy =
        new SharepointServiceProxy(props?.context, props?.webURL);
    const [shows, setShows] = useState<boolean>(false);
    const [editData, SetEditData] = useState<any>();
    const [updatemodal, setUpdateModal] = useState<string>("");
    const [updateDetails, setUpdateDetails] = useState<any>({});



    const EditClick = (editData: any) => {
        SetEditData(editData)
        setShows(true)
    };


    const onChangeFormVal = (e: any, colName: string) => {
        setUpdateDetails((prev: any) => {
            return { ...prev, [colName]: e.target.value };
        });
    };

    async function update(itemId: number) {
        await _SharepointServiceProxy.updateItem(
            "Client",
            itemId,
            updateDetails,
            [],
            true
        )
            .then(() => {
                setUpdateModal("EmployeeUpdated");
                setShows(false)
            })
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
            </div>
            {updatemodal === "EmployeeUpdated" && (
                <SuccessModal
                    // EditModalClose = {setShows(false)}
                    pageType={"success"}
                    setModal={setUpdateModal}
                    message={"Client Updated Successfully"}
                    showModal={true}
                />
            )}
            <>
                <Modal
                    isOpen={shows}
                    onDismiss={() => setShows(false)}
                    isBlocking={true}
                    containerClassName="create-event-modal"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title fs-5 fw-bold">
                                {/* Client Name:&nbsp;&nbsp;<span className="fw-bold">{editData?.Name}</span> */}
                                Update Client Details
                            </p>
                            {/* <p className="modal-title fs-5">Employee ID:<span className="fw-bold">{editData?.Employee_Id}</span></p> */}
                        </div>

                        <hr />
                        <form>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">
                                            Client Name
                                        </label>
                                        <input
                                            className="form-control"
                                            defaultValue={editData?.Name}
                                            onChange={(e) => {
                                                onChangeFormVal(e, "Name");
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label ">
                                            Industry
                                        </label>
                                        <input className="form-control" defaultValue={editData?.BusinessDomain}
                                            onChange={(e) => {
                                                onChangeFormVal(e, "BusinessDomain");
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label ">
                                            Location
                                        </label>
                                        <input className="form-control" defaultValue={editData?.Geography}
                                            onChange={(e) => {
                                                onChangeFormVal(e, "Geography");
                                            }}
                                        />
                                    </div>


                                </div>
                                <div className="row mb-3">

                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">
                                            Contact Name
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                onChangeFormVal(e, "ContactName");
                                            }}
                                            className="form-control"
                                            defaultValue={editData?.ContactName}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label ">
                                            Contact Email
                                        </label>
                                        <input className="form-control" defaultValue={editData?.Email}
                                            onChange={(e) => {
                                                onChangeFormVal(e, "Email");
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">
                                            Contact Number
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                onChangeFormVal(e, "ContactNumber");
                                            }}
                                            className="form-control"
                                            defaultValue={editData?.ContactNumber}
                                        />
                                    </div>

                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">
                                            Address
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                onChangeFormVal(e, "Address");
                                            }}
                                            className="form-control"
                                            defaultValue={editData?.Address}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">
                                            GSTN
                                        </label>
                                        <input
                                            onChange={(e) => {
                                                onChangeFormVal(e, "GSTN");
                                            }}
                                            className="form-control"
                                            defaultValue={editData?.GSTN}
                                        />
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
                                        setShows(false), update(parseInt(editData?.ID));
                                    }}
                                >
                                    Update
                                </button>

                            </footer>
                        </form>
                    </div>
                </Modal>
            </>
        </div>
    )
};

export default ClientEdit;