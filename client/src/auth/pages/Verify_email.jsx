import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import Slider from '../components/slider.jsx'
import { useNavigate } from 'react-router-dom'
import { Appcontent } from '../../context/Appcontext.jsx'
import { toast } from 'react-toastify'

const Singup = () => {

  axios.defaults.withCredentials = true;

  const { BackendURL, setisloggedin, getuserdata } = useContext(Appcontent)

  const navigate = useNavigate()

  const temptokencheck = async () => {
    try {
      const { data } = await axios.get(BackendURL + '/auth/is-temptoken-singup', {
        withCredentials: true,
      })
      if (!data.success) {
        navigate('/singup')
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statuscheck = async () => {
    try {
      const { data } = await axios.get(BackendURL + '/auth/is-auth', {
        withCredentials: true,
      })
      if (data.success) {
        navigate('/Dashboard')
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    statuscheck()
    temptokencheck()
  }, [])

  const resend = async () => {
    try {
      const { data } = await axios.post(BackendURL + '/auth/resend-otp', {}, {
        withCredentials: true,
      })
      toast.success(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const Submit = async (e) => {

    try {
      e.preventDefault()
      const otparray = inputref.current.map(e => e.value)
      const otp = otparray.join('')

      if (otp.length < 6) {
        toast.error('Please enter the full OTP');
        return;
      }

      const response = await axios.post(BackendURL + '/auth/verification', { otp }, { withCredentials: true })

      if (response.data.success) {
        setisloggedin(true)
        getuserdata()
        navigate("/Dashboard")
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const inputref = React.useRef([]);

  const handleinput = (e, index) => {
    const value = e.target.value;

    if (value.length > 0 && index < inputref.current.length - 1) {
      inputref.current[index + 1].focus();
    }
  };

  const handlekeydown = (e, index) => {
    const value = e.target.value;

    const isCtrlV = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';

    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && !isCtrlV) {
      e.preventDefault();
    }

    if (e.key === 'Backspace' && value === '' && index > 0) {
      inputref.current[index - 1].focus();
    }
  };

  const handlepaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData('text').replace(/\D/g, '')
    const digits = paste.split("")

    digits.forEach((num, i) => {
      if (inputref.current[i]) {
        inputref.current[i].value = num
      }
    })
  }


  return (
    <>
      <div className="grid justify-center items-center lg:grid-cols-[44%_48%] xl:grid-cols-[45%_45%] max-w-screen min-h-screen p-15 bg-[#080414] text-white gap-20 xl:gap-30 relative ">

        <div className="flex flex-col items-center">

          <div onClick={() => { navigate("/") }} className=' absolute top-0 left-0 py-3 sm:py-10 px-8 xl:px-15  text-2xl sm:text-3xl xl:text-4xl cursor-pointer '>
            <span className="font-bold text-[#FAD156] font-roboto">Fibly</span>
            <span className="font-bold text-white">Focus</span>
          </div>

          <div className="flex flex-col justify-center h-full gap-5 xsm:w-sm sm:w-md lg:w-full xl:pl-20 pt-10 xxs:pt-0">

            <div className="flex flex-col gap-3 text-center lg:text-start">
              <p className="text-2xl xxs:text-3xl xsm:text-4xl font-bold font-Exo_2">Verify Your Email</p>
              <span className="text-[10px] xxs:text-[11px] xs:text-xs sm:text-base lg:text-sm xl:text-base">Just a quick check — enter your code and you’re all set to go.</span>
            </div>

            <div className="relative grid grid-cols-6 gap-2 xxs:gap-4 xxl:gap-6 h-9 xxs:h-11 xs:h-13 xsm:h-14 xxl:h-15 2xl:h-18" onPaste={handlepaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type="text" inputMode='numeric' pattern="[0-9]*" maxLength='1' required key={index} className="bg-white rounded-lg xsm:rounded-2xl text-black text-center text-2xl"
                  ref={(el) => (inputref.current[index] = el)}
                  onInput={(e) => handleinput(e, index)}
                  onKeyDown={(e) => handlekeydown(e, index)}
                />
              ))}
            </div>

            <div className="text-xs xxs:text-sm xs:text-base">
              <span className="">Didn’t receive a code? </span>
              <a onClick={resend} className="text-[#FAD156] cursor-pointer hover:text-yellow-300 ">Resend</a>
            </div>

            <button onClick={Submit} className='bg-blue-500 text-lg font-Exo_2 py-1.5 xxs:py-2.5 rounded-xl font-bold cursor-pointer active:scale-95'>Submit</button>

          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl hidden lg:block max-h-[950px] max-w-[900px]">
          <Slider initialSlide={1} />
        </div>

      </div>
    </>
  )
}

export default Singup
