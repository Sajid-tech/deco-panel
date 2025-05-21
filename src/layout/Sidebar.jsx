import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, User, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Menuitems from "./Menuitems";
import { Dialog, DialogContent, Button } from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import BASE_URL from "../base/BaseUrl";

const itemVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.02 },
};

const Sidebar = ({ isCollapsed, isMobileOpen, onClose, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userTypeId = localStorage.getItem("user_type_id");
  const userName = localStorage.getItem("username");
  const userEmail = localStorage.getItem("email");
const navigate = useNavigate()
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  useEffect(() => {
    const initialExpanded = {};
    Menuitems(userTypeId).forEach((item) => {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(
          (subItem) => location.pathname === subItem.href
        );
        if (hasActiveChild) {
          initialExpanded[item.id] = true;
        }
      }
    });
    setExpandedMenus(initialExpanded);
  }, [userTypeId, location.pathname]);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLinkClick = () => {
    const sidebarContent = document.querySelector(".sidebar-content");
    if (sidebarContent) {
      sessionStorage.setItem("sidebarScrollPosition", sidebarContent.scrollTop);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  useEffect(() => {
    const sidebarContent = document.querySelector(".sidebar-content");
    const scrollPosition = sessionStorage.getItem("sidebarScrollPosition");

    if (sidebarContent && scrollPosition) {
      sidebarContent.scrollTop = parseInt(scrollPosition);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    localStorage.clear();
    navigate("/");
    toast.success("User Logout")
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!isCollapsed ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">DP</span>
                </div>
                <span className="text-white font-semibold text-lg">Deco Panel</span>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">DP</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white hidden lg:block"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto sidebar-content py-4">
            <nav className="px-2">
              <ul className="space-y-1">
                {Menuitems(userTypeId).map((item) => {
                  if (item.subheader) {
                    return (
                      !isCollapsed && (
                        <li key={item.subheader} className="px-4 py-2">
                          <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                            {item.subheader}
                          </span>
                        </li>
                      )
                    );
                  }

                  if (item.subItems) {
                    const isParentActive = item.subItems.some(
                      (subItem) => location.pathname === subItem.href
                    );
                    const isOpen = expandedMenus[item.id] || isParentActive;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleMenu(item.id)}
                          className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                            isParentActive
                              ? "text-white bg-blue-600/30"
                              : "text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          <item.icon className="flex-shrink-0 h-5 w-5" />
                          {!isCollapsed && (
                            <>
                              <span className="ml-3 text-sm font-medium">
                                {item.title}
                              </span>
                              <ChevronRight
                                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                  isOpen ? "rotate-90" : ""
                                }`}
                              />
                            </>
                          )}
                        </button>

                        <motion.div
                          initial={isOpen ? "open" : "closed"}
                          animate={isOpen ? "open" : "closed"}
                          variants={itemVariants}
                          className="overflow-hidden"
                        >
                          {isOpen && (
                            <ul className="mt-1 space-y-1 pl-4 border-l-2 border-blue-400/30">
                              {item.subItems.map((subItem) => {
                                const isSubItemActive =
                                  location.pathname === subItem.href;
                                return (
                                  <motion.li
                                    key={subItem.id}
                                    variants={buttonVariants}
                                    whileHover="hover"
                                  >
                                    <Link
                                      to={subItem.href}
                                      onClick={handleLinkClick}
                                      className={`block pl-4 py-2 rounded-lg transition-colors duration-200 ${
                                        isSubItemActive
                                          ? "text-white bg-blue-600/20 border-l-2 border-blue-400 -ml-0.5"
                                          : "text-gray-300 hover:bg-gray-700 border-l-2 border-transparent hover:border-gray-500"
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        <subItem.icon className="flex-shrink-0 h-5 w-5" />
                                        {!isCollapsed && (
                                          <span className="ml-3 text-sm">
                                            {subItem.title}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  </motion.li>
                                );
                              })}
                            </ul>
                          )}
                        </motion.div>
                      </li>
                    );
                  }

                  const isActive = location.pathname === item.href;
                  return (
                    <motion.li
                      key={item.id}
                      variants={buttonVariants}
                      whileHover="hover"
                    >
                      <Link
                        to={item.href}
                        onClick={handleLinkClick}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-white bg-blue-600/30"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="flex-shrink-0 h-5 w-5" />
                        {!isCollapsed && (
                          <span className="ml-3 text-sm font-medium">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* User Profile Section */}
          {!isCollapsed ? (
            <div className="p-2 border-t border-gray-700">
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {getInitials(userName)}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-gray-400 truncate w-36">{userEmail}</p>
                  </div>
                  <ChevronDown
                    className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Change Password
                    </Link>
                    <button
                      onClick={() => setOpenLogoutDialog(true)}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-2 border-t border-gray-700 flex justify-center">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="relative"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {getInitials(userName)}
                </div>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-2 left-0 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                     Change Password
                    </Link>
                    <button
                      onClick={() => setOpenLogoutDialog(true)}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </button>
            </div>
          )}

          {/* Version Info */}
          <div className="p-2 border-t border-gray-700">
            <div className="text-center text-xs text-gray-500">
              v{"1.0.0"}
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent className="p-6 text-center bg-gradient-to-br from-gray-50 to-white">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut className="w-7 h-7 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Confirm Logout
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to logout from the system?
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="contained"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow-md"
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
            <Button
              variant="outlined"
              className="border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
              onClick={() => setOpenLogoutDialog(false)}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;