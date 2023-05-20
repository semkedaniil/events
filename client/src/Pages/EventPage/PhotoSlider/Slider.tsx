import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

import cn from "./Slider.less";

interface ImageSliderProps {
    slides: string[];
    className?: string;
}

export const ImageSlider = ({ slides, className }: ImageSliderProps): JSX.Element | null => {
    const [current, setCurrent] = useState(0);
    const length = slides.length;

    const keypressHandler = (event: KeyboardEvent) => {
        if (event.code === "ArrowLeft") {
            previousSlide();
        }
        if (event.code === "ArrowRight") {
            nextSlide();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", keypressHandler, false);
        return () => {
            window.removeEventListener("keydown", keypressHandler);
        };
    });

    const nextSlide = () => {
        setCurrent(current === length - 1 ? current : current + 1);
    };

    const previousSlide = () => {
        setCurrent(current === 0 ? current : current - 1);
    };

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    const showLeftArrow = current !== 0;
    const showRightArrow = current !== length - 1;
    return (
        <section className={cn("slider", className)}>
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