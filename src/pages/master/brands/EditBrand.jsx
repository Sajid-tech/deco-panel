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

const EditBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [brand, setBrand] = useState({
    brands_name: "",
    brands_status: "",
    brands_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  

  const onInputChange = (e) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-brand-by-Id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setBrand(res.data?.brands);
      });
  }, [id]);

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
    formData.append("brands_status", brand.brands_status);
    if (selectedFile) {
      formData.append("brands_image", selectedFile);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-update-brand/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate("/brand");
      } else if ([401, 402].includes(response.data.code)) {
        toast.error(response.data.msg);
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
            <Link to="/brand">
              <ArrowLeft className="text-white bg-blue-500 p-1 w-8 h-8 cursor-pointer rounded-full hover:bg-blue-600 transition-colors" />
            </Link>
            <h2 className="text-gray-800 text-xl font-semibold">
              {" "}
              Edit Brand
            </h2>
          </div>
        </div>
        <div className="bg-white rounded-b-lg mt-1 p-6">
        <form onSubmit={onSubmit} autoComplete="off" className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-2 justify-between">
          <div>
                {brand.brands_image && (
                  <img
                    src={`https://decopanel.in/storage/app/public/allimages/${brand.brands_image}`}
                    alt="Brand"
                    style={{ width: "215px", height: "215px" }}
                      loading="lazy"
                  />
                )}
              </div>
            <div className="grid grid-cols-1 w-full  gap-6 ">
              <div className="form-group">
                <Input
                  label="Brand Name"
                  required
                  readOnly
                  autoComplete="Name"
                  name="brands_name"
                  value={brand.brands_name}
                  className="cursor-not-allowed"
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div className="form-group">
                <FormControl fullWidth>
                  <InputLabel id="size-unit-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Status
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="size-unit-select-label"
                    id="size-unit-select"
                    name="brands_status"
                    value={brand.brands_status}
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
              </div>

         

              {/* File Upload */}
              <div>
                <Input
                  type="file"
                  label="Brand Image"
                  name="brands_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            </div>
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

export default EditBrand;
