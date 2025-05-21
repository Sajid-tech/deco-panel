


import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-blue-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // close sidebar when clicking outside

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex ">
            <div className=" logo-text">
              <div className="logo-title text-white text-lg font-bold">
                <span className="font-black">Deco</span> Panel
              </div>
            </div>
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        <ul className="mb-4 flex flex-col gap-1">
          <li>
            <NavLink to="/home">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <HomeIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Dashboard
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/products">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <PersonIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Master
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/user-team">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <PeopleIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Users
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/create-order">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <NoteAddIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Create Order
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/order-list-nav">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <NoteAddIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Order List
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/quotations">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <TextSnippetIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Quotations
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/product-report">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <TextSnippetIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Reports
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>

          {/* Add more hardcoded routes here as needed */}
        </ul>
      </div>
    </aside>
  );
};
export default SideNav;
