import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import Layout from "../../../layout/Layout";

import BASE_URL from "../../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const AddCaterogies = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    product_category: "",
    product_category_image: "",
    product_sort: "",
});

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  

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
        toast.success(response.data.msg);
        navigate('/categories');
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
    <Link to="/categories">
      <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
    </Link>
    <h2 className="text-gray-800 text-xl font-semibold">    Create Categories</h2>
  </div>
</div>


        <div className="bg-white rounded-b-lg mt-1 p-6">
          <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

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
                  required
                  type="file"
                  label="Image"
                  name="product_category_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            </div>
           
                 <div className="flex justify-center space-x-4 mt-8">
                                      <Button
                                        type="submit"
                                        color="blue"
                                        className="px-6 py-2 rounded-md"
                                        disabled={isButtonDisabled}
                                      >
                                        {isButtonDisabled ? "Creating..." : "Create"}
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

export default AddCaterogies;
