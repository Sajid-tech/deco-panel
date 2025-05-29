import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import Layout from "../../../layout/Layout";

import BASE_URL from "../../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const AddBrand = () => {
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    brands_name: "",
    brands_image:"",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);


  const onInputChange = (e) => {
    setBrand({
      ...brand,
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
    const formData = new FormData();
  
    formData.append("brands_name", brand.brands_name);
    formData.append("brands_image", selectedFile);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-brand`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success(response.data.msg);
        navigate("/brand");
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
            <Link to="/brand">
              <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
            </Link>
            <h2 className="text-gray-800 text-xl font-semibold">    Create Brand</h2>
          </div>
        </div>
        <div className="bg-white rounded-b-lg mt-1 p-6">
        <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              <div className="form-group col-span-2">
               
                 <Input
                                  label="Brand Name"
                                  required
                                  autoComplete="Name"
                                  name="brands_name"
                                  value={brand.brands_name}
                                  onChange={(e) => onInputChange(e)}
                                 maxLength={50}
                                />
              </div>
              <div>
                              <Input
                          
                                type="file"
                                label="Image"
                                name="brands_image"
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
                                        <Link to="/brand">
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

export default AddBrand;
