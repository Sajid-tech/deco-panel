import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import Fields from "../../../common/TextField/TextField";
import BASE_URL from "../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Dialog, Fab, Tooltip } from "@mui/material";


const status = [
    {
      value: "Quotation",
      label: "Quotation",
    },
    {
        value: "Cancel",
        label: "Cancel",
      },
  ];



const EditQuotation = () => {
  const navigate = useNavigate();

const {id} = useParams();

const [quotation, setQuotation] = useState({
    order_user_id: "",
    quotation_date: "",
    quotation_status: "",
    quotation_count: "",
    quotation_sub_data: "",
    quotation_remarks: "",
});



  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  const useTemplate = {quotation_sub_product_id:"",quotation_sub_rate:"", quotation_sub_quantity:"",id:""};
  const [users, setUsers] = useState([useTemplate]);

  const onChange = (e, index) =>{
      const updatedUsers = users.map((user, i) => 
      index == i 
      ? Object.assign(user,{[e.target.name]: e.target.value}) 
      : user );
      setUsers(updatedUsers);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-quotation-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuotation(res.data.quotation);
        setUsers(res.data.quotationSub);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);



  const onInputChange = (e) => {

    setQuotation({
    ...quotation,
    [e.target.name]: e.target.value,
    });

};

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, []);

 
  const [profile, setProfile] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${BASE_URL}/api/web-fetch-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setProfile(res.data?.profile);
      });
  }, []);

  const [product, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-product`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProducts(res.data?.products);
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
    const formData = {
        quotation_status: quotation.quotation_status,
        quotation_sub_data: users,
        quotation_count: quotation.quotation_count,
        quotation_remarks: quotation.quotation_remarks,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-update-quotation/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success("Quotation Added Successfully");
        navigate("/quotations");
      } else {
        if (response.data.code == 401) {
          toast.error("Quotation Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Quotation Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Quotation:", error);
      toast.error("Error  updating Quotation");
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
            Edit Quotation
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group">
                <Fields
                  required={true}
                  disabled={true}
                  title="User"
                  type="userDropdown"
                  autoComplete="Name"
                  name="order_user_id"
                  value={quotation.order_user_id}
                  onChange={(e) => onInputChange(e)}
                  options={profile}
                />
              </div>
              <div className="form-group">
                <Input
                disabled
                required
                  type="date"
                  label="Date"
                  name="quotation_date"
                  value={quotation.quotation_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="form-group ">
                <Fields
                  required={true}
                  title="Status"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  name="quotation_status"
                  value={quotation.quotation_status}
                  onChange={(e) => onInputChange(e)}
                  options={status}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group col-span-3">
                <Fields
                  required={true}
                  title="Remarks"
                  type="textField"
                  autoComplete="Name"
                  name="quotation_remarks"
                  value={quotation.quotation_remarks}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            {
                users.map((user, index)=>(
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="form-group ">
                {/* <Input
                  required
                  label="Name"
                  type="text"
                  hidden
                  name="id"
                  value={user.id}
                  onChange={e => onChange(e, index)}
                /> */}

                <Fields
                  required={true}
                  title="Products"
                  type="productDropdown"
                  autoComplete="Name"
                  name="quotation_sub_product_id"
                  value={user.quotation_sub_product_id}
                  onChange={e => onChange(e, index)}
                  options={product}
                />
              </div>
              <div className="form-group ">
                <Fields
                  required={true}
                  title="Rate"
                  type="textField"
                  autoComplete="Name"
                  name="quotation_sub_rate"
                  value={user.quotation_sub_rate}
                  onChange={e => onChange(e, index)}
                />
              </div>
              <div className="form-group ">
                <Fields
                  required={true}
                  title="Quantity"
                  type="textField"
                  autoComplete="Name"
                  name="quotation_sub_quantity"
                  value={user.quotation_sub_quantity}
                  onChange={e => onChange(e, index)}
                />
              </div>
            </div>
              )  )}
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
              </button>
              <Link to="/quotations">
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

export default EditQuotation;
