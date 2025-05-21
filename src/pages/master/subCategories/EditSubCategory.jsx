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
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditSubCategory = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [subcategory, setSubCategory] = useState({
    product_category_id: "",
    product_sub_category: "",
    product_sub_category_status: "",
    product_sub_category_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

  const onInputChange = (e) => {
    setSubCategory({
      ...subcategory,
      [e.target.name]: e.target.value,
    });
  };

    useEffect(() => {
      axios
        .get(`${BASE_URL}/api/web-fetch-sub-category-by-Id/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setSubCategory(res.data?.productSubCategory);
        });
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    // const formData = {
    //   product_category_id: subcategory.product_category_id,
    //   product_sub_category: subcategory.product_sub_category,
    //   product_sub_category_status: subcategory.product_sub_category_status,
    //   product_sub_category_image: selectedFile,
    // };
    // try {
    //   const response = await axios.post(
    //     `${BASE_URL}/api/web-update-sub-category/${id}`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );

    //   if (response.data.code == 200) {
    //     toast.success(" Sub Caterogies Updated Successfully");
    //     navigate("/sub-categories");
    //   } else {
    //     if (response.data.code == 401) {
    //       toast.error("Sub Caterogies Duplicate Entry");
    //     } else if (response.data.code == 402) {
    //       toast.error("Sub Caterogies Duplicate Entry");
    //     } else {
    //       toast.error("An unknown error occurred");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error updating Sub Caterogies:", error);
    //   toast.error("Error  updating Sub Caterogies");
    // } finally {
    //   setIsButtonDisabled(false);
    // }
    const data = new FormData();
    data.append("product_category_id", subcategory.product_category_id);
    data.append("product_sub_category_image", selectedFile);
    data.append("product_sub_category_status", subcategory.product_sub_category_status);
    data.append("product_sub_category", subcategory.product_sub_category);
    console.log(data , "res");
    axios({
      url: `${BASE_URL}/api/web-update-sub-category/${id}?_method=PUT`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success("Sub Caterogies Updated Successfully");
        navigate("/sub-categories");
        setIsButtonDisabled(false);
      } else {
        toast.error("duplicate entry");
      }
    });
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/sub-categories">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Edit Sub Categories
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div>
                <div className="col-md-4 col-12 mt-4">
                  <img
                    src={
                      "https://decopanel.in/storage/app/public/product_sub_category/" +
                      subcategory.product_sub_category_image
                    }
                    style={{ width: "215px", height: "215px" }}
                  />
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <div className="flex flex-col gap-6 mb-6 col-span-2">
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
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
                        types="text"
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
                     
                        type="file"
                        label="Image"
                        name="product_sub_category_image"
                        required={!subcategory.product_sub_category_image} 
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                    <div>
                      <Fields
                        required={true}
                        title="Status"
                        type="whatsappDropdown"
                        autoComplete="Name"
                        name="product_sub_category_status"
                        value={subcategory.product_sub_category_status}
                        onChange={(e) => onInputChange(e)}
                        options={status}
                      />
                    </div>
                  </div>
                  <div className=" text-center">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                      disabled={isButtonDisabled}
                    >
                      {isButtonDisabled ? "Updating..." : "Update"}
                    </button>
                    <Link to="/sub-categories">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                        Back
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditSubCategory;
