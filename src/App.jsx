import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from './Dropdown';
import Table from './Table';

const App = () => {
  const [reportType, setReportType] = useState('');
  const [pos, setPos] = useState('');
  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handlePOSChange = (event) => {
    setPos(event.target.value);
  };

  const handleShowTable = async () => {
    try {
      if (!reportType || !pos) {
        toast.error('Please select Report type and POS.');
        return;
      }

      const user = getUserForPOS(pos);

      const response = await axios.post(
        'https://lenskits.polynomial.ai/pos_api/get_all_data',
        {
          collection: reportType,
          user: user,
          POS: pos,
        }
      );

      setTableData(response.data[0]?.Data || []);
      setShowTable(true);
    } catch (error) {
      toast.error('Error fetching data from the API.');
      console.error('Error fetching data from the API.', error);
    }
  };

  const getUserForPOS = (pos) => {
    switch (pos) {
      case 'Hub_Hungry POS':
        return 'ryan@therestaurantboss.com';
      case 'REVEL POS':
        return 'ryangromfin';
      case 'SQUAREUP POS':
        return 'jovial.coder2025@gmail.com';
      default:
        return '';
    }
  };

  const reportTypeOptions = [
    { label: 'Labor', value: 'labor' },
    { label: 'Product', value: 'product' },
    { label: 'Sales', value: 'sales' },
  ];

  const posOptions = [
    { label: 'Hub_Hungry POS', value: 'Hub_Hungry POS' },
    { label: 'REVEL POS', value: 'REVEL POS' },
    { label: 'SQUAREUP POS', value: 'SQUAREUP POS' },
  ];

  return (
    <div className="container">
      <h1 className="my-4 text-center">POS Data Preview</h1>
      <div className="d-flex justify-content-center align-items-start">
        <div className="col-md-6 mb-3 mx-2">
          <label htmlFor="reportType">Report type:</label>
          <Dropdown id="reportType" options={reportTypeOptions} onChange={handleReportTypeChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="pos">POS:</label>
          <Dropdown id="pos" options={posOptions} onChange={handlePOSChange} />
        </div>
      </div>
      <button className="btn btn-primary mb-3 d-block mx-auto" onClick={handleShowTable}>
        Show Table
      </button>
      {showTable && (
        <div className="row">
          <div className="col-md-12">
            <Table data={tableData} />
          </div>
        </div>
      )}

      {/* Add ToastContainer to show toast messages */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default App;
