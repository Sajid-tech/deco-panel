import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";
import BASE_URL from "../base/BaseUrl";
import { useEffect, useState } from "react";

export function Footer() {
  const year = new Date().getFullYear();
  const brandName = "AG Solutions";
  const brandLink = "https://www.ag-solutions.in";
  const [dateyear, setDateYear] = useState(null);

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

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2">
        <Typography variant="small" className="font-normal text-inherit">
          Copyright@ {dateyear} by{" "}
          <a
            href={brandLink}
            target="_blank"
            className="transition-colors hover:text-blue-500 font-bold"
          >
            {brandName}
          </a>{" "}
          . All rights reserved.
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
