import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

const CaterogyList = () => {
  const [categoriyListData, setCategoriyListData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-category-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data?.productCategoryList;
        setCategoriyListData(res);
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
      name: "product_category_image",
      label: "IMAGE",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (product_category_image) => {
          const imageUrl = product_category_image
            ? "https://decopanel.in/storage/app/public/product_category/" +
              product_category_image
            : "https://decopanel.in/storage/app/public/no_image.jpg";
          return (
            <img
              src={imageUrl}
              className="media-object rounded-full w-14 h-14"
              loading="lazy"
              alt="Category"
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
      name: "product_sort",
      label: "Sort",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "product_category_status",
      label: "Status",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (product_category_status) => {
          return (
            <div
              className="w-fit px-2 py-1 text-sm font-medium rounded-md 
            text-center 
              bg-blue-100 text-blue-800"
              style={
                product_category_status !== "Active"
                  ? {
                      backgroundColor: "#fef08a",
                      color: "#1c1917",
                    }
                  : {}
              }
            >
              {product_category_status === "Active" ? "Active" : "Inactive"}
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
                onClick={() => navigate(`/edit-categories/${id}`)}
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
    viewColumns: false,
    download: false,
    print: false,
    customToolbar: () => {
      return (
        <button
          onClick={() => navigate("/add-categories")}
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 text-sm px-2 py-1 rounded shadow-md"
        >
          + Category
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
          title="Categories List"
          data={categoriyListData ? categoriyListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default CaterogyList;
