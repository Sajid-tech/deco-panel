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
import moment from "moment";
import { toast } from "react-toastify";
import QuotationsFilter from "../../../components/QuotationsFilter";

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
      if (res.data.code == 200) {
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
        sort: true,
        customBodyRender: (quotation_date) => {
          return moment(quotation_date).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "quotation_no",
      label: "Quotation No",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "full_name",
      label: "User",
      options: {
        filter: true,
        sort: true,
      },
    },
    // {
    //   name: "quotation_status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: false,
    //     customBodyRender: (quotation_status) => {
    //       return quotation_status === "Quotation" ? (
    //         <Stack>
    //           <Chip className="md:w-[45%]" label="Quotation" color="primary" />
    //         </Stack>
    //       ) : quotation_status === "Cancel" ? (
    //         <Stack>
    //           <Chip
    //             className="md:w-[40%]"
    //             sx={{ background: "yellow", color: "black" }}
    //             label="Cancel"
    //           />
    //         </Stack>
    //       ) : (
    //         <Stack>
    //           <Chip
    //             className="md:w-[40%]"
    //             sx={{ background: "lightblue", color: "black" }}
    //             label="Processing"
    //           />
    //         </Stack>
    //       );
    //     },

    //   },
    // },
    {
      name: "quotation_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (quotation_status) => {
          let bgColor = "";
          let textColor = "text-black";

          if (quotation_status === "Quotation") {
            bgColor = "bg-blue-100 text-blue-800";
          } else if (quotation_status === "Cancel") {
            bgColor = "bg-yellow-200 text-black";
          } else {
            // Processing
            bgColor = "bg-red-200 text-black";
          }

          return (
            <div
              className={`w-fit px-2 py-1 text-sm font-medium rounded-md text-center  ${bgColor} ${textColor}`}
            >
              {quotation_status}
            </div>
          );
        },
      },
    },
    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => (
          <div className="flex items-center space-x-1">
            {localStorage.getItem("user_type_id") != 1 && (
              <>
                <Tooltip title="Edit" placement="top">
                  <IconButton aria-label="Edit" size="small">
                    <Link to={`/edit-quotations/${id}`}><Edit fontSize="small" /></Link>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Processing Quotation" placement="top">
                  <IconButton aria-label="Processing Quotation" size="small" onClick={(e) => QuotationProceed(e, id)}>
                    <ConfirmationNumberIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="View" placement="top">
              <IconButton aria-label="View" size="small">
                <Link to={`/view-quotions/${id}`}><Visibility fontSize="small" /></Link>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    }
    
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    textLabels: {
      body: {
        noMatch: loading ? (
          <CircularProgress />
        ) : (
          "Sorry, there is no matching data to display"
        ),
      },
    },
  };

  return (
    <Layout>
      <QuotationsFilter />

      <div className="mt-1">
        <MUIDataTable
          title=" Quotation Submitted"
          data={brandListData ? brandListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default QuotationsSubmittedList;
