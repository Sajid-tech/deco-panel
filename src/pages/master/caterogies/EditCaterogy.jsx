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

const EditCaterogy = () => {
  const navigate = useNavigate();

  const { id } = useParams();



  const [category, setCategory] = useState({
    product_category: "",
    product_category_status: "",
    product_category_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("id");
//     if (!isLoggedIn) {
//       navigate("/");
//       return;
//     }
//   }, []);

  const onInputChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };



useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-category-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategory(res.data?.productCategory);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
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
    //   product_category: category.product_category,
    //   product_category_status: category.product_category_status,
    //   product_category_image: selectedFile,
    // };
   
    // try {
    //   const response = await axios.post(
    //     `${BASE_URL}/api/web-update-category/${id}?_method=PUT`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );

    //   if (response.data.code == 200) {
    //     toast.success("Caterogies Updated Successfully");
    //     navigate("/categories");
    //   } else {
    //     if (response.data.code == 401) {
    //       toast.error("Caterogies Duplicate Entry");
    //     } else if (response.data.code == 402) {
    //       toast.error("Caterogies Duplicate Entry");
    //     } else {
    //       toast.error("An unknown error occurred");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error updating Caterogies:", error);
    //   toast.error("Error  updating Caterogies");
    // } finally {
    //   setIsButtonDisabled(false);
    // }
    const data = new FormData();
    data.append("product_category", category.product_category);
    data.append("product_category_image", selectedFile);
    data.append("product_category_status", category.product_category_status);
    console.log(data , "res");
    axios({
      url: `${BASE_URL}/api/web-update-category/${id}?_method=PUT`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success("Caterogies Updated Successfully");
        navigate("/categories");
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
          <Link to="/categories">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Edit Categories
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
              <div>
                <div className="col-md-4 col-12 mt-4">
                  <img
                    src={
                      "https://decopanel.in/storage/app/public/product_category/" +
                      category.product_category_image
                    }
                    style={{ width: "215px", height: "215px" }}
                  />
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <div className="flex flex-col gap-6 mb-6 col-span-2">
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

                  <div>
                    <Input
                      type="file"
                      label="Image"
                      name="product_category_image"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </div>
                  <div>
                    <Fields
                      required={true}
                      title="Status"
                      type="whatsappDropdown"
                      autoComplete="Name"
                      name="product_category_status"
                      value={category.product_category_status}
                      onChange={(e) => onInputChange(e)}
                      options={status}
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
                    <Link to="/categories">
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

export default EditCaterogy;
