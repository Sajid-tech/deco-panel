import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@material-tailwind/react";
import { Add } from "@mui/icons-material";
import { Card, CardContent, Dialog, Fab, Tooltip } from "@mui/material";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import Fields from "../../common/TextField/TextField";

const status = [
  {
    value: "Order",
    label: "Order",
  },
  {
    value: "Cancel",
    label: "Cancel",
  },
];

const AddQuotation = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [order_sub_count, setCount] = useState(1);

  const [order, setOrder] = useState({
    orders_user_id: "",
    orders_date: "",
    orders_status: "",
    orders_count: "",
    order_sub_data: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const useTemplate = {
    orders_sub_product_id: "",
    orders_sub_quantity: "",
    orders_sub_rate: "",
    id: "",
  };
  const [users, setUsers] = useState([useTemplate]);

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-order-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(res.data.order);
        setUsers(res.data.orderSub);
        setCount(res.data.order.orders_count);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  const onInputChange = (e) => {
    setOrder({
      ...order,
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
      .get(`${BASE_URL}/api/web-fetch-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
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
      orders_status: order.orders_status,
      order_sub_data: users,
      orders_count: order.orders_count,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/api/web-create-quotation-indirect/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success("Order Added Successfully");
        navigate("/quotations");
      } else {
        if (response.data.code == 401) {
          toast.error("Order Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Order Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Order:", error);
      toast.error("Error  updating Order");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <Link to="/pending-order-list">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Add Quotation
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
              <div className="form-group md:col-span-4">
                <Fields
                 disabled={true}
                  required={true}
                  title="User"
                  type="userDropdown"
                  autoComplete="Name"
                  name="orders_user_id"
                  value={order.orders_user_id}
                  onChange={(e) => onInputChange(e)}
                  options={profile}
                />
              </div>
              <div className="form-group md:col-span-2">
                <Input
                 disabled
                  required
                  type="date"
                  label="Date"
                  name="orders_date"
                  value={order.orders_date}
                  onChange={(e) => onInputChange(e)}
                  labelProps={{
                    className: "!text-gray-500",
                  }}
                />
              </div>
              
            </div>
            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
              >
                <div className="form-group col-span-2">
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
                    name="orders_sub_product_id"
                    value={user.orders_sub_product_id}
                    onChange={(e) => onChange(e, index)}
                    options={product}
                  />
                </div>
                <div className="form-group ">
                  <Fields
                    required={true}
                    title="Quantity"
                    type="textField"
                    autoComplete="Name"
                    name="orders_sub_quantity"
                    value={user.orders_sub_quantity}
                    onChange={(e) => onChange(e, index)}
                  />
                </div>
                <div className="form-group ">
                  <Fields
                    required={true}
                    title="Rate"
                    type="textField"
                    autoComplete="Name"
                    name="orders_sub_rate"
                    value={user.orders_sub_rate}
                    onChange={(e) => onChange(e, index)}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Submiting..." : "Submit"}
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

export default AddQuotation;
