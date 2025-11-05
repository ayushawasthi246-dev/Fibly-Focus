import { useRef } from "react";

const SliderWithTooltip = ({ value, setValue, min, max }) => {
    const sliderRef = useRef(null);

    const getLeft = () => {
        if (!sliderRef.current) return 0;
        const w = sliderRef.current.offsetWidth;
        const offset = 10
        const ratio = (value - min) / (max - min);
        return offset + ratio * (w - 2 * offset);
    };

    return (

        <div className="relative text-white flex flex-col gap-2 px-1">
            <div
                className="relative rounded-sm sm:rounded-lg bg-purple-600 text-[11px] sm:text-xs font-semibold w-8 sm:w-10 py-0.5 sm:py-1 text-center"
                style={{ left: `${getLeft()}px`, transform: 'translateX(-50%)' }}
            >{value}</div>

            <input
                ref={sliderRef}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="accent-purple-600 cursor-pointer my-1 w-full h-1 sm:h-1.5"
            />
            <div className="flex justify-between text-white/70 text-xs -mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default SliderWithTooltip;
