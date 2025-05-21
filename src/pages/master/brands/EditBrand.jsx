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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);

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
        toast.success("Brand Updated Successfully");
        navigate("/brand");
      } else if ([401, 402].includes(response.data.code)) {
        toast.error("Brand Duplicate Entry");
      } else {
        toast.error("An unknown error occurred");
      }
    } catch (error) {
      console.error("Error updating Brand:", error);
      toast.error("Error updating Brand");
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
            <MdKeyboardBackspace className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Edit Brand
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <Fields
                  required={true}
                  types="text"
                  title="Brand Name"
                  type="textField"
                  readOnly
                  autoComplete="Name"
                  name="brands_name"
                  className="cursor-not-allowed"
                  value={brand.brands_name}
                  onChange={onInputChange}
                />
              </div>

              <div className="form-group">
                <Fields
                  required={true}
                  title="Status"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  name="brands_status"
                  value={brand.brands_status}
                  onChange={onInputChange}
                  options={status}
                />
              </div>

              {/* Image Preview */}
              <div>
                {brand.brands_image && (
                  <img
                    src={`https://decopanel.in/storage/app/public/allimages/${brand.brands_image}`}
                    alt="Brand"
                    style={{ width: "215px", height: "215px" }}
                  />
                )}
              </div>

              {/* File Upload */}
              <div>
  <Input
    type="file"
    label="Brand Image"
    name="brands_image"
    onChange={(e) => setSelectedFile(e.target.files[0])}
    required={!brand.brands_image} 
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
              <Link to="/brand">
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

export default EditBrand;
