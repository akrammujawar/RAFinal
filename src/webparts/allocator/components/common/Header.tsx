import { Modal } from "office-ui-fabric-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { IAllocatorProps } from "../IAllocatorProps";
import SharepointServiceProxy from "./sp-proxy/SharepointServiceProxy";
import PeoplePicker from "./PeoplePicker";
const URL = window.location.href;
const actTab = URL.slice(URL.lastIndexOf("/") + 1);

const Header: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);
  // const [activeMenu, setActiveMenu] = useState<string>(actTab);
  const [show, setShow] = useState<boolean>(false);
  const [shows, setShows] = useState<boolean>(false);
  const [showLink, setLink] = useState<any>(false)
  // console.log(updateDetails);
  const [projectdata, setprojectdata] = useState<any>();
  const [managerdata, setManagerdata] = useState<any>();

  const storedActiveTab = sessionStorage.getItem('activeTab');
  const [activeMenu, setActiveMenu] = useState<string>(storedActiveTab || actTab);

  useEffect(() => {
    // Save the active tab to sessionStorage whenever it changes
    sessionStorage.setItem('activeTab', activeMenu);
  }, [activeMenu]);

  // const onChangeFormVal = (e: any, colName: string) => {
  //   colName === "ProjectManager" || colName === "ProjectLeadId"
  //     ? setUpdateDetails((prev: any) => {
  //         return { ...prev, [colName]: e.key };
  //       })
  //     : setUpdateDetails((prev: any) => {
  //         return { ...prev, [colName]: e.target.value };
  //       });
  // };
  // console.log(onChangeFormVal);

  // Addin New Project Manager//
  const handlepeopleModalPickerData = (PickerData: any) => {
    setManagerdata(PickerData);
  };
  const AddProjectManager = () => {
    if (managerdata.length > 0) {
      _SharepointServiceProxy
        .addItem(
          "ProjectManager",
          { ProjectMangerId: managerdata[0]?.key },
          [],
          true
        )
        .then(() => {
          setShow(false);
          // setOpenModal("updatedSuccessfully")
        });
    }
  }


  // Adding New Projecg Lead //
  const handlepeopleModalProjectLead = (peopledata: any) => {
    setprojectdata(peopledata)
  };
  const AddProjectLead = () => {
    if (projectdata.length > 0) {
      _SharepointServiceProxy
        .addItem("ProjectLead", { ProjectLeadId: projectdata[0]?.key }, [], true)
        .then(() => {
          setShows(false);
          // setOpenModal("updatedSuccessfully")
        });
    }
  };


  // Permission management......................................................//
  useEffect(() => {
    getProjectAllocationListData("")

  }, []);

  // get ProjectAllocation 
  async function getProjectAllocationListData(year: any) {
    try {
      let loggedUser = await _SharepointServiceProxy.getCurrentUser().then((res: any) => {
        return res
      });
      // setCurrentUser(loggedUser)
      // let filterYear: string = ''
      // if (year) {
      //   filterYear = `Year eq ${year}`;
      // } else {
      //   filterYear = `Year eq '${new Date().getFullYear()}'`;
      // }



      // let projectListItems = await _SharepointServiceProxy.getItems({
      //   listName: "ProjectsAllocations",
      //   fields: ["ID",
      //     "Project_ID/ID",
      //     "Project_ID/ProjectName",
      //     "Project_ID/ClientNames",
      //     "Project_ID/ProjectsType",
      //     "Project_ID/StartDate",
      //     "Project_ID/EndDate",
      //     "Project_ID/ProjectManager",
      //     "EmployeeId/ID",
      //     "EmployeeId/Name",
      //     "EmployeeId/EmpEmail",
      //     "EmployeeId/DeptName",
      //     "EmployeeId/Employee_Id",
      //     "EmployeeId/Primary_Skills",
      //     "EmployeeId/Designation",
      //     "Year",
      //     "Weak1", "Weak2", "Weak3", "Weak4", "Weak5", "Weak6", "Weak7", "Weak8", "Weak9", "Weak10",
      //     "Weak11", "Weak12", "Weak13", "Weak14", "Weak15", "Weak16", "Weak17", "Weak18", "Weak19", "Weak20",
      //     "Weak21", "Weak22", "Weak23", "Weak24", "Weak25", "Weak26", "Weak27", "Weak28", "Weak29", "Weak30",
      //     "Weak31", "Weak32", "Weak33", "Weak34", "Weak35", "Weak36", "Weak37", "Weak38", "Weak39", "Weak40",
      //     "Weak41", "Weak42", "Weak43", "Weak44", "Weak45", "Weak46", "Weak47", "Weak48", "Weak49", "Weak50",
      //     "Weak51", "Weak52"

      //   ],
      //   expandFields: ["Project_ID", "EmployeeId"],
      //   isRoot: true,
      //   // filter: `${filterYear}`,
      //   top: 500
      // });

      if (loggedUser.Groups[0].Title === "RA_Reader") {
        //  LoginFilter = `EmployeeId/EmpEmail eq ${loggedUser?.User?.Email}`
        // let LoginCurrentUser = projectListItems.filter((i: any) => { return i?.EmployeeId?.EmpEmail === loggedUser?.User?.Email })
        setLink(false)
      }
      else if (loggedUser.Groups[0].Title === "RA_Manager") {
        // let LoginManagerData = projectListItems.filter((i: any) => { return i?.Project_ID?.ProjectManager === loggedUser?.User?.Title })
        setLink(false)

      }
      else if (loggedUser.Groups[0].Title === "RA_Owner") {
        setLink(true)
      }

    } catch (error) {
      console.log("Error....")
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg main-head fixed-top" style={{ borderBottom: "1px solid gray" }}>
        {/* changes css remove shadow class */}
        <div className="container-fluid">
          <div className="d-flex justifcontent-between">
            <a href="https://bluebenz0.sharepoint.com">
              <img
                // src="src/webparts/resourceAllokatorWebpart/assets/original.png"
                // src={'../../SiteAssets/Assets/logo3.png'}
                // src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/NewLogo.png'}
                // src={'../../SiteAssets/Bluebenzlogo.png'}
                src={
                  // "https://bluebenz0.sharepoint.com/sites/BBD_Internal/SiteAssets/Bluebenzlogo.png"
                  "https://bluebenz0.sharepoint.com/sites/BBD_Internal/ResourceAllocation/SiteAssets/Bluebenzlogo.png"
                }
                alt="Logo"
                // width="250"
                height="40"
              />
            </a>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse ms-5"
            id="navbarSupportedContent"
          >
            <ul
              className="navbar-nav me-auto mb-2 mb-lg-0 "
              id="myTab"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className={
                    activeMenu == "Allocation"
                      ? "nav-link btn-active fw-bold border-bottom text-primary"
                      : "nav-link btn-active"
                  }
                  onClick={() => setActiveMenu("Allocation")}
                  aria-current="page"
                  href="#/Allocation"
                >
                  Allocation
                </a>
              </li>
              {
                showLink &&
                <li className="nav-item dropdown">
                  <a
                    className={
                      activeMenu === "Client" || activeMenu === "Masters" || activeMenu === "Employee"
                        ? "nav-link dropdown-toggle fw-bold border-bottom text-primary"
                        : "nav-link dropdown-toggle"
                    }
                    // href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Masters
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <a
                        className={
                          activeMenu === "Client"
                            ? "nav-link btn-active  fw-bold"
                            : "nav-link btn-active"
                        }
                        href={"#/Client"}
                        onClick={() => setActiveMenu("Client")}
                      >
                        Client
                      </a>
                    </li>
                    <li>
                      <a
                        className={
                          activeMenu === "Masters"
                            ? "nav-link btn-active  fw-bold"
                            : "nav-link btn-active"
                        }
                        href={"#/Projects"}
                        onClick={() => setActiveMenu("Masters")}
                        aria-expanded="false"
                      >
                        Projects
                      </a>
                    </li>

                    <li>
                      <a
                        className={
                          activeMenu === "Employee"
                            ? "nav-link btn-active  fw-bold"
                            : "nav-link btn-active"
                        }
                        href={"#/Employee"}
                        onClick={() => setActiveMenu("Employee")}
                      >
                        Employee
                      </a>
                    </li>
                  </ul>
                </li>

              }
              <li className="nav-item">
                <a
                  className={
                    activeMenu == "Bench Report"
                      ? "nav-link btn-active fw-bold border-bottom text-primary"
                      : "nav-link btn-active"
                  }
                  onClick={() => setActiveMenu("Bench Report")}
                  aria-current="page"
                  href="#/BenchReport"
                >
                  BenchReport
                </a>
              </li>
              {showLink &&
                <li className="nav-item">
                  <a
                    className={
                      activeMenu == "Quick Report"
                        ? "nav-link btn-active fw-bold border-bottom text-primary"
                        : "nav-link btn-active"
                    }
                    onClick={() => setActiveMenu("Quick Report")}
                    aria-current="page"
                    href="#/QuickReport"
                  >
                    Quick Report
                  </a>
                </li>
              }

            </ul>
            {/* <div className="btn-group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#229ed9"
                className="bi bi-gear dropdown-toggle point"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                viewBox="0 0 16 16"
                // onClick={() => setShow(true)}
              >
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
              </svg>
              <ul className="dropdown-menu setting-dropdown">
                <li>
                  <a className="dropdown-item point" onClick={() => setShow(true)}>
                    Add Manager
                  </a>
                </li>
                <li>
                  <a className="dropdown-item point" onClick={() => setShows(true)}>
                    Add ProjectLead
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>

        {
          <Modal
            isOpen={show}
            onDismiss={() => setShow(false)}
            isBlocking={true}
            containerClassName="create-event-modal"
          >
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title fs-5">
                  Add Manager<span className="fw-bold"></span>
                </p>
              </div>
              {/* <div>
                <h4 className="fw-bold">Employee Name : Riyaz.Nadaf</h4>
            </div> */}
              <hr />
              <form>
                <div className="modal-body">
                  <div className="row mb-3">
                    {/* <h3>Add Manager</h3>                     */}
                    <div className="col-md-12">
                      <label htmlFor="inputEmail4" className="form-label ">
                        New Manager Name
                      </label>
                      {/* <input
                      //   type="date"
                      className="form-control"
                        onChange={(e) => {
                          onChangeFormVal(e, "ProjectManger");
                        }}
                    /> */}
                      <PeoplePicker
                        onItemsChange={handlepeopleModalPickerData}
                        onBlrCalled={undefined}
                        selectionAriaLabel={undefined}
                        description={""}
                        isDarkTheme={false}
                        environmentMessage={""}
                        hasTeamsContext={false}
                        userDisplayName={""}
                        webURL={""}
                        context={undefined}
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
                    onClick={() => {
                      AddProjectManager()
                    }}
                  >
                    Add
                  </button>
                </footer>
              </form>
            </div>
          </Modal>
        }
        {
          <Modal
            isOpen={shows}
            onDismiss={() => setShows(false)}
            isBlocking={true}
            containerClassName="create-event-modal"
          >
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title fs-5">
                  Add Project Lead<span className="fw-bold"></span>
                </p>
              </div>
              {/* <div>
                <h4 className="fw-bold">Employee Name : Riyaz.Nadaf</h4>
            </div> */}
              <hr />
              <form>
                <div className="modal-body">
                  <div className="row mb-3">
                    {/* <h3>Add Manager</h3>                     */}
                    <div className="col-md-12">
                      <label htmlFor="inputEmail4" className="form-label ">
                        New Project Lead
                      </label>
                      {/* <input
                      //   type="date"
                      className="form-control"
                        onChange={(e) => {
                          onChangeFormVal(e, "ProjectManger");
                        }}
                    /> */}
                      <PeoplePicker
                        onItemsChange={handlepeopleModalProjectLead}
                        onBlrCalled={undefined}
                        selectionAriaLabel={undefined}
                        description={""}
                        isDarkTheme={false}
                        environmentMessage={""}
                        hasTeamsContext={false}
                        userDisplayName={""}
                        webURL={""}
                        context={undefined}
                      />
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
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ms-2 btn-size"
                    onClick={() => {
                      AddProjectLead()
                    }}
                  >
                    Add
                  </button>
                </footer>
              </form>
            </div>
          </Modal>
        }
      </nav>
    </>
  );
};

export default Header;
