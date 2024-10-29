import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import moment from "moment";
import { HiMiniMinus } from "react-icons/hi2";
import { TfiReload } from "react-icons/tfi";
import { MdCancel } from "react-icons/md";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

const Home = () => {
  const [dateyear, setDateYear] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState(null);

  const [productsCount , setProductsCount] = useState();
  const [ordersCount , setOrdersCount] = useState();
  const [usersCount , setUsersCount] = useState();


  const [showTable, setShowTable] = useState(true);
  const [closeCategory, setCloseCategory] = useState(true);

  const [fullClose, setFullClose] = useState(true);
  const [fullCloseCategory, setFullCloseCategory] = useState(true);

  const [loadingRecentOrders, setLoadingRecentOrders] = useState(false); // Loading state for orders
  const [loadingProducts, setLoadingProducts] = useState(false); // Loading state for products

  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/web-fetch-year`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res)
        setDateYear(res.data?.year?.current_year);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch both data sets but manage loading states separately
  const fetchRecentOrders = async () => {
    setLoadingRecentOrders(true);
    if(dateyear){
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
    if(dateyear){

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
    fetchProducts(); // Fetch products initially
  }, [dateyear]);


  useEffect(() => {
    fetchRecentOrders(); // Fetch orders initially
  }, [dateyear]);

  // Reload for recent orders
  const handleReload = () => {
    fetchRecentOrders(); // Only reload recent orders, not products
  };

  // Reload for products
  const handleCategoryReload = () => {
    fetchProducts(); 
  };

  // Slide functionality for product carousel
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

  return (
    <Layout>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="bg-[#5e7081] text-white flex items-center justify-center flex-col text-center md:h-24 py-4 rounded-lg transition-transform duration-400">
            <p className="text-md font-bold">Products</p>
            <p className="text-xl font-bold">
            <CountUp start={0} end={productsCount} />
            </p>
            
          </div>
          <div className="bg-blue-500 text-white flex items-center justify-center flex-col text-center md:h-24 py-4 rounded-lg transition-transform duration-400">
            <p className="text-md font-bold">Clients</p>
            <p className="text-xl font-bold">
            <CountUp start={0} end={usersCount} />
            </p>
          </div>
          <div className="bg-green-500 text-white flex items-center justify-center flex-col text-center md:h-24 py-4 rounded-lg transition-transform duration-400">
            <p className="text-md font-bold">Orders</p>
            <p className="text-xl font-bold">
            <CountUp start={0} end={ordersCount} />
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 mt-10 gap-4">
          {fullClose && (
            <div className="container mx-auto col-span-2">
              <div className="flex justify-between bg-white p-4 rounded-sm">
                <div className="content-center">
                  <h1>Tomorrow Booking Orders</h1>
                </div>
                <div className="flex gap-3">
                  <div>
                    <HiMiniMinus
                      className="text-2xl cursor-pointer"
                      onClick={() => setShowTable(!showTable)}
                    />
                  </div>
                  <div>
                    <TfiReload
                      className="text-xl cursor-pointer"
                      onClick={handleReload}
                    />
                  </div>
                  <div>
                    <MdCancel
                      className="text-2xl cursor-pointer"
                      onClick={() => setFullClose(false)}
                    />
                  </div>
                </div>
              </div>
              {loadingRecentOrders ? (
                <Loader />
              ) : (
                showTable && (
                  <div className="flex flex-col">
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full">
                        <div className="overflow-hidden">
                          <table className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                            <thead className="bg-gray-400 font-medium text-white dark:border-white/10">
                              <tr>
                                <th scope="col" className="px-6 py-4">
                                  Order No
                                </th>
                                <th scope="col" className="px-6 py-4">
                                  Order Date
                                </th>
                                <th scope="col" className="px-6 py-4">
                                  Client Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {recentOrders.map((order, key) => (
                                <tr
                                  key={key}
                                  className="border-b border-neutral-200 bg-white"
                                >
                                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                                    {order.orders_no}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {moment(order.orders_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4">
                                    {order.full_name}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {fullCloseCategory && (
            <div className="w-full h-[200px]">
              <div className="flex justify-between bg-white p-4 rounded-sm">
                <div className="content-center">
                  <h1>Categories</h1>
                </div>
                <div className="flex gap-3">
                  <div>
                    <HiMiniMinus
                      className="text-2xl cursor-pointer"
                      onClick={() => setCloseCategory(!closeCategory)}
                    />
                  </div>
                  <div>
                    <TfiReload
                      className="text-xl cursor-pointer"
                      onClick={handleCategoryReload}
                    />
                  </div>
                  <div>
                    <MdCancel
                      className="text-2xl cursor-pointer"
                      onClick={() => setFullCloseCategory(false)}
                    />
                  </div>
                </div>
              </div>
              {loadingProducts ? (
                <Loader />
              ) : (
                closeCategory && (
                  <div className="relative w-full overflow-hidden">
                    <div
                      className="flex transition-transform duration-500"
                      style={{
                        transform: `translateX(-${activeIndex * 100}%)`,
                      }}
                    >
                      {products &&
                        products.map((product, index) => (
                          <div key={index} className="min-w-full h-[450px]">
                            <div className="flex flex-col items-center">
                              <img
                                src={`https://decopanel.in/storage/app/public/product_category/${product.product_category_image}`}
                                alt="product"
                                className="w-[400px]"
                              />
                              <h3 className="text-center">
                                {product.product_category}
                              </h3>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
