import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

const AddCaterogies = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    product_category: "",
    product_category_image: "",
    product_sort: "",
});

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append("product_category", category.product_category);
    formData.append("product_category_image", selectedFile);
    formData.append("product_sort", category.product_sort);
    // const formData = {
    //     product_category: category.product_category,
    //     product_category_image: selectedFile,
    // };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    
      if (response.data.code == 200) {
        toast.success("Caterogies Added Successfully");
        navigate('/categories');
      } else {
        if (response.data.code == 401) {
          toast.error("Caterogies Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Caterogies Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Caterogies:", error);
      toast.error("Error  updating Caterogies");
      
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/categories">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Add Categories
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              <div className="form-group">
                <Fields
                  required={true}
                  types="text"
                  title="Category"
                  type="textField"
                  autoComplete="Name"
                  name="product_category"
                  value={category.product_category}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

                <div className="form-group">
                             <Fields
                               required={true}
                               types="number"
                               title="Sort"
                               type="textField"
                               autoComplete="off"
                               name="product_sort"
                               value={category.product_sort}
                               onChange={(e) => onInputChange(e)}
                             />
                           </div>
              <div>
                <Input
                  required
                  type="file"
                  label="Image"
                  name="product_category_image"
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
                
                {isButtonDisabled ? 'Submiting...' : 'Submit'}
              </button>
              <Link to="/categories">
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

export default AddCaterogies;
