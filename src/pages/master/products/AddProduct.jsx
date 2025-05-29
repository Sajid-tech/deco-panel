import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import Layout from "../../../layout/Layout";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Dialog, Fab, Tooltip } from "@mui/material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import CreateCaterogy from "./CreateCatagory";
import CreateSubCaterogy from "./CreateSubCatagory";
import CreateBrand from "./CreateBrand";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const unit = [
  {
    value: "Nos",
    label: "Nos",
  },
  {
    value: "Mtr",
    label: "Mtr",
  },
  {
    value: "Kg",
    label: "Kg",
  },
  {
    value: "MM",
    label: "MM",
  },
];

const other_unit = [
  {
    value: "Inch",
    label: "Inch",
  },
  {
    value: "Feet",
    label: "Feet",
  },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    products_catg_id: "",
    products_sub_catg_id: "",
    products_brand: "",
    products_size1: "",
    products_thickness: "",
    products_unit: "",
    products_size2: "",
    products_size_unit: "",
    products_rate: "",
    products_image: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showmodal, setShowmodal] = useState(false);
  const closegroupModal = () => {
    setShowmodal(false);
  };

  const openmodal = () => {
    setShowmodal(true);
  };

  const [showmodalsubcategory, setShowmodalSubCategory] = useState(false);
  const closegroupSubModal = () => {
    setShowmodalSubCategory(false);
  };

  const openmodalSub = () => {
    setShowmodalSubCategory(true);
    localStorage.setItem("products_catg_id", product.products_catg_id);
  };

  const [showmodalbrand, setShowmodalBrand] = useState(false);
  const closegroupBrandModal = () => {
    setShowmodalBrand(false);
  };

  const openmodalBrand = () => {
    setShowmodalBrand(true);
  };

  const [datavisible, setDataVisible] = useState(true);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };
  
  const validateOnlyNumberOrDecimal = (inputtxt) => {
    const regex = /^\d*\.?\d{0,2}$/;
    return regex.test(inputtxt);
  };

  const onInputChange = (e) => {
    if (e.target.name == "products_thickness") {
      if (validateOnlyDigits(e.target.value)) {
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "products_size1") {
      if (validateOnlyDigits(e.target.value)) {
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "products_size2") {
      if (validateOnlyDigits(e.target.value)) {
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "products_rate") {
      if (validateOnlyNumberOrDecimal(e.target.value)) {
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "products_catg_id") {
      setProduct({
        ...product,
        [e.target.name]: e.target.value,
      });
      setDataVisible(false);
    } else {
      setProduct({
        ...product,
        [e.target.name]: e.target.value,
      });
    }
  };

 

  const [category, setCategory] = useState([]);
  const fetchCategory = () => {
    axios
      .get(
        `${BASE_URL}/api/web-fetch-sub-category/${product.products_catg_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setSubCategory(res.data?.productSubCategory);
      });
  };
  
  useEffect(() => {
    fetchCategory();
  }, [product.products_catg_id]);

  const [subcategory, setSubCategory] = useState([]);
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

  const populateCategoryName = async (hi) => {
    setShowmodal(false);
    try {
      const response = await axios.get(`${BASE_URL}/api/web-fetch-category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategory(response.data.productCategory);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const populateCategorySub = (hi) => {
    setShowmodalSubCategory(false);
    axios({
      url: BASE_URL + "/api/web-fetch-sub-category/" + product.products_catg_id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res) {
        setSubCategory(res.data.productSubCategory);
      } else {
        toast.error("Duplicate Entry");
      }
    });
  };

  const [brand, setBrand] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-brand`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBrand(res.data?.brands);
      });
  }, []);

  const populateBrand = (hi) => {
    setShowmodalBrand(false);
    axios({
      url: BASE_URL + "/api/web-fetch-brand",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res) {
        setBrand(res.data.brands);
      } else {
        toast.error("Duplicate Entry");
      }
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append("products_catg_id", product.products_catg_id);
    formData.append("products_sub_catg_id", product.products_sub_catg_id);
    formData.append("products_brand", product.products_brand);
    formData.append("products_size1", product.products_size1);
    formData.append("products_thickness", product.products_thickness);
    formData.append("products_unit", product.products_unit);
    formData.append("products_size2", product.products_size2);
    formData.append("products_size_unit", product.products_size_unit);
    formData.append("products_rate", product.products_rate);
    formData.append("products_image", selectedFile);
    
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success(response.data.msg);
        navigate("/products");
      } else {
        if (response.data.code == 401) {
          toast.error(response.data.msg);
        } else if (response.data.code == 402) {
          toast.error(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      }
    } catch (error) {
toast.error(error.response.data.message, error);
        console.error(error.response.data.message, error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto ">
        

        <div className="bg-white rounded-t-lg shadow-lg p-1 mx-auto w-full">
  <div className="flex items-center gap-3 px-4 py-2">
    <Link to="/products">
      <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
    </Link>
    <h2 className="text-gray-800 text-xl font-semibold">    Create Product</h2>
  </div>
</div>


        <div className="bg-white rounded-b-lg mt-1 p-6">
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              <div className="form-group flex">
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
                    name="products_catg_id"
                    value={product.products_catg_id}
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
                <div>
                  <Fab className="!ml-2 !w-10 !h-4" onClick={openmodal} color="primary" aria-label="add">
                    <Add />
                  </Fab>
                </div>
              </div>
              <div className="form-group flex">
                <FormControl fullWidth>
                  <InputLabel id="subcategory-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Sub Category <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="subcategory-select-label"
                    id="subcategory-select"
                    name="products_sub_catg_id"
                    value={product.products_sub_catg_id}
                    label="Sub Category"
                    onChange={(e) => onInputChange(e)}
                    required
                  >
                    {subcategory?.map((data, key) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.product_sub_category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                  <Fab className="!ml-2 !w-10 !h-4" color="primary" aria-label="add">
                    <Add onClick={openmodalSub} />
                  </Fab>
                </div>
              </div>
              <div className="form-group flex">
                <FormControl fullWidth>
                  <InputLabel id="brand-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Brand
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="brand-select-label"
                    id="brand-select"
                    name="products_brand"
                    value={product.products_brand}
                    label="Brand"
                    onChange={(e) => onInputChange(e)}
                  >
                    {brand?.map((data, key) => (
                      <MenuItem key={data.brands_name} value={data.brands_name}>
                        {data.brands_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                  <Fab className="!ml-2 !w-10 !h-4" color="primary" aria-label="add">
                    <Add onClick={openmodalBrand}/>
                  </Fab>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group">
                <Input
                  label="Thickness"
                 
                  autoComplete="Name"
                  name="products_thickness"
                  value={product.products_thickness}
                  onChange={(e) => onInputChange(e)}
                  maxLength={6}
                />
              </div>
              <div className="form-group">
                <FormControl fullWidth>
                  <InputLabel id="unit-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Unit
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="unit-select-label"
                    id="unit-select"
                    name="products_unit"
                    value={product.products_unit}
                    label="Unit"
                    onChange={(e) => onInputChange(e)}
                  >
                    {unit.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group">
                <Input
                  label="Length"
              
                  autoComplete="Name"
                  name="products_size1"
                  value={product.products_size1}
                  onChange={(e) => onInputChange(e)}
                  maxLength={6}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group">
                <Input
                  label="Breadth"
                
                  autoComplete="Name"
                  name="products_size2"
                  value={product.products_size2}
                  onChange={(e) => onInputChange(e)}
           maxLength={6}
                />
              </div>
              <div className="form-group">
                <FormControl fullWidth>
                  <InputLabel id="size-unit-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Size Unit
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="size-unit-select-label"
                    id="size-unit-select"
                    name="products_size_unit"
                    value={product.products_size_unit}
                    label="Size Unit"
                    onChange={(e) => onInputChange(e)}
                  >
                    {other_unit.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group">
                <Input
                  label="Rate"
                  required
                  autoComplete="Name"
                  name="products_rate"
                  value={product.products_rate}
                  onChange={(e) => onInputChange(e)}
                 maxLength={6}
                />
              </div>
              <div>
                <Input
                  type="file"
                  label="Product Image"
                  name="products_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            </div>
          

             {/* Buttons */}
                        <div className="flex justify-center space-x-4 mt-8">
                          <Button
                            type="submit"
                            color="blue"
                            className="px-6 py-2 rounded-md"
                            disabled={isButtonDisabled}
                          >
                            {isButtonDisabled ? "Creating..." : "Create"}
                          </Button>
                          <Link to="/products">
                            <Button color="gray" className="px-6 py-2 rounded-md">
                              Back
                            </Button>
                          </Link>
                        </div>
          </form>
     
            <CreateCaterogy open={showmodal} onClick={closegroupModal} populateCategoryName={populateCategoryName} />
          
            <CreateSubCaterogy open={showmodalsubcategory} onClick={closegroupSubModal} populateCategorySub={populateCategorySub}/>
   
            <CreateBrand open={showmodalbrand} onClick={closegroupBrandModal} populateBrand={populateBrand}/>
       
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;