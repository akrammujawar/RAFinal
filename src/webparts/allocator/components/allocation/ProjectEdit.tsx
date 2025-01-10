import * as React from "react";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import * as _ from "lodash";
import { format } from "date-fns";
import { useState } from "react";
// import Pagination from "../../UIComponent/Pagination";
import SuccessModal from "../common/SuccessModal";
import {
  // Dropdown,
  IComboBox,
  IComboBoxOption,
  // IComboBoxStyles,
  IDropdownOption,
  IDropdownStyles,
  Modal,
} from "@fluentui/react";
import * as moment from "moment";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ComboBox } from "@fluentui/react";
// import { useState } from "react";
// import { Dropdown, Stack } from "office-ui-fabric-react";

const ProjectEdit: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  const _sharePointServiceProxy: SharePointServiceProxy =
    new SharePointServiceProxy(props?.context, props?.webURL);
  const [edit, setEdit] = React.useState<any>([]);
  const [ProEmpID, setProEmpID] = useState<number>();
  const [fullEmpList, setFullEmpList] = useState<any[]>([]);
  const [returnedTarget, setreturnedTarget] = useState<any>();
  const [currentWeek, setCurrentWeek] = useState<any>();
  const [show, setShow] = useState<boolean>(false);
  const [shows, setShows] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState<any>("");
  console.log(selectedWeek);
  const [weekPosition, setWeekPositions] = useState<any[]>([]);
  const [weekRange, setWeekRange] = useState<any[]>([]);
  const [dateRangeOptions, setDateRangeOptions] = useState<any>([]);
  // const [newarr, setnewarr] = useState([]);
  // console.log("newarrr....",newarr)
  console.log(weekRange)
  // const [commonElements, setCommonElements] = useState<string[]>([]);

  const [projectAllocationData, setProjectAllocationData] = React.useState<any>(
    {
      Employee_IDId: 0,
      Billable_YN: "",
      Billiability: "",
      BillableFrom: "",
      BillableTill: "",
      Utilization_Percent: "",
      Project_IdId: 0,
    }
  );
  const [employeedata, setEmployeetData] = React.useState<any>([]);

  // Project Details//
  const [projdetails, setProjDetails] = useState<any>();

  // Success Modal//
  const [updatemodal, setUpdateModal] = useState<string>("");
  const [openmodal, setOpenModal] = useState<string>("");
  const [globalMsg, setGlobalMsg] = useState<boolean>(false);
  const [warningmodal, setWarningModal] = useState<string>("");

  // Weeks table dropdowns //
  // Weeks selecting in Modal with dates //
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

  // const stackTokens: IStackTokens = { childrenGap: 20 };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 215 },
  };
  // const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };

  // const WeekOptions1: IDropdownOption[] = [

  //   { key: "week1", text: `week1 [${startdate(1)}]`, disabled:(currentWeek > 1) ? true : false},
  //   { key: "week2", text: `week2 [${startdate(2)}]`, disabled:(currentWeek > 2) ? true : false },
  //   { key: "week3", text: `week3 [${startdate(3)}]`, disabled:(currentWeek > 3) ? true : false },
  //   { key: "week4", text: `week4 [${startdate(4)}]`, disabled:(currentWeek > 4) ? true : false },
  //   { key: "week5", text: `week5 [${startdate(5)}]`, disabled:(currentWeek > 5) ? true : false },
  //   { key: "week6", text: `week6 [${startdate(6)}]`, disabled:(currentWeek > 6) ? true : false },
  //   { key: "week7", text: `week7 [${startdate(7)}]`, disabled:(currentWeek > 7) ? true : false },
  //   { key: "week8", text: `week8 [${startdate(8)}]`, disabled:(currentWeek > 8) ? true : false },
  //   { key: "week9", text: `week9 [${startdate(9)}]`, disabled:(currentWeek > 9) ? true : false },
  //   { key: "week10", text: `week10 [${startdate(10)}]`, disabled:(currentWeek> 10) ? true : false },
  //   { key: "week11", text: `week11 [${startdate(11)}]`, disabled:(currentWeek > 11) ? true : false },
  //   { key: "week12", text: `week12 [${startdate(12)}]`, disabled:(currentWeek > 12) ? true : false },
  //   { key: "week13", text: `week13 [${startdate(13)}]`, disabled:(currentWeek > 13) ? true : false },
  //   { key: "week14", text: `week14 [${startdate(14)}]`, disabled:(currentWeek > 14) ? true : false },
  //   { key: "week15", text: `week15 [${startdate(15)}]`, disabled:(currentWeek > 15) ? true : false },
  //   { key: "week16", text: `week16 [${startdate(16)}]`, disabled:(currentWeek > 16) ? true : false },
  //   { key: "week17", text: `week17 [${startdate(17)}]`, disabled:(currentWeek > 17) ? true : false },
  //   { key: "week18", text: `week18 [${startdate(18)}]`, disabled:(currentWeek > 18) ? true : false },
  //   { key: "week19", text: `week19 [${startdate(19)}]`, disabled:(currentWeek > 19) ? true : false },
  //   { key: "week20", text: `week20 [${startdate(20)}]`, disabled:(currentWeek > 20) ? true : false },
  //   { key: "week21", text: `week21 [${startdate(21)}]`, disabled:(currentWeek > 21) ? true : false },
  //   { key: "week22", text: `week22 [${startdate(22)}]`, disabled:(currentWeek > 22) ? true : false },
  //   { key: "week23", text: `week23 [${startdate(23)}]`, disabled:(currentWeek > 23) ? true : false },
  //   { key: "week24", text: `week24 [${startdate(24)}]`, disabled:(currentWeek > 24) ? true : false },
  //   { key: "week25", text: `week25 [${startdate(25)}]`, disabled:(currentWeek > 25) ? true : false },
  //   { key: "week26", text: `week26 [${startdate(26)}]`, disabled:(currentWeek > 26) ? true : false },
  //   { key: "week27", text: `week27 [${startdate(27)}]`, disabled:(currentWeek > 27) ? true : false },
  //   { key: "week28", text: `week28 [${startdate(28)}]`, disabled:(currentWeek > 28) ? true : false },
  //   { key: "week29", text: `week29 [${startdate(29)}]`, disabled:(currentWeek > 29) ? true : false },
  //   { key: "week30", text: `week30 [${startdate(30)}]`, disabled:(currentWeek > 30) ? true : false },
  //   { key: "week31", text: `week31 [${startdate(31)}]`, disabled:(currentWeek > 31) ? true : false },
  //   { key: "week32", text: `week32 [${startdate(32)}]`, disabled:(currentWeek > 32) ? true : false },
  //   { key: "week33", text: `week33 [${startdate(33)}]`, disabled:(currentWeek > 33) ? true : false },
  //   { key: "week34", text: `week34 [${startdate(34)}]`, disabled:(currentWeek > 34) ? true : false },
  //   { key: "week35", text: `week35 [${startdate(35)}]`, disabled:(currentWeek > 35) ? true : false },
  //   { key: "week36", text: `week36 [${startdate(36)}]`, disabled:(currentWeek > 36) ? true : false },
  //   { key: "week37", text: `week37 [${startdate(37)}]`, disabled:(currentWeek > 37) ? true : false },
  //   { key: "week38", text: `week38 [${startdate(38)}]`, disabled:(currentWeek > 38) ? true : false },
  //   { key: "week39", text: `week39 [${startdate(39)}]`, disabled:(currentWeek > 39) ? true : false },
  //   { key: "week40", text: `week40 [${startdate(40)}]`, disabled:(currentWeek > 40) ? true : false },
  //   { key: "week41", text: `week41 [${startdate(41)}]`, disabled:(currentWeek > 41) ? true : false },
  //   { key: "week42", text: `week42 [${startdate(42)}]`, disabled:(currentWeek > 42) ? true : false },
  //   { key: "week43", text: `week43 [${startdate(43)}]`, disabled:(currentWeek > 43) ? true : false },
  //   { key: "week44", text: `week44 [${startdate(44)}]`, disabled:(currentWeek > 44) ? true : false },
  //   { key: "week45", text: `week45 [${startdate(45)}]`, disabled:(currentWeek > 45) ? true : false },
  //   { key: "week46", text: `week46 [${startdate(46)}]`, disabled:(currentWeek > 46) ? true : false },
  //   { key: "week47", text: `week47 [${startdate(47)}]`, disabled:(currentWeek > 47) ? true : false },
  //   { key: "week48", text: `week48 [${startdate(48)}]`, disabled:(currentWeek > 48) ? true : false },
  //   { key: "week49", text: `week49 [${startdate(49)}]`, disabled:(currentWeek > 49) ? true : false },
  //   { key: "week50", text: `week50 [${startdate(50)}]`, disabled:(currentWeek > 50) ? true : false },
  //   { key: "week51", text: `week51 [${startdate(51)}]`, disabled:(currentWeek > 51) ? true : false },
  //   { key: "week52", text: `week52 [${startdate(52)}]`, disabled:(currentWeek > 52) ? true : false },
  // ];
  const WeekOptions: IDropdownOption[] = [];
  for (let i = 1; i < 53; i++) {
    WeekOptions.push({
      key: `week${i}`,
      // text: `week${i} [${startdate(i)}]`,
      text: `${startdate(i)}`,
      // hidden: currentWeek > i ? true : false,
      // disabled: currentWeek > i ? true : false,
    });
  }
 

  React.useEffect(() => {
    setCurrentWeek(moment().week());
    // identifyWeekPositions();

    ProjectAllocationlist();
    getEmployeeName();
    getEmpNameTypeahed();
  }, []);

  async function ProjectAllocationlist() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "ProjectAllocation",
      fields: [
        "Title",
        "ID",
        "Utilization_Percent",
        "Employee_ID/Employee_Id",
        "Employee_ID/ID",
        "Employee_ID/Name",
        "Employee_ID/Active",
        "Project_Id/ID",
        "Billiability",
        "BillableFrom",
        "BillableTill",
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
      // filter: `Project_Id/ProjectName eq '${projdetails?.ProjectName}'`,
      isRoot: true,
      top: 5000,
    });

    setEdit(items);

    // let projectid = edit.map((itr: any) => {
    //   return itr?.ID;
    // });
    // console.log("allocation data .....", projectid);
    // setRowData(items);
    // console.log("main data...", edit);

    // getEmpName(items[0]?.Employee_ID?.Employee_Id);
    // console.log("data....", items);
  }
  // TODO:employee id pass

  // const getEmpName = async (empid: any) => {
  //   let empName: any = await _sharePointServiceProxy.getItems({
  //     listName: "Employee",
  //     fields: ["Employee_Id", "Name"],
  //     isRoot: true,
  //   });

  //   // let getEmpID = empName.find((fnd: any) => {
  //   //   if (fnd.Employee_Id === empid) {
  //   //     return fnd.Id;
  //   //   }
  //   // });

  //   // console.log("emp name here ", empid, getEmpID);
  //   setempName(empName[0]?.Name);
  // };

  const [data, setData] = React.useState<any>({});
  const [selectedWeeks, setSelectedWeeks] = useState<any[]>([]);

  React.useEffect(() => {
    setSelectedWeeks([]);
  }, []);
   
  
  const onChangeWeekDropdown = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    if (!projectAllocationData.Utilization_Percent) {
      alert("Please select Utilisation Billiability");
    } else {
      if (option.selected) {
        selectedWeeks.push(option.key as string);
      } else {
        selectedWeeks.indexOf(option.key) !== -1 &&
          selectedWeeks.splice(
            selectedWeeks.indexOf(option.key),
            selectedWeeks.filter((ftr) => ftr === option.key).length
          );
      }

      if (selectedWeeks.length > 0) {
        for (let i = 0; i < selectedWeeks.length; i++) {          
          projectAllocationData[selectedWeeks[i]] = JSON.stringify([{"Billiability": projectAllocationData.Billiability} ,{"Utilization": projectAllocationData.Utilization_Percent }])
            // projectAllocationData.Utilization_Percent;
        }
      }
    }
    // console.log("selectedWeks ", selectedWeeks.length);
  };

  async function UpdateEmployeeData() {
    let item = await _sharePointServiceProxy
      .updateItem("ProjectAllocation", ProEmpID, data, ["a"], true)
      .then((res) => alert("item updated..."));
    setData({});
    console.log(item);
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
      top: 5000,
    });
    setEmployeetData(items);
    console.log(employeedata);
  }

  async function AllocateResource(id: any) {
    if (validate()) {
      let proID: any = [];
      rowData.filter((itr: any) => {
        if (
          itr?.Employee_ID?.ID === projectAllocationData?.Employee_IDId &&
          proID.push(id)
        ) {
        }
      });
      if (proID.length > 0) {
        let findid = rowData?.filter(
          (itr: any) =>
            itr?.Employee_ID?.ID === projectAllocationData?.Employee_IDId &&
            itr?.Project_Id?.ID === projectAllocationData?.Project_IdId
        );
        await _sharePointServiceProxy.updateItem(
          "ProjectAllocation",
          // proID[0],
          findid[0]?.ID,
          projectAllocationData,
          [],
          true
        );
        setUpdateModal("EmployeeUpdated");
        setGlobalMsg(false);
        ProjectAllocationlist();
        setShow(false);
        setProjectAllocationData({});
        // clearFields()
      } else {
        // alert("else")
        await _sharePointServiceProxy
          .addItem("ProjectAllocation", projectAllocationData, [], true)
          .then(() => {
            setOpenModal("EmployeeAdded");
            setGlobalMsg(false);
            ProjectAllocationlist();
            setShow(false);
            setProjectAllocationData({});
            // clearFields()
          });
        // console.log(projectAllocationData);
      }
    }
  }

  // function clearFields(){
  //   projectAllocationData?.Employee_IDId === 0
  //   projectAllocationData?.Billable_YN === ""
  //   projectAllocationData?.Billiability === ""
  //   projectAllocationData?.BillableFrom === ""
  //   projectAllocationData?.BillableTill === ""
  //   projectAllocationData?.Utilization_Percent === ""
  // }

  function validate() {
    // console.log(globalMsg)
    if (
      projectAllocationData?.Employee_IDId === 0 ||
      projectAllocationData?.Billable_YN === "" ||
      projectAllocationData?.Billiability === "" ||
      projectAllocationData?.BillableFrom === "" ||
      projectAllocationData?.BillableTill === "" ||
      projectAllocationData?.Utilization_Percent === ""
      // projectAllocationData?.Utilization_Percent === "" ||
      // projectAllocationData?.Rate === "" ||
      // projectAllocationData?.Bench_YN === ""
    ) {
      setGlobalMsg(true);
      return false;
    } else {
      setGlobalMsg(false);
      return true;
    }
  }

  // Combobox func
  const OnChangeAddEmployee = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    // console.log(value, option);

    let getProId = fullEmpList.find((item: any) => {
      if (item.Employee_Id === option.key) {
        return item.Id;
      }
    });

    // console.log(getProId);

    setProjectAllocationData({
      ...projectAllocationData,
      Employee_IDId: getProId.Id,
      Project_IdId: props?.data?.ID,
    });
  };

  async function getEmpNameTypeahed() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "Employee",
      fields: ["Employee_Id", "Name", "ID","Active"],
      isRoot: true,
      top: 5000,
    });
    setFullEmpList(items);
    // console.log("Employee data... ", items);

    const ActiveEmployees = items.filter((itr:any) => {
      return itr?.Active === "Yes";
    });

    let partialArr = ActiveEmployees?.map(({ Name, Employee_Id }) => ({
      key: Employee_Id,
      text: Name,
    }));
    setreturnedTarget(_.uniqWith(partialArr, _.isEqual));

   
  }

  // Navigations of bredcrams//
  const navigate = useNavigate();

  // Onchange dropdowns //

  function onCellValueChanged(params: any) {
    let field = params.colDef.field;
    let value = params.value;
    let cell = params.api.getFocusedCell();
    setProEmpID(parseInt(params.data.ID));
    if (
      params.value === "0" ||
      params.value === "25" ||
      params.value === "50" ||
      params.value === "75" ||
      params.value === "100"
    ) {
      params.api.setFocusedCell(cell.rowIndex, cell.column);

      if (field == "week1") {
        setData({ week1: value });
      }
      if (field == "week2") {
        setData({ week2: value });
      }
      if (field == "week3") {
        setData({ week3: value });
      }
      if (field == "week4") {
        setData({ week4: value });
      }
      if (field == "week5") {
        setData({ week5: value });
      }
      if (field == "week6") {
        setData({ week6: value });
      }
      if (field == "week7") {
        setData({ week7: value });
      }
      if (field == "week8") {
        setData({ week8: value });
      }
      if (field == "week9") {
        setData({ week9: value });
      }
      if (field == "week10") {
        setData({ week10: value });
      }
      if (field == "week11") {
        setData({ week11: value });
      }
      if (field == "week12") {
        setData({ week12: value });
      }
      if (field == "week13") {
        setData({ week13: value });
      }
      if (field == "week14") {
        setData({ week14: value });
        setOpenModal("Employee Data added Successfully");
        alert("added successfully");
      }
      if (field == "week15") {
        setData({ week15: value });
      }
      if (field == "week16") {
        setData({ week16: value });
      }
      if (field == "week17") {
        setData({ week17: value });
      }
      if (field == "week18") {
        setData({ week18: value });
      }
      if (field == "week19") {
        setData({ week19: value });
      }
      if (field == "week20") {
        setData({ week20: value });
      }
      if (field == "week21") {
        setData({ week21: value });
      }
      if (field == "week22") {
        setData({ week22: value });
      }
      if (field == "week23") {
        setData({ week23: value });
      }
      if (field == "week24") {
        setData({ week24: value });
      }
      if (field == "week25") {
        setData({ week25: value });
      }
      if (field == "week26") {
        setData({ week26: value });
      }
      if (field == "week27") {
        setData({ week27: value });
      }
      if (field == "week28") {
        setData({ week28: value });
      }
      if (field == "week29") {
        setData({ week29: value });
      }
      if (field == "week30") {
        setData({ week30: value });
      }
      if (field == "week31") {
        setData({ week31: value });
      }
      if (field == "week32") {
        setData({ week32: value });
      }
      if (field == "week33") {
        setData({ week33: value });
      }
      if (field == "week34") {
        setData({ week34: value });
      }
      if (field == "week35") {
        setData({ week35: value });
      }
      if (field == "week36") {
        setData({ week36: value });
      }
      if (field == "week37") {
        setData({ week37: value });
      }
      if (field == "week38") {
        setData({ week38: value });
      }
      if (field == "week39") {
        setData({ week39: value });
      }
      if (field == "week40") {
        setData({ week40: value });
      }
      if (field == "week41") {
        setData({ week41: value });
      }
      if (field == "week42") {
        setData({ week42: value });
      }
      if (field == "week43") {
        setData({ week43: value });
      }
      if (field == "week44") {
        setData({ week44: value });
      }
      if (field == "week45") {
        setData({ week45: value });
      }
      if (field == "week46") {
        setData({ week46: value });
      }
      if (field == "week47") {
        setData({ week47: value });
      }
      if (field == "week48") {
        setData({ week48: value });
      }
      if (field == "week49") {
        setData({ week49: value });
      }
      if (field == "week50") {
        setData({ week50: value });
      }
      if (field == "week51") {
        setData({ week51: value });
      }
      if (field == "week52") {
        setData({ week52: value });
      }
      // console.log("cellvaluechanged...", params);
    } else {
      setWarningModal("validText");
      setData(data);
    }
  }
  // Ag-Grid implementation //

  // console.log("EmployeeNAmes......", rowData);

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
      headerName: `Week-1 ${startdates(1)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week1;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week1;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              // borderRight: "1px solid #dde2eb",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]
  },
 
  {
    headerName: `Week-2 ${startdates(2)}`,
    headerClass:"customcss",
    children: [
      {     
             
    field:"Billiability",
    valueFormatter: (params: any) => {  
     let Billiability =params?.data?.week2;
     let  data = JSON.parse(Billiability);             
       return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
    },
    editable: currentWeek > 1 ? false : true,
    singleClickEdit: true,
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
            backgroundColor: "gainsboro",
            textAlign: "Center",
            borderRight: "1px solid #dde2eb",
          },
  },
  {
    // field: "week1",
    field: "Utilization",
    headerClass:"customcss",
    valueFormatter: (params: any) => {
      let Utilization =params?.data?.week2;
     let  data = JSON.parse(Utilization);             
       return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
      // return params.value === null ? " " : params.value + "%";
    },
    editable: currentWeek > 1 ? false : true,
    singleClickEdit: true,
    width: 130,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellStyle: (params: any) =>
      currentWeek > 1
        ? {
             backgroundColor: "gainsboro",
            textAlign: "center",
            borderRight: "1px solid gray",
            
          }
        : {
             backgroundColor: "#fff",
            textAlign: "Center",
            borderRight: "1px solid gray",
          },
  },
]
    
  },
   
  {
      headerName: `Week-3 ${startdates(2)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week3;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week3;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              // borderRight: "1px solid #dde2eb",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              // borderRight: "1px solid #dde2eb",
              borderRight: "1px solid gray",
            },
    },
  ]

    },


    {
      headerName: `Week-4 ${startdates(4)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week4;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week4;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              // borderRight: "1px solid #dde2eb",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              // borderRight: "1px solid #dde2eb",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-5 ${startdates(5)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week5;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week5;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-6 ${startdates(6)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week6;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week6;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-7 ${startdates(7)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week7;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week7;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-8 ${startdates(8)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week8;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week8;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-9 ${startdates(9)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week9;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week9;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-10 ${startdates(10)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week10;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week10;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-11 ${startdates(11)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week11;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week11;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-12 ${startdates(12)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week12;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week12;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-13 ${startdates(13)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week13;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week13;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-14 ${startdates(14)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week14;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week14;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-15 ${startdates(15)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week15;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week15;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-16 ${startdates(16)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week16;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week16;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-17 ${startdates(17)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week17;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week17;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-18 ${startdates(18)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week18;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week18;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-19 ${startdates(19)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week19;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week19;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-20 ${startdates(20)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week20;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week20;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-21 ${startdates(21)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week21;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week21;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-22 ${startdates(22)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week22;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week22;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-23 ${startdates(23)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week23;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week23;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-24 ${startdates(24)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week24;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week24;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },
    {
      headerName: `Week-25 ${startdates(25)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week25;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week25;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },
    
    {
      headerName: `Week-26 ${startdates(26)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week26;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week26;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-27 ${startdates(27)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week27;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week27;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-28 ${startdates(28)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week28;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week28;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-29 ${startdates(29)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week29;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week29;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    }, 
    
    {
      headerName: `Week-30 ${startdates(30)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week30;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week30;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },
    {
      headerName: `Week-31 ${startdates(31)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week31;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week31;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-32 ${startdates(32)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week32;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week32;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-33 ${startdates(33)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week33;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week33;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-34 ${startdates(34)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week34;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week34;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-35 ${startdates(35)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week35;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week35;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-36 ${startdates(36)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week36;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week36;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-37 ${startdates(37)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week37;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
    headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week37;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-38 ${startdates(38)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week38;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week38;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-39 ${startdates(39)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week39;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week39;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-40 ${startdates(40)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week40;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week40;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-41 ${startdates(41)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week41;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week41;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-42 ${startdates(42)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week42;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week42;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },
    {
      headerName: `Week-43 ${startdates(43)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week43;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week43;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-44 ${startdates(44)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week44;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week44;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-45 ${startdates(45)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week45;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week45;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-46 ${startdates(46)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week46;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week46;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-47 ${startdates(47)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week47;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week47;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-48 ${startdates(48)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week48;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week48;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },
    {
      headerName: `Week-49 ${startdates(49)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week49;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week49;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-50 ${startdates(50)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week50;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week50;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-51 ${startdates(51)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week51;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week51;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

    {
      headerName: `Week-52 ${startdates(52)}`,
      headerClass:"customcss",
      children: [
        {     
               
      field:"Billiability",
      valueFormatter: (params: any) => {  
       let Billiability =params?.data?.week52;
       let  data = JSON.parse(Billiability);             
         return data && data.length > 0 ? data[0] && data[0]?.Billiability + "%" : " ";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
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
              textAlign: "Center",
              borderRight: "1px solid #dde2eb",
            },
    },
    {
      // field: "week1",
      field: "Utilization",
      headerClass:"customcss",
      valueFormatter: (params: any) => {
        let Utilization =params?.data?.week52;
       let  data = JSON.parse(Utilization);             
         return data && data.length > 0 ? data[1] && data[1]?.Utilization + "%" : " ";
        // return params.value === null ? " " : params.value + "%";
      },
      editable: currentWeek > 1 ? false : true,
      singleClickEdit: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 1
          ? {
              backgroundColor: "gainsboro",
              textAlign: "center",
              borderRight: "1px solid gray",
            }
          : {
              backgroundColor: "#fff",
              textAlign: "Center",
              borderRight: "1px solid gray",
            },
    },
  ]

    },

  ];

  const handleClick = (modalData: any) => {
    // (modalData)
    // alert("Hello World")

    setProjDetails(modalData);
    // console.log("handleclick", modalData);
    setRowData(edit.filter((itr: any) => itr?.Project_Id?.ID === modalData.ID && itr?.Employee_ID?.Active === 
    "Yes"));
    // setRowData(rowdata);
    // setProjectViewData("ProjectViewa");
    // console.log("Aggridview...", rowdata);

    setShows(true);
  };

  const cancelpopup = () => {
    setShows(false);
  };

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
    setProjectAllocationData((prev: any) => {
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
    setProjectAllocationData((prev: any) => {
      return { ...prev, [inputName]: date };
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
  
  const getWeeksBetweenDates = (start: any, end: any) => {
    const weeks = [];
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
        // options.push(`{${itr?.start} - ${itr?.end}}`)
        options.push({
          key: `${itr?.start}-${itr?.end}`,
          text: `${itr?.start}-${itr?.end}`,
        })
      );
      // console.log("latest weeks options......", options);
      // console.log("latest weeks ......", weeks);

      // setWeekRange((prev: any) => [...prev, ...options]);

      setWeekRange(options);
    }
  };

  // New dates without button //
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
   
  // console.log("dates////new///",dateRangeOptions)

  React.useEffect(() => {
    if (startDate && endDate) {
      generateDateRangeOptions();
    }
  }, [startDate, endDate]);

  // position ////
  const identifyWeekPositions = () => {
    const start = moment(startDate, 'DD-MM-YY');
    const end = moment(endDate, 'DD-MM-YY');

    const weekPositions = [];

    while (start.isSameOrBefore(end)) {
      weekPositions.push(start.isoWeek());
      start.add(1, 'week');
    }

    setWeekPositions(weekPositions);
  };
  console.log(weekPosition)

  // Position

  

  // const compareArrays = () => {
  //   const filteredArray:any = WeekOptions.filter((element) => weekRange.indexOf(element) !== -1);
  //   setCommonElements(filteredArray);
  // };
  // console.log("array comparision.....",commonElements);
 
  // const compareArrays = () => {
  let newArr:any[] = [];
  dateRangeOptions.map((itr:any, index:any)=>{
    WeekOptions.filter(ftr=>{
    if(ftr.text === dateRangeOptions[index] ){
        newArr.push(ftr)
    }
})
})
// setnewarr(newArr);
// console.log("newarrayvalues......./////",newArr)
  // }



  return (
    <>
      {/* ///////////* New One  */}
      <div>
        <svg
          onClick={() => {
            handleClick(props?.data);
          }}
          xmlns="ttp://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="#229ed9"
          className="bi bi-plus-square point plus-icon ms-3 mb-1"
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        {/* {projectviewdata === "ProjectViewa" && ( */}
        <Modal
          isOpen={shows}
          onDismiss={() => setShows(false)}
          isBlocking={true}
          className="modal-width"
        >
          <div>
            <div className="container-fluid">
              <div className="row mt-4 pt-2 mx-0">                
                  <div className="col-6">
                    <div className="d-flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="42"
                        fill="#000000"
                        className="bi bi-file-person text-white ms-2 pt-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
                        <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                      </svg>
                      
                    
                    <div>
                    <h4 className=" pt-2 ms-2">
                        Resource Allocation
                      </h4>
                      <h3 className="bredcram-subhead ms-2">
                        <span
                          className="text-primary cursor-pointer"
                          onClick={() => navigate("")}
                        >
                          Dashboard
                        </span>
                        <span> / </span>
                        <span
                          className="cursor-pointer"
                          // onClick={() => navigate("/Allocation")}
                          onClick={cancelpopup}
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
                      </h3>
                    </div>
                    </div>
                  </div>
                
              <div className="col-6">
              <div className="d-flex justify-content-end align-items-center mb-2 pt-2 ms-1 me-1 text-end">
                <svg
                  onClick={() => {
                    setShow(true);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#229ed9"
                  className="bi bi-plus-square point add-icon"
                  viewBox="0 0 16 16"
                  data-bs-toggle="modal"
                  // data-bs-target="#staticBackdrop2"
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
                {openmodal === "EmployeeAdded" && (
                  <SuccessModal
                    pageType={"success"}
                    setModal={setOpenModal}
                    message={"Employee Added Successfully"}
                    showModal={true}
                  />
                )}
                {updatemodal === "EmployeeUpdated" && (
                  <SuccessModal
                    pageType={"success"}
                    setModal={setUpdateModal}
                    message={"Employee Updated Successfully"}
                    showModal={true}
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
                        <div
                          className="ag-theme-alpine"
                          style={{ height: 325 }}
                        >
                          <AgGridReact
                            rowData={rowData}
                            columnDefs={columnDefs}
                            onCellValueChanged={onCellValueChanged}
                          ></AgGridReact>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-2 mt-2">
                <button className="btn btn-secondary" onClick={cancelpopup}>
                  Cancel
                </button>
              </div>
            </div>

            {/* MODAL */}

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

                          <ComboBox
                          className="cmbocss"
                            defaultSelectedKey={""}
                            options={returnedTarget}
                            placeholder="Employee Name"
                            allowFreeInput
                            autoComplete="on"
                            onChange={OnChangeAddEmployee}
                          />
                          {!projectAllocationData?.Employee_IDId && (
                            <p
                              className={`${
                                globalMsg
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
                          {!projectAllocationData?.Billable_YN && (
                            <p
                              className={`${
                                globalMsg
                                  ? "d-block text-danger mb-0 error-feild-size"
                                  : "d-none"
                              }`}
                            >
                              *This field is mandatory
                            </p>
                          )}
                        </div>
                        <div className="col-md-6">
                          {/* <label htmlFor="inputCity" className="form-label">
                      Billiability
                    </label>
                    <input
                      onChange={(e) =>
                        setProjectAllocationData({
                          ...projectAllocationData,
                          Billiability: e.target.value,
                        })
                      }
                      type="text"
                      className="form-control"
                      id="inputAddress2"
                      placeholder="Billiability"
                    />
                    {!projectAllocationData?.Billiability && (
                      <p
                        className={`${globalMsg
                          ? "d-block text-danger mb-0 error-feild-size"
                          : "d-none"
                          }`}
                      >
                        *This field is mandatory
                      </p>
                    )} */}
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
                            // value={startDate}
                            onChange={handleStartDateChange}
                            type="date"
                            className="form-control"
                            id="inputAddress2"
                            name="BillableFrom"
                            placeholder="Billiable From"
                          />
                          {!projectAllocationData?.BillableFrom && (
                            <p
                              className={`${
                                globalMsg
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
                            Billable To
                          </label>
                          <input
                            // onChange={(e) =>
                            //   setProjectAllocationData({
                            //     ...projectAllocationData,
                            //     BillableTill: e.target.value,
                            //   })
                            // }
                            // value={endDate}
                            min={startDate}
                            onChange={handleEndDateChange}
                            type="date"
                            className="form-control"
                            id="inputAddress2"
                            placeholder="Billiable Till"
                            name="BillableTill"
                          />
                          {!projectAllocationData?.BillableTill && (
                            <p
                              className={`${
                                globalMsg
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
                              setProjectAllocationData({
                                ...projectAllocationData,
                                Billiability: e.target.value,
                              })
                            }
                          >
                            <option value="0">--Select--</option>
                            <option value="0">0%</option>
                            <option value="25">25%</option>
                            <option value="50">50%</option>
                            <option value="100">100%</option>
                          </select>
                          {!projectAllocationData?.Billiability && (
                            <p
                              className={`${
                                globalMsg
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
                              setProjectAllocationData({
                                ...projectAllocationData,
                                Utilization_Percent: e.target.value,
                              })
                            }
                          >
                            <option value="0">--Select--</option>
                            <option value="0">0%</option>
                            <option value="25">25%</option>
                            <option value="50">50%</option>
                            <option value="100">100%</option>
                          </select>
                          {!projectAllocationData?.Utilization_Percent && (
                            <p
                              className={`${
                                globalMsg
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

                          <ComboBox
                          className="cmbocss"
                            placeholder="Select options"
                            multiSelect
                            onChange={onChangeWeekDropdown}
                            // options={WeekOptions}
                            options={newArr}
                            // options={selectedWeek}
                            // options={weekRange}
                            styles={dropdownStyles}
                          />
                        </div>

                        {/* <div className="col-md-6">
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
                    {!projectAllocationData?.Bench_YN && (
                      <p
                        className={`${globalMsg
                          ? "d-block text-danger mb-0 error-feild-size"
                          : "d-none"
                          }`}
                      >
                        *This field is mandatory
                      </p>
                    )}
                  </div> */}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary btn-wid me-2"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          setGlobalMsg(false);
                          setShow(false);
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {AllocateResource(props?.data),identifyWeekPositions()}}
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
          </div>
        </Modal>
        {/* )} */}
      </div>
    </>
  );
};

export default ProjectEdit;
