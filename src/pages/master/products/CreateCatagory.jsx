import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import BASE_URL from "../../../base/BaseUrl";

import { Card, CardContent, Dialog, Tooltip } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import { toast } from "sonner";
import { Input } from "@material-tailwind/react";

const CreateCaterogy = ({open,onClick , populateCategoryName}) => {
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    product_category: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  
 

  const onInputChange = (e) => {
    setCategory({
      ...category,
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
      product_category: category.product_category,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-category`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.code == 200) {
        
        toast.success(response.data.msg);
        onClick()
        populateCategoryName("hi")
      } else {
        if (response.data.code == 401) {
          toast.error(response.data.msg);
        } else if (response.data.code == 402) {
          toast.error(response.data.msg);
        } else {
          toast.error(response.data.msg);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message, error);
      console.error(error.response.data.message, error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        // className="m-3  rounded-lg shadow-xl"
      >
        <form autoComplete="off" >
          <Card className="p-6 space-y-1 w-[400px]">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Create Category
                </h1>
                <div className="flex">
                  <Tooltip title="Close">
                    <button
                      className="ml-3 pl-2 hover:bg-gray-200 rounded-full"
                      type="button"
                      onClick={onClick}
                    >
                      <HighlightOff />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2">
                <div>
              
                    <Input
                                    label="Category"
                                   
                                    autoComplete="Name"
                                    name="product_category"
                                    value={category.product_category}
                                    onChange={(e) => onInputChange(e)}
                                 
                                  />
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    disabled={isButtonDisabled}
                    type="button"
                    onClick={onSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    {isButtonDisabled ? "Submiting..." : "Submit"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateCaterogy;
