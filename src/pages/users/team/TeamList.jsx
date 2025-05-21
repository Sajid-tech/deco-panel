import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import {ContextPanel} from "../../../utils/ContextPanel"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ToggleSwitch from "../../../components/ToggleSwitch"
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import UserTeamFilter from '../../../components/UserTeamFilter';
import MUIDataTable from 'mui-datatables';
import { CircularProgress } from '@mui/material';

const TeamList = () => {
  const [teamListData, setTeamListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-team-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeamListData(response.data?.profile);
      } catch (error) {
        console.error("Error fetching user team list data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListData();

  }, []);

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/web-update-team/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        setTeamListData((prevUserListData) => {
          return prevUserListData.map((user) => {
            if (user.id == id) {
              const newStatus =
                user.user_status == "Active" ? "Inactive" : "Active";

              if (newStatus == "Active") {
                toast.success("User Activated Successfully");
              } else {
                toast.success("User Inactivated Successfully");
              }

              return { ...user, user_status: newStatus };
            }
            return user;
          });
        });
      } else {
        toast.error("Errro occur while Inactive the profile");
      }
    } catch (error) {
      console.error("Error fetching user activate data", error);
      toast.error("Error fetching user activate data");
    } finally {
      setLoading(false);
    }
  };



  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    
    {
      name: "full_name",
      label: "Full name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "user_status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const user = teamListData[tableMeta.rowIndex];
          return (
            <div className="flex">
              <ToggleSwitch
                isActive={user.user_status == "Active"}
                onToggle={(e) => handleUpdate(e, id)}
              />
              
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
     textLabels: {
              body: {
                noMatch: loading ? (
                  <CircularProgress />
                ) : (
                  "Sorry, there is no matching data to display"
                ),
              },
            },
  };
  return (
    <Layout>
      <UserTeamFilter/>
       <div className="mt-1">
        <MUIDataTable
          title={"Team List"}
          data={teamListData ? teamListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  )
}

export default TeamList