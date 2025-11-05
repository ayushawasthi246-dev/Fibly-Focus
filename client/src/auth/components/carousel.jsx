import { useState } from "react";

export default function Carousel({ children: slides , initialCurr }) {

    const [curr, setcurr] = useState(initialCurr)

    return (
        <div className=" bg-white flex items-start overflow-hidden flex-col gap-10 ">
            <div className="flex justify-baseline items-center transition-all duration-300" style={{ transform: `translateX(-${curr * 100}%)` }} >
                {slides}
            </div>
            <div className="flex justify-center w-full">
            <div className="flex gap-2 z-30 cursor-pointer ">
                {slides.map((s, i) => (
                    <div
                        onClick={() => {
                            setcurr(i)
                        }}
                        key={i}
                        className={`h-3 w-3 rounded-full bg-black ${curr === i ? "w-8" : "w-3"}  transition-all duration-300`}
                    />
                ))}
            </div>
            </div>

        </div>
    );
}
