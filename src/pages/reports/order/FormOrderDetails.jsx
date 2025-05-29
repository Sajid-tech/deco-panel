import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import Layout from "../../../layout/Layout";
import ReportFilter from "../../../components/ReportFilter";
import { toast } from "sonner";


const statusOptions = [
  { value: "Order", label: "Order" },
  { value: "Quotation", label: "Quotation" },
  { value: "Cancel", label: "Cancel" },
];

const FormOrderDetails = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  
  const todayback = `${yyyy}-${mm}-${dd}`;
  const [downloadOrder, setOrderDownload] = useState({
    order_user_id: "",
    order_from_date: "2023-03-01",
    order_to_date: todayback,
    order_status: ""
  });
  
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDownload({
      ...downloadOrder,
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

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      order_user_id: downloadOrder.order_user_id,
      order_from_date: downloadOrder.order_from_date,
      order_to_date: downloadOrder.order_to_date,
      order_status: downloadOrder.order_status,
    };
    
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/download-order-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'order_list.csv');
      document.body.appendChild(link);
      link.click();
      toast.success("Order Report is Downloaded Successfully");
      setIsButtonDisabled(false);
    }).catch((err) => {
      toast.error("Order Report is Not Downloaded");
      setIsButtonDisabled(false);
    });
  };
  
  const onReportView = (e) => {
    e.preventDefault();
    localStorage.setItem('order_user_id', downloadOrder.order_user_id);
    localStorage.setItem('order_from_date', downloadOrder.order_from_date);
    localStorage.setItem('order_to_date', downloadOrder.order_to_date);
    localStorage.setItem('order_status', downloadOrder.order_status);
    navigate("/order-view-report");
  };

  return (
    <Layout>
      <ReportFilter />
      <div className="max-w-full mt-1 mx-auto">
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-medium text-gray-800">Orders Detailed Report</h2>
          </div>
          
          <form id="addIndiv" autoComplete="off" className="p-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label htmlFor="client-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  id="client-select"
                  name="order_user_id"
                  value={downloadOrder.order_user_id}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
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
                  name="order_from_date"
                  value={downloadOrder.order_from_date}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  id="to-date"
                  type="date"
                  name="order_to_date"
                  value={downloadOrder.order_to_date}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-select"
                  name="order_status"
                  value={downloadOrder.order_status}
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
                disabled={isButtonDisabled}
                className={`px-4 py-2 rounded-md text-white ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
              >
                {isButtonDisabled ? 'Downloading...' : 'Download'}
              </button>
              
              <button
                type="button"
                onClick={onReportView}
                disabled={isButtonDisabled}
                className={`px-4 py-2 rounded-md border ${isButtonDisabled ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'} transition-colors`}
              >
                View
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default FormOrderDetails;