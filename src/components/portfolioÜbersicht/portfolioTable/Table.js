import React, {useEffect, useState} from "react";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useAtom} from "jotai/index";
import {portfolioAtom} from "@/app/stores/portfolioStore";
import {getAssets, getCoinData} from "@/lib/data"; // Theme

// Create new GridExample component
const GridExample = () => {

    const [loading, setLoading] = useState(false)
    // const [data, setData] = useState()

    useEffect(() => {
        setLoading(true);
        getCoinData().then(data => {
            // setData(data.data);
            console.log("tetsingwtfman", data.data)
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    }, []);

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Mercedes", model: "EQA", price: 48890, electric: true },
        { make: "Fiat", model: "500", price: 15774, electric: false },
        { make: "Nissan", model: "Juke", price: 20675, electric: false },
    ]);

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" },
    ]);

    const defaultColDef = {
        flex: 1,
    };

    // Container: Defines the grid's theme & dimensions.
    return (
        <div
            className={
                "ag-theme-quartz-dark"
            }
            style={{ width: "100%", height: "100%" }}
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
            />
        </div>
    );
};

export default GridExample;