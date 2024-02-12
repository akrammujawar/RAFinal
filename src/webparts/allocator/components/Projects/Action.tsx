import { Modal } from "@fluentui/react";
import * as React from "react";
import { useState } from "react";
// import { ITimesheetProps } from '../ITimesheetProps';
// import AlertBox from './AlertBox';
import { IAllocatorProps } from "../IAllocatorProps";
import SharepointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { ComboBox, IComboBoxStyles } from "@fluentui/react";
import _ from "lodash";
import SuccessModal from "../common/SuccessModal";

const action: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);
  const [show, setShow] = useState<boolean>(false);
  const [domainNames, setDomainNames] = useState<any>([]);
  const [popupData, setPopupData] = useState<any>();
  const [techNamesData, setTechNames] = useState<any>([]);
  const [geographyNames, setGeographyNames] = useState<any>([]);
  const [updateDetails, setUpdateDetails] = useState<any>({}); 
  const [employeelist, setemployeelist] = useState<any>();
  // const [employeeId, setemployeeId] = useState<any>();
  const [leadlist,setLeadList]=useState<any>();
  const [updatemodal, setUpdateModal] = useState<string>("");
  // console.log(employeeId) 
  const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
  const [Clients, setclient] = useState([]);
// console.log("Clients", Clients);

  React.useEffect(() => {
    getClients()
    domainNamesFunc();
    techNames();
    GeographyNames();
    getProjectLeadTypeahed();
    getProjectManagerTypeahed();
  }, []);

//   get ProjectManagerName //
async function getProjectManagerTypeahed() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "ProjectManager",
      fields: ["ProjectManger/Title", "ID"],
      isRoot: true,
      expandFields:["ProjectManger"]
    });
    // console.log(items);
    // setemployeeId(items);
    let partialArr = items.map((e: any) => ({
      key: e?.ProjectManger?.Title,
      text: e?.ProjectManger?.Title,
    }));
    setemployeelist(_.uniqWith(partialArr, _.isEqual));
    // console.log("Projectmanager...", employeelist);
  }

  async function getProjectLeadTypeahed() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "ProjectLead",
      fields: ["ProjectLead/Title"],
      isRoot: true,
      expandFields:["ProjectLead"]
    });
    // console.log(items);
    // setemployeeId(items);
    let partialArr = items.map((e: any) => ({
      key: e?.ProjectLead?.Title,
      text: e?.ProjectLead?.Title,
    }));
    setLeadList(_.uniqWith(partialArr, _.isEqual));
    // console.log("Projectmanager...", employeelist);
  }

  const handleClick = (modalData: any) => {
    setPopupData(modalData);
    setShow(true);
  };

  const domainNamesFunc = async () => {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Domain",
      fields: ["ID", "Name"],
      isRoot: true,
    });
    setDomainNames(items);
  };
 

  const techNames = async () => {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Technology",
      fields: ["ID", "Name"],
      isRoot: true,
    });
    setTechNames(items);
    // console.log("Tech Names....",techNamesData)
  };

  const GeographyNames = async () => {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Geography",
      fields: ["ID", "Name"],
      isRoot: true,
    });
    setGeographyNames(items);
    // console.log("geography...",geographyNames)
  };

  // get data from client
  async function getClients(){
    let clients:any=[]
    let items = await _SharepointServiceProxy.getItems({
        listName: "Client",
        fields: ["Name"],
        isRoot: true,  
        orderedColumn:"Created" ,   
      },false);   

      items.forEach((element: any) => {
        clients.push({
          Name: element?.Name
        })
       
    });
     setclient(clients);
}



  const onChangeFormVal = (e: any, colName: string) => {
    colName === 'ProjectManager' ||  colName === 'ProjectLeadName' || colName === "ClientNames" ? 
    setUpdateDetails((prev: any) => {
      return { ...prev, [colName]: e.key};
    }) :
    setUpdateDetails((prev: any) => {
      return { ...prev, [colName]: e.target.value };
    });
    // setUpdateDetails((prev: any) => {
    //   return { ...prev, [colName]: e.target.value };
    // });
  };

  const getDropDownVal = (e: any, colName: string) => {
    switch (colName) {
      case "Domainid":
        let getDomainID = domainNames?.find((itr: any) => {
          if (itr?.Name === e.target.value) {
            return itr;
          }
          // console.log("getdomainid.....",getDomainID)
        });
        setUpdateDetails((prev: any) => {
          return { ...prev, DomainId: getDomainID.ID };
        });
        break;
      case "Technologyid":
        let getTechnologyID = techNamesData?.find((itr: any) => {
          if (itr.Name === e.target.value) {
            return itr;
          }
        });
        setUpdateDetails((prev: any) => {
          return { ...prev, TechnologyId: getTechnologyID.ID };
        });
        break;
      case "Geographyid":
        let getGeoID = geographyNames?.find((itr: any) => {
          if (itr.Name === e.target.value) {
            return itr;
          }
        });
        setUpdateDetails((prev: any) => {
          return { ...prev, GeographyId: getGeoID.ID };
        });
        break;
    }
  };

  const update = (itemId: number) => {
    _SharepointServiceProxy
      .updateItem("Project", itemId, updateDetails, [], true).then(() => {
         setShow(false);
        setUpdateModal("ProjectUpdated");        
      });     
  };

  return (
    <div>
      <svg
        onClick={() => {handleClick(props?.data),props?.data}}
         xmlns="http://www.w3.org/2000/svg"
          width="16" height="16" 
          fill="#229ed9"
           className="bi bi-pencil-square edit-pencil ms-2 mb-1" 
           viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg>
      {/* </TooltipHost> */}

      {/* {openModal === 'updatedSuccessfully' && <AlertBox setModal={setOpenModal} message={"Updated Successfully"} showModal={true} alertType={'success'}/>} */}

      {updatemodal === "ProjectUpdated" && (
                  <SuccessModal
                    pageType={"success"}
                    setModal={setUpdateModal}
                    message={"Project Details Updated Successfully"}
                    showModal={true}
                  />
                )}
      <>
        <Modal
          isOpen={show}
          onDismiss={() => setShow(false)}
          isBlocking={true}
          containerClassName="create-event-modal"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Update Project Details</h1>
            </div>
            <hr />
            <form>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Project Name
                    </label>
                    <input
                      defaultValue={popupData?.ProjectName}
                      type="text"
                      className="form-control"
                      onChange={(e) => {
                        onChangeFormVal(e, "ProjectName");
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Project Manager
                    </label>                  
                    <ComboBox 
                    defaultValue={popupData?.ProjectManager}                           
                              placeholder="Project Manager"
                              defaultSelectedKey={popupData?.ProjectManager}
                              options={employeelist}
                              styles={comboBoxStyles}
                              allowFreeInput
                              autoComplete="on"
                            //   onChange={onChangeProjectLeadUpdateTypeHead}
                              onChange={(e, val) => {
                                onChangeFormVal(val, "ProjectManager");
                              }}
                            />
                  </div>
                 
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Project Lead
                    </label>
                    {/* <div className="input-group">
                      <select
                        defaultValue={popupData?.ClientName?.Name}
                        className="form-select"
                        onChange={(e) => getDropDownVal(e, "ClientNameid")}
                      >
                        {clientNameList?.map((itr: any) => {
                          return <option value={itr?.Name}>{itr?.Name}</option>;
                        })}
                      </select>
                    </div> */}
                    <ComboBox 
                    defaultValue={popupData?.ProjectLeadName}                           
                              placeholder="Project Lead"
                              // defaultSelectedKey={popupData?.ProjectLead?.ID}
                              defaultSelectedKey={popupData?.ProjectLeadName}
                              options={leadlist}
                              styles={comboBoxStyles}
                              allowFreeInput
                              autoComplete="on"
                            //   onChange={onChangeProjectLeadUpdateTypeHead}
                              onChange={(e,val) => {
                                onChangeFormVal(val, "ProjectLeadName");
                              }}
                            />
                  </div>
                </div>

                <div className="row mb-3">
                <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Client
                    </label>
                    <div className="input-group">
                      {/* <input
                        defaultValue={popupData?.ClientNames}
                        className="form-control"
                        onChange={(e) => onChangeFormVal(e, "ClientNames")}
                      /> */}
                         <select
                                className="form-select"
                                name="Client"
                                onChange={(e) => onChangeFormVal(e, "ClientNames")}
                                
                              >
                                
                              
                                {Clients?.map((itr: any, i: any) => {
                                  return (
                                    <>
                                    <option selected value={popupData?.ClientNames}  >
                                  {popupData?.ClientNames} 
                                </option>
                                      <option value={itr.Name}>
                                        {itr?.Name}
                                      </option>
                                    </>
                                  );
                                })}
                                </select>
                    </div>
               </div>
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Start Date
                    </label>
                    <input
                      defaultValue={popupData?.StartDate?.slice(0, 10)}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        onChangeFormVal(e, "StartDate");
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      End Date
                    </label>
                    <input
                      defaultValue={popupData?.EndDate?.slice(0, 10)}
                      type="date"
                      className="form-control"
                      onChange={(e) => {
                        onChangeFormVal(e, "EndDate");
                      }}
                    />
                  </div>                  
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Project Type
                    </label>
                    <input
                        className="form-control"
                        defaultValue={popupData?.ProjectsType}
                        onChange={(e) => {
                          onChangeFormVal(e, "ProjectsType");
                        }}
                      />
                        {/* <option hidden value={0}>
                          --Select--
                        </option>
                        <option value="FP">FP</option>
                        <option value="T&M">T&M</option>
                      </input> */}
                  </div>
                  <div className="col-md-4">
                    <p className="form-label ">Planned Efforts</p>
                    <input
                      defaultValue={popupData?.PlannedEfforts}
                      type="text"
                      onChange={(e) => {
                        onChangeFormVal(e, "PlannedEfforts");
                      }}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Actual Efforts
                    </label>
                    <input
                      defaultValue={popupData?.ActualEfforts}
                      type="text"
                      onChange={(e) => {
                        onChangeFormVal(e, "ActualEfforts");
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Domain
                    </label>
                    <div className="input-group mb-3">
                      <select
                        defaultValue={popupData?.Domain?.Name}
                        className="form-select"
                        onChange={(e) => getDropDownVal(e, "Domainid")}
                      >
                        <option hidden value="0">
                                  --Select--
                                </option>
                        {domainNames?.map((itr: any) => {
                          return <option value={itr?.Name}>{itr?.Name}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Technology
                    </label>
                    <div className="input-group mb-3">
                      <select
                        defaultValue={popupData?.Technology?.Name}
                        className="form-select"
                        onChange={(e) => getDropDownVal(e, "Technologyid")}
                      >
                        <option hidden value="0">
                                  --Select--
                                </option>
                        {techNamesData?.map((itr: any) => {
                          return <option value={itr?.Name}>{itr?.Name}</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Geography
                    </label>
                    <div className="input-group">
                      <select
                        defaultValue={popupData?.Geography?.Name}
                        className="form-select"
                        onChange={(e) => getDropDownVal(e, "Geographyid")}
                      >
                        <option hidden value="0">
                                  --Select--
                                </option>
                        {geographyNames?.map((itr: any) => {
                          return <option value={itr?.Name}>{itr?.Name}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                <div className="col-md-4">
                    <label htmlFor="inputEmail4" className="form-label ">
                      Status
                    </label>
                    <div className="input-group mb-3">
                      <select
                        className="form-select"
                        defaultValue={popupData?.Status}
                        onChange={(e) => {
                          onChangeFormVal(e, "Status");
                        }}
                      >
                        <option hidden >
                          --Select--
                        </option>
                        <option value="Not Started">Not Started</option>
                        <option value="Completed">Completed</option>
                        <option value="InProgress">InProgress</option>
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
      </>
    </div>
  );
};

export default action;
