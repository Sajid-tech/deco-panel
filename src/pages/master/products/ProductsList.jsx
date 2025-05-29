import React, {  useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Badge, Chip, CircularProgress, Stack } from "@mui/material";
import { toast } from "sonner";

const ProductsList = () => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const usertype = localStorage.getItem("user_type_id");
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        
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
        toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountryData();
    
  }, []);

  const columns = [
    {
      name: "products_image",
      label: "IMAGE",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (products_image) => {
          const imageUrl = products_image
          ? "https://decopanel.in/storage/app/public/allimages/" + products_image
          : "https://decopanel.in/storage/app/public/no_image.jpg";
          return (
            <img
              src={imageUrl }
              className="media-object rounded-full w-14 h-14"
              alt="Product"
                loading="lazy"
            />
          );
        },
      },
    },
    {
      name: "product_category",
      label: "Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "product_sub_category",
      label: "Sub Category",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "products_brand",
      label: "Brand",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "products_thickness",
      label: "Thickness",
      options: {
        filter: true,
        sort: true,
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
        sort: true,
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
        sort: true,
      },
    },
    {
      name: "product_status",
      label: "Status",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (product_status) => {
          return (
            <div className="w-fit px-2 py-1 text-sm font-medium rounded-md 
            text-center 
              bg-blue-100 text-blue-800"
              style={product_status !== "Active" ? {
                backgroundColor: "#fef08a", 
                color: "#1c1917" 
              } : {}}
            >
              {product_status === "Active" ? "Active" : "Inactive"}
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
   customToolbar: () => {
         return (
           <button
             onClick={() => navigate("/add-product")}
             className={`btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 text-sm px-2 py-1 rounded shadow-md ${
               usertype !== 1 ? "inline-block" : "hidden"
             }`}
           >
             + Product
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
     
      <MasterFilter />
    
      <div className="mt-1">
        <MUIDataTable
        title="Products List"
          data={productData ? productData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ProductsList;
