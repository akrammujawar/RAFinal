import * as React from "react";
import { useEffect, useState } from "react";
import { IAllocatorProps } from "../IAllocatorProps";
// import { format } from "date-fns";
import SharepointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";

import * as _ from "lodash";

// import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

// import { Modal,} from "@fluentui/react";
// import Pagination from "../common/Pagination";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import { AgGridReact } from "ag-grid-react";
import SuccessModal from "../common/SuccessModal";
import { Modal } from "office-ui-fabric-react";
import ClientEdit from "./ClientEdit";

const Client: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<any>([]);
  const [paginatedArrClient, setPaginatedArr] = useState<any>()
  const [updateItem, setupdateItem] = useState<any>([])
  const [openmodal, setOpenModal] = useState<string>("");
  const [addProject, setAddClient] = useState<string>("");
  const [show, setShow] = useState<boolean>(true);
  const [globalMsg, setGlobalMsg] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    Name: "",
    BusinessDomain: "",
    Email: "",
    ContactNumber: "",
    Geography: "",
    ContactName: "",
    Address: "",
    GSTN: ""
  });

  const [leadLink, setLeadLink] = useState<any>(false)

  console.log(leadLink)
  useEffect(() => {
    async function getAuthorized() {
      var currentUser = await _SharepointServiceProxy.getCurrentUser();
      if (currentUser.Groups[0]?.Title === "RA_Owner") {
        setLeadLink(true) 
      }
      else {
        // alert("You are not authorised for Client");
        setLeadLink(false)
        if (currentUser.Groups[0]?.Title !== "RA_Owner") {
          window.location.replace("https://bluebenz0.sharepoint.com/sites/BBD_Internal/ResourceAllocation/_layouts/15/workbench.aspx#/Allocation")
        }
        // else if (currentUser.GroupLeads.filter((ftr: any) => ftr.Title === "PRPLeads").length > 0) {
        //   window.location.replace("https://bluebenz0.sharepoint.com/sites/BBD_Internal/PRPortal/_layouts/15/workbench.aspx#/LeadDashboard")
        // }
      }
    }
    getAuthorized()


  }, [])
  useEffect(() => {
    getClients();
  }, [])

  async function getClients() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Client",
      fields: ["Name", "ID", "BusinessDomain", "Email", "ContactNumber", "Geography", "IsActive", "ContactName", "Address", "GSTN"],
      isRoot: true,
      orderedColumn: "Created",
      filter: `IsActive eq 'Yes'`
    }, false);
    setRowData(items)
  }

  const columnDefs: any = [
    {
      headerName: "Name",
      field: "Name",
      sortable: true,
      width: 350,
      filter: true,
      editable: true,
      floatingFilter: true,
      pinned: "left",
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Location",
      field: "Geography",
      sortable: true,
      editable: true,
      filter: true,
      floatingFilter: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },

    {
      headerName: "Industry",
      field: "BusinessDomain",
      sortable: true,
      filter: true,
      editable: true,
      floatingFilter: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Contact Name",
      field: "ContactName",
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Contact Email",
      field: "Email",
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },

    {
      headerName: "Contact Number",
      field: "ContactNumber",
      editable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Address",
      field: "Address",
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "GSTN",
      field: "GSTN",
      sortable: true,
      filter: true,
      floatingFilter: true,
      editable: true,
      width: 330,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Edit",
      field: "Image",
      cellRenderer: ClientEdit,
      // cellRenderer: PopupCellRenderer,
      // cellRenderer:EmployeeIcons,
      cellRendererParams: { context: props?.context, webURL: props?.webURL },
      width: 120,
    },

  ];

  function OnClientDeatilsChange(params: any) {

    if (params !== null &&
      params !== undefined &&
      params.data !== null &&
      params.data !== undefined) {



      if (updateItem.length === 0) {
        updateItem.push(params.data)
      }
      else {
        const listIndex = updateItem.findIndex(
          (ele: any) => {
            ele.Id === params.data.Id
          }
        )
        if (listIndex !== null &&
          listIndex !== undefined &&
          listIndex !== -1) {
          updateItem.splice(listIndex, 1);
          updateItem.push(params.data);
        }
        else {
          updateItem.push(params.data);
        }
      }
      setupdateItem(updateItem)
      updateItem.forEach(async (element: any) => {
        await _SharepointServiceProxy.updateItem("Client", element.ID, element, [], true).then(() => {
          getClients();
          // alert("Update SucessFully")
        })
      });
    }
  }

  // validation
  function validate() {
    // console.log(globalMsg)
    if (
      data?.ProjectName === "" ||
      data?.BusinessDomain === "" ||
      data?.Email === "" ||
      data?.ContactNumber === "" ||
      data?.Geography === "" ||
      data?.ContactName === "" ||
      data?.Address === "" ||
      data?.GSTN === ""
    ) {
      setGlobalMsg(true);
      return false;
    } else {
      setGlobalMsg(false);
      return true;

    }
  }

  // add clients 
  async function addClients() {
    debugger
    if (validate()) {
      let filteronduplicate = (rowData.filter((ftr: any) => ftr?.Name === data?.Name).length > 0)
      if (filteronduplicate) {
        debugger
        setOpenModal("ClientDuplicate");
        setData({
          Name: "",
          BusinessDomain: "",
          Email: "",
          ContactNumber: "",
          Geography: "",
          ContactName: "",
          Address: "",
          GSTN: ""
        });
      } else {
        await _SharepointServiceProxy.addItem("Client", data, [], true);
        setGlobalMsg(false);
        setData({
          Name: "",
          BusinessDomain: "",
          Email: "",
          ContactNumber: "",
          Geography: "",
          ContactName: "",
          Address: "",
          GSTN: ""
        });
        setShow(false);
        setOpenModal("ClientAdded");
        getClients()
      }
    }

  }


  return (
    <>
      <div className="container-fluid">
        {openmodal === "ClientAdded" && (
          <SuccessModal
            pageType={"success"}
            setModal={setOpenModal}
            message={"Client Added Successfully"}
            showModal={true}
          />
        )}
        {openmodal === "ClientDuplicate" && (
          <SuccessModal
            pageType={"warning"}
            setModal={setOpenModal}
            message={"Same client you cannot add"}
            showModal={true}
          />
        )}

        <div className="row mt-4 pt-2 mx-0">
          <div className="col-6">
            <div className="d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="42"
                fill="#000000"
                className="bi bi-file-earmark-post text-white pt-1"
                viewBox="0 0 16 16"
              >
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                <path d="M4 6.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7zm0-3a.5.5 0 0 1 .5-.5H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1-.5-.5z" />
              </svg>


              <div>
                <h4 className="pt-2 ms-2">Clients</h4>
                <h3 className="bredcram-subhead ms-2">
                  <span
                    className="text-primary cursor-pointer"
                  // onClick={() => navigate("")}
                  >
                    <a href="https://bluebenz0.sharepoint.com/">
                      Dashboard
                    </a>

                  </span>
                  <span> / </span>
                  <span
                    className="cursor-pointer"
                    onClick={() => navigate("/Client")}
                  >
                    Client
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="text-end">
              <svg onClick={() => {
                setAddClient("CreateData"), setShow(true);
              }}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#229ed9"
                className="bi bi-plus-square point add-icon mt-2 me-1"
                viewBox="0 0 16 16"
                data-bs-target="#staticBackdrop1"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-body ">
                <div className="row">
                  <div className="ag-theme-alpine" style={{ height: 470 }}>
                    <AgGridReact
                      rowData={paginatedArrClient}
                      columnDefs={columnDefs}
                      onCellValueChanged={OnClientDeatilsChange}
                    ></AgGridReact>
                  </div>
                  <Pagination
                    orgData={rowData}
                    setNewFilterarr={setPaginatedArr}
                  />
                </div>
              </div>
            </div>



            {addProject === "CreateData" && (
              <>
                <Modal
                  isOpen={show}
                  onDismiss={() => setShow(false)}
                  isBlocking={true}
                  containerClassName="create-event-modal custom_modelcss"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5 fw-bold">
                        Create Client Details
                      </h1>
                    </div>
                    <hr className="hr-line" />
                    <form>
                      <div className="modal-body">
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Client Name </label>
                            <input type="text" className="form-control" placeholder="Client Name" onChange={(e) => setData({ ...data, Name: e.target.value })} />

                            {!data?.Name && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>

                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Industry</label>
                            <input type="text" className="form-control" placeholder="Industry" onChange={(e) => setData({ ...data, BusinessDomain: e.target.value })} />

                            {!data?.BusinessDomain && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>

                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Location</label>
                            <input type="text" className="form-control" placeholder="Location" onChange={(e) => setData({ ...data, Geography: e.target.value })} />

                            {!data?.Geography && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row mb-3 pt-2">
                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Contact Name</label>
                            <input type="text" className="form-control" placeholder="Contact Name" onChange={(e) => setData({ ...data, ContactName: e.target.value })} />

                            {!data?.ContactName && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Contact Email</label>
                            <input type="text" className="form-control" placeholder="Contact Email" onChange={(e) => setData({ ...data, Email: e.target.value })} />

                            {!data?.Email && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>

                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Contact Number</label>
                            <input type="text" className="form-control" placeholder="Contact Number" onChange={(e) => setData({ ...data, ContactNumber: e.target.value })} />

                            {!data?.ContactNumber && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>



                        </div>

                        <div className="row mb-3 pt-2">
                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Address</label>
                            <input type="text" className="form-control" placeholder="Address" onChange={(e) => setData({ ...data, Address: e.target.value })} />

                            {!data?.Address && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >GSTN</label>
                            <input type="text" className="form-control" placeholder="GSTN" onChange={(e) => setData({ ...data, GSTN: e.target.value })} />

                            {!data?.GSTN && (
                              <p
                                className={`${globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                                  }`}
                              >
                                *This field is mandatory
                              </p>
                            )}
                          </div>

                        </div>



                      </div>
                      <hr className="hr-line" />
                      <footer className="d-flex justify-content-end align-items-center">
                        <button
                          type="button"
                          className="btn btn-secondary me-2 btn-size"
                          onClick={() => {
                            setShow(false),
                              setGlobalMsg(false),
                              setAddClient("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ms-2 btn-size"
                          onClick={addClients}
                        >
                          Create
                        </button>
                      </footer>
                    </form>
                  </div>
                </Modal>
              </>
            )}


          </div>
        </div>
      </div>

    </>
  );
};

export default Client;
