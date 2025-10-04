import { useContext } from "react";
import { useState } from "react";
import { userContext } from "../App";
import { FilterPagenationData } from "../common/FilterPagenationData";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../common/Loader";
import AnimationWrapper from "../common/AnimationWrapper";
import NoData from "../components/NoData";
import NotificationCard from "../components/NotificationCard";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";

const Notifications = () => {
  const {
    userAuth,
    userAuth: { accessToken, new_notification_available },
    setUserAuth,
  } = useContext(userContext);

  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(null);

  let filters = ["all", "like", "comment", "reply"];

  const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "notifications",
        {
          page,
          filter,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async ({ data: { notifications: data } }) => {
        if (new_notification_available) {
          setUserAuth({ ...userAuth, new_notification_available: false });
        }

        let formatedData = await FilterPagenationData({
          state: notifications,
          data,
          page,
          countRoute: "all-notifications-count",
          data_to_send: { filter },
          user: accessToken,
        });

        setNotifications(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilter = (e) => {
    let btn = e.target;

    setFilter(btn.innerHTML);

    setNotifications(null);
  };

  useEffect(() => {
    if (accessToken) {
      fetchNotifications({ page: 1 });
    }
  }, [accessToken, filter]);

  return (
    <div>
      <h1 className="max-md:hidden text-xl text-dark-grey mb-3">Recent Notifications</h1>
      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                "py-2 " + (filter == filterName ? "btn-dark" : " btn-light")
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>
      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoData message="Nothing available" />
          )}
          <LoadMoreDataBtn
            state={notifications}
            fetchDataFunction={fetchNotifications}
            additionalParam={{ deletedDocCount: notifications.deletedDocCount }}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
