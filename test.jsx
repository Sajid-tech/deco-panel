import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import moment from "moment";
import {  HiOutlineArrowSmRight } from "react-icons/hi";
import { TfiReload } from "react-icons/tfi";
import { MdCancel } from "react-icons/md";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { Minus } from "lucide-react";

const Home = () => {
  const [dateyear, setDateYear] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState(null);

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const [showTable, setShowTable] = useState(true);
  const [closeCategory, setCloseCategory] = useState(true);

  const [fullClose, setFullClose] = useState(true);
  const [fullCloseCategory, setFullCloseCategory] = useState(true);

  const [loadingRecentOrders, setLoadingRecentOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/web-fetch-year`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDateYear(res.data?.year?.current_year);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  const fetchRecentOrders = async () => {
    setLoadingRecentOrders(true);
    if (dateyear) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-dashboard-data-by/${dateyear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setRecentOrders(response.data.pendingOrder);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoadingRecentOrders(false);
      }
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    if (dateyear) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-dashboard-data-by/${dateyear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setProducts(response.data.categoryBanner);
          setProductsCount(response.data.productsCount);
          setOrdersCount(response.data.ordersCount);
          setUsersCount(response.data.usersCount);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dateyear]);

  useEffect(() => {
    fetchRecentOrders();
  }, [dateyear]);

  const handleReload = () => {
    fetchRecentOrders();
  };

  const handleCategoryReload = () => {
    fetchProducts();
  };

  useEffect(() => {
    if (products && products.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [products]);

  const handleOrderClick = (orderNo) => {
    navigate(`/orders/${orderNo}`);
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-[#5e7081] to-[#3a4a5a] text-white rounded-lg shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Products</p>
                <p className="text-2xl font-bold mt-1">
                  <CountUp start={0} end={productsCount} duration={2.5} />
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Clients</p>
                <p className="text-2xl font-bold mt-1">
                  <CountUp start={0} end={usersCount} duration={2.5} />
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Orders</p>
                <p className="text-2xl font-bold mt-1">
                  <CountUp start={0} end={ordersCount} duration={2.5} />
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Section */}
          {fullClose && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Orders
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowTable(!showTable)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title={showTable ? "Minimize" : "Maximize"}
                  >
                    <Minus className="text-xl" />
                  </button>
                  <button
                    onClick={handleReload}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Refresh"
                  >
                    <TfiReload className="text-lg" />
                  </button>
                  <button
                    onClick={() => setFullClose(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Close"
                  >
                    <MdCancel className="text-xl" />
                  </button>
                </div>
              </div>

              {loadingRecentOrders ? (
                <div className="p-8">
                  <Loader />
                </div>
              ) : (
                showTable && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Client Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.length > 0 ? (
                          recentOrders.map((order, key) => (
                            <tr
                              key={key}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.orders_no}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {moment(order.orders_date).format("DD-MM-YYYY")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.full_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() =>
                                    handleOrderClick(order.orders_no)
                                  }
                                  className="text-blue-600 hover:text-blue-900 flex items-center"
                                >
                                  View <HiOutlineArrowSmRight className="ml-1" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              No recent orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}

          {/* Categories Section */}
          {fullCloseCategory && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  Product Categories
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setCloseCategory(!closeCategory)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title={closeCategory ? "Minimize" : "Maximize"}
                  >
                    <Minus className="text-xl" />
                  </button>
                  <button
                    onClick={handleCategoryReload}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Refresh"
                  >
                    <TfiReload className="text-lg" />
                  </button>
                  <button
                    onClick={() => setFullCloseCategory(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Close"
                  >
                    <MdCancel className="text-xl" />
                  </button>
                </div>
              </div>

              {loadingProducts ? (
                <div className="p-8">
                  <Loader />
                </div>
              ) : (
                closeCategory && (
                  <div className="p-4">
                    {products && products.length > 0 ? (
                      <div className="relative overflow-hidden rounded-lg h-64">
                        <div
                          className="flex transition-transform duration-500 ease-in-out h-full"
                          style={{
                            transform: `translateX(-${activeIndex * 100}%)`,
                          }}
                        >
                          {products.map((product, index) => (
                            <div
                              key={index}
                              className="min-w-full flex flex-col items-center justify-center p-4"
                            >
                              <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg">
                                <img
                                  src={`https://decopanel.in/storage/app/public/product_category/${product.product_category_image}`}
                                  alt={product.product_category}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <h3 className="text-lg font-medium text-gray-800 text-center">
                                {product.product_category}
                              </h3>
                              <div className="flex mt-2 space-x-1">
                                {products.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`w-2 h-2 rounded-full ${
                                      idx === activeIndex
                                        ? "bg-blue-500"
                                        : "bg-gray-300"
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No categories available
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Restore Closed Sections */}
        <div className="mt-4 flex space-x-3">
          {!fullClose && (
            <button
              onClick={() => setFullClose(true)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200 transition-colors"
            >
              Restore Orders Panel
            </button>
          )}
          {!fullCloseCategory && (
            <button
              onClick={() => setFullCloseCategory(true)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200 transition-colors"
            >
              Restore Categories Panel
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;