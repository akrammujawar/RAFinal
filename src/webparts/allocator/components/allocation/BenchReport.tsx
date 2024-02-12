import { AgGridReact } from "ag-grid-react";
import * as React from "react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useNavigate } from "react-router-dom";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
// import moment from "moment";
import Pagination from "../common/Pagination";
import { useCallback, useEffect, useRef, useState } from "react";
// import { format } from "date-fns";
import moment from "moment";

const BenchReport: React.FunctionComponent<IAllocatorProps> = (props) => {
  const _sharePointServiceProxy: SharePointServiceProxy =
    new SharePointServiceProxy(props?.context, props?.webURL);

  const [rowData, setRowData] = useState<any>([]);
  const [paginatedArrProject, setPaginatedArr] = useState<any>();
  const [FromstartDate, setfromStartDate] = useState<any>("");
  const [benchReports, filterDate] = useState<any>("");
  const [benchemployeecount, setcount] = useState<any>([]);
  const [currentMonthBenchEmployee, setThreeMonthBenchEmployee] = useState<any>([]);
  const [prevTwoWeakBenchEmployee, setprevTwoWeakBenchEmployee] = useState<any>([]);
  const [loginUser, setLoginUser] = useState<any>([]);





  const columnDefs: any = [
    {
      headerName: "Employee Name",
      field: "EmpName",
      filter: true,
      floatingFilter: true,
      width: 200,
      flex: 1,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Department",
      field: "Department",
      filter: true,
      floatingFilter: true,
      width: 200,
      flex: 1,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },

    {
      headerName: "Bench StartDate",
      field: "BenchStartDate",
      filter: true,
      floatingFilter: true,
      width: 200,
      flex: 1,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Bench EndDate",
      field: "BenchEndDate",
      filter: true,
      floatingFilter: true,
      width: 200,
      flex: 1,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
  ];

  const navigate = useNavigate();
  var gridRef: any = useRef();

  useEffect(() => {
    getbenchreport();
  }, []);

  async function getbenchreport() {
    let loggedUser = await _sharePointServiceProxy.getCurrentUser().then((res: any) => {
      return res
    });
    setLoginUser(loggedUser)
    let listFilter: string = '';
    if (loggedUser.Groups.length === 0) {
      listFilter = `EmpEmail eq '${loggedUser?.User?.Email}'`;
    } else if (loggedUser.Groups[0].Title === "RA_Manager") {
      listFilter = `ProjectManager eq '${loggedUser?.User?.Title}'`;
    } else if (loggedUser.Groups[0].Title === "RA_Owner") {
      listFilter = 'EmpName ne null'; // You can set a different filter if needed
    }
   
    let benchreport = await _sharePointServiceProxy.getItems({
      listName: "BenchReport",
      fields: ["EmpName", "Department", "BenchStartDate", "BenchEndDate", "EmpEmail","ProjectManager"],
      filter: `${listFilter}`,
      isRoot: true,
    });
    let items: any = [];
    console.log(benchreport)
    benchreport.forEach((element: any) => {
      items.push({
        EmpName: element?.EmpName,
        Department: element?.Department,
        ProjectManager: element?.ProjectManager,
        BenchStartDate:
          moment(element?.BenchStartDate).format("YYYY-MM-DD") ===
            "Invalid date"
            ? null
            : moment(element?.BenchStartDate).format("YYYY-MM-DD"),
        BenchEndDate:
          moment(element?.BenchEndDate).format("YYYY-MM-DD") === "Invalid date"
            ? null
            : moment(element?.BenchEndDate).format("YYYY-MM-DD"),
      });
    });
    setRowData(items);
    filterDate(items);
    let empbenchcount = items.length;
    setcount(empbenchcount);
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - 15);
    const benchEmployees = items.filter((employee: any) => {
      const benchStartDate = new Date(employee.BenchStartDate);
      return benchStartDate >= previousDate && benchStartDate <= currentDate;
    });
    const prevcountBenchEmployees = benchEmployees.length;
    setprevTwoWeakBenchEmployee(prevcountBenchEmployees);

    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthBenchEmployees = items.filter((employee: any) => {
      const benchStartDate = new Date(employee.BenchStartDate);
      const benchStartMonth = benchStartDate.getMonth() + 1;
      return (
        benchStartMonth === currentMonth ||
        benchStartMonth === currentMonth - 1 ||
        benchStartMonth === currentMonth - 2
      );
    });
    const countBenchEmployees = currentMonthBenchEmployees.length;
    setThreeMonthBenchEmployee(countBenchEmployees);

    // if (loggedUser.Groups.length === 0) {
    //   listFilter = `EmpEmail eq '${loggedUser?.User?.Email}'`;
    // }
    // else if (loggedUser.Groups[0].Title === "RA_Manager") {
    //   // listFilter = `EmpEmail eq '${loggedUser?.User?.Email}'`;
    //   listFilter = `EmpName ne null`
    //  let res=items.filter((i:any)=>{ return i?.ProjectManager === loggedUser?.User?.Title})
    //  setRowData(res)
    // }
    // else if (loggedUser.Groups[0].Title === "RA_Owner") {
    //   listFilter = `EmpName ne null`
    // }

  }



  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const hanldebyStartDate = (e: any) => {
    var fromStartDate =
      e.target.value && e.target.value != undefined
        ? moment(new Date(e.target.value)).format("YYYY-MM-DD")
        : "";
    setfromStartDate(fromStartDate);
  };

  const hanldebyEndDate = (e: any) => {
    var toEndDate =
      e.target.value && e.target.value != undefined
        ? moment(new Date(e.target.value)).format("YYYY-MM-DD")
        : "";
    filteredData(toEndDate);
  };

  function filteredData(toEndDate: any) {
    setRowData(
      benchReports && FromstartDate !== "" && toEndDate !== ""
        ? benchReports?.filter((d: any, arr: any) => {
          return (
            new Date(d?.BenchStartDate) >= new Date(FromstartDate) &&
            new Date(d?.BenchStartDate) <= new Date(toEndDate) &&
            d
          );
        })
        : benchReports && FromstartDate !== "" && toEndDate !== ""
          ? benchReports?.filter((d: any) => {
            return (
              new Date(d?.BenchStartDate) >= new Date(FromstartDate) &&
              new Date(d?.BenchStartDate) <= new Date(toEndDate) &&
              d
            );
          })
          : benchReports
    );
  }

  function getAllEmployee() {
    setRowData(benchReports)


  }
  function getpreviousWeak() {
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - 15);
    const benchEmployees = benchReports.filter((employee: any) => {
      const benchStartDate = new Date(employee.BenchStartDate);
      return benchStartDate >= previousDate && benchStartDate <= currentDate;
    });
    // const prevcountBenchEmployees = benchEmployees.length;  
    // setprevTwoWeakBenchEmployee(prevcountBenchEmployees);
    setRowData(benchEmployees)

  }
  function getThreeMonth() {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentMonthBenchEmployees = benchReports.filter((employee: any) => {
      const benchStartDate = new Date(employee.BenchStartDate);
      const benchStartMonth = benchStartDate.getMonth() + 1;
      return (
        benchStartMonth === currentMonth ||
        benchStartMonth === currentMonth - 1 ||
        benchStartMonth === currentMonth - 2
      );
    });
    //const countBenchEmployees = currentMonthBenchEmployees.length;
    //setcurrentMonthBenchEmployee(countBenchEmployees);
    setRowData(currentMonthBenchEmployees);
    // current month employee on bench
    //  const currentDate = new Date();
    //  const currentMonth = currentDate.getMonth() + 1;
    //  const currentMonthBenchEmployees = benchReports.filter((employee: any) => {
    //    const benchStartDate = new Date(employee.BenchStartDate);
    //    const benchStartMonth = benchStartDate.getMonth() + 1;
    //    return benchStartMonth === currentMonth;
    //  });
    //  const countBenchEmployees = currentMonthBenchEmployees.length;   
    //  setcurrentMonthBenchEmployee(countBenchEmployees);
    //  setRowData(currentMonthBenchEmployees)


  }
  return (
    <div>
      <div className="container-fluid ">
        <div className="row mt-4 pt-2 mx-0">
          <div className="col-6">
            <div className="d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="42"
                fill="#000000"
                className="bi bi-person-lines-fill text-white pt-1"
                viewBox="0 0 16 16"
              >
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
              </svg>

              <div>
                <h4 className="pt-2 ms-2">Bench Report</h4>
                <h3 className="bredcram-subhead ms-2 ">
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
                    className="cursor-pointer "
                    onClick={() => navigate("/BenchReport")}
                  >
                    Bench Report
                  </span>
                </h3>
              </div>
            </div>
          </div>
          <div className="col-6 text-end">
            <button
              className="btn btn-primary mb-2 pt-2 ms-1 me-1 "
              onClick={onBtnExport}
            >
              Download Bench Report
            </button>
          </div>
        </div>
      </div>
      {/* Cards */}

      <div className="container-fluid">
        {/* <div className="row">
          Hello</div>       */}
        <div className="row">
          <div className="card shadow">
            <div className="card-body ">
              <div className="row">
                <div className={(loginUser && loginUser.Groups && loginUser.Groups.length > 0 && loginUser.Groups[0].Title === "RA_Manager")
                ||(loginUser && loginUser.Groups && loginUser.Groups.length === 0) ? "col-5 row mb-3 d-none" : "col-5 row mb-3"}>

                  <div className="col-4 pointer" onClick={(e) => getAllEmployee()}>
                    <div className="BenchCards card py-3">
                      <div className="benchcount">
                        {benchemployeecount ? benchemployeecount : 0}
                      </div>
                      <p className="parastyle">#All Bench</p>
                    </div>
                  </div>
                  <div
                    className="col-4 pointer" onClick={(e) => getpreviousWeak()}>
                    <div className="BenchCards card py-3">
                      <div className="benchcount">
                        {prevTwoWeakBenchEmployee
                          ? prevTwoWeakBenchEmployee
                          : 0}
                      </div>
                      <p className="parastyle">#Last Two Weeks </p>

                    </div>
                  </div>

                  <div
                    className="col-4 pointer" onClick={(e) => getThreeMonth()} >
                    <div className="BenchCards card py-3">
                      <div className="benchcount">
                        {currentMonthBenchEmployee
                          ? currentMonthBenchEmployee
                          : 0}
                      </div>
                      <p className="parastyle">
                        #Last Three Month
                      </p>

                    </div>
                  </div>
                </div>
                <div className={(loginUser && loginUser.Groups&& loginUser.Groups.length > 0 && loginUser.Groups[0].Title === "RA_Manager")
                || (loginUser && loginUser.Groups && loginUser.Groups.length === 0)
                ? "col-7 align-items-center d-flex justify-content-end pe-0 d-none" : "col-7 align-items-center d-flex justify-content-end pe-0"}>
                  <div className="form-floating ms-2">
                    <input
                      type="date"
                      className="form-control customInput w-auto mb-1 mx-3"
                      placeholder="Select Start Date"
                      onChange={(e) => hanldebyStartDate(e)}
                    />
                    <label className="pt-2 mx-3" htmlFor="floatingInputValue">
                      Select Start Date
                    </label>
                  </div>
                  <div className="form-floating ms-2">
                    <input
                      type="date"
                      className="form-control customInput w-auto mb-1"
                      placeholder="Select End Date"
                      onChange={(e) => hanldebyEndDate(e)}
                    />
                    <label className="pt-2 mx-3" htmlFor="floatingInputValue">
                      Select End Date
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="ag-theme-alpine" style={{ height: 354 }}>
                  <AgGridReact
                    ref={gridRef}
                    rowData={paginatedArrProject}
                    columnDefs={columnDefs}
                  //pagination={true}
                  ></AgGridReact>
                </div>
                <Pagination
                  orgData={rowData}
                  setNewFilterarr={setPaginatedArr}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchReport;
