import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

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

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      navigate("/");
    }
  }, [navigate]);

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
        .get(`${BASE_URL}/api/web-fetch-sub-category/${product.products_catg_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
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
    // const formData = {
    //   products_catg_id: product.products_catg_id,
    //   products_sub_catg_id: product.products_sub_catg_id,
    //   products_brand: product.products_brand,
    //   products_thickness: product.products_thickness,
    //   products_unit: product.products_unit,
    //   products_size1: product.products_size1,
    //   products_size2: product.products_size2,
    //   products_size_unit: product.products_size_unit,
    //   products_rate: product.products_rate,
    //   product_status: product.product_status,
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
        toast.success("Product Updated Successfully");
        navigate("/products");
      } else {
        toast.error("Product Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <Link to="/products">
            <MdKeyboardBackspace className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Edit Product
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          {/* Display Product Image */}
          {product.products_image && (
            <div className="mb-4">
              <img
                src={`https://decopanel.in/storage/app/public/allimages/${product.products_image}`}
                alt="Product"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}

          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Fields
                required
                title="Category"
                type="categoryDropdown"
                name="products_catg_id"
                value={product.products_catg_id}
                onChange={onInputChange}
                options={category}
              />
              <Fields
                required
                title="Sub Category"
                type="subCategoryDropdown"
                name="products_sub_catg_id"
                value={product.products_sub_catg_id}
                onChange={onInputChange}
                options={subcategory}
              />
              <Fields
                title="Brand"
                type="brandDropdown"
                name="products_brand"
                value={product.products_brand}
                onChange={onInputChange}
                options={brand}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Fields
                title="Thickness"
                type="textField"
                name="products_thickness"
                value={product.products_thickness}
                onChange={onInputChange}
              />
              <Fields
                title="Unit"
                type="whatsappDropdown"
                name="products_unit"
                value={product.products_unit}
                onChange={onInputChange}
                options={unit}
              />
              <Input
                label="Length"
                type="number"
                name="products_size1"
                value={product.products_size1}
                onChange={onInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Input
                label="Breadth"
                type="number"
                name="products_size2"
                value={product.products_size2}
                onChange={onInputChange}
              />
              <Fields
                title="Size Unit"
                type="whatsappDropdown"
                name="products_size_unit"
                value={product.products_size_unit}
                onChange={onInputChange}
                options={other_unit}
              />
              <Input
                label="Rate"
                name="products_rate"
                required
                value={product.products_rate}
                onChange={onInputChange}
              />
              <Fields
                required
                title="Status"
                type="whatsappDropdown"
                name="product_status"
                value={product.product_status}
                onChange={onInputChange}
                options={status}
              />

               <Input
                  type="file"
                  label="Product Image"
                  name="products_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required={!product.products_image} 
                />
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
