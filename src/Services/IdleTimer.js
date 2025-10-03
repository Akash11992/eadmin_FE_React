import { useEffect } from "react";
import { logoutCookie } from "../Slices/Authentication/AuthenticationSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const IdleTimer = ({ children }) => {
    const dispatch = useDispatch()
  const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
  ];
  let timer;

  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      resetTimer();
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      logoutAction();
    }, 900000);
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  const logoutAction = async() => {
    const response = await dispatch(logoutCookie());
    if (response?.payload?.code === 200) {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      toast.success(response.payload.message);
      setTimeout(() => {
        window.location.pathname = "/";
    }, 2000);
    }
  };
  return children;
};

export default IdleTimer;