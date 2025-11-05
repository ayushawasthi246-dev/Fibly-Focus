import React from 'react';
import Carousel from '../components/carousel.jsx';
import assets from '../../assets/assets.jsx';

const slides = [
  assets.singup,
  assets.verify,
  assets.login,
  assets.reset_pass,
];

const Slider = ({initialSlide}) => {
  return (
    <div className="h-full flex justify-center items-center px-2 ">
      <Carousel initialCurr={initialSlide} >
        {slides.map((s , i) => (
          <img className={`object-contain drop-shadow-[0_0px_15px_rgba(0,0,0,0.5)] ${i==1||i==3 ? "p-10" : ""} ${i==0||i==2 ? "p-4" : ""}`} key={i} src={s} alt="nothing" />
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
