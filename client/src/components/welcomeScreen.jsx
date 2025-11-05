import React from 'react'
import assets from '../assets/assets.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { Appcontent } from '../context/Appcontext.jsx'

const welcomeScreen = () => {

  const {BackendURL ,setuserdata} = useContext(Appcontent)

  const SeenWelcome = async () => {
    const res = await axios.put(BackendURL + `/user/CheckWelcome`, {}, { withCredentials: true })
    if (res.data?.success) {
      setuserdata(prev=>({...prev , HasSeenWelcome : true}))
    } else {
      toast.error(res.data.message)
    }
  }
  return (
    <div className='h-full w-full flex flex-col gap-10 justify-center items-center p-5 bg-black'>
      <img src={assets.WelcomeGif} alt="" className="min-h-40 max-h-[400px]" />
      <div className="flex flex-col gap-5 items-center">
        <p className="text-white text-3xl font-bold font-Lexend">Welcome to FocusFlow</p>
        <p className="text-white/60 font-Asap">Ready to turn your focus into real progress? Let’s dive in and make today productive.</p>
        <button onClick={()=>SeenWelcome()} className="bg-amber-300/90 px-8 py-2 text-lg font-bold font-Exo_2 rounded-xl hover:scale-110 transition-all duration-200 cursor-pointer">Let’s Begin</button>
      </div>
    </div>
  )
}

export default welcomeScreen
