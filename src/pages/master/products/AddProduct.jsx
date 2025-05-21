import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Dialog, Fab, Tooltip } from "@mui/material";

import CreateCaterogy from "./CreateCatagory";
import CreateSubCaterogy from "./CreateSubCatagory";
import CreateBrand from "./CreateBrand";

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
    products_image:"",
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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  const [category, setCategory] = useState([]);
  const fetchCategory = ()=>{
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
  }
  useEffect(() => {
    fetchCategory()
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
    // const formData = {
    //   products_catg_id: product.products_catg_id,
    //   products_sub_catg_id: product.products_sub_catg_id,
    //   products_brand: product.products_brand,
    //   products_size1: product.products_size1,
    //   products_thickness: product.products_thickness,
    //   products_unit: product.products_unit,
    //   products_size2: product.products_size2,
    //   products_size_unit: product.products_size_unit,
    //   products_rate: product.products_rate,
    // };
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
            Create Product
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group flex">
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
                <div>
                  <Fab className="!ml-2 !w-10 !h-4" onClick={openmodal} color="primary" aria-label="add">
                    <Add />
                  </Fab>
                </div>
              </div>
              <div className="form-group flex">
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
                  <div>
                  <Fab className="!ml-2 !w-10 !h-4" color="primary" aria-label="add">
                    <Add onClick={openmodalSub} />
                  </Fab>
                </div>
              </div>
              <div className="form-group flex">
                <Fields
                  title="Brand"
                  type="brandDropdown"
                  autoComplete="Name"
                  name="products_brand"
                  value={product.products_brand}
                  onChange={(e) => onInputChange(e)}
                  options={brand}
                />
                  <div>
                  <Fab className="!ml-2 !w-10 !h-4" color="primary" aria-label="add">
                    <Add onClick={openmodalBrand}/>
                  </Fab>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group ">
                <Input
                  label="Thickness"
                  type="number"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group ">
                <Fields
                  title="Breadth"
                  type="textField"
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
                  required
                  autoComplete="Name"
                  name="products_rate"
                  value={product.products_rate}
                  onChange={(e) => onInputChange(e)}
                />
               
              </div>
               <div>
                              <Input
                                required
                                type="file"
                                label="Product Image"
                                name="products_image"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                              />
                            </div>
            </div>
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Submiting..." : "Submit"}
              </button>
              <Link to="/products">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Back
                </button>
              </Link>
            </div>
          </form>
         <div>
 
            <CreateCaterogy  open={showmodal} onClick={closegroupModal} populateCategoryName={populateCategoryName} />
         </div>
         <div>
            <CreateSubCaterogy  open={showmodalsubcategory} onClick={closegroupSubModal} populateCategorySub={populateCategorySub}/>
         </div>
         <div>
            <CreateBrand  open={showmodalbrand} onClick={closegroupBrandModal} populateBrand={populateBrand}/>
         </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
