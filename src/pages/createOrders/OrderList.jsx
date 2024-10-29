import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import BASE_URL from '../../base/BaseUrl';
import { Button, IconButton, Tooltip } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import Layout from '../../layout/Layout';
import CreateOrderFilter from '../../components/CreateOrderFilter';
import { Visibility } from '@mui/icons-material';

const OrderList = () => {
    const [orderList, setOrderList] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchOrderList = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/web-fetch-order-list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setOrderList(response.data.orders);
          console.log("set order list", response.data.orders);
        } catch (error) {
          console.error("error while fetching select product ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderList();
      setLoading(false);
    }, []);
  
    const handleCreateOrder = () => {
      navigate("/home");
    };
  
    const handleOrderList = () => {
      navigate("/order-list");
    };
  
    const columns = useMemo(
      () => [
        {
          name: "orders_date",
          label: "Order date",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "orders_no",
          label: "Order no",
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
                  {/* <Link
                    to={`/view-order/${id}`}
                    className="bg-blue-500 rounded-md p-2  text-black cursor-pointer"
                  >
                    view
                  </Link> */}
                   <Tooltip title="View" placement="top">
                  <IconButton aria-label="View">
                    <Link
                      to={`/view-order/${id}`}
                    >
                      <Visibility />
                    </Link>
                  </IconButton>
                </Tooltip>
                </div>
              );
            },
          },
        },
      ],
      [orderList]
    );
  
    const options = {
      selectableRows: "none",
      elevation: 0,
      responsive: "standard",
      viewColumns: false,
      download: false,
      print: false,
    };
    const data = useMemo(() => (orderList ? orderList : []), [orderList]);
  return (
    <Layout>
          <CreateOrderFilter/>
  
      <div className="mt-5">
      

        <div className="bg-white mt-4 p-4 md:p-6 rounded-lg shadow-lg">
          <MUIDataTable
            title={"Order list"}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </Layout>
  )
}

export default OrderList