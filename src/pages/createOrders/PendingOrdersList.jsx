import React, { useContext, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
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
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import CreateOrderFilter from "../../components/CreateOrderFilter";
import { toast } from "react-toastify";

const PendingOrdersList = () => {
  const [OrderListData, setOrderListData] = useState(null);
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
          `${BASE_URL}/api/web-fetch-pending-order-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data?.orders;
        setOrderListData(res);
      } catch (error) {
        console.error("Error fetching Catagory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
    setLoading(false);
  }, []);

 const sendEmail = (e,value) => {
    e.preventDefault();
    axios({
      url: BASE_URL+"/api/web-create-quotation/"+value,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
         if(res.data.code == 200){

           toast.success("Quotation Created Sucessfully");
           setOrderListData(res.data.orders);
         }
         else {
          toast.error("Failed to convert Quotation ");
         }
      
    })
  };

  const columns = [
    {
      name: "orders_date",
      label: "Order Date",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (orders_date) => {
          return moment(orders_date).format("DD-MM-YYYY");
        }
      },
    },
    {
      name: "orders_no",
      label: "Order No",
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
      name: "orders_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (orders_status) => {
          return orders_status === "Order" ? (
            <Stack>
              <Chip className="md:w-[50%]" label="Order" color="primary" />
            </Stack>
          ) : orders_status === "Cancel" ? (
            <Stack>
              <Chip
                className="md:w-[50%]"
                sx={{ background: "yellow", color: "black" }}
                label="Cancel"
              />
            </Stack>
          ) : (
            <Stack>
              <Chip
                className="md:w-[50%]"
                sx={{ background: "lightblue", color: "black" }}
                label="Quotation"
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
                  <Link to={`/edit-order/${id}`}>
                    <Edit />
                  </Link>
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Quotation" placement="top">
                <IconButton
                  aria-label="Generate Quotation"
                  style={{
                    display:
                      localStorage.getItem("user_type_id") == 1 ? "none" : "",
                  }}
                >
                  <a
                    style={{ color: "rgba(13, 126, 247, 0.54)" }}
                    onClick={(e) => sendEmail(e, id)}
                  >
                    <ConfirmationNumberIcon />
                  </a>
                </IconButton>
              </Tooltip>
              <Tooltip title="View" placement="top">
                <IconButton aria-label="View">
                  <Link to={`/view-order/${id}`}>
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
      <CreateOrderFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
        Pending Orders List
        </h3>
        <Link
          to="/create-order"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          <button >
            + Add New
          </button>
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={OrderListData ? OrderListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PendingOrdersList;
