import {
  Input,
  Checkbox,
  Button,
  Typography,
  Carousel,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ContextPanel } from "../../utils/ContextPanel";
import { toast } from "react-toastify";
import bgimg from '../../assets/weather-1.png'
import BASE_URL from "../../base/BaseUrl";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(`${BASE_URL}/api/web-login`, formData);

      if (res.status === 200) {
        const token = res.data.UserInfo?.token;
        const user_type = res.data.UserInfo?.user.user_type;
        const id = res.data.UserInfo?.user.user_type;
        const username = res.data.UserInfo?.user.name;
        const email = res.data.UserInfo?.user.email;
   
        localStorage.setItem("user_type_id", user_type);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        if (token) {
          // Store the token in localStorage
          localStorage.setItem("token", token);
          navigate("/home");
          toast.success("User Logged In Successfully");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };
  return (
    <>
      <section className="flex flex-col lg:flex-row h-screen">
        {/* Left Section for Carousel // h-full -add */}
        <div className="hidden lg:block w-[70%] h-full">
        <img src={bgimg} alt="bg-img" className="h-full" />
        </div>

        {/* Right Section for Login Form  h-full add*/}
        <div className="flex-1 flex items-center bg-blue-50 justify-center px-4 lg:px-8 py-12 h-full lg:w-1/2">
          <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg  shadow-blue-500 ">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
                <p className="text-xs mt-4 text-[#002D74]">
                  If you are already a member, easily log in
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Deco Panel  
              </h1>
            </div>

            <form
              onSubmit={handleSumbit}
              method="POST"
              className="mt-8 mb-2 w-full"
            >
              <div className="mb-6 flex flex-col gap-6">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="-mb-3 font-medium"
                >
                  User Name
                </Typography>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  placeholder="username"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <div className="flex justify-between">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="-mb-3 font-medium"
                  >
                    Password
                  </Typography>
                </div>

                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  size="lg"
                  placeholder="********"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                fullWidth
              >
                {loading ? "Checking..." : "Sign In"}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-6">
               
                <Typography
                  variant="small"
                  className="font-medium p-2 text-gray-900 hover:bg-blue-200 hover:rounded-lg border-b border-blue-500"
                >
                  <Link
                    to="/forget-password"
                    className="text-gray-900 ml-1"
                  >
                    Forgot Password
                  </Link>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
