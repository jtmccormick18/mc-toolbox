import React, { useState } from "react";

function CsvTable() {
    const [file, setCSVFile] = useState();
    const [array, setArray] = useState([]);
    const fileReader = new FileReader();
    const handleOnChange = (e) => {
        setCSVFile(e.target.files[0]);
    };
    const csvArray = (string) => {
        const header = string.slice(0, string.indexOf("\n")).split(",");
        const rows = string.slice(string.indexOf("\n") + 1).split("\n");
        const array = rows.map((i) => {
            const values = i.split(",");
            const obj = header.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});
            return obj;
        });
        setArray(array);
    };
    const onFileSubmit = (e) => {
        e.preventDefault();
        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvArray(text);
            };
            fileReader.readAsText(file);
        }
    };
    const headerVal = Object.keys(Object.assign({}, ...array));
    return (
        <div className="row">

            <div className="col-xs-12 mb-3">
                <form>
                    <input
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleOnChange}
                        className="form-control mb-3"
                    />
                    <button
                        onClick={(e) => {
                            onFileSubmit(e);
                        }}
                        className="btn btn-danger mb-3"
                    >
                        Import CSV
                    </button>
                </form>

                <table className="table table-dark table-striped">
                    <thead className="table-primary">
                        <tr key={"header"}>
                            {headerVal.map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {array.map((item) => (
                            <tr key={item.id}>
                                {Object.values(item).map((val) => (
                                    <td>{val}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default CsvTable;