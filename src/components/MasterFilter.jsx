import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MasterFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (path) => {
    navigate(path);
   
  };

  const buttons = [
    {
      label: "Categories",
      path: "/categories",
      color: "from-blue-500 to-cyan-400",
      hoverColor: "hover:bg-blue-50",
      textColor: "text-blue-900",
    },
    
    {
      label: "Sub Categories",
      path: "/sub-categories",
      color: "from-purple-500 to-indigo-400",
      hoverColor: "hover:bg-purple-50",
      textColor: "text-purple-900",
    },
    {
      label: "Brands",
      path: "/brand",
      color: "from-yellow-500 to-orange-300",
      hoverColor: "hover:bg-yellow-50",
      textColor: "text-yellow-900",
    },
    {
      label: "Products",
      path: "/products",
      color: "from-red-500 to-pink-400",
      hoverColor: "hover:bg-red-50",
      textColor: "text-red-900",
    },
   
  ];

  return (
    <div className="bg-white rounded-t-lg shadow-lg p-1  mx-auto  w-full">
      <div className="flex flex-wrap justify-center items-center gap-1  ">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`relative group px-4 py-2 m-1 rounded-lg transition-all duration-200 text-sm font-medium ${
              location.pathname === button.path
                ? `bg-gradient-to-r ${button.color}  text-white`
                : ` ${button.hoverColor} ${button.textColor} bg-gray-100`
            }`}
            onClick={() => handleButtonClick(`${button.path}`)}
          >
            {button.label}
            {location.pathname !== button.path && (
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${button.color}  group-hover:w-full transition-all duration-300`}></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasterFilter;













// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const MasterFilter = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const handleButtonClick = (path) => {
//     navigate(path);
//   };
//   const buttons = [
//     {
//       label: "Categories",
//       path: "/categories",
//       color: "from-pink-500 to-orange-400",
//     },
//     {
//       label: "Sub Categories",
//       path: "/sub-categories",
//       color: "from-blue-500 to-cyan-400",
//     },
//     {
//       label: "Brands",
//       path: "/brand",
//       color: "from-green-500 to-teal-400",
//     },
//     {
//       label: "Products",
//       path: "/products",
//       color: "from-green-500 to-teal-400",
//     },
//   ];
//   return (
//     <div className="flex flex-wrap justify-between mt-6 gap-4">
//       {buttons.map((button, index) => (
//         <button
//           key={index}
//           className={`w-full md:w-auto flex-1 py-2 px-4 text-white rounded-lg transition-all ${
//             location.pathname === button.path
//               ? `bg-gradient-to-r ${button.color} shadow-lg transform -translate-y-1`
//               : "bg-blue-200"
//           }`}
//           onClick={() => handleButtonClick(button.path)}
//         >
//           {button.label}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default MasterFilter;
