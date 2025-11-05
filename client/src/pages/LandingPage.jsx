import { useRef, useEffect, useState, useContext } from "react";
import Navbar from '../components/navbar.jsx';
import { motion, useTransform, AnimatePresence, useScroll } from "framer-motion";
import assets from "../assets/assets.jsx";
import { useNavigate } from "react-router-dom"
import { FaLinkedin } from "react-icons/fa"
import { FaGithubAlt } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { TiDownload } from "react-icons/ti";
import axios from "axios";
import { Appcontent } from "../context/Appcontext.jsx";
import { toast } from "react-toastify";

export default function LandingPage() {

  const navigate = useNavigate()

    const { BackendURL} = useContext(Appcontent)

  const words = ["Professionals", "Creators", "Students", "Teams", "Everyone"]
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  const [filp, setfilp] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.onChange((y) => {
      if (y > 300 && !filp) setfilp(true)
      else if (y <= 5 && filp) setfilp(false)
    });
    return () => unsubscribe();
  }, [scrollY, filp])

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

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const containerRef = useRef(null);

  const [start, setStart] = useState({ x: 0, y: 0 });
  const [end, setEnd] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "0.90 1"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [start.x, end.x]);
  const y = useTransform(scrollYProgress, [0, 1], [start.y, end.y + 0]);

  const [isLG, setIsLG] = useState(window.innerWidth >= 1024);
  const [isSM, setIsSM] = useState(window.innerWidth >= 640);

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateScreenHeight = () => setScreenHeight(window.innerHeight);
    window.addEventListener("resize", updateScreenHeight);
    return () => window.removeEventListener("resize", updateScreenHeight);
  }, []);

  const scale = useTransform(scrollY, [0, 400], [1, 1.25]);

  useEffect(() => {
    const handleResize = () => {
      setIsLG(window.innerWidth >= 1024)
      setIsSM(window.innerWidth >= 640)
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function updatePositions() {
      const b1 = box1Ref.current?.getBoundingClientRect();
      const b2 = box2Ref.current?.getBoundingClientRect();
      const scrollY = window.scrollY;

      if (b1 && b2) {
        setStart({
          x: b1.left + b1.width / 2,
          y: b1.top + scrollY + b1.height / 2,
        });

        setEnd({
          x: b2.left + b2.width / 2,
          y: b2.top + scrollY + b2.height / 2 - 30,
        });
      }
    }
    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  const motionProps = isLG
    ? {
      initial: { opacity: 0, x: 100 },
      whileInView: { opacity: 1, x: 0 },
    }
    : {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
    };

  const CardleftProps = isSM
    ? {
      initial: { opacity: 0, x: -40, scale: 0.7 },
      whileInView: { opacity: 1, x: 0, scale: 1 },
    }
    : {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
    };

  const CardrightProps = isSM
    ? {
      initial: { opacity: 0, x: 70, scale: 0.7 },
      whileInView: { opacity: 1, x: 0, scale: 1 },
    }
    : {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
    };

  const CardImgProps = isSM
    ? {
      initial: { opacity: 0, y: 100, scale: 0.8 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
    }
    : {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
    };

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="relative w-screen grid grid-rows-[auto_auto] lg:grid-rows-[80vh_auto] ">

        <motion.div
          style={isLG ? {
            x,
            y,
            translateX: "-50%",
            translateY: "-65%",
            scale
          } : {}}
          className="absolute hidden lg:inline z-10 pb-10"
        >
          <img
            style={isLG ? { transform: `scaleX(${filp ? -1 : 1})` } : {}}
            className="h-[600px] w-[600px] lg:h-[380px] object-contain pb-6 drop-shadow-[-5px_-5px_35px_rgba(0,0,0,1)]"
            src={assets.mascot}
            alt="MASCOT"
          />
        </motion.div>

        <div className=" w-full h-fit lg:h-full grid grid-cols-1 grid-rows-[auto_auto] lg:grid-cols-2 lg:grid-rows-1 gap-15 lg:gap-0 py-5 lg:py-0 bg-[#080414]">
          <div className="flex flex-col gap-10 pl-5 pr-5 lg:pl-15 lg:pr-10 h-fit lg:h-full items-center justify-center lg:items-start shrink-1">

            <p className="text-6xl xs:text-6xl xsm:text-7xl sm:text-8xl xxl:text-9xl  font-Bebas_Neue text-center xsm:text-start text-white ">Find Your <br className="hidden xl:inline" />Flow</p>

            <p className="text-center text-xs xsm:text-sm xl:text-base lg:text-start text-white/80">FiblyFocus is your all-in-one productivity platform — with a Pomodoro timer, task board with calendar view, markdown-enabled notes, Focus Mode to block distractions, and a personal productivity buddy. Track your progress with detailed stats and stay organized, focused, and in control — all in one place.</p>


            <button onClick={() => navigate('/singup')} className="relative cursor-pointer bg-white py-2 px-5  sm:py-4 sm:px-12 rounded-lg text-black font-bold font-Lexend overflow-hidden group active:scale-95">
              <span className="absolute inset-0 rounded-lg bg-black/30 transition-all duration-400 -translate-x-[100%] group-hover:translate-x-0"></span>
              <span className="text-sm sm:text-lg font-bold font-Lexend text-black relative">Get Started Free</span>
            </button>

          </div>

          <div className="flex justify-center lg:justify-end items-center flex-none">
            <div ref={box1Ref} className="relative self-center px-8 py-5 lg:pr-10 lg:py-15 xl:px-15 xl:py-10 grid grid-cols-2 w-[450px] h-[350px] xs:h-[380px] sm:w-[650px] sm:h-[600px]" >

              <img
                className="absolute z-10 p-13 xs:p-16 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden object-contain drop-shadow-[-5px_-5px_35px_rgba(0,0,0,1)]"
                src={assets.mascot}
                alt="MASCOT"
              />

              <div className=" absolute h-10 w-10 rounded-full bg-[#080414] left-1/2 top-1/2 -translate-x-7 xl:-translate-x-6 -translate-y-6 "></div>
              <div className=" bg-linear-to-tl from-gray-700 to-gray-300 rounded-3xl mb-4 mr-4"></div>
              <div className=" bg-linear-to-tl from-gray-700 via-gray-700 via-30% to-gray-300 rounded-t-3xl ml-4 "></div>
              <div className=" bg-linear-to-tl from-gray-700 via-gray-700 via-30% to-gray-300 rounded-l-3xl mt-4"></div>
              <div className=" bg-linear-to-tl from-gray-700 via-gray-700 via-80% to-gray-500 rounded-br-3xl "></div>
            </div>
          </div>
        </div>

        <div className=" flex justify-center lg:grid grid-cols-2 bg-[#080414] relative pb-12 lg:py-20">

          <div ref={box2Ref} ></div>
          <motion.div
            {...motionProps}
            viewport={{ amount: 0.1 }}
            transition={{ duration: 0.45 }}

            className="my-10 mx-12 sm:my-14 sm:mx-20 lg:mx-0 lg:pr-20 flex flex-col gap-5 items-center lg:items-start flex-wrap" >

            <div className="text-center lg:text-start" >
              <snap className="text-white font-Bebas_Neue text-xl xs:text-2xl sm:text-5xl xl:text-6xl mr-2 xsm:mr-4">Meet</snap>
              <motion.span
                drag
                dragSnapToOrigin={true}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
                style={{ WebkitTextStroke: '1.3px black' }}
                className="font-Anton font-bold text-2xl xs:text-3xl sm:text-6xl xl:text-7xl uppercase mr-1 xsm:mr-3 text-[#f8c93a] inline-block cursor-grab z-10">
                Fibly</motion.span>
              <snap className="text-white font-Bebas_Neue text-xl xs:text-2xl sm:text-5xl xl:text-6xl">-  Your Focus </snap>
              <snap className="text-white font-Bebas_Neue text-xl xs:text-2xl sm:text-5xl xl:text-6xl">Buddy</snap>
            </div>

            <p className="text-white/80 text-center lg:text-start text-xs xs:text-sm sm:text-base lg:text-lg leading-normal">Say hello to Fibly — your pocket-sized burst of energy for focus and flow.
              With a look that says “you’ve got this” and a heart full of encouragement, Fibly helps you plan your day, organize tasks, and stay on track with distraction-free Pomodoro sessions.
              It’s not just about productivity — Fibly’s your personal cheerleader, celebrating wins and lifting your mood when you need it. With Fibly by your side, focus feels light, motivating, and totally you.</p>
          </motion.div>
        </div>
      </div>





      <div className="bg-[#080414]  w-full items-center pb-20">

        <p className="text-white text-center pb-15 sm:pb-10 lg:pt-20 lg:pb-25 px-15 md:px-30 font-Asap font-bold text-lg xs:text-2xl md:text-3xl lg:text-5xl uppercase">Features that power your productivity</p>

        <div className="flex flex-col gap-20 sm:gap-0 lg:gap-14 items-center">

          <div className="grid grid-rows-[auto_auto] sm:grid-cols-2 sm:grid-rows-1 gap-10 sm:gap-12 md:gap-20 xl:gap-28 border-white/10 rounded-4xl w-[75vw] sm:h-[300px] md:h-[350px] xlg:h-[400px] xl:h-[450px]">
            <motion.div
              {...CardleftProps}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
              className="flex items-center h-fit sm:h-auto">
              <div className="flex flex-col gap-3 md:gap-6 ">
                <p className="text-[#f8c93a] text-sm sm:text-xs md:text-sm lg:text-xl">TO - DO List</p>
                <p className="text-white text-xl sm:text-lg md:text-2xl lg:text-4xl font-bold font-Asap">Take Control of Your <br className="hidden sm:inline" /> Workflow</p>
                <p className="text-white/60 text-sm sm:text-xs md:text-sm lg:text-xl">Whether it’s daily goals, long-term projects, or quick reminders, your task board helps you plan clearly and get things done with confidence.</p>
              </div>
            </motion.div>
            <div className="h-60 sm:h-full w-full flex justify-center">
              <motion.img
                {...CardImgProps}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className=" h-full object-contain" src={assets.to_do} alt="To_DO image" />
            </div>
          </div>

          <div className="grid grid-rows-[auto_auto] sm:grid-cols-2 sm:grid-rows-1 gap-10 sm:gap-12 md:gap-20 xl:gap-28 border-white/10 rounded-4xl w-[75vw] sm:h-[300px] md:h-[350px] xlg:h-[400px] xl:h-[450px]">
            <div className="order-2 sm:order-1 h-60 sm:h-full w-full flex justify-center">
              <motion.img
                {...CardImgProps}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="h-full object-contain" src={assets.promodoro} alt="Promodoro image" />
            </div>
            <motion.div
              {...CardrightProps}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className=" order-1 sm:order-2 flex items-center h-fit sm:h-auto">
              <div className="flex flex-col gap-3 md:gap-6 ">
                <p className="text-[#f8c93a] text-sm sm:text-xs md:text-sm lg:text-xl">Promdoro Timer</p>
                <p className="text-white text-xl sm:text-lg md:text-2xl lg:text-4xl font-bold font-Asap">Work with Rhythm, Pause to Power Up</p>
                <p className="text-white/60 text-sm sm:text-xs md:text-sm lg:text-xl">Use focused 25-minute sessions to dive into deep work, with regular breaks that recharge your mind. Build momentum, avoid burnout, and make every minute count.</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-rows-[auto_auto] sm:grid-cols-2 sm:grid-rows-1 gap-10 sm:gap-12 md:gap-20 xl:gap-28 border-white/10 rounded-4xl w-[75vw] sm:h-[300px] md:h-[350px] xlg:h-[400px] xl:h-[450px]">
            <motion.div
              {...CardleftProps}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center h-fit sm:h-auto">
              <div className="flex flex-col gap-3 md:gap-6  ">
                <p className="text-[#f8c93a] text-sm sm:text-xs md:text-sm lg:text-xl">Calendar Views</p>
                <p className="text-white text-xl sm:text-lg md:text-2xl lg:text-4xl font-bold font-Asap">Calendar with a Clear <br className="hidden sm:inline" />Purpose</p>
                <p className="text-white/60 text-sm sm:text-xs md:text-sm lg:text-xl">Get a full view of your plans with a calendar built for clarity — organize tasks by day, week, or month and move through time with ease.</p>
              </div>
            </motion.div>
            <div className="h-60 sm:h-full w-full flex justify-center">
              <motion.img
                {...CardImgProps}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="max-h-full max-w-full object-contain" src={assets.calender} alt="calender image" />
            </div>
          </div>

          <div className="grid grid-rows-[auto_auto] sm:grid-cols-2 sm:grid-rows-1 gap-10 sm:gap-12 md:gap-20 xl:gap-28 border-white/10 rounded-4xl w-[75vw] sm:h-[300px] md:h-[350px] xlg:h-[400px] xl:h-[450px]">

            <div className="order-2 sm:order-1 h-60 sm:h-full w-full flex justify-center sm:p-5">
              <motion.img
                {...CardImgProps}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className=" max-h-full max-w-full object-contain" src={assets.focus_mode} alt="Focus_mode image" />
            </div>
            <motion.div
              {...CardrightProps}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className=" order-1 sm:order-2 flex items-center h-fit sm:h-auto">
              <div className="flex flex-col gap-3 md:gap-6 ">
                <p className="text-[#f8c93a] text-sm sm:text-xs md:text-sm lg:text-xl">Focus mode</p>
                <p className="text-white text-xl sm:text-lg md:text-2xl lg:text-4xl font-bold font-Asap">Enter Your Flow Zone</p>
                <p className="text-white/60 text-sm sm:text-xs md:text-sm lg:text-xl">Start a personalized focus routine with full-screen lock, guided work-break cycles, and focus-friendly music — everything designed to keep you deep in the zone, distraction-free.</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-rows-[auto_auto] sm:grid-cols-2 sm:grid-rows-1 gap-10 sm:gap-12 md:gap-20 xl:gap-28 border-white/10 rounded-4xl w-[75vw] sm:h-[300px] md:h-[350px] xlg:h-[400px] xl:h-[450px]">
            <motion.div
              {...CardleftProps}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className=" flex items-center h-fit sm:h-auto">
              <div className="flex flex-col gap-3 md:gap-6">
                <p className="text-[#f8c93a] text-sm sm:text-xs md:text-sm lg:text-xl">Smart Notes</p>
                <p className="text-white text-xl sm:text-lg md:text-2xl lg:text-4xl font-bold font-Asap">Notes That Stick With <br className="hidden sm:inline" />Your Tasks</p>
                <p className="text-white/60 text-sm sm:text-xs md:text-sm lg:text-xl">Attach notes directly to tasks for easy context, or create separate standalone notes — so all your ideas and info stay organized and accessible.</p>
              </div>
            </motion.div>
            <div className="h-60 sm:h-full w-full flex justify-center">
              <motion.img
                {...CardImgProps}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="max-h-full max-w-full object-contain" src={assets.notes} alt="Notes image" />
            </div>
          </div>


          <div className="grid grid-rows-[auto_auto] sm:grid-cols-2 sm:grid-rows-1 gap-10 sm:gap-12 md:gap-20 xl:gap-28 border-white/10 rounded-4xl w-[75vw] sm:h-[300px] md:h-[350px] xlg:h-[400px] xl:h-[450px]">
            <div className="order-2 sm:order-1 h-60 sm:h-full w-full flex justify-center sm:p-5">
              <motion.img
                {...CardImgProps}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className=" max-h-full max-w-full object-contain" src={assets.stats} alt="Stats image" />
            </div>
            <motion.div
              {...CardrightProps}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className=" order-1 sm:order-2 flex items-center h-fit sm:h-auto">
              <div className="flex flex-col gap-3 md:gap-6 ">
                <p className="text-[#f8c93a] text-sm sm:text-xs md:text-sm lg:text-xl">Focus Analytics</p>
                <p className="text-white text-xl sm:text-lg md:text-2xl lg:text-4xl font-bold font-Asap">Fuel Your Productivity with Insights</p>
                <p className="text-white/60 text-sm sm:text-xs md:text-sm lg:text-xl">Track your focus sessions, completed tasks, and productivity trends over time with easy-to-understand charts that motivate you to keep going.</p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      <div className="bg-[#ffffff] w-full py-18">

        <p className="grid grid-cols-2 gap-2 lg:gap-4 pr-8 xsm:pr-0">
          <span className="text-black/85 flex justify-end text-3xl sm:text-5xl xl:text-7xl font-Bebas_Neue font-bold ">MADE FOR</span>
          <AnimatePresence mode="wait">
            <motion.span
              className="text-[#080414] text-3xl sm:text-5xl xl:text-7xl font-Bebas_Neue font-bold"
              key={words[index]}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </p>

        <div className="w-full px-10 grid xsm:grid-cols-2 xsm:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-12 pt-10 pb-5">

          <div className="bg-[#080414] flex flex-col gap-3 items-center rounded-2xl border-b-4 border-[#FF8102] pb-10">
            <img className="object-contain h-30 xsm:h-40 lg:h-50 xl:h-60 p-5" src={assets.Professionals} alt="Professionals" />
            <div className="bg-[#FF8102] h-0.5 w-12"></div>
            <p className="text-white font-semibold sm:text-sm xl:text-xl font-Asap">Professionals</p>
            <p className="text-xs w-[85%] text-white/50 text-center">Structure your workday, track progress, and focus without distractions.</p>
          </div>

          <div className="bg-[#080414] flex flex-col gap-3 items-center rounded-2xl border-b-4 border-[#7C06C1] pb-10">
            <img className="object-contain h-30 xsm:h-40 lg:h-50 xl:h-60 px-7 py-4 xl:p-5" src={assets.Creators} alt="Creators" />
            <div className="bg-[#7C06C1] h-0.5 w-12"></div>
            <p className="text-white font-semibold sm:text-sm xl:text-xl font-Asap">Creators</p>
            <p className="text-xs w-[85%] text-white/50 text-center">Organize ideas, plan projects, and stay in the zone while building your next masterpiece.</p>
          </div>

          <div className="bg-[#080414] flex flex-col gap-3 items-center rounded-2xl border-b-4 border-[#FF8102] pb-10">
            <img className="object-contain h-30 xsm:h-40 lg:h-50 xl:h-60 p-5" src={assets.Students} alt="Students" />
            <div className="bg-[#FF8102] h-0.5 w-12"></div>
            <p className="text-white font-semibold sm:text-sm xl:text-xl font-Asap">Students</p>
            <p className="text-xs w-[85%] text-white/50 text-center">Stay focused during lectures, study sessions, and late-night revisions — all in one flow</p>
          </div>

          <div className="bg-[#080414] flex flex-col gap-3 items-center rounded-2xl border-b-4 border-[#7C06C1] pb-10">
            <img className="object-contain h-30 xsm:h-40 lg:h-50 xl:h-60 p-5" src={assets.Teams} alt="Teams" />
            <div className="bg-[#7C06C1] h-0.5 w-12"></div>
            <p className="text-white font-semibold sm:text-sm xl:text-xl font-Asap">Teams</p>
            <p className="text-xs w-[85%] text-white/50 text-center">Collaborate smoothly, share tasks, and stay aligned — wherever you work.</p>
          </div>
        </div>
      </div>


      {/* <div className="bg-[linear-gradient(to_bottom,_white_50%,_#080414_50%)] w-full flex justify-center px-10 pb-5 xsm:py-6">
        <div className="p-1 xsm:p-3 border-2 xsm:border-4 border-dotted border-[#080414]">
          <img className="object-contain" src="/Demo video.jpg" alt="" />
        </div>
      </div> */}

      <div className="w-full bg-[#080414] flex justify-center py-30">
        <div className="text-center flex flex-col gap-5 md:gap-7">
          <p className="">
            <span className="text-white text-2xl xs:text-3xl md:text-5xl font-Josefin_Sans font-bold">Take </span>
            <span className="text-[#e2a522] text-2xl xs:text-3xl md:text-5xl font-Josefin_Sans font-bold">Fibly </span>
            <span className="text-white text-2xl xs:text-3xl md:text-5xl font-Josefin_Sans font-bold">with you </span><br />
          </p>
          <p className=" text-white text-sm xs:text-xl md:text-3xl font-Josefin_Sans font-bold">Use it like an app . No tabs , no distractions.</p>
          <div className="text-black flex justify-center mt-5">

            <button className="relative bg-amber-300 h-13 w-50 pl-5 font-bold font-roboto rounded-2xl flex gap-3 items-center overflow-hidden cursor-pointer group active:scale-95">
              <span className="text-sm xs:text-lg md:text-xl">Install Now</span>
              <span className="absolute right-0 h-full w-15 justify-center bg-[#fcac00] flex items-center group-hover:w-50 transition-all duration-300">
                <TiDownload className="text-3xl" />
              </span>
            </button>

          </div>
        </div>
      </div>

      <div className="moving bg-white/70 w-full flex items-center overflow-hidden px-12 py-1 md:py-2">
        <div className="bg-linear-to-l from-transparent  to-white/70 absolute z-10 left-0 h-6 xs:h-8 md:h-10 lg:h-11 w-[5%]"></div>
        <div className="bg-linear-to-r from-transparent  to-white/70 absolute z-10 right-0 h-6 xs:h-8 md:h-10 lg:h-11 w-[8%]"></div>
        <p
          style={{ wordSpacing: '1rem' }}
          className="animate-marquee pl-[2rem] text-[#080414] text-xs xs:text-base md:text-lg lg:text-2xl font-PT_Sans tracking-widest whitespace-nowrap">
          Focus • Productivity • Task Flow • Deep Work • Clarity • Zero Distractions • Organized Workflow • Creative Focus • Time Blocking •
        </p>
        <p
          style={{ wordSpacing: '1rem' }}
          className="animate-marquee pl-[2rem] text-[#080414] text-xs xs:text-base md:text-lg lg:text-2xl font-PT_Sans tracking-widest whitespace-nowrap">
          Focus • Productivity • Task Flow • Deep Work • Clarity • Zero Distractions • Organized Workflow • Creative Focus • Time Blocking •
        </p>
      </div>





      <footer className="w-full bg-[#080414] py-12 xs:p-20 xl:py-24 xl:px-32 flex flex-col items-center ">

        <div className="grid md:grid-cols-2 w-fit md:w-full gap-13 md:gap-6 ">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <p>
              <span className="text-2xl xs:text-3xl xsm:text-5xl xl:text-7xl font-bold text-[#FAD156] font-roboto">Fibly</span>
              <span className="text-2xl xs:text-3xl xsm:text-5xl xl:text-7xl font-bold text-white">Focus</span>
            </p>
            <p className="text-sm xs:text-base xsm:text-xl xl:text-2xl text-white ">Make every minute count, with Fibly</p>
          </div>

          <div className="flex flex-col text-white gap-10 md:gap-0 md:flex-row md:justify-around xsm:text-xl xl:text-2xl">
            <ul className="space-y-6">
              <li className="flex justify-between" >
                <span>Home</span>
                <span className="md:hidden">{'>'}</span>
              </li>
              <li className="flex justify-between">
                <span>About Us</span>
                <span className="md:hidden">{'>'}</span>
              </li>
              <li className="flex justify-between">
                <span>Features</span>
                <span className="md:hidden">{'>'}</span>
              </li>
              <li className="flex justify-between">
                <span>Get started</span>
                <span className="md:hidden">{'>'}</span>
              </li>
            </ul>
            <div className="h-0.5 w-full bg-white/50 md:hidden"></div>
            <ul className="space-y-6">
              <li className="flex justify-between">
                <span>Journy</span>
                <span className="md:hidden">{'>'}</span>
              </li>
              <li className="flex justify-between">
                <span>portofilo</span>
                <span className="md:hidden">{'>'}</span>
              </li>
            </ul>
            <div className="h-0.5 w-full bg-white/50 md:hidden"></div>
            <ul className="space-y-6 flex justify-around md:flex-col">
              <li><FaLinkedin className="text-2xl lg:text-4xl" /></li>
              <li><FaGithubAlt className="text-2xl lg:text-4xl" /></li>
              <li><RiTwitterXLine className="text-2xl lg:text-4xl" /></li>
            </ul>
          </div>
        </div>
        <div className="xs:w-full w-[80%] h-[1px] bg-white/40 my-12 "></div>
        <p className="w-full text-sm xsm:text-xl xl:text-2xl flex justify-center h-7 text-white/80">@ 2025 ayush awasthi . all rights reserved </p>
      </footer>
    </>
  );
}
