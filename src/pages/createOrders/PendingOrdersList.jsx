import React, {  useEffect, useState } from "react";

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

import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import CreateOrderFilter from "../../components/CreateOrderFilter";
import { toast } from "sonner";


const PendingOrdersList = () => {
  const [OrderListData, setOrderListData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        
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
             toast.error(error.response.data.message, error);
                console.error(error.response.data.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
  
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
        sort: true,
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
    //   name: "orders_status",
    //   label: "Status",
    //   options: {
    //     filter: true,
    //     sort: false,
    //     customBodyRender: (orders_status) => {
    //       return orders_status === "Order" ? (
    //         <Stack>
    //           <Chip className="md:w-[50%]" label="Order" color="primary" />
    //         </Stack>
    //       ) : orders_status === "Cancel" ? (
    //         <Stack>
    //           <Chip
    //             className="md:w-[50%]"
    //             sx={{ background: "yellow", color: "black" }}
    //             label="Cancel"
    //           />
    //         </Stack>
    //       ) : (
    //         <Stack>
    //           <Chip
    //             className="md:w-[50%]"
    //             sx={{ background: "lightblue", color: "black" }}
    //             label="Quotation"
    //           />
    //         </Stack>
    //       );
    //     },
    //   },
    // },
    {
      name: "orders_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (orders_status) => {
          let bgColor = "";
          let textColor = "text-black";
    
          if (orders_status === "Order") {
            bgColor = "bg-blue-100 text-blue-800";
          } else if (orders_status === "Cancel") {
            bgColor = "bg-yellow-200 text-black";
          } else {
          
            bgColor = "bg-sky-200 text-black";
          }
    
          return (
            <div className={`w-fit px-2 py-1 text-sm font-medium rounded-md text-center  ${bgColor} ${textColor}`}>
              {orders_status}
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
                    <Link to={`/edit-order/${id}`}><Edit fontSize="small"/></Link>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Generate Quotation" placement="top">
                  <IconButton aria-label="Generate Quotation" size="small">
                    <Link to={`/add-quotations/${id}`}><ConfirmationNumberIcon fontSize="small"/></Link>
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title="View" placement="top">
              <IconButton aria-label="View" size="small">
                <Link to={`/view-order/${id}`}><Visibility fontSize="small"/></Link>
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    }
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    customToolbar: () => {
              return (
               
                   <button
                   onClick={() => navigate("/create-order")}
                   className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 text-sm px-2 py-1 rounded shadow-md"
                 >
                    + Order
                 </button>
              );
            },
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
     
      <CreateOrderFilter />
     
      <div className="mt-1">
        <MUIDataTable
        title ="Pending Order List"
          data={OrderListData ? OrderListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PendingOrdersList;
