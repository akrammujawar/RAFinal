import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import moment from "moment";
import Pagination from "../common/Pagination";
import { ColDef, } from 'ag-grid-community';
// import { parse } from "date-fns";

const QuickReport: React.FunctionComponent<IAllocatorProps> = (props: any) => {

  const _sharePointServiceProxy: SharePointServiceProxy = new SharePointServiceProxy(props?.context, props?.webURL);
  const [ProjectsAllocation, setProjectsAllocation] = useState([]);
  const [paginatedArrProject, setPaginatedArr] = useState<any>()
  const navigate = useNavigate();


  const [leadLink, setLeadLink] = useState<any>(false)

  console.log(leadLink)
  useEffect(() => {
    async function getAuthorized() {
      var currentUser = await _sharePointServiceProxy.getCurrentUser();
      if (currentUser.Groups[0]?.Title === "RA_Owner") {
        setLeadLink(true)
      }
      else {
        // alert("You are not authorised for Quick report");
        setLeadLink(false)
        if (currentUser.Groups[0]?.Title !== "RA_Owner") {
          window.location.replace("https://bluebenz0.sharepoint.com/sites/BBD_Internal/ResourceAllocation/_layouts/15/workbench.aspx#/Allocation")
        }
      }
    }
    getAuthorized()
  }, [])


  useEffect(() => {
    getProjectAllocationListData("")
  }, []);

  // get ProjectAllocation 
  async function getProjectAllocationListData(year: any) {
    let filterYear: string = ''
    if (year) {
      filterYear = `Year eq ${year}`;
    } else {
      filterYear = `Year eq '${new Date().getFullYear()}'`;
    }
    let projectListItems = await _sharePointServiceProxy.getItems({
      listName: "ProjectsAllocations",
      fields: ["ID",
        "Project_ID/ID",
        "Project_ID/ProjectName",
        "Project_ID/ClientNames",
        "Project_ID/ProjectsType",
        "Project_ID/StartDate",
        "Project_ID/EndDate",
        "EmployeeId/ID",
        "EmployeeId/Name",
        "EmployeeId/DeptName",
        "EmployeeId/Employee_Id",
        "EmployeeId/Primary_Skills",
        "EmployeeId/Designation",
        // "Utilization", "Billability",
        "Year",
        "Weak1", "Weak2", "Weak3", "Weak4", "Weak5", "Weak6", "Weak7", "Weak8", "Weak9", "Weak10",
        "Weak11", "Weak12", "Weak13", "Weak14", "Weak15", "Weak16", "Weak17", "Weak18", "Weak19", "Weak20",
        "Weak21", "Weak22", "Weak23", "Weak24", "Weak25", "Weak26", "Weak27", "Weak28", "Weak29", "Weak30",
        "Weak31", "Weak32", "Weak33", "Weak34", "Weak35", "Weak36", "Weak37", "Weak38", "Weak39", "Weak40",
        "Weak41", "Weak42", "Weak43", "Weak44", "Weak45", "Weak46", "Weak47", "Weak48", "Weak49", "Weak50",
        "Weak51", "Weak52"

      ],
      expandFields: ["Project_ID", "EmployeeId"],
      isRoot: true,
      filter: filterYear,
      top: 5000,
    });
    setProjectsAllocation(projectListItems)
  }



  // Weeks For the Tabel Header //
  const startdates = (weekno: number) => {
    let startdateofweek = moment(moment().week(weekno))
      .startOf("isoWeek")
      .format("MM/DD");
    let endDateofWeek = moment(moment(moment().week(weekno)).endOf("isoWeek"))
      // .subtract(2, "days")
      .format("MM/DD");
    // console.log(`${startdateofweek}, ${endDateofWeek}`);

    return `${startdateofweek} - ${endDateofWeek}`;
  };

  const defaultColDef = useMemo<ColDef>(() => { return { resizable: true, }; }, []);

  const columnDefs: any = [
    {
      headerName: "EmployeeName",
      field: "EmployeeName",
      valueGetter: (params: any) => {
        return params?.data.EmployeeId?.Name
      },
      pinned: "left",
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },

    // weaks 
    {
      headerName: `WK1 ${startdates(1)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak1).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" }

    },
    {
      headerName: `WK2 ${startdates(2)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak2).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" }

    },
    {
      headerName: `WK3 ${startdates(3)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak3).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK4 ${startdates(4)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak4).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK5 ${startdates(5)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak5).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK6 ${startdates(6)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak6).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK7 ${startdates(7)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak7).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK8 ${startdates(8)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak8).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK9 ${startdates(9)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak9).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK10 ${startdates(10)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak10).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK11 ${startdates(11)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak11).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK12 ${startdates(12)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak12).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK13 ${startdates(13)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak13).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK14 ${startdates(14)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak14).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK15 ${startdates(15)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak15).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK16 ${startdates(16)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak16).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK17 ${startdates(17)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak17).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },

    {
      headerName: `WK18 ${startdates(18)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak18).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK19 ${startdates(19)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak19).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK20 ${startdates(20)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak20).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK21 ${startdates(21)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak21).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK22 ${startdates(22)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak22).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK23 ${startdates(23)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak23).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK24 ${startdates(24)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak24).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK25 ${startdates(25)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak25).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK26 ${startdates(26)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak26).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK27 ${startdates(27)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak27).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK28 ${startdates(28)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak28).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK29 ${startdates(29)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak29).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK30 ${startdates(30)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak30).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK31 ${startdates(31)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak31).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK32 ${startdates(32)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak32).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK33 ${startdates(33)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak33).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK34 ${startdates(34)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak34).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK35 ${startdates(35)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak35).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK36 ${startdates(36)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak36).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK37 ${startdates(37)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak37).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK38 ${startdates(38)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak38).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK39 ${startdates(39)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak39).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK40 ${startdates(40)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak40).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK41 ${startdates(41)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak41).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK42 ${startdates(42)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak42).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK43 ${startdates(43)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak43).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK44 ${startdates(44)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak44).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK45 ${startdates(45)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak45).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK46 ${startdates(46)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak46).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK47 ${startdates(47)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak47).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK48 ${startdates(48)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak48).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK49 ${startdates(49)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak49).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK50 ${startdates(50)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak50).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK51 ${startdates(51)}`,
      headerClass: "customcss",
      width: 165,
      cellStyle: (params: any) =>
        ((params?.data?.Weak51).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },
    {
      headerName: `WK52 ${startdates(52)}`,
      headerClass: "customcss",
      width: 120,
      cellStyle: (params: any) =>
        ((params?.data?.Weak52).length > 2)
          ? { backgroundColor: "#73b973", borderColor: "#efefef" }
          : { backgroundColor: "#f09c9c", borderColor: "#efefef" },

    },





  ];






  return (
    <>
      <div className="container-fluid">
        <div className="main-container">
          <div className="row mt-4 pt-2 mx-0">
            <div className="col-6">
              <div className="d-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="42"
                  fill="#000000"
                  className="bi bi-file-person text-white pt-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                  <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
                <div>
                  <h4 className="pt-2 ms-2">
                    Quick Report
                  </h4>
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
                      onClick={() => navigate("/QuickReport")}
                    >
                      Allocation
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <><div>
            <div className="row">
              <div className="col-md-12">
                <div className="card shadow">
                  <div className="card-body ">
                    <div className="align-items-center d-flex justify-content-end">
                      <select name="select" id="select" className="form-control w-auto mb-1" onChange={(e) => getProjectAllocationListData(e.target.value)}>
                        <option value={`${new Date().getFullYear()}`}>Select Year</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>

                      </select>
                    </div>

                    <div className="row">
                      <div
                        className="ag-theme-alpine"
                        style={{ height: 428 }}
                      >
                        <AgGridReact
                          rowData={paginatedArrProject}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                        // onCellValueChanged={weakCellValueChanged}
                        ></AgGridReact>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div>
              <Pagination
                orgData={ProjectsAllocation}
                setNewFilterarr={setPaginatedArr}
              />

            </div>

          </>

        </div>
      </div>
    </>
  );
};

export default QuickReport;
