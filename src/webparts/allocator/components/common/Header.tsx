import { Modal } from "office-ui-fabric-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { IAllocatorProps } from "../IAllocatorProps";
import SharepointServiceProxy from "./sp-proxy/SharepointServiceProxy";
import PeoplePicker from "./PeoplePicker";
// const URL = window.location.href;
// const actTab = URL.slice(URL.lastIndexOf("/") + 1);

const Header: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);
  const [show, setShow] = useState<boolean>(false);
  const [shows, setShows] = useState<boolean>(false);
  const [showLink, setLink] = useState<any>(false)
  const [projectdata, setprojectdata] = useState<any>();
  const [managerdata, setManagerdata] = useState<any>();
  const [currentLink, setCurrentLink] = useState(window.location.hash);
  
  
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
     

      if (loggedUser.Groups[0].Title === "RA_Reader") {
        setLink(false)
      }
      else if (loggedUser.Groups[0].Title === "RA_Manager") {
        setLink(false)
      }
      else if (loggedUser.Groups[0].Title === "RA_Owner") {
        setLink(true)
      }

    } catch (error) {
      console.log("Error....")
    }
  }


  // Nav Bar highlight's code
  useEffect(() => {
    // Update currentLink when the URL changes
    const handleHashChange = () => {
        setCurrentLink(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    // Cleanup the event listener when the component unmounts
    return () => {
        window.removeEventListener('hashchange', handleHashChange);
    };
}, []);


  return (
    <>
      <nav className="navbar navbar-expand-lg main-head fixed-top" style={{ borderBottom: "1px solid gray" }}>
        {/* changes css remove shadow class */}
        <div className="container-fluid">
          <div className="d-flex justifcontent-between">
            <a href="https://bluebenz0.sharepoint.com">
              <img
                src={
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
                    currentLink == "#/Allocation" ||  currentLink == ""
                      ? "nav-link btn-active fw-bold border-bottom text-primary"
                      : "nav-link btn-active"
                  }
                  // onClick={() => setActiveMenu("Allocation")}
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
                      currentLink === "#/Client" || currentLink === "#/Projects" || currentLink === "#/Employee"
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
                          currentLink === "#/Client"
                            ? "nav-link btn-active  fw-bold"
                            : "nav-link btn-active"
                        }
                        href={"#/Client"}
                        // onClick={() => setActiveMenu("Client")}
                      >
                        Client
                      </a>
                    </li>
                    <li>
                      <a
                        className={
                          currentLink === "#/Projects"
                            ? "nav-link btn-active  fw-bold"
                            : "nav-link btn-active"
                        }
                        href={"#/Projects"}
                        // onClick={() => setActiveMenu("Masters")}
                        aria-expanded="false"
                      >
                        Projects
                      </a>
                    </li>

                    <li>
                      <a
                        className={
                          currentLink === "#/Employee"
                            ? "nav-link btn-active  fw-bold"
                            : "nav-link btn-active"
                        }
                        href={"#/Employee"}
                        // onClick={() => setActiveMenu("Employee")}
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
                    currentLink == "#/BenchReport"
                      ? "nav-link btn-active fw-bold border-bottom text-primary"
                      : "nav-link btn-active"
                  }
                  // onClick={() => setActiveMenu("Bench Report")}
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
                      currentLink == "#/QuickReport"
                        ? "nav-link btn-active fw-bold border-bottom text-primary"
                        : "nav-link btn-active"
                    }
                    // onClick={() => setActiveMenu("Quick Report")}
                    aria-current="page"
                    href="#/QuickReport"
                  >
                    Quick Report
                  </a>
                </li>
              }

            </ul>
           
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
             
              <hr />
              <form>
                <div className="modal-body">
                  <div className="row mb-3">
                    {/* <h3>Add Manager</h3>                     */}
                    <div className="col-md-12">
                      <label htmlFor="inputEmail4" className="form-label ">
                        New Manager Name
                      </label>
                    
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
              
              <hr />
              <form>
                <div className="modal-body">
                  <div className="row mb-3">
                    {/* <h3>Add Manager</h3>                     */}
                    <div className="col-md-12">
                      <label htmlFor="inputEmail4" className="form-label ">
                        New Project Lead
                      </label>
                     
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
