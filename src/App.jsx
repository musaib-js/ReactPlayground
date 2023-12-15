import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "./Dropdown";
import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'

const App = () => {
  const [posList, setPosList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [reportType, setReportType] = useState("");
  const [pos, setPos] = useState("");
  const [user, setUser] = useState("");
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/get_pos_list`
      );
      setPosList(response.data);
    } catch (error) {}
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/all_users`
      );
      setUserList(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handlePOSChange = (event) => {
    setPos(event.target.value);
  };

  const handleShowTable = async () => {
    try {
      if (!reportType || !pos) {
        toast.error("Please select Report type and POS.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/get_all_data`,
        {
          report_name: reportType,
          user: user,
          POS: pos,
        }
      );

      setTableData(response.data || []);
      setShowTable(true);
    } catch (error) {
      toast.error("Error fetching data from the API.");
      console.error("Error fetching data from the API.", error);
    }
  };

  const reportTypeOptions = [
    { label: "Labor", value: "labor" },
    { label: "Product", value: "product" },
    { label: "Sales", value: "sales" },
  ];

  return (
    <div className="container">
      <h1 className="my-4 text-center">POS Data Preview</h1>
      <div className="d-flex justify-content-center align-items-start">
      <div className="col-md-4 mb-3 mx-2">
          <label htmlFor="user">Select a User:</label>
          <select
            className="form-select"
            id="user"
            onChange={(e) => setUser(e.target.value)}
            value={user}
          >
            <option value="">Select</option>
            {userList.map((user) => (
              <option key={user._id} value={user.credentials.username}>
                {user.credentials.username}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="pos">Select a POS:</label>
          <select
            className="form-select"
            id="pos"
            onChange={handlePOSChange}
            value={pos}
          >
            <option value="">Select</option>
            {posList.map((pos) => (
              <option
                key={pos._id}
                value={pos.pos_name}
                style={{ textTransform: "capitalize" }}
              >
                {pos.pos_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3 mx-2">
          <label htmlFor="reportType">Report type:</label>
          <Dropdown
            id="reportType"
            options={reportTypeOptions}
            onChange={handleReportTypeChange}
          />
        </div>
      </div>
      <button
        className="btn btn-warning mb-3 d-block mx-auto"
        onClick={handleShowTable}
      >
        Show Table
      </button>
      {showTable && (
        <div className="row">
          <div className="col-md-12 table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">POS</th>
                  <th scope="col">User</th>
                  <th scope="col">Report Name</th>
                  <th scope="col">Data</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.Date}</td>
                    <td>{data.pos_name}</td>
                    <td>{data.user}</td>
                    <td>{data.report_name}</td>
                    <td
                     data-bs-toggle="tooltip"
                     data-bs-placement="top"
                     title={data.Data.length === 0 ? "No data available" : "Click to view the data"}>
                      <button
                        disabled={data.Data.length === 0}
                        className="btn btn-warning"
                        onClick={() => {
                          setData(data.Data);
                          setShow(true);
                          setDate(data.Date);
                        }}
                      >
                        Show Data
                      </button>
                      <Tooltip id={index} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Data for {date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h2>Data Table</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => <th style={{ width: "150px" }} key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, index) => (
                        <td key={index}>{value}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Object.keys(data?.[0] || {}).length || 1}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
      {/* Add ToastContainer to show toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
