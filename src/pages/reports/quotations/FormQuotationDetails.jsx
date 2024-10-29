import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from '../../../layout/Layout'
import ReportFilter from '../../../components/ReportFilter'
import axios from "axios";

import { TextField, MenuItem, Button } from "@mui/material";
import BASE_URL from "../../../base/BaseUrl";
import { ContextPanel } from "../../../utils/ContextPanel";
const status = [
    {
      value: "Quotation",
      label: "Quotation",
    },
    {
        value: "Processing",
        label: "Processing",
    },
    {
        value: "Cancel",
        label: "Cancel",
      },
  ];

const FormQuotationDetails = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    
    today = mm + "/" + dd + "/" + yyyy;
    var todayback = yyyy + "-" + mm + "-" + dd;
    const [downloadQuotation, setQuotationDownload] = useState({
      orders_user_id:"",
      quotation_from_date: "2023-03-01", 
      quotation_to_date: todayback,
      quotation_status: ""
    });
    
    const [client, setClient] = useState([]);
      const [loading, setLoading] = useState(false);
      const { isPanelUp } = useContext(ContextPanel);
      const navigate = useNavigate();
    
      const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
      // Handle input change
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
            if (!isPanelUp) {
              navigate("/maintenance");
              return;
            }
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
        setLoading(false);
      }, []);
    
      const downloadReport = async (url, fileName) => {
        try {
          const data = {
            orders_user_id:downloadQuotation.orders_user_id,
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
    
          console.log(`${fileName} downloaded successfully.`);
        } catch (err) {
          console.error(`Error downloading ${fileName}:`, err);
        }
      };
    
      // download
      const onSubmit = (e) => {
        e.preventDefault();
        downloadReport(
          `${BASE_URL}/api/download-quotation-report`,
          "quotation-report.csv"
        );
      };
    
      //  report view
      const onReportView = (e) => {
        e.preventDefault();
        localStorage.setItem('orders_user_id',downloadQuotation.orders_user_id);
        localStorage.setItem('quotation_from_date',downloadQuotation.quotation_from_date);
        localStorage.setItem('quotation_to_date',downloadQuotation.quotation_to_date);
        localStorage.setItem('quotation_status',downloadQuotation.quotation_status);
    
        navigate("/quotation-view-report");
      };
  return (
   <Layout>
    <ReportFilter/>
    <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Quotation Details Report</h3>
        </div>
        <div className="grid gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <form id="addIndiv" autoComplete="off">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="form-group">
                  <TextField
                    fullWidth
                    label="Client"
                    autoComplete="off"
                    select
                    name="order_user_id"
                    value={downloadQuotation.order_user_id}
                    onChange={onInputChange}
                  >
                    {client.map((fabric) => (
                      <MenuItem key={fabric.id} value={fabric.id}>
                        {fabric.full_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    required
                    label="From Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                    name="order_from_date"
                    value={downloadQuotation.quotation_from_date}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    required
                    label="To Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    autoComplete="off"
                    name="order_to_date"
                    value={downloadQuotation.quotation_to_date}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    label="Status"
                    autoComplete="off"
                    select
                    name="quotation_status"
                    value={downloadQuotation.quotation_status}
                    onChange={onInputChange}
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                
              </div>
              <div className="mt-6 flex justify-start gap-5">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-100 to-indigo-300 text-white py-2 px-4 rounded-md mr-4"
                  onClick={onSubmit}
                  disabled={isButtonDisabled}
                >
                  Download
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-100 to-indigo-300 text-white py-2 px-4 rounded-md"
                  onClick={onReportView}
                  disabled={isButtonDisabled}
                >
                  View
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
   </Layout>
  )
}

export default FormQuotationDetails