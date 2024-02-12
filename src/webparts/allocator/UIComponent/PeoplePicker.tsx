import * as React from "react";
import { ComboBox } from "@fluentui/react";
import type { IComboBoxOption, IComboBoxStyles } from "@fluentui/react";
import { useEffect, useState } from "react";
import { IAllocatorProps } from "../components/IAllocatorProps";
import SharepointServiceProxy from "../components/common/sp-proxy/SharepointServiceProxy";
import * as _ from "lodash";

// const options: IComboBoxOption[] = [
//   {}
// ]
const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };

const PeoplePicker: React.FunctionComponent<IAllocatorProps> = (props: any) => {
  // const options: IComboBoxOption[] = [
  //   { key: 'black', text: 'Black' },
  //   { key: 'blue', text: 'Blue' },
  //   { key: 'brown', text: 'Brown' },
  //   { key: 'cyan', text: 'Cyan' },
  //   { key: 'green', text: 'Green' },
  //   { key: 'magenta', text: 'Magenta', disabled: true }
  // ];
  const [returnedTarget, setreturnedTarget] = useState<any>();
  // const [globalMsg, setGlobalMsg] = useState(false)
  // const[projectManagers, setProjectManagers]= useState<any>([])
  const options: IComboBoxOption[] = [
    { key: "black", text: "Black" },
    { key: "white", text: "white" },
    { key: "pink", text: "pink" },
  ];

  const _SharepointServiceProxy: SharepointServiceProxy =
    new SharepointServiceProxy(props?.context, props?.webURL);

  async function getToken() {
    let items = await _SharepointServiceProxy.getItems({
      listName: "Project",
      fields: ["ID", "ProjectManager"],
      isRoot: true,
      // expandFields: ["ClientName"],
    });
    // console.log("Project data... ", items);
    let partialArr = items.map(({ ProjectManager }) => ({
      key: ProjectManager,
      text: ProjectManager,
    }));
    setreturnedTarget(_.uniqWith(partialArr, _.isEqual));
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div>
      <ComboBox
        // options={options}
        options={returnedTarget ? returnedTarget : options}
        styles={comboBoxStyles}
        allowFreeInput
        autoComplete="on"
        // onChange={(e) => setData({ ...data, ProjectManager: e.target.value })}
      />
      {/* {!data?.ProjectManager &&
                      <p className={`${globalMsg ? "d-block text-danger fw-semibold" : "d-none"}`}>*This field is mandatory</p>} */}
    </div>
  );
};

export default PeoplePicker;
