import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Dialog, Fab, Tooltip } from "@mui/material";


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

const EditProduct = () => {
  const navigate = useNavigate();

const {id} = useParams();

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
});



  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


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
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);


  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {

    if(e.target.name=="products_thickness"){
      if(validateOnlyDigits(e.target.value)){
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    }else if(e.target.name=="products_size1"){
      if(validateOnlyDigits(e.target.value)){
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    }else if(e.target.name=="products_size2"){
      if(validateOnlyDigits(e.target.value)){
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    }else if(e.target.name=="products_rate"){
      if(validateOnlyDigits(e.target.value)){
        setProduct({
          ...product,
          [e.target.name]: e.target.value,
        });
      }
    }else{

      setProduct({
      ...product,
      [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  const [category, setCategory] = useState([]);
  useEffect(() => {
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



  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = {
        products_catg_id: product.products_catg_id,
        products_sub_catg_id: product.products_sub_catg_id,
        products_brand: product.products_brand,
        products_thickness: product.products_thickness,
        products_unit: product.products_unit,
        products_size1: product.products_size1,
        products_size2: product.products_size2,
        products_size_unit: product.products_size_unit,
        products_rate: product.products_rate,
        product_status: product.product_status,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-update-product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success("Product Added Successfully");
        navigate("/products");
      } else {
        if (response.data.code == 401) {
          toast.error("Product Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Product Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Product:", error);
      toast.error("Error  updating Product");
    } finally {
      setIsButtonDisabled(false);
    }
  };




  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/products">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Edit Product
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group">
                <Fields
                  required={true}
                  title="Category"
                  type="categoryDropdown"
                  autoComplete="Name"
                  name="products_catg_id"
                  value={product.products_catg_id}
                  onChange={(e) => onInputChange(e)}
                  options={category}
                />
              </div>
              <div className="form-group">
                <Fields
                  required={true}
                  title="Sub Category"
                  type="subCategoryDropdown"
                  autoComplete="Name"
                  name="products_sub_catg_id"
                  value={product.products_sub_catg_id}
                  onChange={(e) => onInputChange(e)}
                  options={subcategory}
                />
              </div>
              <div className="form-group ">
                <Fields
                  title="Brand"
                  type="brandDropdown"
                  autoComplete="Name"
                  name="products_brand"
                  value={product.products_brand}
                  onChange={(e) => onInputChange(e)}
                  options={brand}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group ">
                <Fields
                  title="Thickness"
                  type="textField"
                  autoComplete="Name"
                  name="products_thickness"
                  value={product.products_thickness}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="form-group ">
                <Fields
                  title="Unit"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  name="products_unit"
                  value={product.products_unit}
                  onChange={(e) => onInputChange(e)}
                  options={unit}
                />
              </div>
              <div className="form-group ">
                <Input
                  label="Length"
                  type="number"
                  autoComplete="Name"
                  name="products_size1"
                  value={product.products_size1}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="form-group ">
                <Input
                  label="Breadth"
                  type="number"
                  autoComplete="Name"
                  name="products_size2"
                  value={product.products_size2}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="form-group ">
                <Fields
                  title="Size Unit"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  name="products_size_unit"
                  value={product.products_size_unit}
                  onChange={(e) => onInputChange(e)}
                  options={other_unit}
                />
              </div>
              <div className="form-group ">
                <Input
                  label="Rate"
                  autoComplete="Name"
                  name="products_rate"
                  value={product.products_rate}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="form-group ">
                <Fields
                required={true}
                  title="Status"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  name="product_status"
                  value={product.product_status}
                  onChange={(e) => onInputChange(e)}
                  options={status}
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
              </button>
              <Link to="/products">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
