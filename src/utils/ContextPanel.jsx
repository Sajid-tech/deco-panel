import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/web-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/home",
          "/order-list",
          "/view-order",
          "/create-order",
          "/change-password",
          "/user-team",
          "/profile",
          "/user-app",
          "/add-quotations",
          "/quotation-report",
          "/view-quotions",
          "/pending-order-list",
          "/order-report",
          "/edit-order",
          "/order-list-nav",
          "/product-report",
          "/order-view-report",
          "/quotation-view-report",
          "/categories",
          "/add-categories",
          "/edit-categories",
          "/sub-categories",
          "/add-sub-categories",
          "/edit-sub-categories",
          "/brand",
          "/add-brand",
          "/edit-brand",
          "/add-product",
          "/products",
          "/edit-product",
          "/quotations",
          "/all-quotations",
          "/edit-quotations",
        ];

        const isAllowedPath = allowedPaths.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/forget-password"


        ) {
          navigate(currentPath);
        } else {
          navigate("/");
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
