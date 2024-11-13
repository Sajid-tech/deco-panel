import React, { useContext, useEffect, useState } from "react";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Badge, Chip, CircularProgress, Stack } from "@mui/material";

const ProductsList = () => {
  const [productData, setProductData] = useState(null);
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
          `${BASE_URL}/api/web-fetch-product-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data?.products;
        setProductData(res);
      } catch (error) {
        console.error("Error fetching Catagory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "product_category",
      label: "Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "product_sub_category",
      label: "Sub Category",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "products_brand",
      label: "Brand",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "products_thickness",
      label: "Thickness",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) =>{
          const products_unit = productData[tableMeta.rowIndex].products_unit;
          return value+" "+products_unit;
        },
      },
    },
    {
      name: "products_size1",
      label: "Size",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) =>{
          const products_size2 = productData[tableMeta.rowIndex].products_size2;
          return value+" x "+products_size2;
        },
      },
    },
    {
      name: "products_rate",
      label: "Rate",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "product_status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (product_status) => {
          return product_status === "Active" ? (
            <Stack>
              <Chip  className="md:w-[60%]"  label="Active" color="primary" />
            </Stack>
          ) : (
            <Stack>
              <Chip
               className="md:w-[60%]"
                sx={{  background: "yellow", color: "black" }}
                label="Inactive"
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
              <MdEdit
                onClick={() => navigate(`/edit-product/${id}`)}
                title="edit"
                className="h-5 w-5 cursor-pointer"
              />
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
      <MasterFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
        BrandList
        </h3>

        <Link
          to="/add-product"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          <button className={usertype !== 1 ? "inline-block" : "hidden"}>
            + Add New
          </button>
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={productData ? productData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ProductsList;
