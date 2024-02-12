// import { Dropdown } from "office-ui-fabric-react";
import * as React from "react";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import * as _ from "lodash";
import { format } from "date-fns";
// import {
//   Dropdown,
//   IComboBoxStyles,
//   IDropdownOption,
//   IDropdownStyles,
//   IStackTokens,
//   Stack,
// } from "office-ui-fabric-react";
import { useState } from "react";
// import Pagination from "../../UIComponent/Pagination";
import SuccessModal from "../common/SuccessModal";
import {
  ComboBox,
  Dropdown,
  IComboBox,
  IComboBoxOption,
  IComboBoxStyles,
  IDropdownOption,
  IDropdownStyles,
  IStackTokens,
  Stack,
} from "@fluentui/react";
import * as moment from "moment";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
// import { useState } from "react";
// import { Dropdown, Stack } from "office-ui-fabric-react";

const ProjectNonEdit: React.FunctionComponent<IAllocatorProps> = (props) => {
  const _sharePointServiceProxy: SharePointServiceProxy =
    new SharePointServiceProxy(props?.context, props?.webURL);
  const [edit, setEdit] = React.useState<any>([]);
  // const [paginatedArr, setPaginatedArr] = React.useState<any[]>([]);
  // console.log(paginatedArr);
  const editproject = window.location.href;
  const projectID = editproject.slice(editproject.lastIndexOf("/") + 1);
  const [empName, setempName] = React.useState<any[]>([]);
  console.log(empName);
  const [ProEmpID, setProEmpID] = useState<number>();
  console.log(setProEmpID);
  const [fullEmpList, setFullEmpList] = useState<any[]>([]);
  const [returnedTarget, setreturnedTarget] = useState<any>();
  const [currentWeek, setCurrentWeek] = useState<any>();
  console.log(currentWeek);

  const [projectAllocationData, setProjectAllocationData] = React.useState<any>(
    {}
  );
  const [employeedata, setEmployeetData] = React.useState<any>([]);

  // Project Details//
  const [projdetails, setProjDetails] = useState<any>();
  // console.log(setProjDetails);

  // Success Modal//
  const [openmodal, setOpenModal] = useState<string>("");
  const [globalMsg, setGlobalMsg] = useState<string>("");
  const [warningmodal, setWarningModal] = useState<string>("");

  // Weeks table dropdowns //
  // Weeks selecting in Modal with dates //
  const startdate = (weekno: number) => {
    let startdateofweek = moment(moment().week(weekno))
      .startOf("isoWeek")
      .format("DD/MM");
    let endDateofWeek = moment(moment(moment().week(weekno)).endOf("isoWeek"))
      .subtract(2, "days")
      .format("DD/MM");
    // console.log(`${startdateofweek}, ${endDateofWeek}`);
    return `${startdateofweek}-${endDateofWeek}`;
  };

  const stackTokens: IStackTokens = { childrenGap: 20 };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 228 },
  };
  const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
  const WeekOptions: IDropdownOption[] = [
    { key: "week1", text: `week1 [${startdate(1)}]` },
    { key: "week2", text: `week2 [${startdate(2)}]` },
    { key: "week3", text: `week3 [${startdate(3)}]` },
    { key: "week4", text: `week4 [${startdate(4)}]` },
    { key: "week5", text: `week5 [${startdate(5)}]` },
    { key: "week6", text: `week6 [${startdate(6)}]` },
    { key: "week7", text: `week7 [${startdate(7)}]` },
    { key: "week8", text: `week8 [${startdate(8)}]` },
    { key: "week9", text: `week9 [${startdate(9)}]` },
    { key: "week10", text: `week10 [${startdate(10)}]` },
    { key: "week11", text: `week11 [${startdate(11)}]` },
    { key: "week12", text: `week12 [${startdate(12)}]` },
    { key: "week13", text: `week13 [${startdate(13)}]` },
    { key: "week14", text: `week14 [${startdate(14)}]` },
    { key: "week15", text: `week15 [${startdate(15)}]` },
    { key: "week16", text: `week16 [${startdate(16)}]` },
    { key: "week17", text: `week17 [${startdate(17)}]` },
    { key: "week18", text: `week18 [${startdate(18)}]` },
    { key: "week19", text: `week19 [${startdate(19)}]` },
    { key: "week20", text: `week20 [${startdate(20)}]` },
    { key: "week21", text: `week21 [${startdate(21)}]` },
    { key: "week22", text: `week22 [${startdate(22)}]` },
    { key: "week23", text: `week23 [${startdate(23)}]` },
    { key: "week24", text: `week24 [${startdate(24)}]` },
    { key: "week25", text: `week25 [${startdate(25)}]` },
    { key: "week26", text: `week26 [${startdate(26)}]` },
    { key: "week27", text: `week27 [${startdate(27)}]` },
    { key: "week28", text: `week28 [${startdate(28)}]` },
    { key: "week29", text: `week29 [${startdate(29)}]` },
    { key: "week30", text: `week30 [${startdate(30)}]` },
    { key: "week31", text: `week31 [${startdate(31)}]` },
    { key: "week32", text: `week32 [${startdate(32)}]` },
    { key: "week33", text: `week33 [${startdate(33)}]` },
    { key: "week34", text: `week34 [${startdate(34)}]` },
    { key: "week35", text: `week35 [${startdate(35)}]` },
    { key: "week36", text: `week36 [${startdate(36)}]` },
    { key: "week37", text: `week37 [${startdate(37)}]` },
    { key: "week38", text: `week38 [${startdate(38)}]` },
    { key: "week39", text: `week39 [${startdate(39)}]` },
    { key: "week40", text: `week40 [${startdate(40)}]` },
    { key: "week41", text: `week41 [${startdate(41)}]` },
    { key: "week42", text: `week42 [${startdate(42)}]` },
    { key: "week43", text: `week43 [${startdate(43)}]` },
    { key: "week44", text: `week44 [${startdate(44)}]` },
    { key: "week45", text: `week45 [${startdate(45)}]` },
    { key: "week46", text: `week46 [${startdate(46)}]` },
    { key: "week47", text: `week47 [${startdate(47)}]` },
    { key: "week48", text: `week48 [${startdate(48)}]` },
    { key: "week49", text: `week49 [${startdate(49)}]` },
    { key: "week50", text: `week50 [${startdate(50)}]` },
    { key: "week51", text: `week51 [${startdate(51)}]` },
    { key: "week52", text: `week52 [${startdate(52)}]` },
  ];

  React.useEffect(() => {
    let startDate = moment(moment().week(1)).startOf("isoWeek");
    let endDate = moment(moment(moment().week(1)).endOf("isoWeek")).subtract(
      2,
      "days"
    );
    console.log(startDate);
    console.log(endDate);
    setCurrentWeek(moment().week());

    fetchaward();
    getEmployeeName();
    getEmpNameTypeahed();
  }, []);
   console.log( edit);
  // console.log("data....", edit);

  async function fetchaward() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "ProjectAllocation",
      fields: [
        "Title",
        "ID",
        "Employee_ID/Employee_Id",
        "Employee_ID/Name",
        "Project_Id/ID",
        "Project_Id/ProjectName",
        "Project_Id/ProjectManager",
        "Project_Id/StartDate",
        "Project_Id/EndDate",
        "week1",
        "week2",
        "week3",
        "week4",
        "week5",
        "week6",
        "week7",
        "week8",
        "week9",
        "week10",
        "week11",
        "week12",
        "week13",
        "week14",
        "week15",
        "week16",
        "week17",
        "week18",
        "week19",
        "week20",
        "week21",
        "week22",
        "week23",
        "week24",
        "week25",
        "week26",
        "week27",
        "week28",
        "week29",
        "week30",
        "week31",
        "week32",
        "week33",
        "week34",
        "week35",
        "week36",
        "week37",
        "week38",
        "week39",
        "week40",
        "week41",
        "week42",
        "week43",
        "week44",
        "week45",
        "week46",
        "week47",
        "week48",
        "week49",
        "week50",
        "week51",
        "week52",
      ],
      expandFields: ["Project_Id", "Employee_ID"],
      filter: `Project_Id/ID eq '${projectID}'`,
      isRoot: true,
    });
    // View Binding//

    let projectDetails = {
      ProjectName: items[0].Project_Id.ProjectName,
      ProjectManager: items[0].Project_Id.ProjectManager,
      StartDate: items[0].Project_Id.StartDate,
      EndDate: items[0].Project_Id.EndDate,
    };

    setProjDetails(projectDetails);
    setEdit(items);
    setRowData(items);
    getEmpName(items[0]?.Employee_ID?.Employee_Id);
    // console.log("data....", items);
  }
  // TODO:employee id pass

  const getEmpName = async (empid: any) => {
    let empName: any = await _sharePointServiceProxy.getItems({
      listName: "Employee",
      fields: ["Employee_Id", "Name"],
      isRoot: true,
      // filter: `Employee_Id eq 'E002'`,
    });

    let getEmpID = empName.find((fnd: any) => {
      if (fnd.Employee_Id === empid) {
        return fnd.Id;
      }
    });

    console.log("emp name here ", empid, getEmpID);
    setempName(empName[0]?.Name);
  };

  const [data, setData] = React.useState<any>({});
  const [selectedWeeks, setSelectedWeeks] = useState<any>([]);

  const onChangeWeekDropdown = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    if (!projectAllocationData.Utilization_Percent) {
      alert("Please select utilisation first");
    } else {
      if (item.selected) {
        setSelectedWeeks([...selectedWeeks, item.key as string]);
      }

      if (selectedWeeks.length > 0) {
        for (let i = 0; i < selectedWeeks.length; i++) {
          projectAllocationData[selectedWeeks[i]] =
            projectAllocationData.Utilization_Percent;
        }
      }
    }
  };

  async function UpdateEmployeeData() {
    let item = await _sharePointServiceProxy
      .updateItem("ProjectAllocation", ProEmpID, data, ["a"], true)
      .then((res) => alert("item updated..."));
    setData({});
    console.log("items data", item);
    alert("success..........");
  }

  React.useEffect(() => {
    UpdateEmployeeData();
  }, [data]);

  // Modal Binding //
  async function getEmployeeName() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "Employee",
      fields: ["Name", "Employee_Id", "ID"],
      orderedColumn: "Created",
      isRoot: true,
    });
    setEmployeetData(items);
    console.log(employeedata);
  }

  async function AllocateResource(data: any, projectAllocationData: any) {
    // console.log("data here ", projectAllocationData);
    console.log("111111111111111111");
    await _sharePointServiceProxy
      .addItem("ProjectAllocation", projectAllocationData, [], true)
      .then(() => {
        setOpenModal("EmployeeAdded");
        setGlobalMsg("");
        fetchaward();
      });
  }

  // Combobox func
  const onChangeWeekDropdownProject = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    console.log(value, option);

    let getProId = fullEmpList.find((item: any) => {
      if (item.Name === value) {
        return item.Employee_Id;
      }
    });

    console.log(getProId);

    setProjectAllocationData({
      ...projectAllocationData,
      Employee_IDId: getProId.ID,
      Project_IdId: parseInt(projectID),
    });
  };

  async function getEmpNameTypeahed() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "Employee",
      fields: ["Employee_Id", "Name", "ID"],
      isRoot: true,
    });
    setFullEmpList(items);
    console.log("Employee data... ", items);

    let partialArr = items?.map(({ Name }) => ({ key: Name, text: Name }));
    setreturnedTarget(_.uniqWith(partialArr, _.isEqual));

    console.log(returnedTarget);
  }

  // Navigations of bredcrams//
  const navigate = useNavigate();

  // Onchange dropdowns //

  // Ag-Grid implementation //
  const [rowData, setRowData] = useState([]);
  console.log("EmployeeNAmes", rowData);

  const columnDefs: any = [
    {
      headerName: "Employee Name",
      field: "Employee_ID.Name",
      sortable: true,
      filter: true,
      width: 220,
      pinned: "left",
    },
    {
      headerName: `Week-01 ${startdate(1)}`,
      field: "week1",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-02 ${startdate(2)}`,
      field: "week2",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 2
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-03 ${startdate(3)}`,
      field: "week3",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 3
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-04 ${startdate(4)}`,
      field: "week4",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 4
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-05 ${startdate(5)}`,
      field: "week5",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 5
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-06 ${startdate(6)}`,
      field: "week6",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 6
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-07 ${startdate(7)}`,
      field: "week7",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 7
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-08 ${startdate(8)}`,
      field: "week8",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 8
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-09 ${startdate(9)}`,
      field: "week9",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 9
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-10 ${startdate(10)}`,
      field: "week10",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 10
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-11 ${startdate(11)} `,
      field: "week11",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 11
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-12 ${startdate(12)}`,
      field: "week12",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 12
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-13 ${startdate(13)}`,
      field: "week13",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 13
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-14 ${startdate(14)}`,
      field: "week14",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 14
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-15 ${startdate(15)}`,
      field: "week15",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 15
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-16 ${startdate(16)}`,
      field: "week16",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 16
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-17 ${startdate(17)}`,
      field: "week17",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 17
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-18 ${startdate(18)}`,
      field: "week18",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 18
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-19 ${startdate(19)}`,
      field: "week19",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 19
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-20 ${startdate(20)}`,
      field: "week20",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 20
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-21 ${startdate(21)}`,
      field: "week21",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 21
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-22 ${startdate(22)}`,
      field: "week22",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 22
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-23 ${startdate(23)}`,
      field: "week23",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 23
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-24 ${startdate(24)}`,
      field: "week24",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 24
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-25 ${startdate(25)}`,
      field: "week25",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 25
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-26 ${startdate(26)}`,
      field: "week26",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 26
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-27 ${startdate(27)}`,
      field: "week27",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 27
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-28 ${startdate(28)}`,
      field: "week28",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 28
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-29 ${startdate(29)}`,
      field: "week29",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 29
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-30 ${startdate(30)}`,
      field: "week30",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 30
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-31 ${startdate(31)}`,
      field: "week31",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 31
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-32 ${startdate(32)}`,
      field: "week32",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 32
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-33 ${startdate(33)}`,
      field: "week33",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 33
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-34 ${startdate(34)}`,
      field: "week34",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 34
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-35 ${startdate(35)}`,
      field: "week35",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 35
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-36 ${startdate(36)}`,
      field: "week36",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 36
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-37 ${startdate(37)}`,
      field: "week37",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 37
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-38 ${startdate(38)}`,
      field: "week38",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 38
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-39 ${startdate(39)}`,
      field: "week39",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 39
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-40 ${startdate(40)}`,
      field: "week40",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 40
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-41 ${startdate(41)}`,
      field: "week41",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 41
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-42 ${startdate(42)}`,
      field: "week42",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 42
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-43 ${startdate(43)}`,
      field: "week43",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 43
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-44 ${startdate(44)}`,
      field: "week44",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 44
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-45 ${startdate(45)}`,
      field: "week45",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 45
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-46 ${startdate(46)}`,
      field: "week46",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 46
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-47 ${startdate(47)}`,
      field: "week47",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 47
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-48 ${startdate(48)}`,
      field: "week48",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 48
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-49 ${startdate(49)}`,
      field: "week49",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 49
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-50 ${startdate(50)}`,
      field: "week50",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 50
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-51 ${startdate(51)}`,
      field: "week51",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 51
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      headerName: `Week-52 ${startdate(52)}`,
      field: "week52",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      width: 140,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 52
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "center",
              borderRight: "1px solid #dde2eb",
            },
    },
  ];
  return (
    <>
      {/* ///////////* New One  */}

      <div className="container-fluid pt-4">
        {/* <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="text-decoration-underline">Allocation</h4>
            <p className="bredcram-subhead">
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("")}
              >
                Dashboard
              </span>{" "}
              /{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => navigate("/Allocation")}
              >
                Allocation
              </span>{" "}
              /{" "}
              <span className="cursor-pointer" onClick={() => navigate("")}>
                Project
              </span>
            </p>
          </div>
        </div> */}
        <div className="row pt-2  mx-1">
          <div className="card bag-card">
            <div className="col-md-12 d-flex justify-content-between">
              <div className="d-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="42"
                  fill="currentColor"
                  className="bi bi-file-person text-white ms-2 pt-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                  <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
                <h4 className="head-namee pt-2 ms-2">Resource Allocation</h4>
              </div>
              <div>
                <h4 className="bredcram-subhead pt-4">
                  <span
                    className="text-primary cursor-pointer"
                    onClick={() => navigate("")}
                  >
                    Dashboard
                  </span>
                  <span className="text-white"> / </span>
                  <span
                    className="cursor-pointer text-white"
                    onClick={() => navigate("/Allocation")}
                  >
                    Allocation
                  </span>
                  <span className="text-white"> / </span>
                  <span
                    className="cursor-pointer text-white"
                    onClick={() => navigate("/Project")}
                  >
                    Project
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          {openmodal === "EmployeeAdded" && (
            <SuccessModal
              pageType={"success"}
              setModal={setOpenModal}
              message={"Employee Added Successfully"}
              showModal={true}
            />
          )}
          {globalMsg === "ScheduleVal" && (
            <SuccessModal
              setModal={setGlobalMsg}
              message={"All fields are mandatory"}
              showModal={true}
              pageType={"warning"}
            />
          )}
          <div className="col-md-12">
            {warningmodal === "validText" && (
              <SuccessModal
                pageType={"warning"}
                setModal={setWarningModal}
                message={"Enter Valid Allocation Value"}
                showModal={true}
              />
            )}
            <div className="card shadow">
              <div className="card-body ">
                <h5 className="card-title ms-3">Project&nbsp;Details</h5>
                <div className="col-md-12">
                  <div className="card shadow mb-2">
                    <div className="card-body mt-2 adjust-head-card">
                      <div className="row">
                        <div className="col-sm-3 col-md-3">
                          <p className="opacity-75">Project&nbsp;Name</p>
                          <p className="Manager-main-forteen">
                            <b>{projdetails?.ProjectName} </b>
                          </p>
                        </div>
                        <div className="col-sm-3 col-md-3">
                          <p className="opacity-75 ">
                            Project&nbsp;&nbsp;Manager
                          </p>
                          <p className="Manager-main-forteen">
                            <b>{projdetails?.ProjectManager} </b>
                          </p>
                        </div>
                        <div className="col-sm-3 col-md-3">
                          <p className="opacity-75 ">Start&nbsp;Date</p>
                          <p className="Manager-main-forteen">
                            <b>
                              {projdetails?.StartDate
                                ? format(
                                    new Date(projdetails?.StartDate),
                                    "dd-MM-yyyy"
                                  )
                                : "-"}
                            </b>
                          </p>
                        </div>
                        <div className="col-sm-3 col-md-3">
                          <p className="opacity-75 ">End&nbsp;Date</p>
                          <p className="Manager-main-forteen">
                            <b>
                              {projdetails?.EndDate
                                ? format(
                                    new Date(projdetails?.EndDate),
                                    "dd-MM-yyyy"
                                  )
                                : "-"}
                            </b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="ag-theme-alpine" style={{ height: 325 }}>
                    <AgGridReact
                      rowData={rowData}
                      columnDefs={columnDefs}
                      // pagination={true}
                      // paginationPageSize={5}
                      // rowDragManaged={false}
                    ></AgGridReact>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}

      <div
        className="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Allocate Resource
              </h1>
            </div>
            <form>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Employee Name
                    </label>

                    {/* <select className="form-select" onChange={onChangeEmpName}>
                      <option hidden value="0">
                        --Select--
                      </option>
                      {employeedata?.map((itr: any, i: any) => {
                        return (
                          <option defaultValue={itr.ID}>{itr.Name}</option>
                        );
                      })}
                    </select> */}
                    <ComboBox
                      // options={options}
                      options={returnedTarget}
                      styles={comboBoxStyles}
                      allowFreeInput
                      autoComplete="on"
                      onChange={onChangeWeekDropdownProject}
                    />
                    {globalMsg && <p>this field is mandatory </p>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
                      Billable
                    </label>

                    <select
                      className="form-select"
                      onChange={(e) =>
                        setProjectAllocationData({
                          ...projectAllocationData,
                          Billable_YN: e.target.value,
                        })
                      }
                    >
                      <option hidden value="0">
                        --Select--
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      Utilization
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        setProjectAllocationData({
                          ...projectAllocationData,
                          Utilization_Percent: e.target.value,
                        })
                      }
                    >
                      <option value="0">--Select--</option>
                      <option value="0%">0%</option>
                      <option value="25%">25%</option>
                      <option value="50%">50%</option>
                      <option value="100%">100%</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputAddress2" className="form-label">
                      Rate
                    </label>
                    <input
                      onChange={(e) =>
                        setProjectAllocationData({
                          ...projectAllocationData,
                          Rate: e.target.value,
                        })
                      }
                      type="text"
                      className="form-control"
                      id="inputAddress2"
                      placeholder="Rate"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      Weeks
                    </label>
                    <Stack tokens={stackTokens}>
                      <Dropdown
                        placeholder="Select options"
                        defaultSelectedKeys={["apple", "banana", "grape"]}
                        multiSelect
                        onChange={onChangeWeekDropdown}
                        options={WeekOptions}
                        styles={dropdownStyles}
                      />
                    </Stack>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="inputState" className="form-label">
                      Bench
                    </label>

                    <select
                      className="form-select"
                      onChange={(e) =>
                        setProjectAllocationData({
                          ...projectAllocationData,
                          Bench_YN: e.target.value,
                        })
                      }
                    >
                      <option hidden value="0">
                        --Select--
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary  btn-wid"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  onClick={() => AllocateResource(data, projectAllocationData)}
                  type="button"
                  className="btn btn-color btn-wid"
                  data-bs-dismiss="modal"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectNonEdit;
