import React, { useRef, useState } from 'react'
import { createPortal } from "react-dom"

const tooltip = ({ children, text }) => {
    const [show, setshow] = useState(false)
    const [pos, setpos] = useState({ top: 0, left: 0 })
    const ref = useRef(null)

    const handleMouseEnter = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            setpos({
                top: rect.top + rect.height / 2,
                left: 25
            })
        }
        setshow(true)
    }

    return (
        <>
            <span
                ref={ref}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setshow(false)}
                className="inline-block">
                {children}
            </span>
            {show &&
                createPortal(
                    <div
                        style={{ top: pos.top, left: pos.left, transform: "translateY(-50%)" }}
                        className="text-white text-xs absolute top-3 translate-x-16 z-30 bg-[#550888] border-[1px] border-white rounded-xl font-semibold py-1.5 px-3">{text}
                    </div>, document.body
                )
            }
        </>
    )
}

export default tooltip