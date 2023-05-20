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

    const previousSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    const showLeftArrow = current !== 0;
    const showRightArrow = current !== length - 1;
    return (
        <section className={cn("slider")}>
            { showLeftArrow && <FaArrowAltCircleLeft className={cn("arrow")} onClick={previousSlide} /> }
            {slides.map((slide, index) => (
                <div className={cn("slide", { active: index === current })} key={index}>
                    {index === current && <img src={slide} alt="EventImage" className={cn("image")} />}
                </div>
            ))}
            { showRightArrow && <FaArrowAltCircleRight className={cn("arrow")} onClick={nextSlide} /> }
        </section>
    );
};