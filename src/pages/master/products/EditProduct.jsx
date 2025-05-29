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
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const unit = [
  { value: "Nos", label: "Nos" },
  { value: "Mtr", label: "Mtr" },
  { value: "Kg", label: "Kg" },
  { value: "MM", label: "MM" },
];

const other_unit = [
  { value: "Inch", label: "Inch" },
  { value: "Feet", label: "Feet" },
];

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    products_catg_id: "",
    products_sub_catg_id: "",
    products_brand: "",
    products_thickness: "",
    products_unit: "",
    products_size1: "",
    products_rate: "",
    products_size2: "",
    products_size_unit: "",
    product_status: "",
    products_image: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-product-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProduct(res.data?.products);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [id]);

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);
  const validateOnlyNumberOrDecimal = (inputtxt) =>
    /^\d*\.?\d{0,2}$/.test(inputtxt);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (
      ["products_thickness", "products_size1", "products_size2"].includes(name)
    ) {
      if (validateOnlyDigits(value)) {
        setProduct((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "products_rate") {
      if (validateOnlyNumberOrDecimal(value)) {
        setProduct((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [brand, setBrand] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-category`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setCategory(res.data?.productCategory || []));
  }, []);

  useEffect(() => {
    if (product.products_catg_id) {
      axios
        .get(
          `${BASE_URL}/api/web-fetch-sub-category/${product.products_catg_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => setSubCategory(res.data?.productSubCategory || []));
    }
  }, [product.products_catg_id]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-brand`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setBrand(res.data?.brands || []));
  }, []);

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
    formData.append("product_status", product.product_status);

    if (selectedFile) {
      formData.append("products_image", selectedFile);
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-update-product/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate("/products");
      } else {
        toast.error(response.data.msg);
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
            <h2 className="text-gray-800 text-xl font-semibold">
              {" "}
              Edit Product
            </h2>
          </div>
        </div>

        
        <div className="bg-white rounded-b-lg mt-1 p-6">
          {/* Display Product Image */}
          {product.products_image && (
            <div className="mb-4">
              <img
                src={`https://decopanel.in/storage/app/public/allimages/${product.products_image}`}
                alt="Product"
                  loading="lazy"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}

          <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
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

              <FormControl fullWidth>
                <InputLabel id="brand-select-label">
                  <span className="text-sm relative bottom-[6px]">Brand</span>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Thickness"
                autoComplete="Name"
                name="products_thickness"
                value={product.products_thickness}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
              />

              <FormControl fullWidth>
                <InputLabel id="unit-select-label">
                  <span className="text-sm relative bottom-[6px]">Unit</span>
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

              <Input
                label="Length"
                autoComplete="Name"
                name="products_size1"
                value={product.products_size1}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Input
                label="Breadth"
                autoComplete="Name"
                name="products_size2"
                value={product.products_size2}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
              />

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

              <Input
                label="Rate"
                required
                autoComplete="Name"
                name="products_rate"
                value={product.products_rate}
                onChange={(e) => onInputChange(e)}
                maxLength={6}
              />

              <FormControl fullWidth>
                <InputLabel id="size-unit-select-label">
                  <span className="text-sm relative bottom-[6px]">Status</span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="size-unit-select-label"
                  id="size-unit-select"
                  name="product_status"
                  value={product.product_status}
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
              <Input
                type="file"
                label="Product Image"
                name="products_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
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
              <Link to="/products">
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

export default EditProduct;
