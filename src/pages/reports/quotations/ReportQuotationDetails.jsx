import React, { useContext, useEffect, useRef, useState } from 'react'
import Layout from '../../../layout/Layout'
import ReportFilter from '../../../components/ReportFilter'
import MUIDataTable from 'mui-datatables';
import { ContextPanel } from '../../../utils/ContextPanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IconButton } from '@material-tailwind/react';
import { FaRegFilePdf } from 'react-icons/fa';
import moment from 'moment';

const ReportQuotationDetails = () => {
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isPanelUp } = useContext(ContextPanel);
    const navigate = useNavigate();
    const tableRef = useRef(null);
    useEffect(() => {
      const fetchReprotQuotation = async () => {
        try {
          if (!isPanelUp) {
            navigate("/maintenance");
            return;
          }
          setLoading(true);
          const data = {
            orders_user_id:localStorage.getItem("orders_user_id"),
        quotation_from_date: localStorage.getItem("quotation_from_date"), 
        quotation_to_date: localStorage.getItem("quotation_to_date"),
        quotation_status: localStorage.getItem("quotation_status"),
          };
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `${BASE_URL}/api/web-fetch-quotation-report-list`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setQuotation(response.data?.quotation);
          console.log("report quoattaion report", response.data.quotation);
        } catch (error) {
          console.error("Error fetching one report quoation data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReprotQuotation();
      setLoading(false);
    }, []);
  
    const handleSavePDF = () => {
      const input = tableRef.current;
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        pdf.save("quotation-report.pdf");
      });
    };
  
    const columns = [
      {
        name: "quotation_date",
        label: "Quotation Date",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (quotation_date) => {
            return moment(quotation_date).format("DD-MM-YYYY");
          }
          
        },
      },
      {
        name: "full_name",
        label: "Client",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "quotation_no",
        label: "Quotation No",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "quotation_status",
        label: "Status",
        options: {
          filter: true,
          sort: false,
        },
      },
      
    ];
  
    const options = {
      selectableRows: "none",
      elevation: 0,
      pagination: false,
      search: false,
      filter: false,
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 10, 25],
      responsive: "standard",
      viewColumns: false,
      customToolbar: () => {
        return (
          <IconButton
            onClick={handleSavePDF}
            title="Save as PDF"
            className="bg-white text-black"
          >
            <FaRegFilePdf className="w-5 h-5" />
          </IconButton>
        );
      },
    };
  return (
    <Layout>
        <ReportFilter/>
        <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Quotation Details Report
        </h3>
      </div>

      <div className="mt-5" ref={tableRef}>
        <MUIDataTable
          data={quotation ? quotation : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default ReportQuotationDetails