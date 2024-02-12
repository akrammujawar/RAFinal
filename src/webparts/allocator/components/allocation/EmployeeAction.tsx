import * as React from "react";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import * as _ from "lodash";
import {
  // Dropdown,
  IComboBox,
  IComboBoxOption,
  // IComboBoxStyles,
  IDropdownOption,
  IDropdownStyles,
  Modal,
} from "@fluentui/react";
import { useState } from "react";
import { ComboBox } from "@fluentui/react";
import SuccessModal from "../common/SuccessModal";
// import Pagination from "../../UIComponent/Pagination";
import { useNavigate } from "react-router-dom";
import * as moment from "moment";
import { AgGridReact } from "ag-grid-react";

const EmployeeAction: React.FunctionComponent<IAllocatorProps> = (
  props: any
) => {
  const _sharePointServiceProxy: SharePointServiceProxy =
    new SharePointServiceProxy(props?.context, props?.webURL);
  const [edit, setEdit] = React.useState<any>([]);
  // const editproject = window.location.href;
  // const projectID = editproject.slice(editproject.lastIndexOf("/") + 1);
  const [empName, setempName] = React.useState<any[]>([]);
  console.log(empName);
  const [ProEmpID, setProEmpID] = useState<number>();
  const [globalMsg, setGlobalMsg] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [shows, setShows] = useState<boolean>(false);
  const [rowData, setRowData] = useState([]);
  const [employeedata, setEmployeetData] = React.useState<any>([]);
  // const [employeeId, SetEmployeeId] = React.useState<any>();
  const [employeedetails, setEmployeeDetails] = useState<any>();
  const [dateRangeOptions, setDateRangeOptions] = useState<any>([]);


  // weeks //
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState<any>("");
  console.log(selectedWeek)

  // Date-Binding
  const [currentWeek, setCurrentWeek] = useState<any>();
  console.log(currentWeek);

  // TypeHead-Combobox Options //

  // Dates in Week table//
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

  // header display //
  // Dates in Week table//
  const startdates = (weekno: number) => {
    let startdateofweek = moment(moment().week(weekno))
      .startOf("isoWeek")
      .format("DD/MM");
    let endDateofWeek = moment(moment(moment().week(weekno)).endOf("isoWeek"))
      // .subtract(2, "days")
      .format("DD/MM");
    // console.log(`${startdateofweek}, ${endDateofWeek}`);
    return `${startdateofweek} - ${endDateofWeek}`;
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 215 },
  };

  // const WeekOptions: IDropdownOption[] = [
  //   { key: "week1", text: `week1 [${startdate(1)}]` },
  //   { key: "week2", text: `week2 [${startdate(2)}]` },
  //   { key: "week3", text: `week3 [${startdate(3)}]` },
  //   { key: "week4", text: `week4 [${startdate(4)}]` },
  //   { key: "week5", text: `week5 [${startdate(5)}]` },
  //   { key: "week6", text: `week6 [${startdate(6)}]` },
  //   { key: "week7", text: `week7 [${startdate(7)}]` },
  //   { key: "week8", text: `week8 [${startdate(8)}]` },
  //   { key: "week9", text: `week9 [${startdate(9)}]` },
  //   { key: "week10", text: `week10 [${startdate(10)}]` },
  //   { key: "week11", text: `week11 [${startdate(11)}]` },
  //   { key: "week12", text: `week12 [${startdate(12)}]` },
  //   { key: "week13", text: `week13 [${startdate(13)}]` },
  //   { key: "week14", text: `week14 [${startdate(14)}]` },
  //   { key: "week15", text: `week15 [${startdate(15)}]` },
  //   { key: "week16", text: `week16 [${startdate(16)}]` },
  //   { key: "week17", text: `week17 [${startdate(17)}]` },
  //   { key: "week18", text: `week18 [${startdate(18)}]` },
  //   { key: "week19", text: `week19 [${startdate(19)}]` },
  //   { key: "week20", text: `week20 [${startdate(20)}]` },
  //   { key: "week21", text: `week21 [${startdate(21)}]` },
  //   { key: "week22", text: `week22 [${startdate(22)}]` },
  //   { key: "week23", text: `week23 [${startdate(23)}]` },
  //   { key: "week24", text: `week24 [${startdate(24)}]` },
  //   { key: "week25", text: `week25 [${startdate(25)}]` },
  //   { key: "week26", text: `week26 [${startdate(26)}]` },
  //   { key: "week27", text: `week27 [${startdate(27)}]` },
  //   { key: "week28", text: `week28 [${startdate(28)}]` },
  //   { key: "week29", text: `week29 [${startdate(29)}]` },
  //   { key: "week30", text: `week30 [${startdate(30)}]` },
  //   { key: "week31", text: `week31 [${startdate(31)}]` },
  //   { key: "week32", text: `week32 [${startdate(32)}]` },
  //   { key: "week33", text: `week33 [${startdate(33)}]` },
  //   { key: "week34", text: `week34 [${startdate(34)}]` },
  //   { key: "week35", text: `week35 [${startdate(35)}]` },
  //   { key: "week36", text: `week36 [${startdate(36)}]` },
  //   { key: "week37", text: `week37 [${startdate(37)}]` },
  //   { key: "week38", text: `week38 [${startdate(38)}]` },
  //   { key: "week39", text: `week39 [${startdate(39)}]` },
  //   { key: "week40", text: `week40 [${startdate(40)}]` },
  //   { key: "week41", text: `week41 [${startdate(41)}]` },
  //   { key: "week42", text: `week42 [${startdate(42)}]` },
  //   { key: "week43", text: `week43 [${startdate(43)}]` },
  //   { key: "week44", text: `week44 [${startdate(44)}]` },
  //   { key: "week45", text: `week45 [${startdate(45)}]` },
  //   { key: "week46", text: `week46 [${startdate(46)}]` },
  //   { key: "week47", text: `week47 [${startdate(47)}]` },
  //   { key: "week48", text: `week48 [${startdate(48)}]` },
  //   { key: "week49", text: `week49 [${startdate(49)}]` },
  //   { key: "week50", text: `week50 [${startdate(50)}]` },
  //   { key: "week51", text: `week51 [${startdate(51)}]` },
  //   { key: "week52", text: `week52 [${startdate(52)}]` },
  // ];
  const WeekOptions: IDropdownOption[] = [];
  for (let i = 1; i < 53; i++) {
    WeekOptions.push({
      key: `week${i}`,
      text: `${startdate(i)}`,
      // hidden: currentWeek > i ? true : false,
      // disabled: currentWeek > i ? true : false,
    });
  }
  // const stackTokens: IStackTokens = { childrenGap: 20 };

  // TypeHeader//
  // const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
  const [fullPrjList, setFullPrjList] = useState<any[]>([]);
  const [returnedTarget, setreturnedTarget] = useState<any[]>([]);
  // const [paginatedArr, setPaginatedArr] = React.useState<any[]>([]);
  // console.log(paginatedArr)
  const [projectAllocationData, setProjectAllocationData] = React.useState<any>(
    {
      Project_IdId: 0,
      Billable_YN: "",
      Billiability: "",
      BillableFrom: "",
      BillableTill: "",
      Utilization_Percent: "",
      Employee_IDId: 0,
      // Rate: "",
      // Bench_YN: "",
    }
  );

  // Card binding states//

  async function ProjectAllocationList() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "ProjectAllocation",
      fields: [
        "ID",
        "Employee_ID/Employee_Id",
        "Employee_ID/Name",
        "Employee_ID/Designation",
        "Employee_ID/Primary_Skills",
        "Employee_ID/Secondary_Skills",
        "Project_Id/ID",
        "Project_Id/ProjectName",
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
      // filter: `Employee_ID/Employee_Id eq '${projectID}'`,
      orderedColumn: "Created",
      isRoot: true,
    });
    let employeeDetails = {
      Name: items[0].Employee_ID.Name,
      Designation: items[0].Employee_ID.Designation,
      Primary_Skills: items[0].Employee_ID.Primary_Skills,
      Employee_Id: items[0].Employee_ID.Employee_Id,
      Secondary_Skills: items[0].Employee_ID.Secondary_Skills,
    };

    setEmployeeDetails(employeeDetails);

    setEdit(items);
    getEmpName(items[0]?.Project_Id?.ID);

  }

  // async function getEmpId() {
  //   let employeeID = await _sharePointServiceProxy.getItems({
  //     listName: "Employee",
  //     fields: ["Name", "Employee_Id", "ID"],
  //     filter: `Employee_Id eq '${projectID}'`,
  //     orderedColumn: "Created",
  //     isRoot: true
  //   });
  //   SetEmployeeId(employeeID[0]?.ID);
  // }

  React.useEffect(() => {
    // getEmpId();
    ProjectAllocationList();
    getEmpNameTypeahed();
    getEmployeeName();
    setCurrentWeek(moment().week());
  }, []);

  // console.log("empid", employeeId);

  // TODO:employee id pass
  const getEmpName = async (empid: any) => {
    let empName: any = await _sharePointServiceProxy.getItems({
      listName: "Project",
      fields: ["ID", "ProjectName"],
      orderedColumn: "Created",
      isRoot: true,
    });
    let getEmpID = empName.find((fnd: any) => {
      if (fnd.Project_Id === empid) {
        return fnd.Id;
      }
    });

    console.log("emp name here ", empid, getEmpID);
    setempName(empName?.ProjectName);
  };

  const [data, setData] = React.useState<any>({});
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
    if (!projectAllocationData.Utilization_Percent) {
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
          projectAllocationData[selectedWeeks[i]] =
            projectAllocationData.Utilization_Percent;
        }
      }
    }

  };

  async function UpdateProjectdata() {
    let item = await _sharePointServiceProxy
      .updateItem("ProjectAllocation", ProEmpID, data, ["a"], true)
      .then((res) => alert("item updated..."));
    setData({});

    console.log("items data", item);
    // alert("success..........");
  }

  React.useEffect(() => {
    UpdateProjectdata();
  }, [data]);

  // Modal Binding //
  async function getEmployeeName() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "Project",
      fields: ["ProjectName", "ID"],
      orderedColumn: "Created",
      isRoot: true,
    });
    setEmployeetData(items);
    console.log(employeedata);
  }

  async function AllocateResource(id: any) {
    if (validate()) {
      let proID: any = [];
      rowData.filter((itr: any) => {
        itr?.Project_Id?.ID === projectAllocationData?.Project_IdId &&
          proID.push(id);
      });
      if (proID.length > 0) {
        let findid = rowData?.filter(
          (itr: any) =>
            itr?.Project_Id?.ID === projectAllocationData?.Project_IdId
          // itr?.Employee_ID?.ID === projectAllocationData?.Employee_IDId
        );
        // alert(proID[0].Project_Id.ID)
        await _sharePointServiceProxy.updateItem(
          "ProjectAllocation",
          findid[0]?.ID,
          projectAllocationData,
          [],
          true
        );
        // alert("data updated")
        setUpdateModal("EmployeeUpdated");
        setGlobalMsg(false);
        ProjectAllocationList();
        setShow(false);
        setProjectAllocationData({});
      } else {
        await _sharePointServiceProxy.addItem(
          "ProjectAllocation",
          projectAllocationData,
          [],
          true
        );
        ProjectAllocationList();
        setProjectAllocationData({});
        setGlobalMsg(false);
        setShow(false);
        setOpenModal("EmployeeAdded");
      }
    }
  }

  // Validation for modal //
  function validate() {
    // console.log(globalMsg)
    if (
      projectAllocationData?.Project_IdId === 0 ||
      projectAllocationData?.Billable_YN === "" ||
      projectAllocationData?.Billiability === "" ||
      projectAllocationData?.BillableFrom === "" ||
      projectAllocationData?.BillableTill === "" ||
      projectAllocationData?.Utilization_Percent === ""
      // projectAllocationData?.Utilization_Percent === "" 

    ) {
      setGlobalMsg(true);
      return false;
    } else {
      setGlobalMsg(false);
      return true;
      // props.modalPopupHide("")
    }
  }

  // Combo function//
  const onChangeAddProject = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {


    let getProId = fullPrjList.find((item: any) => {
      if (item.ProjectName === value) {
        return item.ID;
      }
    });



    setProjectAllocationData({
      ...projectAllocationData,
      Project_IdId: getProId.ID,
      // Employee_IDId: parseInt(employeeId),
      Employee_IDId: props?.data?.ID,
    });
  };

  async function getEmpNameTypeahed() {
    let items = await _sharePointServiceProxy.getItems({
      listName: "Project",
      fields: ["ProjectName", "ID", "StartDate", "EndDate",],
      isRoot: true,
    });
    setFullPrjList(items);
    console.log("Employee data... ", items);

    // To Bind Active Project in DropDown //
    const currentDate = new Date().toISOString().split('T')[0];
    const filteredRowData = items.filter((row) => {
      return row?.EndDate >= currentDate;
    });

    let partialArr = filteredRowData?.map(({ ProjectName }) => ({
      key: ProjectName,
      text: ProjectName,
    }));
    setreturnedTarget(_.uniqWith(partialArr, _.isEqual));


  }

  // Success Modal//
  const [openmodal, setOpenModal] = useState<string>("");
  const [warningmodal, setWarningModal] = useState<string>("");
  const [updatemodal, setUpdateModal] = useState<string>("");

  // Navigations of bredcrams//
  const navigate = useNavigate();

  // Ag-Grid //

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
        setData({ wee10: value });
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
      // setProEmpID(parseInt(itr?.ID));
      console.log("paramsaction...", params);
    } else {
      setWarningModal("ValidProject");
      // alert("Enter valid value")
      setData(data);
    }
  }
  // Ag-Grid implementation //



  const columnDefs: any = [
    {
      headerName: "Project Name",
      field: "Project_Id.ProjectName",
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week1;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week1;
            let data = JSON.parse(Utilization);
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
      headerName: `Week-2 ${startdates(2)}`, 
      headerClass:"customcss",
      children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week2;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week2;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week3;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week3;
            let data = JSON.parse(Utilization);
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
      headerName: `Week-4 ${startdates(4)}`,
 
 headerClass:"customcss",     children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week4;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week4;
            let data = JSON.parse(Utilization);
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
      headerName: `Week-5 ${startdates(5)}`,
 
 headerClass:"customcss",     children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week5;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week5;
            let data = JSON.parse(Utilization);
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
 
 headerClass:"customcss",     children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week6;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week6;
            let data = JSON.parse(Utilization);
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
 
 headerClass:"customcss",     children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week7;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week7;
            let data = JSON.parse(Utilization);
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
 
 headerClass:"customcss",     children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week8;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week8;
            let data = JSON.parse(Utilization);
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
 
 headerClass:"customcss",     children: [
        {

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week9;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week9;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week10;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week10;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week11;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week11;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week12;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week12;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week13;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week13;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week14;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week14;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week15;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week15;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week16;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week16;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week17;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week17;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week18;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week18;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week19;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week19;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week20;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week20;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week21;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week21;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week22;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week22;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week23;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week23;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week24;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week24;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week25;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week25;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week26;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week26;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week27;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week27;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week28;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week28;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week29;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week29;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week30;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week30;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week31;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week31;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week32;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week32;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week33;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week33;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week34;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week34;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week35;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week35;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week36;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week36;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week37;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week37;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week38;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week38;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week39;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week39;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week40;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week40;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week41;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week41;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week42;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week42;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week43;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week43;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week44;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week44;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week45;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week45;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week46;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week46;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week47;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week47;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week48;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week48;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week49;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week49;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week50;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week50;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week51;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week51;
            let data = JSON.parse(Utilization);
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

          field: "Billiability",
          valueFormatter: (params: any) => {
            let Billiability = params?.data?.week52;
            let data = JSON.parse(Billiability);
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
            let Utilization = params?.data?.week52;
            let data = JSON.parse(Utilization);
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

    // {
    //   headerName: `Week-01 ${startdates(1)}`,
    //   field: "week1",
    //   valueFormatter: (params: any) => {
    //     params.value === "null" ? 0 : params.value;
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 1 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 1
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-02 ${startdates(2)}`,
    //   field: "week2",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //     //  return  params.value === null ?  ' ': params.value + '%';
    //   },
    //   editable: currentWeek > 2 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 2
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-03 ${startdates(3)}`,
    //   field: "week3",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 3 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 3
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-04 ${startdates(4)}`,
    //   field: "week4",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 4 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 4
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-05 ${startdates(5)}`,
    //   field: "week5",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 5 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 5
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-06 ${startdates(6)}`,
    //   field: "week6",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 6 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 6
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-07 ${startdates(7)}`,
    //   field: "week7",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 7 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 7
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-08 ${startdates(8)}`,
    //   field: "week8",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 8 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 8
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-09 ${startdates(9)}`,
    //   field: "week9",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 9 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 9
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-10 ${startdates(10)}`,
    //   field: "week10",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 10 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 10
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-11 ${startdates(11)} `,
    //   field: "week11",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 11 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 11
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-12 ${startdates(12)}`,
    //   field: "week12",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 12 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 12
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-13 ${startdates(13)}`,
    //   field: "week13",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 13 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 13
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-14 ${startdates(14)}`,
    //   field: "week14",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 14 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 14
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-15 ${startdates(15)}`,
    //   field: "week15",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 15 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 15
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-16 ${startdates(16)}`,
    //   field: "week16",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 16 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 16
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-17 ${startdates(17)}`,
    //   field: "week17",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 17 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 17
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-18 ${startdates(18)}`,
    //   field: "week18",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 18 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 18
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-19 ${startdates(19)}`,
    //   field: "week19",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 19 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 19
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-20 ${startdates(20)}`,
    //   field: "week20",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 20 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 20
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-21 ${startdates(21)}`,
    //   field: "week21",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 21 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 21
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-22 ${startdates(22)}`,
    //   field: "week22",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 22 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 22
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-23 ${startdates(23)}`,
    //   field: "week23",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 23 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 23
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-24 ${startdates(24)}`,
    //   field: "week24",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 24 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 24
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-25 ${startdates(25)}`,
    //   field: "week25",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 25 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 25
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-26 ${startdates(26)}`,
    //   field: "week26",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 26 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 26
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-27 ${startdates(27)}`,
    //   field: "week27",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 27 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 27
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-28 ${startdates(28)}`,
    //   field: "week28",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 28 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 28
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-29 ${startdates(29)}`,
    //   field: "week29",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 29 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 29
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-30 ${startdates(30)}`,
    //   field: "week30",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 30 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 30
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-31 ${startdates(31)}`,
    //   field: "week31",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 31 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 31
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-32 ${startdates(32)}`,
    //   field: "week32",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 32 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 32
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-33 ${startdates(33)}`,
    //   field: "week33",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 33 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 33
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-34 ${startdates(34)}`,
    //   field: "week34",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 34 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 34
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-35 ${startdates(35)}`,
    //   field: "week35",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 35 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 35
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-36 ${startdates(36)}`,
    //   field: "week36",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 36 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 36
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-37 ${startdates(37)}`,
    //   field: "week37",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 37 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 37
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-38 ${startdates(38)}`,
    //   field: "week38",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 38 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 38
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-39 ${startdates(39)}`,
    //   field: "week39",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 39 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 39
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-40 ${startdates(40)}`,
    //   field: "week40",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 40 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 40
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-41 ${startdates(41)}`,
    //   field: "week41",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 41 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 41
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-42 ${startdates(42)}`,
    //   field: "week42",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 42 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 42
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-43 ${startdates(43)}`,
    //   field: "week43",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 43 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 43
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-44 ${startdates(44)}`,
    //   field: "week44",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 44 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 44
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-45 ${startdates(45)}`,
    //   field: "week45",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 45 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 45
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-46 ${startdates(46)}`,
    //   field: "week46",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 46 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 46
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-47 ${startdates(47)}`,
    //   field: "week47",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 47 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 47
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-48 ${startdates(48)}`,
    //   field: "week48",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 48 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 48
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-49 ${startdates(49)}`,
    //   field: "week49",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 49 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 49
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-50 ${startdates(50)}`,
    //   field: "week50",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 50 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 50
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-51 ${startdates(51)}`,
    //   field: "week51",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 51 ? false : true,
    //   singleClickEdit: true,
    //   width: 130,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 51
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
    // {
    //   headerName: `Week-52 ${startdates(52)}`,
    //   field: "week52",
    //   valueFormatter: (params: any) => {
    //     return params.value === null ? " " : params.value + "%";
    //   },
    //   editable: currentWeek > 52 ? false : true,
    //   singleClickEdit: true,
    //   width: 140,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellStyle: (params: any) =>
    //     currentWeek > 52
    //       ? {
    //           backgroundColor: "gainsboro",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         }
    //       : {
    //           backgroundColor: "#fff",
    //           textAlign: "center",
    //           borderRight: "1px solid #dde2eb",
    //         },
    // },
  ];

  // Ag grid page render //

  const handleClick = (EmployeeData: any) => {
    console.log("handleclick", EmployeeData);
    setEmployeeDetails(EmployeeData);
    setRowData(edit.filter((itr: any) => itr?.Employee_ID?.Employee_Id === EmployeeData.Employee_Id));
    setShows(true);
  };

  // Cancel popup //
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
        // options.push(`{${itr?.start} - ${itr?.end}}`)
        options.push({
          key: `${itr?.start} - ${itr?.end}`,
          text: `${itr?.start} - ${itr?.end}`,
        })
      );
      // console.log("latest weeks options......", options);
      // console.log("latest weeks ......", weeks);

      // setWeekRange((prev: any) => [...prev, ...options]);

      setWeekRange(options);
    }
  };

  // New //
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
  // console.log("original options...",WeekOptions)

  React.useEffect(() => {
    if (startDate && endDate) {
      generateDateRangeOptions();
    }
  }, [startDate, endDate]);

  let newArr: any[] = [];
  dateRangeOptions.map((itr: any, index: any) => {
    WeekOptions.filter(ftr => {
      if (ftr.text === dateRangeOptions[index]) {
        newArr.push(ftr)
      }
    })
  })

  // console.log("newarrayvalues.......!!!!!!",newArr)




  return (
    <>
      {/* New One */}
      <div>
        <svg
          onClick={() => handleClick(props?.data)}
          xmlns="ttp://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="#229ed9"
          className="bi bi-plus-square pointer plus-icon ms-3 mb-1"
          viewBox="0 0 16 16"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>

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
                        <span > / </span>
                        <span
                          className="cursor-pointer"
                          onClick={() => navigate("/Employee")}
                        >
                          Employee
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
                    // data-bs-target="#staticBackdrop1"
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                  </div>
                </div>
                <div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <div className="row">
                {openmodal === "EmployeeAdded" && (
                  <SuccessModal
                    pageType={"success"}
                    setModal={setOpenModal}
                    message={"Project Added Successfully"}
                    showModal={true}
                  />
                )}
                {updatemodal === "EmployeeUpdated" && (
                  <SuccessModal
                    pageType={"success"}
                    setModal={setUpdateModal}
                    message={"Project Updated Successfully"}
                    showModal={true}
                  />
                )}
                <div className="col-md-12">
                  {warningmodal === "ValidProject" && (
                    <SuccessModal
                      pageType={"warning"}
                      setModal={setWarningModal}
                      message={"Enter Valid Allocation Value"}
                      showModal={true}
                    />
                  )}
                  <div className="card shadow">
                    <div className="card-body ">
                      <h5 className="card-title ms-3">Employee&nbsp;Details</h5>
                      <div className="col-md-12">
                        <div className="card shadow mb-2">
                          <div className="card-body mt-2 adjust-head-card">
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="opacity-75">Employee&nbsp;Name</p>
                                <p className="Manager-main-forteen">
                                  <b>{employeedetails?.Name} </b>
                                </p>
                              </div>
                              <div className="col-sm-2">
                                <p className="opacity-75">EmployeeID</p>
                                <p className="Manager-main-forteen">
                                  <b>{employeedetails?.Employee_Id} </b>
                                </p>
                              </div>
                              <div className="col-sm-2">
                                <p className="opacity-75 ">Designation</p>
                                <p className="Manager-main-forteen">
                                  <b>{employeedetails?.Designation} </b>
                                </p>
                              </div>
                              <div className="col-sm-2">
                                <p className="opacity-75 ">Primary_Skills</p>
                                <p className="Manager-main-forteen">
                                  <b>{employeedetails?.Primary_Skills}</b>
                                </p>
                              </div>
                              <div className="col-sm-3">
                                <p className="opacity-75 ">Secondary_Skills</p>
                                <p className="Manager-main-forteen">
                                  <b>{employeedetails?.Secondary_Skills}</b>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="ag-theme-alpine"
                          style={{ height: 320 }}
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
              {/* <Pagination orgData={edit} setNewFilterarr={setPaginatedArr} /> */}
            </div>
          </div>
        </Modal>

        {/* MODAL */}

        {/* <div
        className="modal fade"
        id="staticBackdrop1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      > */}
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
                        options={returnedTarget}
                        // styles={comboBoxStyles}
                        allowFreeInput
                        autoComplete="on"
                        placeholder="Project Name"
                        onChange={onChangeAddProject}
                      />
                      {!projectAllocationData?.Project_IdId && (
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
                          className={`${globalMsg
                            ? "d-block text-danger mb-0 error-feild-size"
                            : "d-none"
                            }`}
                        >
                          *This field is mandatory
                        </p>
                      )}
                    </div>
                    {/* <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">
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
                    )}
                  </div> */}
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
                      {!projectAllocationData?.BillableFrom && (
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
                      {!projectAllocationData?.BillableTill && (
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
                    // data-bs-dismiss="modal"
                    onClick={() => {
                      setGlobalMsg(false);
                      setShow(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => AllocateResource(props?.data)}
                    type="button"
                    className="btn btn-color btn-primary btn-wid"
                  // data-bs-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
        {/* </div> */}
      </div>
    </>
  );
};

export default EmployeeAction;
