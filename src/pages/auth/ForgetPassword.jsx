import { Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import img1 from '../../assets/home-decor-2.jpeg';
import { useState } from "react";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onResetPassword = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      toast.warning("Please enter both Username and Email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/send-password?username=${username}&email=${email}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data?.data?.msg || "Password reset instructions sent.");
      } else {
        toast.error(data?.message || "Invalid credentials or user not found.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen">
      <div
        style={{ backgroundImage: `url(${img1})` }}
        className="flex-1 flex items-center bg-cover bg-center bg-no-repeat justify-center px-4 lg:px-8 py-12 lg:w-1/2"
      >
        <div className="w-full max-w-md p-8 bg-white/90 rounded-xl shadow-lg shadow-blue-500">
          <div className="flex justify-center mb-4">
            <h1 className="text-2xl font-bold">Deco Panel</h1>
          </div>
          <h2 className="font-bold text-2xl text-[#002D74]">Forget Password</h2>
          <p className="text-xs mt-4 text-[#002D74]">
            Enter Username & Email to Reset Password
          </p>
          <form method="POST" className="mt-8 mb-2 w-full" onSubmit={onResetPassword}>
            <div className="mb-6 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Username
              </Typography>
              <Input
                id="username"
                name="username"
                size="lg"
                placeholder="Enter your username"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Email Address
              </Typography>
              <Input
                id="email"
                name="email"
                type="email"
                size="lg"
                placeholder="name@gmail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
              fullWidth
            >
              {loading ? "Sending..." : "Forget Password"}
            </Button>

            <div className="flex items-center justify-between gap-2 mt-6">
              <Typography
                variant="paragraph"
                className="text-center text-blue-gray-500 font-medium mt-4"
              >
                Remembered your password?
                <Link to="/" className="text-gray-900 ml-1">
                  Sign In
                </Link>
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
