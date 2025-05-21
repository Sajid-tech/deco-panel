import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";

const AddBrand = () => {
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    brands_name: "",
    brands_image:"",
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
        toast.success("Brand Added Successfully");
        navigate("/brand");
      } else {
        if (response.data.code == 401) {
          toast.error("Brand Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Brand Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Brand:", error);
      toast.error("Error  updating Brand");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/brand">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Create Brand
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group col-span-2">
                <Fields
                  required={true}
                  types="text"
                  title="Brand"
                  type="textField"
                  autoComplete="Name"
                  name="brands_name"
                  value={brand.brands_name}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                              <Input
                                required
                                type="file"
                                label="Image"
                                name="brands_image"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                              />
                            </div>
              <div >
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Submiting..." : "Submit"}
                </button>
                <Link to="/brand">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                    Back
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddBrand;
