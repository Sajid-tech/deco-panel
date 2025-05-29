import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Input,
} from "@material-tailwind/react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";


const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    mobile: "",
    email: "",
    address: "",
    state: "",
    pincode: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/web-fetch-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProfile(res.data?.user);
      });
  }, []);



  const onInputChange = (e) => {
    setProfile({
      ...profile,
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
    const formData = {
      first_name: profile.first_name,
      mobile: profile.mobile,
      email: profile.email,
      pincode: profile.pincode,
      address: profile.address,
      state: profile.state,
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == 200) {
        toast.success(" Profile Updated Successfully");
        // navigate("/sub-categories");
      } else {
        if (response.data.code == 401) {
          toast.error("Profile Duplicate Entry");
        } else if (response.data.code == 402) {
          toast.error("Sub Caterogies Duplicate Entry");
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating Profile:", error);
      toast.error("Error  updating Profile");
    } finally {
      setIsButtonDisabled(false);
    }
  };


  return (
    <Layout>
      <div className="mt-6 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="white" className="mb-8 p-6">
            <Typography variant="h6" color="black">
              Profile
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <form onSubmit={onSubmit} className="px-8 pt-6 pb-8 w-full ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <div className="mb-4">
                  <Input
  label="Full Name"
  type="text"
  name="full_name"
  value={profile.full_name}
  maxLength={50}
  onChange={onInputChange}
/>
                  </div>

                  <div className="mb-4">
                  
<Input
  label="Mobile No"
  type="tel"
  name="mobile"
  value={profile.mobile}
  maxLength={10}
  pattern="[0-9]*"
  onChange={onInputChange}
/>
                  </div>

                  <div className="mb-4">
                  

<Input
  label="Email Id"
  type="email"
  name="email"
  value={profile.email}
  maxLength={100}
  onChange={onInputChange}
/>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                  
<Input
  label="Address"
  type="text"
  name="address"
  value={profile.address}
  maxLength={250}
  onChange={onInputChange}
/>
                  </div>

                  <div className="mb-4">
                  <Input
  label="State"
  type="text"
  name="state"
  value={profile.state}
  maxLength={50}
  onChange={onInputChange}
/>
                  </div>

                  <div className="mb-4">
                    
<Input
  label="Pincode"
  type="number"
  name="pincode"
  value={profile.pincode}
  onChange={(e) => {
    if (e.target.value.length <= 6) {
      onInputChange(e);
    }
  }}
  inputMode="numeric"
/>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isButtonDisabled}
                >
                  
                  {isButtonDisabled ? "Updating Profile..." : "Update Profile"}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
