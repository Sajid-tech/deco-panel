import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const CreateOrderFilter = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    //   const handleButtonClick = (index, path) => {
    //     setActiveButton(index);
    //     console.log("naviaget", path);
    //     navigate(path);
    //   };
  
    const handleButtonClick = (path) => {
      navigate(path);
    };
  
    const buttons = [
      {
        label: "Create Order",
        path: "/create-order",
        color: "from-pink-500 to-orange-400",
      },
      {
        label: "Pending Order List",
        path: "/pending-order-list",
        color: "from-pink-500 to-orange-400",
      },
      {
        label: "Order List",
        path: "/order-list",
        color: "from-blue-500 to-cyan-400",
      },
      
      
    ];
  return (
    <div className="flex flex-wrap justify-between mt-6 gap-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`w-full md:w-auto flex-1 py-2 px-4 text-white rounded-lg transition-all ${
            location.pathname === button.path
              ? `bg-gradient-to-r ${button.color} shadow-lg transform -translate-y-1`
              : "bg-blue-200"
          }`}
          onClick={() => handleButtonClick(button.path)}
        >
          {button.label}
        </button>
      ))}
    </div>
  )
}

export default CreateOrderFilter