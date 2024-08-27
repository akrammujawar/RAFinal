import * as React from "react";
import { useState, useEffect } from "react";
import { IAllocatorProps } from "../IAllocatorProps";
import { format } from "date-fns";
import SharepointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
// import PeoplePicker from '../../UIComponent/PeoplePicker';
// import PeoplePicker from '../../UIComponent/PeoplePicker';
// import { useNavigate } from 'react-router';
// import PeoplePicker from '../../UIComponent/PeoplePicker';
import * as _ from "lodash";
// import Pagination from "../../UIComponent/Pagination";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import {
  ComboBox,
  // DirectionalHint,
  IComboBox,
  IComboBoxOption,
  IComboBoxStyles,
  Modal,
  // TooltipHost,
} from "@fluentui/react";
import SuccessModal from "../common/SuccessModal";
import moment from "moment";
import Action from "./Action";
import Pagination from "../common/Pagination";

const Projects: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);

  const [addProject, setAddProject] = useState<string>("");
  const [showProject, setShowProject] = useState<string>("");
  const [paginatedArrProject, setPaginatedArr] = useState<any>()
  // const [projectData, setprojectData] = useState<any[]>([]);
  // console.log(projectData);
  // const [clientddl, setClientName] = useState<any>();
  const [domainName, setDomainName] = useState<any>();
  const [technology, setTechnology] = useState<any>();
  const [geography, setGeography] = useState<any>();
  const [show, setShow] = useState<boolean>(true);
  const [shows, setShows] = useState<boolean>(true);
  const [globalMsg, setGlobalMsg] = useState<boolean>(false);
  const [projectForView, setProjectForView] = useState<any[]>([]);
  // const [updateClientName, setUpdateClientName] = useState<any>();
  const [updateDomainName, setUpdateDomainName] = useState<any>();
  const [updateTechnologyName, setUpdateTechnology] = useState<any>();
  const [updateGeographyName, setUpdateGeography] = useState<any>();
  const [viewProject, setViewProject] = useState<any>({});
  const [returnedUpdateTarget, setreturnedUpdateTarget] = useState<any>();
  const [openmodal, setOpenModal] = useState<string>("");
  const [updatemodal, setUpdateModal] = useState<string>("");
  const [selectedStartDate, setSelectedStartDate] = useState<any>("");
  const [selectedEndDate, setSelectedEndDate] = useState<any>("");
  const [leadlist, setleadlist] = useState<any>();
  const [managerlist, setManagerList] = useState<any>();
  const [employeeId, setemployeeId] = useState<any>();
  const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
  const [rowData, setRowData] = useState([]);
  const [Clients, setclient] = useState([]);
  const [updateProjectData, setUpdateProjectData] = useState<any>({});

  const [data, setData] = useState<any>({
    ProjectName: "",
    StartDate: "",
    EndDate: "",
    ProjectManager: "",
    ProjectLeadName: "",
    Status: "",
    ProjectsType: "",
    ActualEfforts: "",
    PlannedEfforts: "",
    DomainId: 0,
    TechnologyId: 0,
    GeographyId: 0,
    ClientNames: ""

  });



  useEffect(() => {
    getToken();
    getClients();
    getDomain();
    getTechnology();
    getGeography();
    updateDomain();
    updateTechnology();
    updateGeography();
    getProjectForView();
    getProjectLeadTypeahed();
    getProjectManagerType();
    getProjectManagerUpdateTypeahed();
  }, []);


  const navigate = useNavigate();
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
      }
    }
    getAuthorized()
  }, [])
  


  const columnDefs: any = [
    {
      headerName: "Project Name",
      field: "ProjectName",
      sortable: true,
      width: 250,
      filter: true,
      floatingFilter: true,
      pinned:"left",
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Start Date",
      field: "StartDate",
      cellRenderer: (params: any) => {
        return moment(params.value).format("DD-MM-YY");
      },
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "End Date",
      field: "EndDate",
      cellRenderer: (params: any) => {
        return moment(params.value).format("DD-MM-YY");
      },
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Project Manager",
      field: "ProjectManager",
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 250,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Project Lead",
      field: "ProjectLeadName",
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Client Name",
      field: "ClientNames",
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 250,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 160,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Action",
      field: "Image",
      cellRenderer: Action,
      cellRendererParams: { context: props?.context, webURL: props?.webURL,getToken: getToken },
      width: 100,

    },
  ];




  async function getToken() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Project",
      fields: [
        "ID",
        "ProjectName",
        "StartDate",
        "EndDate",
        "ProjectLeadName",
        "ProjectManager",
        "ClientName/Name",
        "Status",
        "ClientNames",
        "ProjectsType",
        "ProjectValue",
        "ProjectType",
        "PlannedEfforts",
        "ActualEfforts",
        "Domain/Name",
        "Domain/ID",
        "Technology/Name",
        "Technology/ID",
        "Geography/Name",
        "Geography/ID",
        "ClientNames",
        "ProjectsType",
      ],
      expandFields: ["ClientName", "Domain", "Technology", "Geography"],
      isRoot: true,
      orderedColumn: "Created",
    }, false);
    // setprojectData(items);
    setRowData(items);


  }

  // get data from client
  async function getClients() {
    let clients: any = []
    let items = await _SharepointServiceProxy.getItems({
      listName: "Client",
      fields: ["Name"],
      isRoot: true,
      orderedColumn: "Created",
    }, false);

    items.forEach((element: any) => {
      clients.push({
        Name: element?.Name
      })

    });
    setclient(clients);
  }

  // get data from Domain .
  async function getDomain() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Domain",
      fields: ["Name", "ID"],
      isRoot: true,
    });
    setDomainName(items);
  }

  // get data from Technology
  async function getTechnology() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Technology",
      fields: ["Name", "ID"],
      isRoot: true,
    });
    setTechnology(items);
  }

  // get data from Geography
  async function getGeography() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Geography",
      fields: ["Name", "ID"],
      isRoot: true,
    });
    setGeography(items);
  }

  async function createProject() {
    console.log("setshiw", data);
    if (validate()) {
      console.log(data);
      await _SharepointServiceProxy.addItem(
        "Project",
        data,
        [],
        true
      );
      setData({});
      setAddProject("");
      setGlobalMsg(false);
      setShow(false);

      setOpenModal("ProjectAdded");
      getToken();
      // getClient();
      getDomain();
      getTechnology();
      getGeography();
      // getStausChoice();
      // updateClient();
      updateDomain();
      updateTechnology();
      updateGeography();
      getProjectForView();
      // getProjectManagerTypeahed();
      getProjectManagerType();
      getProjectLeadTypeahed();
      // getProjectManagerUpdateTypeahed();
    }
  }

  function validate() {
    // console.log(globalMsg)
    if (
      data?.ProjectName === "" ||
      data?.StartDate === "" ||
      data?.EndDate === "" ||
      data?.ProjectManager === "" ||
      // data?.ProjectLeadId === 0 ||
      // data?.ProjectValue === "" ||
      // data?.ProjectLead === "" ||
      data?.ProjectsType === "" ||
      data?.PlannedEfforts === "" ||
      data?.ActualEfforts === "" ||
      data?.Status === "" ||
      data?.ClientNames === 0 ||
      data?.DomainId === 0 ||
      data?.TechnologyId === 0 ||
      data?.GeographyId === 0
    ) {
      setGlobalMsg(true);
      return false;
    } else {
      setGlobalMsg(false);
      return true;
      // props.modalPopupHide("")
    }
  }

  async function getProjectForView() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Project",
      fields: [
        "ID",
        "ProjectName",
        "StartDate",
        "EndDate",
        "ProjectManager",
        "ProjectLeadName",
        "Status",
        "ActualEfforts",
        "PlannedEfforts",
        "ProjectValue",
        "ProjectsType",
        "ClientName/Name",
        "ClientName/ID",
        "Domain/Name",
        "Domain/ID",
        "Technology/Name",
        "Technology/ID",
        "Geography/Name",
        "Geography/ID",
        "ClientNames",
        "ProjectsType",
      ],
      // filter: `ID eq '${ID}'`,
      expandFields: ["ClientName", "Domain", "Technology", "Geography"],
      isRoot: true,
      // orderedColumn: "ID"
    });
    setProjectForView(items);
    console.log(projectForView);
  }

  // async function getProject(item: any) {
  //   setViewProject(item);
  //   // console.log("items..", items)
  // console.log("View...", viewProject);
  // }
  console.log(setViewProject);



  async function updateProject(id: any) {
    let items = await _SharepointServiceProxy.updateItem(
      "Project",
      id,
      updateProjectData,
      [],
      true
    );
    setUpdateProjectData({});
    // setUpdateProjectData([])
    // setViewProject([])
    console.log("updateproject data", items);
    setOpenModal("ProjectUpdated");
    getToken();
  }

  async function updateDomain() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Domain",
      fields: ["Name", "ID"],
      isRoot: true,
    });
    setUpdateDomainName(items);
  }
  // update data from Technology
  async function updateTechnology() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Technology",
      fields: ["Name", "ID"],
      isRoot: true,
    });
    setUpdateTechnology(items);
  }

  // update data from Geography
  async function updateGeography() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Geography",
      fields: ["Name", "ID"],
      isRoot: true,
    });
    setUpdateGeography(items);
  }



  const onChangeProjectManagerTypeHead = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    setData({ ...data, ProjectManager: value });
  };



  const onChangeProjectManagerUpdateTypeHead = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    setUpdateProjectData({ ...updateProjectData, ProjectManager: value });
  };

  // Get Project Manager  typehead Data//
  async function getProjectManagerType() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "ProjectManager",
      fields: ["ProjectManger/Title", "ID"],
      isRoot: true,
      expandFields: ["ProjectManger"],
    });
    // console.log(items);
    setemployeeId(items);
    let partialArr = items.map((e: any) => ({
      key: e?.ProjectManger?.Title,
      text: e?.ProjectManger?.Title,
    }));
    setManagerList(_.uniqWith(partialArr, _.isEqual));
    // console.log("Projectmanager...", employeelist);
  }

  // Get Project Lead //
  async function getProjectLeadTypeahed() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "ProjectLead",
      fields: ["ProjectLead/Title", "ID"],
      isRoot: true,
      expandFields: ["ProjectLead"],
    });
    // console.log(items);
    // setProjectLead(items);
    // console.log("Lead list data...", items);
    let partialArr = items.map((e: any) => ({
      key: e?.ProjectLead?.Title,
      text: e?.ProjectLead?.Title,
    }));
    setleadlist(_.uniqWith(partialArr, _.isEqual));
  }

  const onChangeProjectLeadTypeHead = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    setData({ ...data, ProjectLeadName: value });
  };

  const onChangeProjectLeadUpdateTypeHead = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    let empId = employeeId.filter((itr: any) => itr?.Name?.includes(value));
    setUpdateProjectData({ ...updateProjectData, ProjectLeadId: empId?.ID });
  };

  async function getProjectManagerUpdateTypeahed() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Project",
      fields: ["ProjectManager", "ID"],
      isRoot: true,
    });


    let partialArray = items.map(({ ProjectManager }) => ({
      key: ProjectManager,
      text: ProjectManager,
    }));
    setreturnedUpdateTarget(_.uniqWith(partialArray, _.isEqual));
    console.log(returnedUpdateTarget);
  }



  return (
    <>
      <div className="container-fluid">
        {openmodal === "ProjectAdded" && (
          <SuccessModal
            pageType={"success"}
            setModal={setOpenModal}
            message={"Project Added Successfully"}
            showModal={true}
          />
        )}
        {updatemodal === "ProjectUpdated" && (
          <SuccessModal
            pageType={"success"}
            setModal={setUpdateModal}
            message={"Project Updated Successfully"}
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
                <h4 className="pt-2 ms-2">Projects</h4>
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
                    onClick={() => navigate("/Projects")}
                  >
                    Project
                  </span>
                </h3>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="text-end">
              <svg
                onClick={() => {
                  setAddProject("CreateData"), setShow(true);
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
                      rowData={paginatedArrProject}
                      columnDefs={columnDefs}
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
                  containerClassName="create-event-modal"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5 fw-bold">
                        Create Project Details
                      </h1>
                    </div>
                    <hr className="hr-line" />
                    <form>
                      <div className="modal-body">
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label htmlFor="inputEmail4" className="form-label " >Project Name </label>
                            <input type="text" className="form-control" placeholder="Project Name" onChange={(e) => setData({ ...data, ProjectName: e.target.value })} />

                            {!data?.ProjectName && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Project Manager
                            </label>
                            {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Project Manager"
                            onChange={(e) => setData({ ...data, ProjectManager: e.target.value })}
                          /> */}

                            {/* add ka hai  */}
                            <ComboBox
                              className="cmbocss"
                              // options={options}
                              placeholder="Project Manager"
                              options={managerlist}
                              styles={comboBoxStyles}
                              allowFreeInput
                              autoComplete="on"
                              onChange={onChangeProjectManagerTypeHead}
                            />
                            {!data?.ProjectManager && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Project Lead
                            </label>
                            {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Project Lead"
                            onChange={(e) =>
                              setData({ ...data, ProjectLead: e.target.value })
                            }
                          /> */}
                            <ComboBox
                              className="cmbocss"
                              // options={options}
                              placeholder="Project Lead"
                              options={leadlist}
                              styles={comboBoxStyles}
                              allowFreeInput
                              autoComplete="on"
                              onChange={onChangeProjectLeadTypeHead}
                            />

                            {!data?.ProjectLeadName && (
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

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Client Name
                            </label>
                            <div className="input-group">
                              {/* <input
                              type="text"
                              className="form-control"
                              //  dropdown-style" remove
                              placeholder="Project Name"
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  ClientNames: e.target.value,
                                })
                              }
                            /> */}
                              {/* <select name="" id="">
                            options={Clients
                                ?.map((itr: any) => {
                                    return {
                                        text: itr.Name,
                                        key: itr.Name
                                    }
                                })}
                            </select> */}
                              <select
                                className="form-select"
                                name="Client"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    ClientNames: e.target.value
                                  })
                                }
                              >


                                {Clients?.map((itr: any, i: any) => {
                                  return (
                                    <>
                                      <option hidden value="0">
                                        --Select--
                                      </option>
                                      <option value={itr.Name}>
                                        {itr?.Name}
                                      </option>
                                    </>
                                  );
                                })}
                              </select>
                            </div>
                            {!data?.ClientNames && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Start Date
                            </label>
                            {/* <input
                            id="date"
                            data-provide="datepicker"
                            type="date"
                            className="form-control"
                            placeholder="Start Date"
                            onChange={(e) => setData({ ...data, StartDate: e.target.value })}
                          /> */}
                            <input
                              type="date"
                              id="date-input"
                              className="form-control"
                              //  dropdown-style"
                              // min={format(new Date(), "yyyy-MM-dd")} // Set the minimum date here
                              //  value={selectedStartDate}
                              // onChange={(event) => setSelectedStartDate(event.target.value)}
                              onChange={(e) => {
                                setData({ ...data, StartDate: e.target.value }),
                                  setSelectedStartDate(e.target.value);
                              }}
                            />

                            {!data?.StartDate && (
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
                            <label htmlFor="inputEmail4" className="form-label">
                              End Date
                            </label>
                            {/* <input
                            type="date"
                            className="form-control"
                            placeholder="End Date"
                            onChange={(e) => setData({ ...data, EndDate: e.target.value })}

                          /> */}
                            <input
                              type="date"
                              id="date-input"
                              className="form-control"
                              //  dropdown-style"
                              // min={format(new Date(), "yyyy-MM-dd")} // Set the minimum date here
                              value={selectedEndDate}
                              min={selectedStartDate}
                              // onChange={(event) => setSelectedEndDate(event.target.value)}
                              onChange={(e) => {
                                setData({ ...data, EndDate: e.target.value }),
                                  setSelectedEndDate(e.target.value);
                              }}
                            />
                            {!data?.EndDate && (
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

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Project Type
                            </label>
                            {/* <input
                            type="text"
                            className="form-control dropdown-style"
                            placeholder="Project Value"
                            onChange={(e) =>
                              setData({ ...data, ProjectValue: e.target.value })
                            }
                          />
                          {!data?.ProjectValue && (
                            <p
                              className={`${globalMsg
                                ? "d-block text-danger mb-0 error-feild-size"
                                : "d-none"
                                }`}
                            >
                              *This field is mandatory
                            </p>
                          )} */}
                            <input
                              type="text"
                              className="form-control"
                              //  dropdown-style" remove
                              placeholder="Project Type"
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  ProjectsType: e.target.value,
                                })
                              }
                            />
                            {/* <select
                              className="form-select"
                              //  dropdown-style"
                              defaultValue={viewProject?.ProjectType}
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  ProjectType: e.target.value,
                                })
                              }
                            >
                              <option hidden value="0">
                                --Select--
                              </option>
                              <option value="FP">FP</option>
                              <option value="T&M">T&M</option>
                            </select> */}
                            {!data?.ProjectsType && (
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
                            <p className="form-label">Planned Efforts</p>
                            <input
                              type="text"
                              className="form-control"
                              //  dropdown-style"
                              placeholder="Planned Efforts"
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  PlannedEfforts: e.target.value,
                                })
                              }
                            />
                            {!data?.PlannedEfforts && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Actual Efforts
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              //  dropdown-style"
                              placeholder="Actual Efforts"
                              onChange={(e) =>
                                setData({
                                  ...data,
                                  ActualEfforts: e.target.value,
                                })
                              }
                            />
                            {!data?.ActualEfforts && (
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
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Domain
                            </label>
                            <div className="input-group">
                              <select
                                className="form-select"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    DomainId: parseInt(e.target.value),
                                  })
                                }
                              >
                                <option hidden value="0">
                                  --Select--
                                </option>
                                {domainName?.map((itr: any, i: any) => {
                                  return (
                                    <option value={itr.ID}>{itr?.Name}</option>
                                  );
                                })}
                              </select>
                            </div>
                            {!data?.DomainId && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Technology
                            </label>
                            <div className="input-group">
                              <select
                                className="form-select"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    TechnologyId: parseInt(e.target.value),
                                  })
                                }
                              >
                                <option hidden value="0">
                                  --Select--
                                </option>
                                {technology?.map((itr: any, i: any) => {
                                  return (
                                    <option value={itr.ID}>{itr?.Name}</option>
                                  );
                                })}
                              </select>
                            </div>
                            {!data?.TechnologyId && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Geography
                            </label>
                            <div className="input-group">
                              <select
                                className="form-select"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    GeographyId: parseInt(e.target.value),
                                  })
                                }
                              >
                                <option hidden value="0">
                                  --Select--
                                </option>
                                {geography?.map((itr: any, i: any) => {
                                  return (
                                    <option value={itr.ID}>{itr?.Name}</option>
                                  );
                                })}
                              </select>
                            </div>
                            {!data?.GeographyId && (
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
                            <label
                              htmlFor="inputEmail4"
                              className="form-label pt-3"
                            >
                              Status
                            </label>
                            <div className="input-group">
                              <select
                                className="form-select"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setData({ ...data, Status: e.target.value })
                                }
                              >
                                {/* {statusChoice?.map((itr: any, i: any) => {
                                          return (
                                          <option value={itr.Status}>{itr.Status}</option>
                                           )
                                           })} */}
                                <option hidden value="">
                                  --Select--
                                </option>
                                <option value="Not Started">Not Started</option>
                                {/* <option value="Not Assigned">Not Assigned</option> */}
                                <option value="InProgress">InProgress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                            {!data?.Status && (
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
                              setAddProject("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary ms-2 btn-size"
                          onClick={createProject}
                        >
                          Create
                        </button>
                      </footer>
                    </form>
                  </div>
                </Modal>
              </>
            )}

            {/* VIEW BUTTON MODAL */}
            {showProject === "UpdateData" && (
              <>
                <Modal
                  isOpen={shows}
                  onDismiss={() => setShows(false)}
                  isBlocking={true}
                  containerClassName="create-event-modal"
                >
                  {viewProject && (
                    // viewProject?.map((itr: any) =>
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5">
                          Update Project Details
                        </h1>
                      </div>
                      <hr />
                      <form>
                        <div className="modal-body">
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Project Name
                              </label>
                              <input
                                defaultValue={viewProject?.ProjectName}
                                type="text"
                                className="form-control"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    ProjectName: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Project Manager
                              </label>
                              {/* <input
                              defaultValue={viewProject?.ProjectManager}
                              type="text"
                              className="form-control"
                              onChange={(e) => setUpdateProjectData({ ...updateProjectData, ProjectManager: e.target.value })}

                            /> */}

                              {/* Update ka hai */}
                              <ComboBox
                                // options={options}
                                // defaultValue={viewProject?.ProjectManager}
                                placeholder="Project Manager"
                                defaultSelectedKey={viewProject?.ProjectManager.toString()}
                                options={managerlist}
                                styles={comboBoxStyles}
                                allowFreeInput
                                autoComplete="on"
                                onChange={onChangeProjectManagerUpdateTypeHead}
                              />
                            </div>
                            {/* <div className="col-md-4">
                            <label
                              htmlFor="inputEmail4"
                              className="form-label "
                            >
                              Client
                            </label>
                            <div className="input-group">
                              <select
                                className="form-select dropdown-style"
                                defaultValue={viewProject?.ClientName?.ID}
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    ClientNameId: e.target.value,
                                  })
                                }
                              >
                                {updateClientName?.map((itr: any, i: any) => {
                                  return (
                                    <option value={itr.ID}>{itr?.Name}</option>
                                  );
                                })}
                              </select>
                            </div>
                          </div> */}
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Project Lead
                              </label>
                              <ComboBox
                                // options={options}
                                defaultSelectedKey={viewProject?.ProjectLead?.Name.toString()}
                                // defaultSelectedKey={viewProject?.ProjectManager.toString()}
                                placeholder="Projecct Lead"
                                options={managerlist}
                                styles={comboBoxStyles}
                                allowFreeInput
                                autoComplete="on"
                                onChange={onChangeProjectLeadUpdateTypeHead}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Client
                              </label>
                              <div className="input-group">
                                <input
                                  className="form-control"
                                  //  dropdown-style"
                                  defaultValue={viewProject?.ClientName?.ID}
                                  onChange={(e) =>
                                    setUpdateProjectData({
                                      ...updateProjectData,
                                      ClientNames: e.target.value,
                                    })
                                  }
                                />
                                {/* {updateClientName?.map((itr: any, i: any) => {
                                    return (
                                      <option value={itr.ID}>
                                        {itr?.Name}
                                      </option>
                                    );
                                  })} */}

                              </div>
                            </div>
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Start Date
                              </label>
                              <input
                                defaultValue={
                                  viewProject?.StartDate
                                    ? format(
                                      new Date(viewProject?.StartDate),
                                      "yyyy-MM-dd"
                                    )
                                    : ""
                                }
                                type="date"
                                className="form-control"
                                //  dropdown-style"
                                min={format(new Date(), "yyyy-MM-dd")}
                                // value={selectedUpdateStartDate}
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    StartDate: e.target.value,
                                  })
                                }
                              // onChange={(e) => {setUpdateProjectData({ ...updateProjectData, StartDate: e.target.value}), setSelectedUpdateStartDate(e.target.value)}}
                              />
                            </div>
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                End Date
                              </label>
                              <input
                                defaultValue={
                                  viewProject?.EndDate
                                    ? format(
                                      new Date(viewProject?.EndDate),
                                      "yyyy-MM-dd"
                                    )
                                    : ""
                                }
                                type="date"
                                min={format(new Date(), "yyyy-MM-dd")}
                                className="form-control"
                                //  dropdown-style"
                                // value={selectedUpdateEndDate}
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    EndDate: e.target.value,
                                  })
                                }
                              // onChange={(e) => {setUpdateProjectData({ ...updateProjectData, StartDate: e.target.value}), setSelectedUpdateEndDate(e.target.value)}}
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label"
                              >
                                Project Type
                              </label>
                              <input
                                className="form-control"
                                defaultValue={viewProject?.ProjectType}
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    ProjectsType: e.target.value,
                                  })
                                }
                              />
                              {/* <option selected>select</option>
                                <option value="Completed">FP</option>
                                <option value="InProgress">T&M</option>
                              </select> */}
                              {!data?.ProjectsType && (
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
                              <p className="form-label ">Planned Efforts</p>
                              <input
                                defaultValue={viewProject?.PlannedEfforts}
                                type="text"
                                className="form-control"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    PlannedEfforts: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Actual Efforts
                              </label>
                              <input
                                defaultValue={viewProject?.ActualEfforts}
                                type="text"
                                className="form-control"
                                //  dropdown-style"
                                onChange={(e) =>
                                  setUpdateProjectData({
                                    ...updateProjectData,
                                    ActualEfforts: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Domain
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select"
                                  //  dropdown-style"
                                  defaultValue={viewProject?.Domain?.ID}
                                  onChange={(e) =>
                                    setUpdateProjectData({
                                      ...updateProjectData,
                                      DomainId: e.target.value,
                                    })
                                  }
                                >
                                  {updateDomainName?.map((itr: any, i: any) => {
                                    return (
                                      <option value={itr.ID}>
                                        {itr?.Name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Technology
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select"
                                  //  dropdown-style"
                                  onChange={(e) =>
                                    setUpdateProjectData({
                                      ...updateProjectData,
                                      TechnologyId: e.target.value,
                                    })
                                  }
                                  defaultValue={viewProject?.Technology?.ID}
                                >
                                  {updateTechnologyName?.map(
                                    (itr: any, i: any) => {
                                      return (
                                        <option value={itr.ID}>
                                          {itr?.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Geography
                              </label>
                              <div className="input-group">
                                <select
                                  className="form-select"
                                  //  dropdown-style"
                                  defaultValue={viewProject?.Geography?.ID}
                                  onChange={(e) =>
                                    setUpdateProjectData({
                                      ...updateProjectData,
                                      GeographyId: e.target.value,
                                    })
                                  }
                                >
                                  {updateGeographyName?.map(
                                    (itr: any, i: any) => {
                                      return (
                                        <option value={itr.ID}>
                                          {itr?.Name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label "
                              >
                                Status
                              </label>
                              <div className="input-group mb-3">
                                <select
                                  className="form-select"
                                  //  dropdown-style"
                                  defaultValue={viewProject?.Status}
                                  onChange={(e) =>
                                    setUpdateProjectData({
                                      ...updateProjectData,
                                      Status: e.target.value,
                                    })
                                  }
                                >
                                  <option hidden value="">
                                    --Select--
                                  </option>
                                  <option value="Not Started">
                                    Not Started
                                  </option>
                                  {/* <option value="Not Assigned">Not Assigned</option> */}
                                  <option value="InProgress">InProgress</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr />
                        <footer className="d-flex justify-content-end align-items-center">
                          <button
                            type="button"
                            className="btn btn-secondary me-2 btn-size"
                            onClick={() => {
                              setShow(false),
                                setGlobalMsg(false),
                                setShowProject("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ms-2 btn-size"
                            onClick={() => {
                              updateProject(viewProject?.ID),
                                setShow(false),
                                setUpdateModal("ProjectUpdated");
                            }}
                          >
                            Update
                          </button>
                        </footer>
                      </form>
                    </div>
                  )}
                </Modal>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default Projects;
