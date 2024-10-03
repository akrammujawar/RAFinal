import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ComboBox, IComboBox, IComboBoxOption, IComboBoxStyles, IDropdownOption, IDropdownStyles, Modal } from "@fluentui/react";
import EditAllocation from "./EditAllocation";

// import { parse } from "date-fns";

const Allocation: React.FunctionComponent<IAllocatorProps> = (props: any) => {

  const _sharePointServiceProxy: SharePointServiceProxy = new SharePointServiceProxy(props?.context, props?.webURL);
  const [ProjectsAllocation, setProjectsAllocation] = useState([]);
  const [paginatedArrProject, setPaginatedArr] = useState<any>()
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showProjectAllocation, setShowProjectAllocation] = useState<boolean>(false);
  const [allProjects, setAllProjects] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [ProjectWithEmployee, setProjectWithEmployee] = useState<any>({
    Project_IDId: "", EmployeeIdId: "", Year: `${new Date().getFullYear()}`, Billiability: "",
    BillableFrom: "",
    BillableTill: "",
    Utilization_Percent: "",
    Month: "",
  });
  const [globalMsg, setGlobalMsg] = useState<boolean>(false);
  const [updatemodal, setUpdateModal] = useState<string>("");
  const [getprojectEmp, setProjectEmployee] = useState<any>([]);
  const [getselectedEmp, setselectedEmp] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState<any>([]);
  const [updatedDate, setDateUpdated] = useState<any>([])
  const [yearValue, setYearval] = useState("")
  console.log(yearValue)
  // weeks //
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState<any>("");
  console.log(selectedWeek)

  var gridRef: any = useRef();
  useEffect(() => {
    getProjectAllocationListData("")
    getAllProject()
    getAllEmployee()
  }, []);

  // get ProjectAllocation 
  function convertDateToMonth(date:any){
    const parsedDate = new Date(date);
        const month = parsedDate.getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
       return monthNames[month];
  }
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
          "Project_ID/ProjectManager",
          "Project_ID/ProjectsType",
          "Project_ID/StartDate",
          "Project_ID/EndDate",
          "EmployeeId/ID",
          "EmployeeId/Name",
          "EmployeeId/Practice",
          "EmployeeId/DeptName",
          "EmployeeId/Employee_Id",
          "EmployeeId/Designation",
          "EmployeeId/EmpEmail",

          "Year",
          "Weak1", "Weak2", "Weak3", "Weak4", "Weak5", "Weak6", "Weak7", "Weak8", "Weak9", "Weak10",
          "Weak11", "Weak12", "Weak13", "Weak14", "Weak15", "Weak16", "Weak17", "Weak18", "Weak19", "Weak20",
          "Weak21", "Weak22", "Weak23", "Weak24", "Weak25", "Weak26", "Weak27", "Weak28", "Weak29", "Weak30",
          "Weak31", "Weak32", "Weak33", "Weak34", "Weak35", "Weak36", "Weak37", "Weak38", "Weak39", "Weak40",
          "Weak41", "Weak42", "Weak43", "Weak44", "Weak45", "Weak46", "Weak47", "Weak48", "Weak49", "Weak50",
          "Weak51", "Weak52",
          "Manager1/Title",
          "Manager1/ID",
          "Manager2/Title",
          // "BillableFrom",
          // "BillableTill",
          // "Billiability",
          // "Utilization_Percent",
        ],
        expandFields: ["Project_ID", "EmployeeId", "Manager1", "Manager2"],
        isRoot: true,
        filter: filterYear,
        top: 500
      });

      let DateListItems = await _sharePointServiceProxy.getItems({
        listName: "LastUpdatedDate",
        fields: ["ID",
          "LastUpdatedDate",
        ],
        isRoot: true,
        top: 500
      });
      setDateUpdated(DateListItems)



      if (loggedUser.Groups.length === 0) {
        //  LoginFilter = `EmployeeId/EmpEmail eq ${loggedUser?.User?.Email}`
        let LoginCurrentUser = projectListItems.filter((i: any) => { return i?.EmployeeId?.EmpEmail === loggedUser?.User?.Email })
        setProjectsAllocation(LoginCurrentUser)
        setShowProjectAllocation(false)
      }
      else if (loggedUser.Groups[0].Title === "RA_Manager") {

        let LoginCurrentUser = projectListItems.filter((i: any) => { return i?.Manager1?.Title === loggedUser?.User?.Title || i?.EmployeeId?.EmpEmail === loggedUser?.User?.Email })
        setProjectsAllocation(LoginCurrentUser)


        setShowProjectAllocation(false)
      }
      else if (loggedUser.Groups[0].Title === "RA_Owner") {
        setProjectsAllocation(projectListItems)
        setShowProjectAllocation(true)
      }
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
      fields: ["ID", "Name", "Active",
        "Manager1/Title",
        "Manager1/ID",
        "Manager2/Title"],
      expandFields: ["Manager1", "Manager2"],
      filter: `Active eq 'Yes'`,
      isRoot: true
    });
    allEmployee.forEach((element: any) => {
      // const manager1Title = element.Manager1 ? element.Manager1.Title : null;
      employee.push({
        key: element.ID,
        text: element.Name,
        // Manager1: manager1Title,
      }
      );
    })
    setallEmployee(employee)

  }


  // Weeks For the Tabel Header //
  const startdates = (weekno: number) => {
    let startdateofweek = moment(moment().week(weekno))
      .startOf("isoWeek")
      .format("MMM/DD");
    let endDateofWeek = moment(moment(moment().week(weekno)).endOf("isoWeek"))
      // .subtract(2, "days")
      .format("MMM/DD");
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
      headerName: "Practice",
      field: "Practice",
      valueGetter: (params: any) => {
        return params?.data.EmployeeId?.Practice
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
      headerName: "Manager 1",
      field: "Manager1.Title",
      valueGetter: (params: any) => {
        return params?.data.Manager1?.Title
      },
      pinned: "left",
      width: 124,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },
    {
      headerName: "Manager 2",
      field: "Manager2.Title",
      valueGetter: (params: any) => {
        return params?.data.Manager2?.Title
      },
      pinned: "left",
      width: 124,
      sortable: true,
      filter: true,
      floatingFilter: true,
      flex: 1,
      wrapHeaderText: true,
    },

    // {
    //   headerName: "StartDate",
    //   field: "Project_ID/StartDate",
    //   valueGetter: (params: any) => {
    //     const startDate = params?.data?.Project_ID?.StartDate;
    //     if (startDate) {
    //       const formattedDate = moment(startDate).format("DD-MM-YY");
    //       return moment(formattedDate, "DD-MM-YY", true).isValid() ? formattedDate : "-";
    //     } else {
    //       return "-";
    //     }
    //   },
    //   pinned: "left",
    //   width: 120,
    //   sortable: true,
    //   filter: true,
    //   floatingFilter: true,
    //   flex: 1,
    //   wrapHeaderText: true,
    // },
    // {
    //   headerName: "EndDate",
    //   field: "Project_ID/EndDate",
    //   valueGetter: (params: any) => {
    //     const endDate = params?.data?.Project_ID?.EndDate;
    //     if (endDate) {
    //       const formattedDate = moment(endDate).format("DD-MM-YY");
    //       return moment(formattedDate, "DD-MM-YY", true).isValid() ? formattedDate : "-";
    //     } else {
    //       return "-";
    //     }
    //   },
    //   pinned: "left",
    //   width: 120,
    //   sortable: true,
    //   filter: true,
    //   floatingFilter: true,
    //   flex: 1,
    //   wrapHeaderText: true,
    // },
    // weaks 
    {
      headerName: `Week1 ${startdates(1)}`,
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
          colId: 'Billiability_1',
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
          colId: 'Utilization_1',
        },
      ]
    },
    {
      headerName: `Week2 ${startdates(2)}`,
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
          colId: 'Billiability_2',
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
          colId: 'Utilization_2',
        },
      ]
    },
    {
      headerName: `Week3 ${startdates(3)}`,
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
          colId: 'Billiability_3',
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
          colId: 'Utilization_3',
        },
      ]
    },
    {
      headerName: `Week4 ${startdates(4)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          colId: 'Billiability_4',
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
          colId: 'Utilization_4',
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
      headerName: `Week5 ${startdates(5)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          colId: 'Billiability_5',
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
          colId: 'Utilization_5',
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
      headerName: `Week6 ${startdates(6)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          colId: 'Billiability_6',
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
          colId: 'Utilization_6',
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
      headerName: `Week7 ${startdates(7)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          colId: 'Billiability_7',
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
          colId: 'Utilization_7',
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
      headerName: `Week8 ${startdates(8)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          colId: 'Billiability_8',
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
          colId: 'Utilization_8',
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
      headerName: `Week9 ${startdates(9)}`,
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
      headerName: `Week10 ${startdates(10)}`,
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
      headerName: `Week11 ${startdates(11)}`,
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
      headerName: `Week12 ${startdates(12)}`,
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
      headerName: `Week13 ${startdates(13)}`,
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
      headerName: `Week14 ${startdates(14)}`,
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
      headerName: `Week15 ${startdates(15)}`,
      headerClass: "customcss",
      children: [
        {
          field: "Billiability",
          colId: 'Billiability_15',
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
          colId: 'Utilization_15',
        },
      ]
    },
    {
      headerName: `Week16 ${startdates(16)}`,
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
      headerName: `Week17 ${startdates(17)}`,
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
      headerName: `Week18 ${startdates(18)}`,
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
      headerName: `Week19 ${startdates(19)}`,
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
      headerName: `Week20 ${startdates(20)}`,
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
      headerName: `Week21 ${startdates(21)}`,
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
      headerName: `Week22 ${startdates(22)}`,
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
      headerName: `Week23 ${startdates(23)}`,
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
      headerName: `Week24 ${startdates(24)}`,
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
      headerName: `Week25 ${startdates(25)}`,
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
      headerName: `Week26 ${startdates(26)}`,
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
      headerName: `Week27 ${startdates(27)}`,
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
      headerName: `Week28 ${startdates(28)}`,
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
      headerName: `Week29 ${startdates(29)}`,
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
      headerName: `Week30 ${startdates(30)}`,
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
      headerName: `Week31 ${startdates(31)}`,
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
      headerName: `Week32 ${startdates(32)}`,
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
      headerName: `Week33 ${startdates(33)}`,
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
      headerName: `Week34 ${startdates(34)}`,
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
      headerName: `Week35 ${startdates(35)}`,
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
      headerName: `Week36 ${startdates(36)}`,
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
      headerName: `Week37 ${startdates(37)}`,
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
      headerName: `Week38 ${startdates(38)}`,
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
      headerName: `Week39 ${startdates(39)}`,
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
      headerName: `Week40 ${startdates(40)}`,
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
      headerName: `Week41 ${startdates(41)}`,
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
      headerName: `Week42 ${startdates(42)}`,
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
      headerName: `Week43 ${startdates(43)}`,
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
      headerName: `Week44 ${startdates(44)}`,
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
      headerName: `Week45 ${startdates(45)}`,
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
      headerName: `Week46 ${startdates(46)}`,
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
      headerName: `Week47 ${startdates(47)}`,
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
      headerName: `Week48 ${startdates(48)}`,
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
      headerName: `Week49 ${startdates(49)}`,
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
      headerName: `Week50 ${startdates(50)}`,
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
      headerName: `Week51 ${startdates(51)}`,
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
      headerName: `Week52 ${startdates(52)}`,
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
    },
    {
      headerName: "Edit",
      field: "Image",
      cellRenderer: EditAllocation,
      // cellRenderer: PopupCellRenderer,
      // cellRenderer:EmployeeIcons,
      cellRendererParams: { context: props?.context, webURL: props?.webURL, getProjectAllocationListData: getProjectAllocationListData },
      width: 120,
    },
  ];


  // json object onchange 

  // async function weakCellValueChanged(params: any) {
  //   let updatecolumnvalue = params.column.originalParent.colGroupDef.headerName.split(" ")[0]
  //   updateProperties(params.data, updatecolumnvalue);
  // }
  const fieldNameMap: { [key: string]: string } = {};
  for (let i = 1; i <= 52; i++) {
    fieldNameMap[`Week${i}`] = `Weak${i}`;
  }

  async function weakCellValueChanged(params: any) {
    let updateColumnValue = params.column.originalParent.colGroupDef.headerName.split(" ")[0];
    let backendFieldName = fieldNameMap[updateColumnValue] || updateColumnValue; // Map to backend field name
    updateProperties(params.data, backendFieldName);
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
    const weekNumber = parseInt(cName.replace(/\D/g, ''), 10);
    const month = moment().week(weekNumber).startOf("isoWeek").format("MMM");
    if (data.Utilization !== undefined && data.Utilization !== "0") {
    jsondata['Month'] = month;
    }else{
    jsondata['Month'] = null;
    }
    await _sharePointServiceProxy
      .updateItem("ProjectsAllocations", data.ID, jsondata, [], true)
      .then((res) => {
        if (data?.Year === '2023') {
          getProjectAllocationListData(data?.Year);
        }
        else {
          getProjectAllocationListData('')
        }
      });
  }

  function getEmployeeallocatedwithProject(ProjectName: any) {
    let getemployeewithallocatedProject = ProjectsAllocation.filter((ftr) => ftr?.Project_ID?.ProjectName === ProjectName).map((itr) => ({
      EmployeeName: itr?.EmployeeId?.Name
    }));
    setProjectEmployee(getemployeewithallocatedProject)
  }
  // validation
  function validate() {
    // console.log(globalMsg)
    if (
      ProjectWithEmployee?.Project_IDId === "" ||
      ProjectWithEmployee?.EmployeeIdId === "" ||
      ProjectWithEmployee?.BillableFrom === "" ||
      ProjectWithEmployee?.BillableTill === "" ||
      ProjectWithEmployee?.Utilization_Percent === "" ||
      ProjectWithEmployee?.Billiability === "") {
      setGlobalMsg(true);
      return false;
    } else {
      setGlobalMsg(false);
      return true;

    }
  }



  async function addAllocateResource() {
    if (validate()) {
      let isemployeeallocatedwithsameproject = (getprojectEmp.filter((ftr: any) => ftr?.EmployeeName === getselectedEmp).length > 0)
      if (isemployeeallocatedwithsameproject) {
        setShow(false)
        setUpdateModal("ProjectAllocated")
        setProjectWithEmployee({
          Project_IDId: "", EmployeeIdId: "", Year: `${new Date().getFullYear()}`, Billiability: "",
          BillableFrom: "",
          BillableTill: "",
          Utilization_Percent: "",
        });
      }
      else {
        await _sharePointServiceProxy.addItem("ProjectsAllocations", ProjectWithEmployee, [], true).then(() => {
          setGlobalMsg(false);
          setProjectWithEmployee({
            Project_IDId: "", EmployeeIdId: "", Year: `${new Date().getFullYear()}`, Billiability: "",
            BillableFrom: "",
            BillableTill: "",
            Utilization_Percent: "",
          });
          setShow(false)
          getProjectAllocationListData("")
          setUpdateModal("ProjectUpdated");

        });
      }
    }

  }

  const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };

  // ************************** code for billability , utilization weeks ********************************//
  // Weeks based on selected dates//

  const handleStartDateChange = (event: any) => {
    const date = event.target.value;
    let inputName = event.target.name;

    setStartDate(date);
    updateSelectedWeek(date, endDate);
    // setProjectAllocationData({
    //   ...projectAllocationData,
    //   [inputName]: date,
    // });
    setProjectWithEmployee((prev: any) => {
      return { ...prev, [inputName]: date };
    });
  };

  const handleEndDateChange = (event: any) => {
    const date = event.target.value;
    let inputName = event.target.name;
    setEndDate(date);
    updateSelectedWeek(startDate, date);
    // setProjectAllocationData({
    //   ...projectAllocationData,
    //   [inputName]: date,
    // });
    setProjectWithEmployee((prev: any) => {
      return { ...prev, [inputName]: date, Month: convertDateToMonth(date) };
    });
  };

  const getStartOfWeek = (date: any) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getEndOfWeek = (date: any) => {
    const day = date.getDay();
    const diff = date.getDate() + (day === 0 ? 0 : 7 - day);
    return new Date(date.setDate(diff));
  };
  const updateSelectedWeek = (start: any, end: any) => {
    if (start && end) {
      const startOfWeek = getStartOfWeek(new Date(start));
      const endOfWeek = getEndOfWeek(new Date(end));
      const weeks = getWeeksBetweenDates(startOfWeek, endOfWeek);
      setSelectedWeek(weeks);
    } else {
      setSelectedWeek("");
    }
  };







  const [weekRange, setWeekRange] = useState<any[]>([]);
  console.log(weekRange)
  const getWeeksBetweenDates = (start: any, end: any) => {
    const weeks = [];
    // const weeks: IDropdownOption[] = [];
    let curr = new Date(start);
    while (curr <= end) {
      const weekStartDate = new Date(curr);
      const weekEndDate = getEndOfWeek(curr);
      weeks.push({
        start: weekStartDate.toLocaleDateString(),
        end: weekEndDate.toLocaleDateString(),
      });
      curr.setDate(curr.getDate() + 7);
    }
    // combo box option format
    let options: any[] = [];
    if (weeks.length > 0) {
      weeks?.map((itr: any) =>

        options.push({
          key: `${itr?.start} - ${itr?.end}`,
          text: `${itr?.start} - ${itr?.end}`,
        })
      );

      setWeekRange(options);
    }
  };


  const [selectedWeeks, setSelectedWeeks] = useState<any>([]);
  React.useEffect(() => {
    setSelectedWeeks([]);
  }, []);
  const onChangeWeekDropdown = (
    // event: React.FormEvent<HTMLDivElement>,
    // item: IDropdownOption
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    if (!ProjectWithEmployee.Utilization_Percent) {
      alert("Please select utilisation first");
    } else {
      if (option.selected) {
        // setSelectedWeeks([...selectedWeeks, option.key as string]);
        selectedWeeks.push(option.key as string);
      } else {
        selectedWeeks.indexOf(option.key) !== -1 &&
          selectedWeeks.splice(
            selectedWeeks.indexOf(option.key),
            selectedWeeks.filter((ftr: any) => ftr === option.key).length
          );
      }

      if (selectedWeeks.length > 0) {
        for (let i = 0; i < selectedWeeks.length; i++) {
          const week = selectedWeeks[i];
          const weekData = {
            Billiability: ProjectWithEmployee.Billiability,
            Utilization: ProjectWithEmployee.Utilization_Percent,
          };

          // Stringify the weekData object
          const stringifiedWeekData = JSON.stringify(weekData);
          console.log(stringifiedWeekData)

          // Add the stringified data to ProjectWithEmployee
          ProjectWithEmployee[week] = stringifiedWeekData;
        }
      }

    }

  };

  const generateDateRangeOptions = () => {
    const dateRanges = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const currentRange = new Date(start);
    currentRange.setDate(currentRange.getDate() - (currentRange.getDay() - 1)); // Adjust start date to the previous Monday

    while (currentRange <= end) {
      const rangeStartDate = new Date(currentRange);
      const rangeEndDate = new Date(currentRange);
      rangeEndDate.setDate(currentRange.getDate() + 6);

      const rangeStartDateString = rangeStartDate.toLocaleDateString('en-US');
      const rangeEndDateString = rangeEndDate.toLocaleDateString('en-US');
      const dateRangeOption = `${rangeStartDateString}-${rangeEndDateString}`;
      dateRanges.push(dateRangeOption);

      currentRange.setDate(currentRange.getDate() + 7);
    }

    setDateRangeOptions(dateRanges);
  };
  const startdate = (weekno: number) => {
    let startdateofweek = moment(moment().week(weekno))
      .startOf("isoWeek")
      .format("M/D/YYYY");
    let endDateofWeek = moment(moment(moment().week(weekno)).endOf("isoWeek"))
      // .subtract(2, "days")
      .format("M/D/YYYY");
    // console.log(`${startdateofweek}, ${endDateofWeek}`);
    return `${startdateofweek}-${endDateofWeek}`;
  };

  const WeekOptions: IDropdownOption[] = [];
  for (let i = 1; i < 53; i++) {
    WeekOptions.push({
      key: `Weak${i}`,
      text: `${startdate(i)}`,
      // hidden: currentWeek > i ? true : false,
      // disabled: currentWeek > i ? true : false,
    });
  }
  //console.log("WeekOptions", WeekOptions)

  React.useEffect(() => {
    if (startDate && endDate) {
      generateDateRangeOptions();
    }
  }, [startDate, endDate]);


  const [dateRangeOptions, setDateRangeOptions] = useState<any>([]);
  let newArr: any[] = [];
  dateRangeOptions.map((itr: any, index: any) => {
    WeekOptions.filter(ftr => {
      if (ftr.text === dateRangeOptions[index]) {
        newArr.push(ftr)
      }
    })
  })




  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 215 },
  };

  // const onBtnExport = useCallback(() => {
  //   debugger
  //   gridRef.current.api.exportDataAsCsv({
  //     // processCellCallback: (params: any) => {
  //     //   // console.log("ParamsData", params.value
  //     //   //);
  //     //   if (params.column.colId.includes('Billiability_1') || params.column.colId.includes('Utilization_1')) {
  //     //     return JSON.parse(params.node.data['Weak' + params.column.colId.split("_")[1]])[params.column.colId.split("_")[0]];
  //     //   }
  //     //   return params.value;
  //     // },
  //     processCellCallback: (params: any) => {
  //       const weakIndex = parseInt(params.column.colId.split("_")[1], 10);
  //       if (params.column.colId.includes('Billiability_') || params.column.colId.includes('Utilization_')) {
  //         const weakData = params.node.data['Weak' + weakIndex];
  //         if (weakData) {
  //           return JSON.parse(weakData)[params.column.colId.split("_")[0]];
  //         } else {
  //           return "";
  //         }
  //       }
  //       return params.value;
  //     },
  //   });

  // }, []);
  // const onBtnExport = useCallback(() => {
  //   debugger
  //   gridRef.current.api.exportDataAsCsv({

  //     processCellCallback: (params: any) => {
  //       if (params.column.colId.includes('Billiability_') || params.column.colId.includes('Utilization_')) {
  //         const weakIndex = parseInt(params.column.colId.split("_")[1], 11) || 0;
  //         const weakData = params.node.data['Weak' + weakIndex];
  //         if (weakData) {
  //           return JSON.parse(weakData)[params.column.colId.split("_")[0]];
  //         } else {
  //           return "";
  //         }
  //       }
  //       return params.value;
  //     },
  //   });

  // }, []);
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv({
      processCellCallback: (params: any) => {
        if (params.column.colId.includes('Billiability_') || params.column.colId.includes('Utilization_')) {
          const weekIndexStr = params.column.colId.split("_")[1];
          const weakIndex = parseInt(weekIndexStr, 10) || 0;
          const weakData = params.node.data['Weak' + weakIndex];
          if (weakData) {
            return JSON.parse(weakData)[params.column.colId.split("_")[0]];
          } else {
            return "";
          }
        }
        return params.value;
      },
    });
  }, []);


  // const onBtnExport = useCallback(() => {
  //   debugger;
  //   gridRef.current.api.exportDataAsCsv({
  //     processCellCallback: (params: any) => {
  //       const columnId = params.column.colId;
  //       console.log("Column ID:", columnId);

  //       if (columnId.startsWith('Billiability_') || columnId.startsWith('Utilization_')) {
  //         const weekNumber = columnId.substring(columnId.lastIndexOf('_') + 1);
  //         console.log("Week Number:", weekNumber);

  //         const weekData = params.node.data['Weak' + weekNumber];
  //         console.log("Week Data:", weekData);

  //         if (weekData && weekData[columnId.split("_")[0]]) {
  //           console.log("Property Value:", weekData[columnId.split("_")[0]]);
  //           return weekData[columnId.split("_")[0]];
  //         } else {
  //           console.log("Week data or property not found");
  //           return null;
  //         }
  //       }

  //       return params.value;
  //     },
  //   });
  // }, []);

  // Hide edit column
  const onGridReady = (params: any) => {
    const { api, columnApi } = params;
    // Set the gridApi and columnApi to state
    setGridApi(api);
    setColumnApi(columnApi);
  };

  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);

  useEffect(() => {
    if (gridApi && columnApi) {
      const columnName = 'Image'; // Replace with the actual column field name

      if (showProjectAllocation) {
        // Show the column
        columnApi.setColumnVisible(columnName, true);
      } else {
        // Hide the column
        columnApi.setColumnVisible(columnName, false);
      }
    }
  }, [showProjectAllocation, gridApi, columnApi]);
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
          message={"Already Employee engaged with you have selected Project"}
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
                    {!ProjectWithEmployee?.Project_IDId && (
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
                      onChange={(e: any, selected: any) => { setProjectWithEmployee({ ...ProjectWithEmployee, EmployeeIdId: selected.key }), setselectedEmp(selected.text) }}
                    />
                    {!ProjectWithEmployee?.EmployeeIdId && (
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


                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Billable From
                    </label>
                    <input
                      // onChange={(e) =>
                      //   setProjectAllocationData({
                      //     ...projectAllocationData,
                      //     BillableFrom: e.target.value,
                      //   })
                      // }
                      onChange={handleStartDateChange}
                      type="date"
                      className="form-control"
                      id="inputAddress2"
                      placeholder="Billiable Till"
                      name="BillableFrom"

                    />
                    {!ProjectWithEmployee?.BillableFrom && (
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
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Billable Till
                    </label>
                    <input
                      // onChange={(e) =>
                      //   setProjectAllocationData({
                      //     ...projectAllocationData,
                      //     BillableTill: e.target.value,
                      //   })
                      // }
                      min={startDate}
                      onChange={handleEndDateChange}
                      type="date"
                      className="form-control"
                      id="inputAddress2"
                      placeholder="Billiable Till"
                      name="BillableTill"
                    />
                    {!ProjectWithEmployee?.BillableTill && (
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
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Billiability
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        setProjectWithEmployee({
                          ...ProjectWithEmployee,
                          Billiability: e.target.value,
                        })
                      }
                    >
                      <option value="0">--Select--</option>
                      <option value="0">0%</option>
                      <option value="25">25%</option>
                      <option value="50">50%</option>
                      <option value="75">75%</option>
                      <option value="100">100%</option>
                    </select>
                    {!ProjectWithEmployee?.Billiability && (
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
                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      Utilization
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        setProjectWithEmployee({
                          ...ProjectWithEmployee,
                          Utilization_Percent: e.target.value,
                        })
                      }
                    >
                      <option value="0">--Select--</option>
                      <option value="0">0%</option>
                      <option value="25">25%</option>
                      <option value="50">50%</option>
                      <option value="75">75%</option>
                      <option value="100">100%</option>
                    </select>
                    {!ProjectWithEmployee?.Utilization_Percent && (
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
                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      Weeks
                    </label>
                    {/* <Stack tokens={stackTokens}> */}
                    <ComboBox
                      className="cmbocss"
                      placeholder="Select options"
                      multiSelect
                      onChange={onChangeWeekDropdown}
                      // options={WeekOptions}
                      options={newArr}
                      // options={weekRange}
                      styles={dropdownStyles}
                    />
                    {/* </Stack> */}
                  </div>


                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-wid me-2"
                  onClick={() => {
                    setShow(false),
                      setGlobalMsg(false),
                      setUpdateModal("");
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addAllocateResource}
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
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-3">
                    <div className="custom-card">
                      {/* remove card class */}
                      <div className="card-body">
                        <div className="row">
                          <div className="event-box d-flex">
                            <div className="ribbon">
                              <span className="ribbon3">Last Updated On</span>
                            </div>
                            {/* <div className="event-date">
                                                <div className="ribbon">
                                                    <p className="ribbon2">Announcements</p>
                                                </div>
                                            </div> */}
                            <div className="marquee-container">
                              {/* {announcements.length > 0 ? ( */}
                              <div className="marquee-container">
                                <div className="marquee-content d-flex">

                                  {/* {announcements.map((item, index) => ( */}
                                  <div className=' pe-3'>
                                    <span className="red-dot ">{moment(updatedDate[0]?.LastUpdatedDate).format("DD-MM-YYYY")}</span>
                                  </div>
                                  {/* // <li  key={index} className='py-2 pe-3 '>{item.Title}</li> */}
                                  {/* ))} */}

                                </div>
                              </div>
                              {/* ) : (
                                    <div>No announcements to display</div>
                                  )} */}


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="col-md-6">
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
                      onClick={() => navigate("")}
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
            {showProjectAllocation &&
              <div className="col-md-6 p-1 text-end">

                <button
                  className="btn btn-primary mt-2"
                  onClick={onBtnExport}
                >
                  Download Allocation Report
                </button>
              </div>}

          </div>

          <><div>
            <div className="row">
              <div className="col-md-12">
                <div className="card shadow">
                  <div className="card-body ">


                    <div className="align-items-center d-flex justify-content-end">
                      <select name="select" id="select" className="form-select w-auto mb-1" onChange={(e) => { getProjectAllocationListData(e.target.value), setYearval(e.target.value) }}>
                        <option value={`${new Date().getFullYear()}`}>{new Date().getFullYear()}</option>
                        <option value="2023">{new Date().getFullYear() - 1}</option>
                        {/* <option value="2022">{new Date().getFullYear() - 2}</option> */}
                      </select>
                      {showProjectAllocation &&
                        <svg
                          onClick={() => { yearValue == "2023" ? alert('You cannot allocate project in the previous year.') : setShow(true) }}
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
                        style={{ height: 385 }}
                      >
                        <AgGridReact
                          ref={gridRef}
                          rowData={paginatedArrProject}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          onCellValueChanged={weakCellValueChanged}
                          onGridReady={onGridReady}
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
