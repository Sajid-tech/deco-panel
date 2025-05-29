import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import Layout from "../../../layout/Layout";

import BASE_URL from "../../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";
import { toast } from "sonner";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ArrowLeft } from "lucide-react";
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

const EditSubCategory = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [subcategory, setSubCategory] = useState({
    product_category_id: "",
    product_sub_category: "",
    product_sub_category_status: "",
    product_sub_category_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [category, setCategory] = useState([]);

  const onInputChange = (e) => {
    setSubCategory({
      ...subcategory,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-sub-category-by-Id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSubCategory(res.data?.productSubCategory);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCategory(res.data?.productCategory);
      });
  }, []);

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const form = e.target;
  //   if (!form.checkValidity()) {
  //     form.reportValidity();
  //     return;
  //   }
  //   setIsButtonDisabled(true);
   
  //   const data = new FormData();
  //   data.append("product_category_id", subcategory.product_category_id);
  //   data.append("product_sub_category_image", selectedFile);
  //   data.append(
  //     "product_sub_category_status",
  //     subcategory.product_sub_category_status
  //   );
  //   data.append("product_sub_category", subcategory.product_sub_category);

  //   axios({
  //     url: `${BASE_URL}/api/web-update-sub-category/${id}?_method=PUT`,
  //     method: "POST",
  //     data,
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then((res) => {
  //     if (res.data.code == 200) {
  //       toast.success("Sub Caterogies Updated Successfully");
  //       navigate("/sub-categories");
  //       setIsButtonDisabled(false);
  //     } else {
  //       toast.error("duplicate entry");
  //     }
  //   });
  // };


  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
  
    setIsButtonDisabled(true);
  
    const data = new FormData();
    data.append("product_category_id", subcategory.product_category_id);
    data.append("product_sub_category_image", selectedFile);
    data.append(
      "product_sub_category_status",
      subcategory.product_sub_category_status
    );
    data.append("product_sub_category", subcategory.product_sub_category);
  
    try {
      const res = await axios({
        url: `${BASE_URL}/api/web-update-sub-category/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        navigate("/sub-categories");
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
  
  const imageUrl = subcategory.product_sub_category_image
    ? "https://decopanel.in/storage/app/public/product_category/" +
      subcategory.product_sub_category_image
    : "https://decopanel.in/storage/app/public/no_image.jpg";
  return (
    <Layout>
     <div className="container mx-auto ">
       
        <div className="bg-white rounded-t-lg shadow-lg p-1 mx-auto w-full">
  <div className="flex items-center gap-3 px-4 py-2">
    <Link to="/sub-categories">
      <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
    </Link>
    <h2 className="text-gray-800 text-xl font-semibold">     Edit Sub Categories</h2>
  </div>
</div>


        <div className="bg-white rounded-b-lg mt-1 p-6">
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div>
              <img
                    src={imageUrl}
                    style={{ width: "215px", height: "215px" }}
                      loading="lazy"
                  />
              </div>
              <div className="col-span-2 mt-4">
     
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                    <div className="form-group">
                      <FormControl fullWidth>
                        <InputLabel id="category-select-label">
                          <span className="text-sm relative bottom-[6px]">
                            Category <span className="text-red-700">*</span>
                          </span>
                        </InputLabel>
                        <Select
                          sx={{ height: "40px", borderRadius: "5px" }}
                          labelId="category-select-label"
                          id="category-select"
                          name="product_category_id"
                          value={subcategory.product_category_id}
                          label="Category"
                          onChange={(e) => onInputChange(e)}
                          required
                        >
                          {category?.map((data, key) => (
                            <MenuItem key={key} value={data.id}>
                              {data.product_category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="form-group">
                      <Input
                        label="Sub Category"
                        required
                        autoComplete="Name"
                        name="product_sub_category"
                        value={subcategory.product_sub_category}
                        onChange={(e) => onInputChange(e)}
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <Input
                        type="file"
                        label="Image"
                        name="product_sub_category_image"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="size-unit-select-label">
                          <span className="text-sm relative bottom-[6px]">
                            Status
                          </span>
                        </InputLabel>
                        <Select
                          sx={{ height: "40px", borderRadius: "5px" }}
                          labelId="size-unit-select-label"
                          id="size-unit-select"
                          name="product_sub_category_status"
                          value={subcategory.product_sub_category_status}
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
                          <Link to="/sub-categories">
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

export default EditSubCategory;
