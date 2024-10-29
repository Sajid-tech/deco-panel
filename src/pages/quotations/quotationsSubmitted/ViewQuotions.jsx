import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import moment from "moment";

const ViewQuotions = () => {
  const [viewQuotions, setViewQuotions] = useState(null);
  const [viewSubQuotions, setViewSubQuotions] = useState(null);
  const [quotationSubSum, setQuotationSubSum] = useState([]);
  console.log(quotationSubSum)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef();
  useEffect(() => {
    const fetchViewOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-quotation-view-by-Id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setViewQuotions(response.data?.quotation);
        setViewSubQuotions(response.data?.quotationSub);
        setQuotationSubSum(response.data?.quotationSubSum);
        console.log("set order list", response.data.quotions);
      } catch (error) {
        console.error("error while fetching select product ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchViewOrder();
    setLoading(false);
  }, [1]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-56">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!viewQuotions) {
    return (
      <Layout>
        <div className="flex justify-center flex-col mt-48 items-center h-56">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div className="text-gray-400 animate-pulse">Loading</div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto mt-5">
        <ReactToPrint
          trigger={() => (
            <button className=" bg-blue-500 text-white py-2 px-4 rounded mb-4">
              Print Quotition
            </button>
          )}
          content={() => printRef.current}
        />

        <div ref={printRef} className="print-container">
          <div className="grid grid-cols-3 gap-4 mb-6 border-b pb-4">
            <div>
              <p className="font-semibold text-black">Client:</p>
              <p className="text-black">{viewQuotions.full_name}</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-black">Quote No:</p>
              <p className="text-black">{viewQuotions.quotation_no}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-black">Quote Date:</p>
              <p className="text-black">{moment(viewQuotions.quotation_date).format('DD-MM-YYYY')}</p>
            </div>
          </div>

          <div className="mt-4">
            <table className="min-w-full table-auto border border-black">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2 border border-black">Item</th>
                  <th className="text-left p-2 border border-black">Size</th>
                  <th className="text-left p-2 border border-black">
                    Quantity
                  </th>
                  <th className="text-left p-2 border border-black">Rate</th>
                  <th className="text-left p-2 border border-black">Amount</th>
                </tr>
              </thead>
              <tbody>
                {viewSubQuotions?.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-black">
                      {item.quotation_sub_thickness} - {item.quotation_sub_unit}{" "}
                      {item.product_category} {item.product_sub_category}
                      <p className="text-sm text-black">
                        Brand: {item.quotation_sub_brand}
                      </p>
                    </td>
                    <td className="p-2 border border-black">
                      {item.quotation_sub_size1 > 1
                        ? item.quotation_sub_size2 > 1
                          ? item.quotation_sub_size1 +
                            "x" +
                            item.quotation_sub_size2
                          : ""
                        : ""}
                    </td>
                    <td className="p-2 border border-black">
                      {item.quotation_sub_quantity}
                    </td>
                    <td className="p-2 border border-black">
                    {item.quotation_sub_rate.toFixed(2)}
                    </td>
                    <td className="p-2 border border-black">
                    {item.quotation_sub_amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4 border border-black font-semibold">
                    Billing on Address
                  </td>
                  <td className="p-2 border border-black font-bold" >Total  </td>

                  <td className="p-2 border border-black font-semibold text-center" colSpan={3}>
                  {quotationSubSum.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col  gap-4">
            <div className=" h-20 border border-black  bg-white  w-1/2  ">
              <span className=" opacity-50">Delevery Address</span>
            </div>

            <div className="  h-20 border border-black  bg-white w-1/2 ">
              <span className=" opacity-50">Billing Address</span>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        @media print {
          @page {
            size: A5;
            margin: 10mm;
          }

          .print-container {
            font-size: 12px;
            color: black;
          }

          .print-container h1 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .print-container p {
            margin: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          table, th, td {
            border: 1px solid black;
          }

          th, td {
            padding: 8px;
            text-align: left;
          }

          thead {
            background-color: #f0f0f0;
          }

          tbody tr:nth-child(even) {
            background-color: white; 
          }

          tbody tr:nth-child(odd) {
            background-color: white;
          }
        }
      `}
      </style>
    </Layout>
  );
};

export default ViewQuotions;
