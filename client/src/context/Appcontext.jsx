import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Appcontent = createContext()

export const AppProvider = (props) => {

    const BackendURL = import.meta.env.VITE_BACKEND_URL
    const [isloggedin, setisloggedin] = useState(false)
    const [userdata, setuserdata] = useState(false)

    const [notification, setnotification] = useState({ idx: 0, show: false })

    const Streak = async () => {
        try {
            const res = await axios.put(BackendURL + '/user/Streak', {}, { withCredentials: true })
            if (res.data?.success) {
            } else {
                toast.error(res.data?.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getsatus = async () => {
        try {
            const { data } = await axios.get(BackendURL + '/auth/is-auth', {
                withCredentials: true,
            });

            if (data.success) {
                setisloggedin(true);
                getuserdata();
            }
        } catch (error) {
            toast.error("Auth check failed: " + error.message);
        }
    }

    const statuscheck = async () => {
        try {
            const { data } = await axios.get(BackendURL + '/auth/is-auth', {
                withCredentials: true,
            })
            if (data.success) {
                return true
            }else{
                return false
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getuserdata = async () => {
        try {
            const { data } = await axios.get(BackendURL + '/user/data', {
                withCredentials: true,
            })
            data.success ? setuserdata(data.UserData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const [model, setmodel] = useState({ type: null, data: null })
    const openmodel = (type, data = null) => setmodel({ type, data })
    const closemodel = () => setmodel({ type: null, data: null })

    useEffect(() => {
        getsatus()
    }, [])

    const value = {
        BackendURL,
        isloggedin,
        setisloggedin,
        userdata,
        setuserdata,
        getuserdata,
        model,
        openmodel,
        closemodel,
        notification,
        setnotification,
        Streak,
        statuscheck
    }

    return (
        <Appcontent.Provider value={value}>
            {props.children}
        </Appcontent.Provider>
    )
}
