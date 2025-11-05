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

  const { BackendURL } = useContext(Appcontent)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm();

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
  }, [])

  const password = watch("Password")

  const onSubmit = async (data) => {
    const { confirmpass, ...cleanData } = data;

    try {
      const response = await axios.post(BackendURL + '/auth/register', cleanData, { withCredentials: true })

      if (response.data?.success) {
        navigate("/verifyemail")
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const onerror = (errors) => {

    const fieldOrder = ["Username", "Email", "Password", "confirmpass"]

    fieldOrder.forEach((filed, i) => {
      if (errors[filed]?.message) {
        setTimeout(() => {
          toast.error(errors[filed].message)
        }, i * 500);
      }
    })
  }

  const [passeye, setpasseye] = useState(true)
  const [confirmeye, setconfirmseteye] = useState(true)

  const handlepass = () => {
    setpasseye(!passeye)
  }
  const handlconfirm = () => {
    setconfirmseteye(!confirmeye)
  }

  return (
    <>
      <div className="grid lg:grid-cols-[44%_48%] xl:grid-cols-[45%_45%] max-w-screen h-screen p-15 bg-[#080414] text-white gap-20 xl:gap-30 relative ">

        <form onSubmit={handleSubmit(onSubmit, onerror)} className="flex flex-col items-center ">

          <div onClick={() => { navigate("/") }} className=' absolute top-0 left-0 py-3 sm:py-10 px-8 xl:px-15  text-2xl sm:text-3xl xl:text-4xl cursor-pointer '>
            <span className="font-bold text-[#FAD156] font-roboto">Fibly</span>
            <span className="font-bold text-white">Focus</span>
          </div>

          <div className="flex flex-col justify-center h-full gap-5 xsm:w-sm sm:w-md lg:w-full xl:pl-20 pt-10 xxs:pt-0">

            <div className="flex flex-col gap-3 text-center lg:text-start">
              <p className="text-2xl xxs:text-3xl xsm:text-4xl font-bold font-Exo_2">Sign Up</p>
              <span className="text-[10px] xxs:text-[11px] xs:text-xs sm:text-base lg:text-sm xl:text-base">Create your account and take the first step toward better focus.</span>
            </div>

            <div className="flex flex-col gap-5 ">

              <div className="relative">
                <input
                  {...register("Username", {
                    required: "Username is required", minLength: {
                      value: 2,
                      message: "Username must be at least 2 characters"
                    }
                  })}
                  placeholder=""
                  type="text"
                  className='peer w-full border-1 border-white/80 rounded-lg py-[6px] xs:py-[9px] px-3'
                />
                <label
                  className='absolute -top-4 xs:-top-3.5 left-6 scale-90 text-white bg-[#080414] px-3 transition-all duration-250 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1.5  xs:peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:scale-90 peer-focus:-top-4 xs:peer-focus:-top-3.5 peer-focus:left-6 peer-focus:text-white pointer-events-none
              '>Username</label>
              </div>

              <div className="relative">
                <input
                  placeholder=""
                  {...register("Email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                      message: "Enter the valid Gmail"
                    }
                  })}
                  type="text"
                  className='peer w-full border-1 border-white/80 rounded-lg py-[6px] xs:py-[9px] px-3'
                />
                <label
                  className='absolute -top-4 xs:-top-3.5 left-6 scale-90 text-white bg-[#080414] px-3 transition-all duration-250 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1.5  xs:peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:scale-90 peer-focus:-top-4 xs:peer-focus:-top-3.5 peer-focus:left-6 peer-focus:text-white pointer-events-none
              '>Email</label>
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
            </div>

            <button className='bg-blue-500 text-lg font-Exo_2 py-1.5 xxs:py-2.5 rounded-xl font-bold cursor-pointer active:scale-95' type="submit" disabled={isSubmitting}>
              Sign up
            </button>
            <div className="text-sm xs:text-base">
              <span className="">Already have an account ? </span>
              <a onClick={() => navigate('/login')} className="text-[#FAD156] cursor-pointer hover:text-yellow-300 ">Login</a>
            </div>
          </div>
        </form>

        <div className="bg-white p-5 rounded-3xl hidden lg:block">
          <Slider initialSlide={0} />
        </div>

      </div>
    </>
  )
}

export default Singup
