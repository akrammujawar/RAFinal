// import { Dropdown } from "office-ui-fabric-react";
import * as React from "react";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import * as _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
// import * as moment from "moment";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import * as moment from "moment";
import SuccessModal from "../common/SuccessModal";
import Pagination from "../common/Pagination";
// import DatePicker from "../common/DatePicker";
// import Pagination from "../../UIComponent/Pagination";

const ConsolidatedReport: React.FunctionComponent<IAllocatorProps> = (
  props
) => {
  const _sharePointServiceProxy: SharePointServiceProxy =
    new SharePointServiceProxy(props?.context, props?.webURL);
  const [paginatedArrProject, setPaginatedArr] = useState<any>()
  const [currentWeek, setCurrentWeek] = useState<any>(moment().week());
  const [data, setData] = React.useState<any>({});
  const [ProEmpID, setProEmpID] = useState<number>();
  console.log(ProEmpID);
  const [warningmodal, setWarningModal] = useState<string>();
  const [openmodal, setOpenModal] = useState<string>();
  const Billabletype = ["Yes", "No"];
  // Ag-Grid implementation //
  const [rowData, setRowData] = useState([]);
  var gridRef:any = useRef();

  const [evaluationdata, setEvaluationData] = React.useState<any>();
  console.log(evaluationdata);
  useEffect(() => {
    setCurrentWeek(moment().week());
    console.log(currentWeek);
    // getResourceAllocation()
    getempDatawithProjectallocation();
  }, []);

  // Resource Allocation List //

  // async function getResourceAllocation() {
  //  let items = await _sharePointServiceProxy.getItems({
  //     listName: "ResourceAllocation",

  //     fields: [
  //       "Name/Title",
  //       "Role",
  //       "CoreSkill",
  //       "Practice",
  //       "PracticeLead/Title",
  //       "PracticeManager/Title",
  //       "Location",
  //       "CurrentProject",
  //       "ProjectLead/Title",
  //       "ProjectManager/Title",
  //       "Billable",
  //       "Billability",
  //       "Occupancy",
  //       "Visibility",
  //       "FutureProject",
  //       "Remarks",
  //       "ReportingManager1/Title",
  //       "ReportingManager2/Title",
  //           ],
  //     expandFields: ["Name","PracticeManager","PracticeLead","ProjectLead","ProjectManager","ReportingManager1","ReportingManager2"],
  //     isRoot: true,
  //   });
  //   setRowData(items)
  // }

  async function getProjectAllocation() {
    var item = [];
    item = await _sharePointServiceProxy.getItems({
      listName: "ProjectAllocation",
      fields: [
        "ID",
        "Employee_ID/Employee_Id",
        "Employee_ID/Name",
        "Project_Id/ID",
        "Project_Id/ProjectName",
        "Project_Id/ProjectManager",
        "Project_Id/StartDate",
        "Project_Id/EndDate",
        "Billable_YN",
        "Billiability",
        "BillableTill",
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
        // "Project_Id/ProjectLead"
      ],
      expandFields: ["Employee_ID", "Project_Id"],
      top: 500,
      isRoot: true,
    });
    // setCurrentWeek(item)
    setEvaluationData(item);
    console.log("items", item);
    // setRowData(item)
    return item;
  }

  async function getempData() {
    var fetchEmployee = [];
    fetchEmployee = await _sharePointServiceProxy.getItems(
      {
        listName: "Employee",
        fields: [
          "ID",
          "Employee_Id",
          "Name",
          "Primary_Skills",
          "Secondary_Skills",
          "Experience",
          "Certification",
          "Designation",
          "DeptName",
          "Location",
          "FutureProject",
          "Manager1/Title",
          "Manager2/Title",
        ],
        isRoot: true,
        expandFields: ["Manager1", "Manager2"],
        //filter:  `Employee_Id eq '${element.Employee_ID?.Employee_Id}'`,
        top: 500,
      },
      false
    );
    return fetchEmployee;
  }

  async function getprjData() {
    var fetchProject = [];
    fetchProject = await _sharePointServiceProxy.getItems(
      {
        listName: "Project",
        fields: ["ID", "ProjectName", "ProjectManager", "ProjectLead/Name", "ProjectLeadName", "EndDate"],
        // filter: `ID eq '${ID}'`,
        expandFields: ["ProjectLead"],
        isRoot: true,
        //filter:  `Employee_Id eq '${element.Employee_ID?.Employee_Id}'`,
        top: 500,
      },
      false
    );
    // console.log("fetching project data",fetchProject[0].ProjectLead.Title)
    return fetchProject;
  }

  async function getPracticelead() {
    let items = await _sharePointServiceProxy.getItems(
      {
        listName: "PracticeLead",
        fields: ["ID", "Practice", "Lead/Title", "Lead/ID"],
        isRoot: true,
        expandFields: ["Lead"],
        // filter:  `Practice eq '${params.value}'`,
      },
      false
    );
    // let leadName = fetchPracticelead?.filter((itr:any)=>
    //     itr.Practice.includes(params.value)
    // )
    return items;
  }

  async function getempDatawithProjectallocation() {
    let newarray: any[] = [];
    let projectallocationData = await getProjectAllocation();
    let empData = await getempData();
    let projData = await getprjData();
    console.log(projData);

    let practiceleadData = await getPracticelead();
    // loop empData first instead of projectallocationData
    // Get practice lead based on Emp_Department
    // Get project allocation based on employee id
    // Loop filterd project allocation data
    // get project details based om project id
    // add values to object and push to array
    empData?.forEach((p: any) => {
      let projectAllocations = projectallocationData.filter((e: any) => {
        return e?.Employee_ID?.Employee_Id === p?.Employee_Id;
      });
      let practiceLead = practiceleadData.find((pc: any) => {
        return pc?.Practice === p?.DeptName;
      });
      if (projectAllocations.length > 0) {
        projectAllocations.forEach((ftr: any) => {
          let project = projData.find((pd: any) => {
            return pd?.ID === ftr?.Project_Id?.ID;
          });
          newarray.push({
            EmpName: p?.Name,
            Employee_Id: p?.Employee_Id,
            Role: p?.Designation,
            CoreSkill: p?.Primary_Skills,
            Practice: p?.DeptName,
            Location: p?.Location,
            ProjectManager1: p?.Manager1?.Title,
            ProjectManager2: p?.Manager2?.Title,
            Billable_YN: ftr?.Billable_YN,
            Billiability: ftr?.Billiability,
            BillableTill: ftr?.BillableTill,
            ProjectManager: project?.ProjectManager,
            ProjectName: project?.ProjectName,
            ProjectLead: project?.ProjectLeadName,
            PracticeLead: practiceLead?.Lead?.Title,
            ProjectAllocatinID: ftr?.ID,
            FutureProject: p?.FutureProject,
            Occupancy: ftr?.["week" + currentWeek],
            Visibilitynew: project?.EndDate,
            Visibility:
              ftr.week1 == "" || ftr.Week1 == "0" || ftr.week1 == null
                ? getLastDateOFWeek(1)
                : ftr.week2 == "" || ftr.week2 == "0" || ftr.week2 == null
                  ? getLastDateOFWeek(2)
                  : ftr.week3 == "" || ftr.week3 == "0" || ftr.week3 == null
                    ? getLastDateOFWeek(3)
                    : ftr.week4 == "" || ftr.week4 == "0" || ftr.week4 == null
                      ? getLastDateOFWeek(4)
                      : ftr.week5 == "" || ftr.week5 == "0" || ftr.week5 == null
                        ? getLastDateOFWeek(5)
                        : ftr.week6 == "" || ftr.week6 == "0" || ftr.week6 == null
                          ? getLastDateOFWeek(6)
                          : ftr.week7 == "" || ftr.week7 == "0" || ftr.week7 == null
                            ? getLastDateOFWeek(7)
                            : ftr.week8 == "" || ftr.week8 == "0" || ftr.week8 == null
                              ? getLastDateOFWeek(8)
                              : ftr.week9 == "" || ftr.week9 == "0" || ftr.week9 == null
                                ? getLastDateOFWeek(9)
                                : ftr.week10 == "" || ftr.week10 == "0" || ftr.week10 == null
                                  ? getLastDateOFWeek(10)
                                  : ftr.week11 == "" || ftr.week11 == "0" || ftr.week11 == null
                                    ? getLastDateOFWeek(11)
                                    : ftr.week12 == "" || ftr.week12 == "0" || ftr.week12 == null
                                      ? getLastDateOFWeek(12)
                                      : ftr.week13 == "" || ftr.week13 == "0" || ftr.week13 == null
                                        ? getLastDateOFWeek(13)
                                        : ftr.week14 == "" || ftr.week14 == "0" || ftr.week14 == null
                                          ? getLastDateOFWeek(14)
                                          : ftr.week15 == "" || ftr.week15 == "0" || ftr.week15 == null
                                            ? getLastDateOFWeek(15)
                                            : ftr.week16 == "" || ftr.week16 == "0" || ftr.week16 == null
                                              ? getLastDateOFWeek(16)
                                              : ftr.week17 == "" || ftr.week17 == "0" || ftr.week17 == null
                                                ? getLastDateOFWeek(17)
                                                : ftr.week18 == "" || ftr.week18 == "0" || ftr.week18 == null
                                                  ? getLastDateOFWeek(18)
                                                  : ftr.week19 == "" || ftr.week19 == "0" || ftr.week19 == null
                                                    ? getLastDateOFWeek(19)
                                                    : ftr.week20 == "" || ftr.week20 == "0" || ftr.week20 == null
                                                      ? getLastDateOFWeek(20)
                                                      : ftr.week21 == "" || ftr.week21 == "0" || ftr.week21 == null
                                                        ? getLastDateOFWeek(21)
                                                        : ftr.week22 == "" || ftr.week22 == "0" || ftr.week22 == null
                                                          ? getLastDateOFWeek(22)
                                                          : ftr.week23 == "" || ftr.week23 == "0" || ftr.week23 == null
                                                            ? getLastDateOFWeek(23)
                                                            : ftr.week24 == "" || ftr.week24 == "0" || ftr.week24 == null
                                                              ? getLastDateOFWeek(24)
                                                              : ftr.week25 == "" || ftr.week25 == "0" || ftr.week25 == null
                                                                ? getLastDateOFWeek(25)
                                                                : ftr.week26 == "" || ftr.week26 == "0" || ftr.week26 == null
                                                                  ? getLastDateOFWeek(26)
                                                                  : ftr.week27 == "" || ftr.week27 == "0" || ftr.week27 == null
                                                                    ? getLastDateOFWeek(27)
                                                                    : ftr.week28 == "" || ftr.week28 == "0" || ftr.week28 == null
                                                                      ? getLastDateOFWeek(28)
                                                                      : ftr.week29 == "" || ftr.week29 == "0" || ftr.week29 == null
                                                                        ? getLastDateOFWeek(29)
                                                                        : ftr.week30 == "" || ftr.week30 == "0" || ftr.week30 == null
                                                                          ? getLastDateOFWeek(30)
                                                                          : ftr.week31 == "" || ftr.week31 == "0" || ftr.week31 == null
                                                                            ? getLastDateOFWeek(31)
                                                                            : ftr.week32 == "" || ftr.week32 == "0" || ftr.week32 == null
                                                                              ? getLastDateOFWeek(32)
                                                                              : ftr.week33 == "" || ftr.week33 == "0" || ftr.week33 == null
                                                                                ? getLastDateOFWeek(33)
                                                                                : ftr.week34 == "" || ftr.week34 == "0" || ftr.week34 == null
                                                                                  ? getLastDateOFWeek(34)
                                                                                  : ftr.week35 == "" || ftr.week35 == "0" || ftr.week35 == null
                                                                                    ? getLastDateOFWeek(35)
                                                                                    : ftr.week36 == "" || ftr.week36 == "0" || ftr.week36 == null
                                                                                      ? getLastDateOFWeek(36)
                                                                                      : ftr.week37 == "" || ftr.week37 == "0" || ftr.week37 == null
                                                                                        ? getLastDateOFWeek(37)
                                                                                        : ftr.week38 == "" || ftr.week38 == "0" || ftr.week38 == null
                                                                                          ? getLastDateOFWeek(38)
                                                                                          : ftr.week39 == "" || ftr.week39 == "0" || ftr.week39 == null
                                                                                            ? getLastDateOFWeek(39)
                                                                                            : ftr.week40 == "" || ftr.week40 == "0" || ftr.week40 == null
                                                                                              ? getLastDateOFWeek(40)
                                                                                              : ftr.week41 == "" || ftr.week41 == "0" || ftr.week41 == null
                                                                                                ? getLastDateOFWeek(41)
                                                                                                : ftr.week42 == "" || ftr.week42 == "0" || ftr.week42 == null
                                                                                                  ? getLastDateOFWeek(42)
                                                                                                  : ftr.week43 == "" || ftr.week43 == "0" || ftr.week43 == null
                                                                                                    ? getLastDateOFWeek(43)
                                                                                                    : ftr.week44 == "" || ftr.week44 == "0" || ftr.week44 == null
                                                                                                      ? getLastDateOFWeek(44)
                                                                                                      : ftr.week45 == "" || ftr.week45 == "0" || ftr.week45 == null
                                                                                                        ? getLastDateOFWeek(45)
                                                                                                        : ftr.week46 == "" || ftr.week46 == "0" || ftr.week46 == null
                                                                                                          ? getLastDateOFWeek(46)
                                                                                                          : ftr.week47 == "" || ftr.week47 == "0" || ftr.week47 == null
                                                                                                            ? getLastDateOFWeek(47)
                                                                                                            : ftr.week48 == "" || ftr.week48 == "0" || ftr.week48 == null
                                                                                                              ? getLastDateOFWeek(48)
                                                                                                              : ftr.week49 == "" || ftr.week49 == "0" || ftr.week49 == null
                                                                                                                ? getLastDateOFWeek(49)
                                                                                                                : ftr.week50 == "" || ftr.week50 == "0" || ftr.week50 == null
                                                                                                                  ? getLastDateOFWeek(50)
                                                                                                                  : ftr.week51 == "" || ftr.week51 == "0" || ftr.week51 == null
                                                                                                                    ? getLastDateOFWeek(51)
                                                                                                                    : ftr.week52 == "" || ftr.week52 == "0" || ftr.week52 == null
                                                                                                                      ? getLastDateOFWeek(52)
                                                                                                                      : null,
          });
        });
      } else {
        newarray.push({
          EmpName: p?.Name,
          Role: p?.Designation,
          CoreSkill: p?.Primary_Skills,
          Practice: p?.DeptName,
          Location: p?.Location,
          ProjectManager1: p?.Manager1?.Title,
          ProjectManager2: p?.Manager2?.Title,
          Billable_YN: null,
          Billiability: null,
          BillableTill: null,
          ProjectManager: null,
          ProjectName: null,
          ProjectLead: null,
          PracticeLead: practiceLead?.Lead?.Title,
          ProjectAllocatinID: p?.ID,
          FutureProject: p?.FutureProject,
          Occupancy: null,
          Visibilitynew: null,
        });
      }

      //  project = projData.filter((pd: any) => { return pd?.ID === })

      //   newarray.push({
      //     //   EmpName:emp?.Employee_Id?.Name,
      //     //   Role:emp?.Designation ,
      //     //   CoreSkill:emp?.Primary_Skills,
      //     //   Practice:emp?.Emp_Department,
      //     //   Location:emp?.Location,
      //     //   ProjectManager1:emp?.Manager1?.Title,
      //     //   ProjectManager2:emp?.Manager2?.Title,
      //     //   Billable_YN:p?.Billable_YN,
      //     //   Billiability:p?.Billiability,
      //     //   BillableTill:p?.BillableTill,
      //     //   ProjectManager:project?.ProjectManager,
      //     //  ProjectName:project?.ProjectName,
      //     //  ProjectLead:project?.ProjectLead?.Title,
      //     //   PracticeLead:practiceLead?.Lead?.Title,
      //       ProjectAllocatinID:p?.ID,
      //       Occupancy: p?.['week' + currentWeek],
      //       Visibility: p.week1==""|| p.Week1=="0"||p.week1==null?getLastDateOFWeek(1):
      //                   p.week2==""|| p.week2=="0"||p.week2==null?getLastDateOFWeek(2):
      //                   p.week3==""|| p.week3=="0"||p.week3==null?getLastDateOFWeek(3):
      //                   p.week4==""|| p.week4=="0"||p.week4==null?getLastDateOFWeek(4):
      //                   p.week5==""|| p.week5=="0"||p.week5==null?getLastDateOFWeek(5):
      //                   p.week6==""|| p.week6=="0"||p.week6==null?getLastDateOFWeek(6):
      //                   p.week7==""|| p.week7=="0"||p.week7==null?getLastDateOFWeek(7):
      //                   p.week8==""|| p.week8=="0"||p.week8==null?getLastDateOFWeek(8):
      //                   p.week9==""|| p.week9=="0"||p.week9==null?getLastDateOFWeek(9):
      //                   p.week10==""|| p.week10=="0"||p.week10==null?getLastDateOFWeek(10):
      //                   p.week11==""|| p.week11=="0"||p.week11==null?getLastDateOFWeek(11):
      //                   p.week12==""|| p.week12=="0"||p.week12==null?getLastDateOFWeek(12):
      //                   p.week13==""|| p.week13=="0"||p.week13==null?getLastDateOFWeek(13):
      //                   p.week14==""|| p.week14=="0"||p.week14==null?getLastDateOFWeek(14):
      //                   p.week15==""|| p.week15=="0"||p.week15==null?getLastDateOFWeek(15):
      //                   p.week16==""|| p.week16=="0"||p.week16==null?getLastDateOFWeek(16):
      //                   p.week17==""|| p.week17=="0"||p.week17==null?getLastDateOFWeek(17):
      //                   p.week18==""|| p.week18=="0"||p.week18==null?getLastDateOFWeek(18):
      //                   p.week19==""|| p.week19=="0"||p.week19==null?getLastDateOFWeek(19):
      //                   p.week20==""|| p.week20=="0"||p.week20==null?getLastDateOFWeek(20):
      //                   p.week21==""|| p.week21=="0"||p.week21==null?getLastDateOFWeek(21):
      //                   p.week22==""|| p.week22=="0"||p.week22==null?getLastDateOFWeek(22):
      //                   p.week23==""|| p.week23=="0"||p.week23==null?getLastDateOFWeek(23):
      //                   p.week24==""|| p.week24=="0"||p.week24==null?getLastDateOFWeek(24):
      //                   p.week25==""|| p.week25=="0"||p.week25==null?getLastDateOFWeek(25):
      //                   p.week26==""|| p.week26=="0"||p.week26==null?getLastDateOFWeek(26):
      //                   p.week27==""|| p.week27=="0"||p.week27==null?getLastDateOFWeek(27):
      //                   p.week28==""|| p.week28=="0"||p.week28==null?getLastDateOFWeek(28):
      //                   p.week29==""|| p.week29=="0"||p.week29==null?getLastDateOFWeek(29):
      //                   p.week30==""|| p.week30=="0"||p.week30==null?getLastDateOFWeek(30):
      //                   p.week31==""|| p.week31=="0"||p.week31==null?getLastDateOFWeek(31):
      //                   p.week32==""|| p.week32=="0"||p.week32==null?getLastDateOFWeek(32):
      //                   p.week33==""|| p.week33=="0"||p.week33==null?getLastDateOFWeek(33):
      //                   p.week34==""|| p.week1=="0"||p.week1==null?getLastDateOFWeek(34):
      //                   p.week35==""|| p.week35=="0"||p.week35==null?getLastDateOFWeek(35):
      //                   p.week36==""|| p.week36=="0"||p.week36==null?getLastDateOFWeek(36):
      //                   p.week37==""|| p.week37=="0"||p.week37==null?getLastDateOFWeek(37):
      //                   p.week38==""|| p.week38=="0"||p.week38==null?getLastDateOFWeek(38):
      //                   p.week39==""|| p.week39=="0"||p.week39==null?getLastDateOFWeek(39):
      //                   p.week40==""|| p.week40=="0"||p.week40==null?getLastDateOFWeek(40):
      //                   p.week41==""|| p.week41=="0"||p.week41==null?getLastDateOFWeek(41):
      //                   p.week42==""|| p.week42=="0"||p.week42==null?getLastDateOFWeek(42):
      //                   p.week43==""|| p.week43=="0"||p.week43==null?getLastDateOFWeek(43):
      //                   p.week44==""|| p.week44=="0"||p.week44==null?getLastDateOFWeek(44):
      //                   p.week45==""|| p.week45=="0"||p.week45==null?getLastDateOFWeek(45):
      //                   p.week46==""|| p.week46=="0"||p.week46==null?getLastDateOFWeek(46):
      //                   p.week47==""|| p.week47=="0"||p.week47==null?getLastDateOFWeek(47):
      //                   p.week48==""|| p.week48=="0"||p.week48==null?getLastDateOFWeek(48):
      //                   p.week49==""|| p.week49=="0"||p.week49==null?getLastDateOFWeek(49):
      //                   p.week50==""|| p.week50=="0"||p.week50==null?getLastDateOFWeek(50):
      //                   p.week51==""|| p.week51=="0"||p.week51==null?getLastDateOFWeek(51):
      //                   p.week52==""|| p.week52=="0"||p.week52==null?getLastDateOFWeek(52):null,
      //   })
    });

    setRowData(newarray);
  }
  function getLastDateOFWeek(weekNo: any) {
    return moment(moment(moment().week(weekNo)).endOf("isoWeek"))
      .subtract(2, "days")
      .format("DD/MM/YYYY");
  }

  // Navigations of bredcrams//
  const navigate = useNavigate();

  // Onchange dropdowns //

  const columnDefs: any = [
    {
      headerName: "Employee Name",
      // field: "Name.Title",
      field: "EmpName",
      sortable: true,
      filter: true,

      floatingFilter: true,
      width: 220,
      pinned: "left",
    },
    {
      headerName: "EmployeeID",
      // field: "Name.Title",
      field: "Employee_Id",
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 150,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Role",
      field: "Role",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "ID",
      field: " ProjectAllocatinID",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      hide: true,
      width: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Core Skill",
      field: "CoreSkill",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 2
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Practice",
      field: "Practice",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 3
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Practice Lead",
      field: "PracticeLead",
      // valueFormatter: getPracticelead,
      // valueFormatter: getPracticelead,
      width: 200,
      filter: true,

      floatingFilter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 4
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Project Manager",
      field: "ProjectManager",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      width: 200,
      filter: true,

      floatingFilter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 5
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Location",
      field: "Location",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      width: 200,
      filter: true,

      floatingFilter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 6
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Current Project",
      field: "ProjectName",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      width: 200,
      filter: true,

      floatingFilter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 7
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Project Lead",
      field: "ProjectLead",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      // valueGetter: getPracticelead,
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 8
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Billiable",
      field: "Billable_YN",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Billabletype,
      },
      valueFormatter: (params: any) => {
        return params.value === null ? ' ' : params.value + '';
      },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      editable: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 9
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Billability",
      field: "Billiability",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      editable: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 10
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Billiable Till",
      field: "BillableTill",
      // valueFormatter: (params: any) => {
      //     return params.value === ' ' ? ' ' : params.value;
      // },
      filter: true,

      floatingFilter: true,
      // cellEditor: DatePicker,
      cellEditorPopup: true,
      cellRenderer: (params: any) => {
        return params.value === null
          ? ""
          : moment(params.value).format("DD/MM/YYYY");
      },
      width: 200,
      wrapHeaderText: true,
      // editable: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 10
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Occupancy",
      field: "Occupancy",
      valueFormatter: (params: any) => {
        return params.value === null ? " " : params.value + "%";
      },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      editable: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 11
          ? { borderRight: "1px solid #dde2eb" }
          : { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Visibility",
      field: "Visibilitynew",
      width: 200,
      filter: true,

      floatingFilter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellRenderer: (params: any) => {
        return params.value === null
          ? ""
          : moment(params.value).format("DD/MM/YYYY");
      },
      cellStyle: (params: any) =>
        currentWeek > 12
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Future Project",
      field: "FutureProject",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      filter: true,

      floatingFilter: true,
      width: 200,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 13
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Reporting Manager1",
      field: "ProjectManager1",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      filter: true,

      floatingFilter: true,
      width: 250,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 14
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "Reporting Manager2",
      field: "ProjectManager2",
      // valueFormatter: (params: any) => {
      //     return params.value === null ? ' ' : params.value + '%';
      // },
      filter: true,

      floatingFilter: true,
      width: 250,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: (params: any) =>
        currentWeek > 15
          ? { borderRight: "1px solid #dde2eb" }
          : { backgroundColor: "#fff", borderRight: "1px solid #dde2eb" },
    },
  ];

  // Onchange of 4 feilds //

  function onCellValueChanged(params: any) {
    let field = params.colDef.field;
    let value = params.value;
    let cell = params.api.getFocusedCell();
    setProEmpID(parseInt(params.data.ProjectAllocatinID));
    {
      params.api.setFocusedCell(cell.rowIndex, cell.column);
      if (field == "Billable_YN") {
        if (params.value === "Yes" || params.value === "No") {
          setData({ Billable_YN: value });
          setOpenModal("Updated Successfully");
        } else {
          setData(data);
          // params.value = ''
          // alert("Enter Valid value")
          setWarningModal("validText");
        }
      }
      if (field == "Billiability") {
        if (
          params.value === "0" ||
          params.value === "25" ||
          params.value === "50" ||
          params.value === "75" ||
          params.value === "100"
        ) {
          setData({ Billiability: value });
          setOpenModal("Updated Successfully");
        } else {
          setData(data);
          setWarningModal("validText");
        }
      }
      if (field == "BillableTill") {
        setData({ BillableTill: value });
      }
      if (field == "Occupancy") {
        if (
          params.value === "0" ||
          params.value === "25" ||
          params.value === "50" ||
          params.value === "75" ||
          params.value === "100"
        ) {
          setData({ [`week${currentWeek}`]: value });
          setOpenModal("Updated Successfully");
        } else {
          setData(data);
          setWarningModal("validText");
        }
      } else {
        setData(data);
      }
    }
  }

  // updating values //
  async function UpdateEmployeeData() {
    let item = await _sharePointServiceProxy.updateItem(
      "ProjectAllocation",
      ProEmpID,
      data,
      [],
      true
    );
    //   .then((res) => alert("item updated..."));
    setData({});
    console.log("items data....added", item);
    // alert("success..........");
  }

  React.useEffect(() => {
    UpdateEmployeeData();
  }, [data]);

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  return (
    <>
      {/* ///////////* New One  */}

      <div className="container-fluid">
        {openmodal === "Updated Successfully" && (
          <SuccessModal
            pageType={"success"}
            setModal={setOpenModal}
            message={"Updated Successfully"}
            showModal={true}
          />
        )}
        {warningmodal === "validText" && (
          <SuccessModal
            pageType={"warning"}
            setModal={setWarningModal}
            message={"Enter Valid Allocation Value"}
            showModal={true}
          />
        )}
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
              <h4 className="pt-2 ms-2">
                Consolidated Report
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
                  onClick={() => navigate("/Allocation")}
                >
                  Consolidated Report
                </span>
              </h3>
            </div>
            </div>
            </div>
            <div className="col-6 text-end">
              <button className="btn btn-primary mb-2 pt-2 ms-1 me-1 " onClick={onBtnExport}>Genrate CSV</button>
            </div>
          
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          {/* <div className="col-md-12"> */}
          <div className="card shadow">
            <div className="card-body ">
              {/* <div className="col-md-12"></div> */}
              <div className="row">
                <div className="ag-theme-alpine" style={{ height: 660 }}>
                  <AgGridReact
                  ref={gridRef}
                    rowData={paginatedArrProject}
                    onCellValueChanged={onCellValueChanged}
                    columnDefs={columnDefs}
                  // pagination={true}
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
      {/* </div> */}
      {/* <Pagination orgData={undefined} setNewFilterarr={undefined} /> */}
      {/* <div className="footer fixed-bottom">
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center shadow"
          style={{ height: "3rem" }}
        >
          <div></div>
        </div>
      </div> */}
    </>
  );
};

export default ConsolidatedReport;
