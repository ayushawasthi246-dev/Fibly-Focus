import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Slider from '../components/slider.jsx'
import { useForm } from 'react-hook-form'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { Appcontent } from '../../context/Appcontext.jsx'
import { toast } from 'react-toastify'

const Singup = () => {

  axios.defaults.withCredentials = true;

  const { BackendURL, setisloggedin, getuserdata } = useContext(Appcontent)

  const navigate = useNavigate()

  const statuscheck = async () => {
    try {
      const { data } = await axios.get(BackendURL + '/auth/is-auth', {
        withCredentials: true,
      })
      if (data.success) {
        navigate('/Dashboard')
        toast.success(data?.message)
      }
    } catch (error) {
      toast.error(error?.message)
    }
  }

  useEffect(() => {
    statuscheck()
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm();

  const [Email, setEmail] = useState('')
  const [isEmailSent, setisEmailSent] = useState(false)
  const [isotpSent, setisotpSent] = useState(false)



  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return pattern.test(email);
  };

  const SendEmail = async (e) => {

    e.preventDefault()
    const trimmedEmail = Email.trim();

    if (trimmedEmail == "") {
      toast.error("Gmail is requried")
      return;
    }

    if (trimmedEmail != "" && !validateEmail(Email)) {
      toast.error("Enter a valid Gmail")
      return;
    }


    try {
      const response = await axios.post(BackendURL + '/auth/send-passreset-otp', { Email }, { withCredentials: true })


      if (response.data.success) {
        setisEmailSent(true)
        toast.success(response.data?.message)
      } else {
        toast.error(response.data?.message)
      }

    } catch (error) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }

  }



  const [passeye, setpasseye] = useState(true)
  const [confirmeye, setconfirmseteye] = useState(true)

  const handlepass = () => {
    setpasseye(!passeye)
  }
  const handlconfirm = () => {
    setconfirmseteye(!confirmeye)
  }

  const password = watch("Password")

  const SetPassword = async (data) => {

    try {
      const response = await axios.post(BackendURL + '/auth/reset-password', { NewPassword: data.Password }, { withCredentials: true })
      if (response.data?.success) {
        setisloggedin(true)
        getuserdata()
        navigate('/')
        toast.success(response.data?.message)
      } else {
        toast.error(response.data?.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  const onerror = (errors) => {

    const fieldOrder = ["Password", "confirmpass"]

    fieldOrder.forEach((filed, i) => {
      if (errors[filed]?.message) {
        setTimeout(() => {
          toast.error(errors[filed].message)
        }, i * 500);
      }
    })
  }


  const resend = async () => {
    try {
      const res = await axios.post(BackendURL + '/auth/rest-resend-otp', {}, {
        withCredentials: true,
      })
      if (res.data?.success) {
        toast.success(res.data?.message)
      } else {
        toast.error(res.data?.message)
      }
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

      const response = await axios.post(BackendURL + '/auth/reset-verification', { otp }, { withCredentials: true })

      if (response.data.success) {
        setisotpSent(true)
        toast.success(response.data?.message)
      } else {
        toast.error(response.data?.message)
      }
    } catch (err) {
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

          {!isEmailSent && !isotpSent &&

            <form onSubmit={SendEmail} className="flex flex-col justify-center h-full gap-5 xsm:w-sm sm:w-md lg:w-full xl:pl-20 pt-10 xxs:pt-0">

              <div className="flex flex-col gap-3 text-center lg:text-start">
                <p className="text-2xl xxs:text-3xl xsm:text-4xl font-bold font-Exo_2">Forgot your password ?</p>
                <span className="text-[10px] xxs:text-[11px] xs:text-xs sm:text-base lg:text-sm xl:text-base">Can’t remember? Let’s reset your password and get you back on track.</span>
              </div>


              <div className="relative">
                <input
                  placeholder=""
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className='peer w-full border-1 border-white/80 rounded-lg py-[6px] xs:py-[9px] px-3'
                />
                <label
                  className='absolute -top-4 xs:-top-3.5 left-6 scale-90 text-white bg-[#080414] px-3 transition-all duration-250 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1.5  xs:peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:scale-90 peer-focus:-top-4 xs:peer-focus:-top-3.5 peer-focus:left-6 peer-focus:text-white pointer-events-none
              '>Email</label>
              </div>

              <button className='bg-blue-500 text-lg font-Exo_2 py-1.5 xxs:py-2.5 rounded-xl font-bold cursor-pointer active:scale-95' type="submit">Submit</button>
            </form>

          }

          {isEmailSent && !isotpSent &&

            <div
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  Submit(e)
                }
              }}
              className="flex flex-col justify-center h-full gap-5 xsm:w-sm sm:w-md lg:w-full xl:pl-20 pt-10 xxs:pt-0">

              <div className="flex flex-col gap-3 text-center lg:text-start">
                <p className="text-2xl xxs:text-3xl xsm:text-4xl font-bold font-Exo_2">Forgot your password?</p>
                <span className="text-[10px] xxs:text-[11px] xs:text-xs sm:text-base lg:text-sm xl:text-base">Can’t remember? Let’s reset your password and get you back on track.</span>
              </div>


              <div
                className="relative grid grid-cols-6 gap-2 xxs:gap-4 xxl:gap-6 h-9 xxs:h-11 xs:h-13 xsm:h-14 xxl:h-15 2xl:h-18" onPaste={handlepaste}>
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

          }

          {isEmailSent && isotpSent &&

            <form onSubmit={handleSubmit(SetPassword, onerror)} className="flex flex-col justify-center h-full gap-5 xsm:w-sm sm:w-md lg:w-full xl:pl-20 pt-10 xxs:pt-0">

              <div className="flex flex-col gap-3 text-center lg:text-start">
                <p className="text-2xl xxs:text-3xl xsm:text-4xl font-bold font-Exo_2">Forgot your password?</p>
                <span className="text-[10px] xxs:text-[11px] xs:text-xs sm:text-base lg:text-sm xl:text-base">Can’t remember? Let’s reset your password and get you back on track.</span>
              </div>


              <div className="relative">
                <input
                  placeholder=""
                  {...register("Password", {
                    required: "Password is required", minLength: {
                      value: 8,
                      message: "Password should be of atleast 8 charcters"
                    }, maxLength: {
                      value: 20,
                      message: "Password should not be more then 20 charcters"
                    }
                  })}
                  type={passeye ? "password" : "text"}
                  className='peer w-full border-1 border-white/80 rounded-lg py-[6px] xs:py-[9px] pl-3 pr-15'
                />

                <button
                  type="button"
                  onClick={handlepass} className='absolute right-4.5 top-2.5 cursor-pointer'>
                  {
                    passeye ? <IoMdEyeOff className='size-6 text-white/80 hover:text-white' /> : <IoMdEye className='size-6 text-white/80 hover:text-white' />
                  }
                </button>

                <label
                  className='absolute -top-4 xs:-top-3.5 left-6 scale-90 text-white bg-[#080414] px-3 transition-all duration-250 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1.5  xs:peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:scale-90 peer-focus:-top-4 xs:peer-focus:-top-3.5 peer-focus:left-6 peer-focus:text-white pointer-events-none
                '>Password</label>
              </div>


              <div className="relative">
                <input
                  placeholder=""
                  {...register("confirmpass", {
                    required: "Confirm password is required to enter",
                    validate: (value) => value === password || "Password do not match"
                  })}
                  type={confirmeye ? "password" : "text"}
                  className='peer w-full border-1 border-white/80 rounded-lg py-[6px] xs:py-[9px] pl-3 pr-15'
                />

                <button
                  type="button"
                  onClick={handlconfirm} className='absolute right-4.5 top-2.5 cursor-pointer'>
                  {
                    confirmeye ? <IoMdEyeOff className='size-6 text-white/80 hover:text-white' /> : <IoMdEye className='size-6 text-white/80 hover:text-white' />
                  }
                </button>

                <label
                  className='absolute -top-4 xs:-top-3.5 left-6 scale-90 text-white bg-[#080414] px-3 transition-all duration-250 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1.5  xs:peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:scale-90 peer-focus:-top-4 xs:peer-focus:-top-3.5 peer-focus:left-6 peer-focus:text-white pointer-events-none
                  '>confirm Password</label>
              </div>

              <button type="submit" disabled={isSubmitting} className='bg-blue-500 text-lg font-Exo_2 py-1.5 xxs:py-2.5 rounded-xl font-bold cursor-pointer active:scale-95'>Submit</button>

            </form>
          }

        </div>
        <div className="bg-white p-5 rounded-3xl hidden lg:block max-h-[950px] max-w-[900px]">
          <Slider initialSlide={3} />
        </div>

      </div>
    </>
  )
}

export default Singup
