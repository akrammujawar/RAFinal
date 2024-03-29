import * as React from "react";
import {
  //  useCallback,
  useEffect, useMemo, useRef, useState
} from "react";
import { useNavigate } from "react-router-dom";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import moment from "moment";
// import { ComboBox, Modal } from "office-ui-fabric-react";
import Pagination from "../common/Pagination";
import SuccessModal from "../common/SuccessModal";
import { ColDef, } from 'ag-grid-community';
import { ComboBox, IComboBoxStyles, Modal } from "@fluentui/react";
// import { parse } from "date-fns";

const Allocation: React.FunctionComponent<IAllocatorProps> = (props: any) => {

  const _sharePointServiceProxy: SharePointServiceProxy = new SharePointServiceProxy(props?.context, props?.webURL);
  const [ProjectsAllocation, setProjectsAllocation] = useState([]);
  const [paginatedArrProject, setPaginatedArr] = useState<any>()
  const [show, setShow] = useState<boolean>(false);
  const [showProjectAllocation, setShowProjectAllocation] = useState<boolean>(false);
  const navigate = useNavigate();
  // const [updateItem, setupdateItem] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [ProjectWithEmployee, setProjectWithEmployee] = useState({ Project_IDId: "", EmployeeIdId: "",ReportingManager1:"", Year: `${new Date().getFullYear()}` });
  const [updatemodal, setUpdateModal] = useState<string>("");
  const [getprojectEmp, setProjectEmployee] = useState<any>([]);
  const [getselectedEmp, setselectedEmp] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState<any>([]);
  // console.log(currentUser)
  // const [Data, setData] = useState<any>([{Billibility:"" , Utilization:""}]);




  useEffect(() => {
    getProjectAllocationListData("")
    getAllProject()
    getAllEmployee()
  }, []);

  // get ProjectAllocation 
  async function getProjectAllocationListData(year: any) {
    try {
      let loggedUser = await _sharePointServiceProxy.getCurrentUser().then((res: any) => {
        return res
      });
      setCurrentUser(loggedUser)
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
          "Project_ID/ProjectManager",
          "EmployeeId/ID",
          "EmployeeId/Name",
          "EmployeeId/EmpEmail",
          "EmployeeId/DeptName",
          "EmployeeId/Employee_Id",
          "EmployeeId/Primary_Skills",
          "EmployeeId/Designation",
          "Year",
          "ReportingManager1",
          "Weak1", "Weak2", "Weak3", "Weak4", "Weak5", "Weak6", "Weak7", "Weak8", "Weak9", "Weak10",
          "Weak11", "Weak12", "Weak13", "Weak14", "Weak15", "Weak16", "Weak17", "Weak18", "Weak19", "Weak20",
          "Weak21", "Weak22", "Weak23", "Weak24", "Weak25", "Weak26", "Weak27", "Weak28", "Weak29", "Weak30",
          "Weak31", "Weak32", "Weak33", "Weak34", "Weak35", "Weak36", "Weak37", "Weak38", "Weak39", "Weak40",
          "Weak41", "Weak42", "Weak43", "Weak44", "Weak45", "Weak46", "Weak47", "Weak48", "Weak49", "Weak50",
          "Weak51", "Weak52"

        ],
        expandFields: ["Project_ID", "EmployeeId"],
        isRoot: true,
        filter: `${filterYear}`,
        top: 500
      });

      let allEmployee = await _sharePointServiceProxy.getItems({
        listName: "Employee",
        fields: ["ID",
          "Name",
          "Active",
          "Employee_Id",
          "Manager1/Title",
          "Manager1/ID",
          "Manager2/Title",],
        expandFields: ["Manager1", "Manager2"],
        // filter: `Active eq 'Yes'`,
        isRoot: true
      });

      if (loggedUser.Groups.length === 0) {
        //  LoginFilter = `EmployeeId/EmpEmail eq ${loggedUser?.User?.Email}`
        let LoginCurrentUser = projectListItems.filter((i: any) => { return i?.EmployeeId?.EmpEmail === loggedUser?.User?.Email })
        setProjectsAllocation(LoginCurrentUser)
        setShowProjectAllocation(false)
      }
      else if (loggedUser.Groups[0].Title === "RA_Manager") {
        let employeeFilter= allEmployee.filter((emp:any)=>{return emp?.Manager1?.Title === loggedUser?.User?.Title})
        
        let newarray: any[] = []; 
        employeeFilter?.forEach((emp: any) => {
          let projectAllocations = projectListItems.filter((project: any) => {
            return project?.EmployeeId?.Employee_Id === emp?.Employee_Id;
          });
          console.log(projectAllocations)
          newarray.push(...projectAllocations)
        });
        setProjectsAllocation(newarray)

        //Below is using one array filter projectallocation
        // let LoginManagerData = projectListItems.filter((i: any) => { return i?.ReportingManager1 === loggedUser?.User?.Title })
        // setProjectsAllocation(LoginManagerData)
        setShowProjectAllocation(false)

      }
      else if (loggedUser.Groups[0].Title === "RA_Owner") {
        setProjectsAllocation(projectListItems)
        setShowProjectAllocation(true)
      }
      // else{
      //   let LoginCurrentUser = projectListItems.filter((i: any) => { return i?.EmployeeId?.EmpEmail === loggedUser?.User?.Email })
      //     setProjectsAllocation(LoginCurrentUser)
      //     setShowProjectAllocation(false)
      // }

    } catch (error) {
      console.log("Error....")
    }
  }


  // get Project Details
  async function getAllProject() {
    let projets: any = [];
    let allProjects = await _sharePointServiceProxy.getItems({
      listName: "Project",
      fields: ["ID", "ProjectName"],
      isRoot: true
    });
    allProjects.forEach((element: any) => {
      projets.push({
        key: element.ID,
        text: element.ProjectName
      }
      );
    })
    setAllProjects(projets)
  }

  // get All Employee Details
  async function getAllEmployee() {
    let employee: any = [];
    let allEmployee = await _sharePointServiceProxy.getItems({
      listName: "Employee",
      fields: ["ID",
        "Name",
        "Active",
        "Manager1/Title",
        "Manager1/ID",
        "Manager2/Title",],
      expandFields: ["Manager1", "Manager2"],
      filter: `Active eq 'Yes'`,
      isRoot: true
    });
    allEmployee.forEach((element: any) => {
      const manager1Title = element.Manager1 ? element.Manager1.Title : null;
      employee.push({
        key: element.ID,
        text: element.Name,
        Manager1: manager1Title,
      }
      );
    })
    setallEmployee(employee)

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
    // {
    //   headerName: "EmployeeID",
    //   field: "EmployeeID",
    //   valueGetter: (params: any) => {
    //     return params?.data.EmployeeId?.Employee_Id
    //   },
    //   pinned: "left",
    //   width: 100,
    //   sortable: true,
    //   filter: true,
    //   floatingFilter: true,
    //   flex: 1,
    //   wrapHeaderText: true,
    // },
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
    {
      headerName: "Designation",
      field: "Designation",
      valueGetter: (params: any) => {
        return params?.data.EmployeeId?.Designation
      },
      pinned: "left",
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },
    {
      headerName: "Primary_Skills",
      field: "Primary_Skills",
      valueGetter: (params: any) => {
        return params?.data.EmployeeId?.Primary_Skills
      },
      pinned: "left",
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },
    // {
    //   headerName: "Practice",
    //   field: "Practice",
    //   valueGetter: (params: any) => {
    //     return params?.data.EmployeeId?.DeptName
    //   },
    //   pinned: "left",
    //   width: 120,
    //   sortable: true,
    //   filter: true,
    //   floatingFilter: true,
    //   flex: 1,
    //   wrapHeaderText: true,
    // },
    {
      headerName: "ProjectName",
      field: "ProjectName",
      valueGetter: (params: any) => {
        return params?.data.Project_ID?.ProjectName
      },
      pinned: "left",
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
      // autoHeaderHeight: true,
    },
    // {
    //   headerName: "ProjectsType",
    //   field: "ProjectsType",
    //   valueGetter: (params: any) => {
    //     return params?.data.Project_ID?.ProjectsType
    //   },
    //   pinned: "left",
    //   width: 100,
    //   sortable: true,
    //   filter: true,
    //   floatingFilter: true,
    //   flex: 1,
    //   wrapHeaderText: true,
    // },
    {
      headerName: "ClientNames",
      field: "ClientNames",
      valueGetter: (params: any) => {
        return params?.data.Project_ID?.ClientNames
      },
      pinned: "left",
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },

    {
      headerName: "StartDate",
      field: "Project_ID/StartDate",
      valueGetter: (params: any) => {
        const startDate = params?.data?.Project_ID?.StartDate;
        if (startDate) {
          const formattedDate = moment(startDate).format("DD-MM-YY");
          return moment(formattedDate, "DD-MM-YY", true).isValid() ? formattedDate : "-";
        } else {
          return "-";
        }
      },
      pinned: "left",
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },
    {
      headerName: "EndDate",
      field: "Project_ID/EndDate",
      valueGetter: (params: any) => {
        const endDate = params?.data?.Project_ID?.EndDate;
        if (endDate) {
          const formattedDate = moment(endDate).format("DD-MM-YY");
          return moment(formattedDate, "DD-MM-YY", true).isValid() ? formattedDate : "-";
        } else {
          return "-";
        }
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
      headerName: `Weak1 ${startdates(1)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,


          width: 90,
          valueFormatter: (params: any) => {
            const data = params?.data?.Weak1;
            const parsedData = data ? JSON.parse(data) : null;
            return parsedData?.Billiability !== undefined ? parsedData.Billiability + "%" : null;
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 90,
          cellClass: (params: any) => ['customcss'],
          valueFormatter: (params: any) => {
            const data = params?.data?.Weak1;
            const parsedData = data ? JSON.parse(data) : null;
            return parsedData?.Utilization !== undefined ? parsedData.Utilization + "%" : null;
          },
        },
      ]
    },
    {
      headerName: `Weak2 ${startdates(2)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak2)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak2)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak3 ${startdates(3)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak3)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak3)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak4 ${startdates(4)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak4)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak4)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak5 ${startdates(5)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak5)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak5)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak6 ${startdates(6)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak6)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak6)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak7 ${startdates(7)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak7)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak7)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak8 ${startdates(8)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak8)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak8)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak9 ${startdates(9)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak9)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak9)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak10 ${startdates(10)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak10)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak10)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak11 ${startdates(11)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak11)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak11)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak12 ${startdates(12)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak12)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak12)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak13 ${startdates(13)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak13)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak13)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak14 ${startdates(14)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak14)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak14)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak15 ${startdates(15)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak15)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak15)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak16 ${startdates(16)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak16)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak16)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak17 ${startdates(17)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak17)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak17)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak18 ${startdates(18)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak18)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak18)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak19 ${startdates(19)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak19)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak19)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak20 ${startdates(20)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak20)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak20)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak21 ${startdates(21)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak21)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak21)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak22 ${startdates(22)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak22)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak22)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak23 ${startdates(23)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak23)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak23)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak24 ${startdates(24)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak24)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak24)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak25 ${startdates(25)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak25)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak25)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak26 ${startdates(26)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak26)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak26)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak27 ${startdates(27)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak27)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak27)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak28 ${startdates(28)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak28)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak28)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak29 ${startdates(29)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak29)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak29)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak30 ${startdates(30)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak30)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak30)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak31 ${startdates(31)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak31)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak31)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak32 ${startdates(32)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak32)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak32)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak33 ${startdates(33)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak33)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak33)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak34 ${startdates(34)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak34)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak34)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak35 ${startdates(35)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak35)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak35)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak36 ${startdates(36)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            const data = params?.data?.Weak36;
            const parsedData = data ? JSON.parse(data) : null;
            return parsedData?.Billiability !== undefined ? parsedData.Billiability + "%" : null;
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            const data = params?.data?.Weak36;
            const parsedData = data ? JSON.parse(data) : null;
            return parsedData?.Utilization !== undefined ? parsedData.Utilization + "%" : null;
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak37 ${startdates(37)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak37)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak37)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak38 ${startdates(38)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak38)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak38)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak39 ${startdates(39)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak39)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak39)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak40 ${startdates(40)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak40)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak40)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak41 ${startdates(41)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak41)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak41)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },

    {
      headerName: `Weak42 ${startdates(42)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak42)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak42)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },

    {
      headerName: `Weak43 ${startdates(43)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak43)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak43)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak44 ${startdates(44)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak44)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak44)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak45 ${startdates(45)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak45)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak45)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak46 ${startdates(46)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak46)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak46)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak47 ${startdates(47)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak47)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak47)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak48 ${startdates(48)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak48)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak48)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak49 ${startdates(49)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak49)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak49)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak50 ${startdates(50)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak50)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak50)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak51 ${startdates(51)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak51)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak51)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    },
    {
      headerName: `Weak52 ${startdates(52)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak52)?.Billiability
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
        {
          field: "Utilization",
          headerClass: "customcss",
          editable: (currentUser && currentUser.Groups && currentUser.Groups.length === 0)
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          singleClickEdit: (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Reader")
            || (currentUser && currentUser.Groups && currentUser.Groups.length > 0 && currentUser.Groups[0].Title === "RA_Manager") ? false : true,
          width: 100,
          valueFormatter: (params: any) => {
            let data = JSON.parse(params?.data?.Weak52)?.Utilization
            return data === undefined ? null : data + "%";
          },
          cellClass: (params: any) => ['customcss'],
        },
      ]
    }


  ];


  // json object onchange 

  async function weakCellValueChanged(params: any) {
    let updatecolumnvalue = params.column.originalParent.colGroupDef.headerName.split(" ")[0]
    updateProperties(params.data, updatecolumnvalue);
  }

  async function updateProperties(data: any, cName: string) {
    let obj = JSON.parse(data[cName]);
    // Billability
    if (obj?.Billiability === undefined) {
      obj.Billiability = data.Billiability;
    } else if (data.Billiability !== undefined) {
      obj.Billiability = data.Billiability;
    }
    // Utilization
    if (obj?.Utilization === undefined) {
      obj.Utilization = data.Utilization;
    } else if (data.Utilization !== undefined) {
      obj.Utilization = data.Utilization;
    }
    // return JSON.stringify(obj);
    const jsondata: { [key: string]: string } = {};
    jsondata[cName] = JSON.stringify(obj);

    await _sharePointServiceProxy
      .updateItem("ProjectsAllocations", data.ID, jsondata, [], true)
      .then((res) => {
        getProjectAllocationListData("");
      });
  }



  // validation 
  function getEmployeeallocatedwithProject(ProjectName: any) {
    let getemployeewithallocatedProject = ProjectsAllocation.filter((ftr) => ftr?.Project_ID?.ProjectName === ProjectName).map((itr) => ({
      EmployeeName: itr?.EmployeeId?.Name
    }));
    setProjectEmployee(getemployeewithallocatedProject)
  }

  async function addAllocateResource() {
    let isemployeeallocatedwithsameproject = (getprojectEmp.filter((ftr: any) => ftr?.EmployeeName === getselectedEmp).length > 0)
    if (isemployeeallocatedwithsameproject) {
      setUpdateModal("ProjectAllocated")
      setShow(false)
    }
    else {
      await _sharePointServiceProxy.addItem("ProjectsAllocations", ProjectWithEmployee, [], true).then(() => {
        getProjectAllocationListData("")
        setUpdateModal("ProjectUpdated");
        setShow(false)
      });

    }

  }
  const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };

  // CSV Code
  var gridRef: any = useRef();
  // const onBtnExport = useCallback(() => {
  //   gridRef.current.api.exportDataAsCsv();
  // }, []);

  // const onBtnExport = useCallback(() => {
  //   const flattenedData = paginatedArrProject.map((row: any) => {
  //     const flatRow = { ...row }; // Create a shallow copy of the row

  //     // Flatten nested columns
  //     for (let i = 1; i <= 52; i++) {
  //       const weekData = JSON.parse(row[`Weak${i}`]);
  //       if (weekData && Object.keys(weekData).length > 0) {
  //         flatRow[`Weak${i}_Billiability`] = weekData.Billiability;
  //         flatRow[`Weak${i}_Utilization`] = weekData.Utilization;
  //       } else {
  //         flatRow[`Weak${i}_Billiability`] = null;
  //         flatRow[`Weak${i}_Utilization`] = null;
  //       }
  //     }

  //     return flatRow;
  //   });

  //   // Log the first row's id for debugging purposes
  //   if (flattenedData.length > 0) {
  //     const firstRowId = flattenedData[0].Id || flattenedData[0].ID;
  //     console.log('First Row ID:', firstRowId);
  //   }


  //   // Export the flattened data
  //   gridRef.current.api.exportDataAsCsv({
  //     processRow: (node: any) => {
  //       // Use the correct property name for the ID
  //       const flatRow = flattenedData.find((row: any) => row.Id === node.data.Id || row.ID === node.data.ID);
  //       console.log('Flat Row:', flatRow);
  //       return flatRow;
  //     }
  //   });
  // }, [paginatedArrProject]);





  return (
    <>
      {updatemodal === "ProjectUpdated" && (
        <SuccessModal
          pageType={"success"}
          setModal={setUpdateModal}
          message={"ProjectAllocation Updated Successfully"}
          showModal={true}
        />
      )}
      {updatemodal === "ProjectAllocated" && (
        <SuccessModal
          pageType={"warning"}
          setModal={setUpdateModal}
          message={"Employee already allocated with the project you have selected"}
          showModal={true}
        />
      )}
      <Modal
        isOpen={show}
        onDismiss={() => setShow(false)}
        isBlocking={true}
        containerClassName="create-event-modal"
      >
        <div className="project-edit-modal">
          <div className="modal-content-projectedit">
            <div className="pb-3">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Allocate Project
              </h1>
            </div>
            <form>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Project Name
                    </label>

                    <ComboBox
                      className="cmbocss"
                      options={allProjects}
                      // styles={comboBoxStyles}
                      allowFreeInput
                      autoComplete="on"
                      placeholder="Project Name"
                      onChange={(e: any, selected: any) => { setProjectWithEmployee({ ...ProjectWithEmployee, Project_IDId: selected.key }); getEmployeeallocatedwithProject(selected.text) }}
                    />

                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Employee Name
                    </label>

                    <ComboBox
                      className="cmbocss"
                      options={allEmployee}
                      styles={comboBoxStyles}
                      allowFreeInput
                      autoComplete="on"
                      placeholder="Employee Name"
                      onChange={(e: any, selected: any) => { setProjectWithEmployee({ ...ProjectWithEmployee, EmployeeIdId: selected.key, ReportingManager1: selected.Manager1, }), setselectedEmp(selected.text) }}
                    />

                  </div>





                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-wid me-2"
                  onClick={() => { setShow(false) }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => addAllocateResource()}
                  type="button"
                  className="btn btn-color btn-primary btn-wid"

                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

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
                    Resource Allocation
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
                      onClick={() => navigate("/Allocation")}
                    >
                      Allocation
                    </span>
                  </h3>
                </div>
              </div>
            </div>
            {/* <div className="col-6 text-end">
              <button
                className="btn btn-primary mb-2 pt-2 ms-1 me-1 "
                onClick={onBtnExport}
              >
                Download Allocation Report
              </button>
            </div> */}
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
                      {
                        showProjectAllocation &&
                        <svg
                          onClick={() => { setShow(true) }}
                          xmlns="ttp://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          fill="#229ed9"
                          className="bi bi-plus-square pointer plus-icon ms-3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                      }

                    </div>
                    <div className="row">
                      <div
                        className="ag-theme-alpine"
                        style={{ height: 425 }}
                      >
                        <AgGridReact
                          ref={gridRef}
                          rowData={paginatedArrProject}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          onCellValueChanged={weakCellValueChanged}
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

export default Allocation;
