import * as React from 'react'
import { IAllocatorProps } from '../IAllocatorProps'
import { useState, useEffect } from 'react';
import { Modal, ComboBox, IComboBox, IComboBoxOption, IDropdownStyles, IDropdownOption } from '@fluentui/react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
import * as moment from 'moment';

const EditAllocation: React.FunctionComponent<IAllocatorProps> = (props: any) => {
    const { getProjectAllocationListData } = props;
    const _SharepointServiceProxy: SharepointServiceProxy =
        new SharepointServiceProxy(props?.context, props?.webURL);

    const [shows, setShows] = useState<boolean>(false);
    const [editData, SetEditData] = useState<any>();
    const [globalMsg, setGlobalMsg] = useState<boolean>(false);

    // Form data state (Project_IDId is intentionally excluded — project is read-only)
    const [editAllocationData, setEditAllocationData] = useState<any>({
        Billiability: '',
        BillableFrom: '',
        BillableTill: '',
        Utilization_Percent: '',
    });

    // Managers
    const [managerdata, setManagerdata] = useState<any[]>([]);
    const [managerdata2, setManagerdata2] = useState<any[]>([]);

    // Weeks
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [dateRangeOptions, setDateRangeOptions] = useState<any[]>([]);
    const [selectedWeeks, setSelectedWeeks] = useState<any[]>([]);

    const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 215 },
    };

    // Week date range helper (matches EmployeeAction format)
    const startdate = (weekno: number) => {
        let startdateofweek = moment(moment().week(weekno)).startOf('isoWeek').format('M/D/YYYY');
        let endDateofWeek = moment(moment(moment().week(weekno)).endOf('isoWeek')).format('M/D/YYYY');
        return `${startdateofweek}-${endDateofWeek}`;
    };

    // Build all 52 week options — keys match ProjectsAllocations list field names (Weak1..Weak52)
    const WeekOptions: IDropdownOption[] = [];
    for (let i = 1; i < 53; i++) {
        WeekOptions.push({ key: `Weak${i}`, text: `${startdate(i)}` });
    }

    // Filter week options to only those within the selected date range
    let newArr: any[] = [];
    dateRangeOptions.map((itr: any, index: any) => {
        WeekOptions.filter(ftr => {
            if (ftr.text === dateRangeOptions[index]) {
                newArr.push(ftr);
            }
        });
    });

    const generateDateRangeOptions = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dateRanges: string[] = [];
        const currentRange = new Date(start);
        while (currentRange <= end) {
            const weekNo = moment(currentRange).week();
            dateRanges.push(startdate(weekNo));
            currentRange.setDate(currentRange.getDate() + 7);
        }
        setDateRangeOptions(dateRanges);
    };

    useEffect(() => {
        if (startDate && endDate) {
            generateDateRangeOptions();
        }
    }, [startDate, endDate]);

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return '';
        return dateStr.split('T')[0];
    };

    const EditClick = async (data: any) => {
        // Reset state and open modal immediately — don't block on the SP fetch
        SetEditData(data);
        setSelectedWeeks([]);
        setManagerdata([]);
        setManagerdata2([]);
        setEditAllocationData({ Billiability: '', BillableFrom: '', BillableTill: '', Utilization_Percent: '' });
        setStartDate(null);
        setEndDate(null);
        setShows(true);

        // Fetch the editable fields in the background and populate the form once loaded
        try {
            const items = await _SharepointServiceProxy.getItems({
                listName: 'ProjectsAllocations',
                fields: ['ID', 'BillableFrom', 'BillableTill', 'Billiability', 'Utilization_Percent'],
                isRoot: true,
                filter: `ID eq ${data.ID}`,
                top: 1,
            });
            const item = items && items.length > 0 ? items[0] : {};
            const fromDate = formatDateForInput(item?.BillableFrom);
            const tillDate = formatDateForInput(item?.BillableTill);
            // Use String() so that numeric 0 is preserved as "0" not dropped by || ''
            const billiability = item?.Billiability != null ? String(item.Billiability) : '';
            const utilization = item?.Utilization_Percent != null ? String(item.Utilization_Percent) : '';
            setEditAllocationData({
                Billiability: billiability,
                BillableFrom: fromDate,
                BillableTill: tillDate,
                Utilization_Percent: utilization,
            });
            setStartDate(fromDate || null);
            setEndDate(tillDate || null);
        } catch (error) {
            console.log('Error fetching allocation details', error);
        }

   };

    const handleManager1 = (PickerData: any) => {
        setManagerdata(PickerData);
    };

    const handleManager2 = (PickerData: any) => {
        setManagerdata2(PickerData);
    };

    const handleStartDateChange = (event: any) => {
        const date = event.target.value;
        setStartDate(date);
        setEditAllocationData((prev: any) => ({ ...prev, BillableFrom: date }));
    };

    const handleEndDateChange = (event: any) => {
        const date = event.target.value;
        setEndDate(date);
        setEditAllocationData((prev: any) => ({ ...prev, BillableTill: date }));
    };

    const onChangeWeekDropdown = (
        event: React.FormEvent<IComboBox>,
        option?: IComboBoxOption,
        index?: number,
        value?: string
    ): void => {
        if (!editAllocationData.Utilization_Percent) {
            alert('Please select utilisation first');
        } else {
            const updatedWeeks = [...selectedWeeks];
            if (option?.selected) {
                updatedWeeks.push(option.key as string);
            } else {
                const idx = updatedWeeks.indexOf(option?.key);
                if (idx !== -1) updatedWeeks.splice(idx, 1);
            }
            setSelectedWeeks(updatedWeeks);
        }
    };

    const validate = () => {
        if (
            !editAllocationData?.Billiability ||
            !editAllocationData?.BillableFrom ||
            !editAllocationData?.BillableTill ||
            !editAllocationData?.Utilization_Percent
        ) {
            setGlobalMsg(true);
            return false;
        }
        setGlobalMsg(false);
        return true;
    };

    const updateAllocation = async () => {
        if (validate()) {
            try {
                const updatePayload: any = { ...editAllocationData };

                // Store each selected week as JSON to match the grid format:
                // {"Billiability": x, "Utilization": x}
                if (selectedWeeks.length > 0) {
                    const weekJson = JSON.stringify({
                        Billiability: editAllocationData.Billiability,
                        Utilization: editAllocationData.Utilization_Percent,
                    });
                    selectedWeeks.forEach((week: string) => {
                        updatePayload[week] = weekJson;
                    });
                }

                // Include manager updates only if pickers were changed
                if (managerdata.length > 0) {
                    updatePayload.Manager1Id = managerdata[0]?.id;
                }
                if (managerdata2.length > 0) {
                    updatePayload.Manager2Id = managerdata2[0]?.id;
                }

                await _SharepointServiceProxy.updateItem(
                    'ProjectsAllocations',
                    editData?.ID,
                    updatePayload,
                    [],
                    true
                );
                setShows(false);
                setGlobalMsg(false);
                if (editData?.Year === '2023') {
                    getProjectAllocationListData(editData?.Year);
                } else {
                    getProjectAllocationListData('');
                }
            } catch (error) {
                console.log('Error updating allocation', error);
            }
        }
    };

    return (
        <>
            <div>
                <svg
                    onClick={() => { EditClick(props?.data); }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16"
                    fill="#229ed9"
                    className="bi bi-pencil-square edit-pencil ms-2 mb-1"
                    viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>
            </div>

            <Modal
                isOpen={shows}
                onDismiss={() => setShows(false)}
                isBlocking={true}
                containerClassName="create-event-modal"
            >
                <div className="project-edit-modal">
                    <div className="modal-content-projectedit">
                        <div className="pb-3">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Update Employee Details
                            </h1>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="row g-3">

                                    {/* Employee Name — read-only */}
                                    <div className="col-md-6">
                                        <label className="form-label">Employee Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editData?.EmployeeId?.Name || ''}
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }}
                                        />
                                    </div>

                                    {/* Project Name — read-only */}
                                    <div className="col-md-6">
                                        <label className="form-label">Project Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editData?.Project_ID?.ProjectName || ''}
                                            readOnly
                                            style={{ backgroundColor: '#f8f9fa' }}
                                        />
                                    </div>

                                    {/* Billable From */}
                                    <div className="col-md-6">
                                        <label htmlFor="inputCity" className="form-label">
                                            Billable From
                                        </label>
                                        <input
                                            onChange={handleStartDateChange}
                                            type="date"
                                            className="form-control"
                                            value={editAllocationData?.BillableFrom}
                                            name="BillableFrom"
                                        />
                                        {!editAllocationData?.BillableFrom && globalMsg && (
                                            <p className="d-block text-danger mb-0 error-feild-size">
                                                *This field is mandatory
                                            </p>
                                        )}
                                    </div>

                                    {/* Billable Till */}
                                    <div className="col-md-6">
                                        <label htmlFor="inputCity" className="form-label">
                                            Billable Till
                                        </label>
                                        <input
                                            min={startDate}
                                            onChange={handleEndDateChange}
                                            type="date"
                                            className="form-control"
                                            value={editAllocationData?.BillableTill}
                                            name="BillableTill"
                                        />
                                        {!editAllocationData?.BillableTill && globalMsg && (
                                            <p className="d-block text-danger mb-0 error-feild-size">
                                                *This field is mandatory
                                            </p>
                                        )}
                                    </div>

                                    {/* Billiability */}
                                    <div className="col-md-6">
                                        <label htmlFor="inputCity" className="form-label">
                                            Billiability
                                        </label>
                                        <select
                                            className="form-select"
                                            value={editAllocationData?.Billiability}
                                            onChange={(e) =>
                                                setEditAllocationData({
                                                    ...editAllocationData,
                                                    Billiability: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">--Select--</option>
                                            <option value="0">0%</option>
                                            <option value="25">25%</option>
                                            <option value="50">50%</option>
                                            <option value="100">100%</option>
                                        </select>
                                        {!editAllocationData?.Billiability && globalMsg && (
                                            <p className="d-block text-danger mb-0 error-feild-size">
                                                *This field is mandatory
                                            </p>
                                        )}
                                    </div>

                                    {/* Utilization */}
                                    <div className="col-md-6">
                                        <label htmlFor="inputState" className="form-label">
                                            Utilization
                                        </label>
                                        <select
                                            className="form-select"
                                            value={editAllocationData?.Utilization_Percent}
                                            onChange={(e) =>
                                                setEditAllocationData({
                                                    ...editAllocationData,
                                                    Utilization_Percent: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">--Select--</option>
                                            <option value="0">0%</option>
                                            <option value="25">25%</option>
                                            <option value="50">50%</option>
                                            <option value="100">100%</option>
                                        </select>
                                        {!editAllocationData?.Utilization_Percent && globalMsg && (
                                            <p className="d-block text-danger mb-0 error-feild-size">
                                                *This field is mandatory
                                            </p>
                                        )}
                                    </div>

                                    {/* Weeks */}
                                    <div className="col-md-6">
                                        <label htmlFor="inputState" className="form-label">
                                            Weeks
                                        </label>
                                        <ComboBox
                                            className="cmbocss"
                                            placeholder="Select options"
                                            multiSelect
                                            onChange={onChangeWeekDropdown}
                                            options={newArr}
                                            styles={dropdownStyles}
                                        />
                                    </div>

                                    {/* Manager 1 */}
                                    <div className="col-md-6">
                                        <label className="form-label">Manager 1</label>
                                        <PeoplePicker
                                            context={{
                                                absoluteUrl: props.context.pageContext.web.absoluteUrl,
                                                msGraphClientFactory: props.context.msGraphClientFactory,
                                                spHttpClient: props.context.spHttpClient,
                                            }}
                                            personSelectionLimit={1}
                                            groupName={""}
                                            defaultSelectedUsers={[editData?.Manager1?.Title || editData?.Manager1?.title]}
                                            disabled={false}
                                            ensureUser={true}
                                            onChange={handleManager1}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                        />
                                    </div>

                                    {/* Manager 2 */}
                                    <div className="col-md-6">
                                        <label className="form-label">Manager 2</label>
                                        <PeoplePicker
                                            context={{
                                                absoluteUrl: props.context.pageContext.web.absoluteUrl,
                                                msGraphClientFactory: props.context.msGraphClientFactory,
                                                spHttpClient: props.context.spHttpClient,
                                            }}
                                            personSelectionLimit={1}
                                            groupName={""}
                                            defaultSelectedUsers={[editData?.Manager2?.Title || editData?.Manager2?.title]}
                                            disabled={false}
                                            ensureUser={true}
                                            onChange={handleManager2}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-wid me-2"
                                    onClick={() => { setGlobalMsg(false); setShows(false); }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-color btn-primary btn-wid"
                                    onClick={updateAllocation}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditAllocation;
