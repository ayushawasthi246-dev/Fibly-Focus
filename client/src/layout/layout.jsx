import { useContext, useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import WelcomeScreen from "../components/welcomeScreen.jsx"
import { Outlet, useNavigate } from "react-router-dom";
import { Appcontent } from "../context/Appcontext.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Layout() {
  const [fit, setfit] = useState(true)
  const { userdata ,statuscheck } = useContext(Appcontent)
  const [SeenWelcomeScreen, setSeenWelcomeScreen] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    setSeenWelcomeScreen(userdata.HasSeenWelcome)
  }, [userdata])

  useEffect(() => {
    if (userdata && SeenWelcomeScreen !== undefined) {
      const timer = setTimeout(() => setShowLoader(false), 50);
      return () => clearTimeout(timer);
    }
  }, [userdata, SeenWelcomeScreen]);

  console.log("userdata : ", userdata)
  console.log("SeenWelcomeScreen :", SeenWelcomeScreen)

  const navigate = useNavigate()

  const [isLogged, setIsLogged] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const check = await statuscheck();

        console.log("CHECK :", check)

        if (!check) {
          toast.error("Not authorized. Please log in again");
          setIsLogged(false);
          navigate("/");
          return;
        }

        setIsLogged(true);
      } catch (error) {
        toast.error(error.message);
        setIsLogged(false);
        navigate("/");
      } finally {
        setAuthChecked(true)
      }
    };

    checkStatus();
  }, [navigate]);

  return (
    <div className="h-screen overflow-y-auto sm:h-screen w-screen flex gap-8 py-5 xs:py-7 px-5 bg-[#080414] relative">
      {showLoader && (
        <div className="bg-black absolute top-0 left-0 z-40 h-full w-full flex items-center justify-center flex-col ">
          <div className="flex gap-2 ">
            <div className="bg-white size-2 sm:size-3 rounded-full animate-fadeToggle"></div>
            <div className="bg-white size-2 sm:size-3 rounded-full animate-fadeToggle-300ms"></div>
            <div className="bg-white size-2 sm:size-3 rounded-full animate-fadeToggle-500ms"></div>
          </div>
          <br />
          <p className="text-white text-xl sm:text-3xl translate-x-1">Loading...</p>
        </div>
      )}
      {!SeenWelcomeScreen && userdata && (
        <div className="absolute top-0 left-0 min-h-[450px] z-30 h-full w-full py-3">
          <WelcomeScreen />
        </div>
      )}

      {SeenWelcomeScreen && userdata && (
        <div className={`${fit ? "h-16 w-12 md:w-auto" : "h-full overflow-y-auto bg-[#080414] "} absolute md:min-h-full flex-shrink-0 top-0 left-0 pl-5 xxl:pl-0 py-5 xxl:py-0 xxl:static  z-20 `}>
          <Sidebar setfit={setfit} fit={fit} />
        </div>
      )}

      {SeenWelcomeScreen && userdata && (
        <div className="h-full flex-1 min-w-0 flex flex-col md:ml-27 xxl:ml-0 gap-5 relative bg-[#080414] ">
          <Outlet />
        </div>
      )}

    </div>
  );
}
