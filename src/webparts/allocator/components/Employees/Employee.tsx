import * as React from "react";
import { useNavigate } from "react-router-dom";
import SharePointServiceProxy from "../common/sp-proxy/SharepointServiceProxy";
import { IAllocatorProps } from "../IAllocatorProps";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState } from "react";
import { differenceInMonths } from "date-fns";
import Pagination from "../common/Pagination";
import EditEmployee from "./EditEmployee";


const Employee: React.FunctionComponent<IAllocatorProps> = (props) => {
  const _sharePointServiceProxy: SharePointServiceProxy =
    new SharePointServiceProxy(props?.context, props?.webURL);
  const [paginatedArrProject, setPaginatedArr] = useState<any>()
  const [rowData, setRowData] = useState([]);
  const [updateItem, setupdateItem] = useState<any>([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await getToken();
        // Other logic related to the component
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchData();
  }, []);

  async function getToken() {
    try {
      let items = await _sharePointServiceProxy.getItems({
        listName: "Employee",
        fields: [
          "ID",
          "Employee_Id",
          "EmpEmail",
          "Name",
          "Primary_Skills",
          "Designation",
          "Location",
          "DeptName",
          "Manager1/Title",
          "Manager1/ID",
          "Manager2/Title",
          "Secondary_Skills",
          "IsBench",
          "BenchStartDate",
          "BenchEndDate",
          "JoiningDate",
          "Active",
          "TotalExperience",
          "Practice"
        ],
        isRoot: true,
        filter: `Active eq 'Yes'`,
        expandFields: ["Manager1", "Manager2"],
      });
      setRowData(items)

    } catch (error) {
      console.error("Error in getToken:", error);
    }
  }





  const getCurrentDate = () => {
    return new Date();
  };
  const monthDifferenceFormatter = (params: any) => {
    if (params.value) {
      const existingDate = new Date(params.value);
      const currentDate = getCurrentDate();
      const monthDifference = differenceInMonths(currentDate, existingDate);
      const years = (monthDifference / 12).toFixed(1);
      return `${years} year${years === '1.0' ? '' : 's'}`;
    }
    else {
      null
    }
  };


  // function OnClientDeatilsChange(params: any) {

  //   if (params !== null &&
  //     params !== undefined &&
  //     params.data !== null &&
  //     params.data !== undefined) {



  //     if (updateItem.length === 0) {
  //       updateItem.push(params.data)
  //     }
  //     else {
  //       const listIndex = updateItem.findIndex(
  //         (ele: any) => {
  //          return ele.Id === params.data.Id
  //         }
  //       )
  //       if (listIndex !== null &&
  //         listIndex !== undefined &&
  //         listIndex !== -1) {
  //         updateItem.splice(listIndex, 1);
  //         updateItem.push(params.data);
  //       }
  //       else {
  //         updateItem.push(params.data);
  //       }
  //     }
  //     setupdateItem(updateItem)
  //     updateItem.forEach(async (element: any) => {
  //       await _sharePointServiceProxy.updateItem("Employee", element.ID, element, [], true).then(() => {
  //         getToken();
  //         alert("Update SucessFully")
  //       })
  //     });
  //   }
  // }
  async function OnClientDeatilsChange(params: any) {
    if (params !== null && params !== undefined && params.data !== null && params.data !== undefined) {
      let updatedItems = [...updateItem]; // Create a copy of updateItem

      const listIndex = updatedItems.findIndex((ele: any) => ele.Id === params.data.Id);

      if (listIndex !== -1) {
        updatedItems.splice(listIndex, 1);
      }

      updatedItems.push(params.data);
      setupdateItem(updatedItems);

      const updatePromises = updatedItems.map(async (element: any) => {
        await _sharePointServiceProxy.updateItem("Employee", element.ID, element, [], true);
      });

      await Promise.all(updatePromises);

      // After all updates are completed
      getToken();
      alert("Update Successfully");
    }
  }
  const columnDefs: any = [
    {
      headerName: "Employee-Id",
      field: "Employee_Id",
      sortable: true,
      filter: true,
      width: 150,
      flex: 1,
      floatingFilter: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
      pinned: "left",
    },
    {
      headerName: "Employee Name",
      field: "Name",
      editable: true,
      sortable: true,
      filter: true,
      width: 215,
      flex: 1,
      floatingFilter: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    {
      headerName: "ID",
      field: "ID",
      hide: true,
    },
    {
      headerName: "Practice",
      field: "Practice",
      editable: true,
      sortable: true,
      filter: true,
      width: 215,
      flex: 1,
      floatingFilter: true,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    // {
    //   headerName: "Secondart Skill",
    //   field: "Secondary_Skills",
    //   editable: true,
    //   sortable: true,
    //   filter: true,
    //   width: 215,
    //   flex: 1,
    //   floatingFilter: true,
    //   cellStyle: { borderRight: "1px solid #dde2eb" },
    // },
    {
      headerName: "Experience(Yrs)",
      field: "JoiningDate",
      sortable: true,
      editable: true,
      filter: true,
      width: 215,
      flex: 1,
      floatingFilter: true,
      valueFormatter: monthDifferenceFormatter,
      cellStyle: { borderRight: "1px solid #dde2eb" },
    },
    // {
    //   headerName: "Experience",
    //   field: "TotalExperience",
    //   sortable: true,
    //   editable: true,
    //   filter: true,
    //   width: 215,
    //   flex: 1,
    //   floatingFilter: true,
    //   cellStyle: { borderRight: "1px solid #dde2eb" },
    // },
    {
        headerName: "Manager1",
        field: "Manager1.Title",
        sortable: true,
        // editable: true,
        filter: true,
        width: 215,
        flex: 1,
        floatingFilter: true,
        cellStyle: { borderRight: "1px solid #dde2eb" },
      },
      {
        headerName: "Manager2",
        field: "Manager2.Title",
        sortable: true,
        // editable: true,
        filter: true,
        width: 215,
        flex: 1,
        floatingFilter: true,
        cellStyle: { borderRight: "1px solid #dde2eb" },
      },
    {
      headerName: "Edit",
      field: "Image",
      cellRenderer: EditEmployee,
      // cellRenderer: PopupCellRenderer,
      // cellRenderer:EmployeeIcons,
      cellRendererParams: { context: props?.context, webURL: props?.webURL, getToken: getToken },
      width: 120,
    },
  ];

  const navigate = useNavigate();
  return (
    <>
      <div className="container-fluid ">
        <div className="row mt-4 pt-2 mx-0">
          <div className="col-6">
            <div className="d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="42"
                fill="#0000000"
                className="bi bi-person-circle text-white  pt-1"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>

              <div>
                <h4 className=" pt-2 ms-2">
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
                    className="cursor-pointer "
                    onClick={() => navigate("/Employee")}
                  >
                    Employee
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-body ">
                <div className="row">
                  <div className="ag-theme-alpine" style={{ height: 470 }}>
                    <AgGridReact
                      rowData={paginatedArrProject}
                      columnDefs={columnDefs}
                      onCellValueChanged={OnClientDeatilsChange}
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

    </>
  );
};

export default Employee;
