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

const CaterogyList = () => {
  const [categoriyListData, setCategoriyListData] = useState(null);
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
      name: "product_category_image",
      label: " ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (product_category_image) => {
          return (
            <img
              src={
                "https://decopanel.in/storage/app/public/product_category/" +
                product_category_image
              }
              className="media-object rounded-circle w-[75px] h-[75px]"
              
              alt="Product Category"
            />
          );
        },
      },
    },
    {
      name: "product_category",
      label: "Caterogy",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "product_category_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (product_category_status) => {
          return product_category_status === "Active" ? (
            <Stack>
              <Chip className="md:w-[40%]"  label="Active" color="primary" />
            </Stack>
          ) : (
            <Stack>
              <Chip
              className="md:w-[40%]"
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
    viewColumns: true,
    download: false,
    print: false,
    
  };
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
          Categories List
        </h3>

        <Link
          to="/add-categories"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add New
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={categoriyListData ? categoriyListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default CaterogyList;
