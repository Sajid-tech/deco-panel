import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from '../../../layout/Layout'
import ReportFilter from '../../../components/ReportFilter'
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";


const statusOptions = [
  { value: "Quotation", label: "Quotation" },
  { value: "Processing", label: "Processing" },
  { value: "Cancel", label: "Cancel" },
];

const FormQuotationDetails = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  
  const todayback = `${yyyy}-${mm}-${dd}`;
  
  const [downloadQuotation, setQuotationDownload] = useState({
    orders_user_id: "",
    quotation_from_date: "2023-03-01",
    quotation_to_date: todayback,
    quotation_status: ""
  });
  
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationDownload({
      ...downloadQuotation,
      [name]: value,
    });
    setIsButtonDisabled(!value);
  };

  useEffect(() => {
    const fetchVend = async () => {
      try {
        
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClient(response.data?.profile);
      } catch (error) {
        console.error("Error fetching order profile data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVend();
  }, [ navigate]);

  const downloadReport = async (url, fileName) => {
    try {
      const data = {
        orders_user_id: downloadQuotation.orders_user_id,
        quotation_from_date: downloadQuotation.quotation_from_date,
        quotation_to_date: downloadQuotation.quotation_to_date,
        quotation_status: downloadQuotation.quotation_status,
      };
      const token = localStorage.getItem("token");
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/download-quotation-report`,
      "quotation-report.csv"
    );
  };

  const onReportView = (e) => {
    e.preventDefault();
    localStorage.setItem('orders_user_id', downloadQuotation.orders_user_id);
    localStorage.setItem('quotation_from_date', downloadQuotation.quotation_from_date);
    localStorage.setItem('quotation_to_date', downloadQuotation.quotation_to_date);
    localStorage.setItem('quotation_status', downloadQuotation.quotation_status);

    navigate("/quotation-view-report");
  };

  return (
    <Layout>
      <ReportFilter />
      <div className="  mt-1  max-w-full mx-auto">
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-medium text-gray-800">Quotation Detailed Report</h2>
          </div>
          
          <form id="addIndiv" autoComplete="off" className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  id="client-select"
                  name="orders_user_id"
                  value={downloadQuotation.orders_user_id}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Client</option>
                  {client.map((fabric) => (
                    <option key={fabric.id} value={fabric.id}>
                      {fabric.full_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  id="from-date"
                  type="date"
                  name="quotation_from_date"
                  value={downloadQuotation.quotation_from_date}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  id="to-date"
                  type="date"
                  name="quotation_to_date"
                  value={downloadQuotation.quotation_to_date}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-select"
                  name="quotation_status"
                  value={downloadQuotation.quotation_status}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                onClick={onSubmit}
                disabled={isButtonDisabled}
                className={`px-4 py-2 rounded-md text-white ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
              >
                Download Report
              </button>
              
              <button
                type="button"
                onClick={onReportView}
                disabled={isButtonDisabled}
                className={`px-4 py-2 rounded-md border ${isButtonDisabled ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'} transition-colors`}
              >
                View Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default FormQuotationDetails;