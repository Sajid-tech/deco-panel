import React, { useContext, useEffect, useState } from "react";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import {
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Edit, Visibility } from "@mui/icons-material";
import QuotationsFilter from "../../../components/quotationsFilter";

import moment from "moment";
import { toast } from "react-toastify";

const QuotationsSubmittedList = () => {
  const [brandListData, setBrandListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-submit-quotation-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data?.quotation;
        setBrandListData(res);
      } catch (error) {
        console.error("Error fetching Catagory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
    setLoading(false);
  }, []);

  const QuotationProceed = (e, value) => {
    e.preventDefault();
    axios({
      url: BASE_URL + "/api/web-update-proceed/" + value,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if(res.data.code == 200){
        toast.success("Quotation Updated Sucessfully");
        setBrandListData(res.data.quotation);
      } else {
        toast.error("Failed to convert Quotation ");
       }
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
      name: "quotation_no",
      label: "Quotation No",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "full_name",
      label: "User",
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
        customBodyRender: (quotation_status) => {
          return quotation_status === "Quotation" ? (
            <Stack>
              <Chip className="md:w-[45%]" label="Quotation" color="primary" />
            </Stack>
          ) : quotation_status === "Cancel" ? (
            <Stack>
              <Chip
                className="md:w-[40%]"
                sx={{ background: "yellow", color: "black" }}
                label="Cancel"
              />
            </Stack>
          ) : (
            <Stack>
              <Chip
                className="md:w-[40%]"
                sx={{ background: "lightblue", color: "black" }}
                label="Processing"
              />
            </Stack>
          );
        },
        
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <Tooltip title="Edit" placement="top">
                <IconButton
                  aria-label="Edit"
                  style={{
                    display:
                      localStorage.getItem("user_type_id") == 1 ? "none" : "",
                  }}
                >
                  <Link to={`/edit-quotations/${id}`}>
                    <Edit />
                  </Link>
                </IconButton>
              </Tooltip>
              <Tooltip title="Processing Quotation" placement="top">
                <IconButton
                  aria-label="Processing Quotation"
                  style={{
                    display:
                      localStorage.getItem("user_type_id") == 1 ? "none" : "",
                  }}
                >
                  <a
                    style={{ color: "rgba(13, 126, 247, 0.54)" }}
                    onClick={(e) => QuotationProceed(e, id)}
                  >
                    <ConfirmationNumberIcon />
                  </a>
                </IconButton>
              </Tooltip>
              <Tooltip title="View" placement="top">
                <IconButton aria-label="View">
                  <Link to={`/view-quotions/${id}`}>
                    <Visibility />
                  </Link>
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  const usertype = localStorage.getItem("user_type_id");

  return (
    <Layout>
      {loading && (
        <CircularProgress
          disableShrink
          style={{
            marginLeft: "600px",
            marginTop: "300px",
            marginBottom: "300px",
          }}
          color="secondary"
        />
      )}
      <QuotationsFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Quotations Submitted
        </h3>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={brandListData ? brandListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default QuotationsSubmittedList;
