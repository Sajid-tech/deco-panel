import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

const AddSubCategory = () => {
  const navigate = useNavigate();

  const [subcategory, setSubCategory] = useState({
    product_category_id: "",
    product_sub_category: "",
    product_sub_category_image: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
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

  const onInputChange = (e) => {
    setSubCategory({
      ...subcategory,
      [e.target.name]: e.target.value,
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
    // const formData = {
    //     product_category_id: subcategory.product_category_id,
    //     product_sub_category: subcategory.product_sub_category,
    //     product_sub_category_image: selectedFile,
    // };
    const formData = new FormData();
    formData.append("product_category_id", subcategory.product_category_id);
    formData.append("product_sub_category", subcategory.product_sub_category);
    formData.append("product_sub_category_image", selectedFile);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-sub-category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success("Sub Caterogies Added Successfully");
        navigate("/sub-categories");
      } else {
        if (response.data.code == 401) {
          toast.error("Sub Caterogies Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Sub Caterogies Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Sub Caterogies:", error);
      toast.error("Error  updating Sub Caterogies");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/country">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
          Create Sub Categories
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
                  name="product_category_id"
                  value={subcategory.product_category_id}
                  onChange={(e) => onInputChange(e)}
                  options={category}
                />
              </div>
              <div className="form-group">
                <Fields
                  required={true}
                  title="Sub Category"
                  type="textField"
                  autoComplete="Name"
                  name="product_sub_category"
                  value={subcategory.product_sub_category}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div>
                <Input
                  required
                  type="file"
                  label="Image"
                  name="product_sub_category_image"
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
              <Link to="/sub-categories">
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

export default AddSubCategory;
