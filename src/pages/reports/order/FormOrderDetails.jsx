import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

import { TextField, MenuItem, Button } from "@mui/material";
import Layout from "../../../layout/Layout";
import ReportFilter from "../../../components/ReportFilter";
import { toast } from "react-toastify";
const status = [
    {
      value: "Order",
      label: "Order",
    },
    {
        value: "Quotation",
        label: "Quotation",
    },
    {
        value: "Cancel",
        label: "Cancel",
      },
  ];

const FormOrderDetails = () => {
    var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  
  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [downloadOrder, setOrderDownload] = useState({
    order_user_id:"",
    order_from_date: "2023-03-01", 
    order_to_date: todayback,
    order_status: ""
  });
  
  const [client, setClient] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
  
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
    // Handle input change
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
  
    // const downloadReport = async (url, fileName) => {
    //   try {
    //     const data = {
    //         order_user_id:downloadOrder.order_user_id,
    //         order_from_date: downloadOrder.order_from_date,
    //         order_to_date: downloadOrder.order_to_date,
    //         order_status: downloadOrder.order_status,
    // };
    //     const token = localStorage.getItem("token");
    //     const res = await axios.post(url, data, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //       responseType: "blob",
    //     });
  
    //     const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
    //     const link = document.createElement("a");
    //     link.href = downloadUrl;
    //     link.setAttribute("download", fileName);
    //     document.body.appendChild(link);
    //     link.click();
  
    //     console.log(`${fileName} downloaded successfully.`);
    //   } catch (err) {
    //     console.error(`Error downloading ${fileName}:`, err);
    //   }
    // };
  
    // download
    // const onSubmit = (e) => {
    //   e.preventDefault();
    //   downloadReport(
    //     `${BASE_URL}/api/download-order-report`,
    //     "order-report.csv"
    //   );
    // };

    const onSubmit = (e) => {
      e.preventDefault();
      let data = {
              order_user_id:downloadOrder.order_user_id,
              order_from_date: downloadOrder.order_from_date,
              order_to_date: downloadOrder.order_to_date,
              order_status: downloadOrder.order_status,
      };
      const form = e.target;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
     

     
      setIsButtonDisabled(true)
      axios({
          url: BASE_URL+"/api/download-order-report",
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
          setIsButtonDisabled(false)
      }).catch((err) =>{
        toast.error("Order Report is Not Downloaded");
          setIsButtonDisabled(false)
      });
    
  };
  
    //  report view
   
    const onReportView = (e) => {
      e.preventDefault();
      localStorage.setItem('order_user_id',downloadOrder.order_user_id);
        localStorage.setItem('order_from_date',downloadOrder.order_from_date);
        localStorage.setItem('order_to_date',downloadOrder.order_to_date);
        localStorage.setItem('order_status',downloadOrder.order_status);
  
      navigate("/order-view-report");
    };
  return (
    <Layout>
        <ReportFilter/>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Order Details Report</h3>
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
                    value={downloadOrder.order_user_id}
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
                    value={downloadOrder.order_from_date}
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
                    value={downloadOrder.order_to_date}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    label="Status"
                    autoComplete="off"
                    select
                    name="order_status"
                    value={downloadOrder.order_status}
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

export default FormOrderDetails