import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import Layout from "../../../layout/Layout";

import BASE_URL from "../../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditCaterogy = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState({
    product_category: "",
    product_category_status: "",
    product_category_image: "",
    product_sort: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

const onInputChange = (e) => {
  const { name, value } = e.target;

  
  if (name === "product_sort") {
    if (/^\d*$/.test(value)) { 
      setCategory({
        ...category,
        [name]: value,
      });
    }
  } else {
    setCategory({
      ...category,
      [name]: value,
    });
  }
};

useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-category-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategory(res.data?.productCategory);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
  
    setIsButtonDisabled(true);
  
    const data = new FormData();
    data.append("product_category", category.product_category);
    data.append("product_category_image", selectedFile);
    data.append("product_category_status", category.product_category_status);
    data.append("product_sort", category.product_sort);
  
    try {
      const res = await axios({
        url: `${BASE_URL}/api/web-update-category/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        navigate("/categories");
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
             toast.error(error.response.data.message, error);
             console.error(error.response.data.message, error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  
  
  const imageUrl = category.product_category_image
  ? "https://decopanel.in/storage/app/public/product_category/" +
  category.product_category_image
  : "https://decopanel.in/storage/app/public/no_image.jpg";
  return (
    <Layout>
       <div className="container mx-auto ">

       

        <div className="bg-white rounded-t-lg shadow-lg p-1 mx-auto w-full">
          <div className="flex items-center gap-3 px-4 py-2">
            <Link to="/categories">
              <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
            </Link>
            <h2 className="text-gray-800 text-xl font-semibold">
              {" "}
              Edit Categories
            </h2>
          </div>
        </div>

        
        <div className="bg-white rounded-b-lg mt-1 p-6">
        <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div>
                <div className="col-md-4 col-12 mt-4">
                  <img
                    src={imageUrl}
                    style={{ width: "215px", height: "215px" }}
                      loading="lazy"
                  />
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <div className="flex flex-col gap-6 mb-6 col-span-2">
                  <div className="form-group">
               
                     <Input
                                  label="Category Name"
                                 required
                                  autoComplete="Name"
                                  name="product_category"
                                  value={category.product_category}
                                  onChange={(e) => onInputChange(e)}
                                  maxLength={100}
                                />
                  </div>
  <div className="form-group">
                  
                       <Input
                                               label="Sort"
                                              required
                                               autoComplete="Name"
                                               name="product_sort"
                                               placeholder="0-99"
                                               value={category.product_sort}
                                               onChange={(e) => onInputChange(e)}
                                               maxLength={6}
                                             />
                  </div>

                  <div>
                    <Input
                      type="file"
                      label="Image"
                      name="product_category_image"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </div>
                  <div>
                   
                     <FormControl fullWidth>
                                    <InputLabel id="size-unit-select-label">
                                      <span className="text-sm relative bottom-[6px]">Status</span>
                                    </InputLabel>
                                    <Select
                                      sx={{ height: "40px", borderRadius: "5px" }}
                                      labelId="size-unit-select-label"
                                      id="size-unit-select"
                                      name="product_category_status"
                                      value={category.product_category_status}
                                      label="Size Unit"
                                      onChange={(e) => onInputChange(e)}
                                    >
                                      {status.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                  </div>
                  
                </div>
              </div>
            </div>
             <div className="flex justify-center space-x-4 mt-8">
                          <Button
                            type="submit"
                            color="blue"
                            className="px-6 py-2 rounded-md"
                            disabled={isButtonDisabled}
                          >
                            {isButtonDisabled ? "Updating..." : "Update"}
                          </Button>
                          <Link to="/categories">
                            <Button color="gray" className="px-6 py-2 rounded-md">
                              Back
                            </Button>
                          </Link>
                        </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditCaterogy;
