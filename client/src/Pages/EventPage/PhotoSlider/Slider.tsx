import React, { useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import cn from "./Slider.less";

interface ImageSliderProps {
    slides: string[];
}

export const ImageSlider = ({ slides }: ImageSliderProps): JSX.Element | null => {
    const [current, setCurrent] = useState(0);
    const length = slides.length;

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    return (
        <section className={cn("slider")}>
            <FaArrowAltCircleLeft className={cn("left-arrow")} onClick={prevSlide} />
            <FaArrowAltCircleRight className={cn("right-arrow")} onClick={nextSlide} />
            {slides.map((slide, index) => (
                <div className={cn("slide", { active: index === current })} key={index}>
                    {index === current && <img src={slide} alt="EventImage" className={cn("image")} />}
                </div>
            ))}
        </section>
    );
};