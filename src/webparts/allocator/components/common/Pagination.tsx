// FIXME:pagination
import *as React from 'react';
import { useEffect, useState } from 'react';
//  import React, { useEffect, useState } from 'react'


type appProps = {
    orgData: any,
    // inputflag:any
    setNewFilterarr:any
}

const Pagination= ({ orgData, setNewFilterarr }: appProps) => {

    const [rowSize, setRowSize] = useState<number | string | any>(null)
    const [startPos, setStartPos] = useState<number>(0)
    const [endPos, setEndPos] = useState<number>(6)
    // const [newFilterarr, setNewFilterarr] = useState<any[]>([])
    const [currPage, setCurrPage] = useState<any>()
    let [endOffset, setEndOffset] = useState<any>()
    // const [pageCount, setPageCount] = useState<number | any[] | any>()

    // pagination

    useEffect(() => {
        // console.count("from pagination")
         endOffset = startPos + rowSize;
        setEndOffset(startPos + rowSize);
        setNewFilterarr(rowSize ? orgData?.slice(startPos, endOffset) : orgData);      
    }, [startPos, rowSize, orgData]);

    const handlePageCount = (e: any) => {
        e.persist()
        if (e.target.value === 'All') {
            setRowSize(null)
        } else {
            setStartPos(0)
            setCurrPage(0)
            setEndPos(parseInt(e.target.value))
            setRowSize(parseInt(e.target.value))
        }
    }

    const handlePrev = () => {
        if (currPage > 0) {
            // this.setState({ currPage: currPage - 1 });
            setCurrPage(currPage - 1);
            if (startPos !== 0) {
                setStartPos(startPos - rowSize)
                setEndPos(endPos - rowSize)
            }

            //disabled Previous button here
        }
    }
    const handleNext = (newFilterarr: any) => {
        const pageCount = Math.ceil(rowSize && newFilterarr?.length / rowSize);
        if (currPage < pageCount - 1) {
            // this.setState({ currPage: this.state.currPage + 1 });
            setCurrPage(currPage + 1)
            // if (orgData?.length > endPos) {
            //     setStartPos(startPos + rowSize)
            //     setEndPos(endPos + rowSize)
            // }
            orgData?.length > endPos && setStartPos(startPos + rowSize); setEndPos(endPos + rowSize)
        } else {
            // disabled next button here
        }
    }

    const handlePageNavigation = (cpn: any) => {
        setStartPos((rowSize * cpn) - rowSize)
        setEndPos(rowSize * cpn)
    }

    return (
        <>
            {/* < */}
            <footer className="asset-management-footer p-0 py-1 pt-3">
                <div className="container-fluid py-2 d-flex justify-content-between align-items-center">
                    <div>
                        <span className="pe-2 opacity-50">Show</span>
                        <select onChange={(e) => handlePageCount(e)} value={rowSize} name="" className="col me-2 p-1">
                            <option className="" value="All" >
                                All
                            </option>
                            <option className="" value="10">
                                10
                            </option>
                            <option className="" value="20">
                                20
                            </option>
                            <option className="" value="50">
                               50
                            </option>
                            <option className="" value="100">
                                100
                            </option>
                        </select>
                        {/* <span className="ps-2 opacity-50">entries | Showing 1 to 9 of 60 entries</span> */}
                        <span className="ps-2 opacity-50">entries | Showing {startPos + 1} to {endPos > orgData?.length ? orgData?.length : endPos} of {orgData?.length} entries</span>
                    </div>
                    <div className="me-1">
                        <span className={`${startPos < 1 ? "opacity-50 " : ""}${"me-1 pointer"}`}
                            onClick={() => handlePrev()}
                        >Previous</span>

                        {orgData && rowSize ?
                            [...Array(Math.ceil(orgData?.length / rowSize))]?.map((itr: any, i: any) => (
                                <span key={i} className={`${currPage === i ? "border border-dark " : "opacity-50 "} ${"mx-1 px-2 py-1 pointer"}`}
                                    onClick={() => { handlePageNavigation(i + 1), setCurrPage(i) }}
                                >
                                    {i + 1}
                                </span>
                            )) :
                            <span className="border border-dark mx-1 px-2 py-1 pointer">
                                1
                            </span>
                        }


                        <span className={`${orgData?.length > endPos ? " " : "opacity-50 "} ${"ms-1 pointer"}`}
                            onClick={() => handleNext(orgData)}
                        >Next</span>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Pagination