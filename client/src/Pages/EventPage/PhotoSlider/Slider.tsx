import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle, BsTrash3 } from "react-icons/bs";

import cn from "./Slider.less";

interface ImageSliderProps {
    slides: string[];
    className?: string;
    onRemoveImage?: (id: number) => void;
    readonly?: boolean;
}

export const ImageSlider = ({ slides, className, onRemoveImage, readonly }: ImageSliderProps): JSX.Element | null => {
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
            <BsArrowLeftCircle className={cn("arrow", { show: showLeftArrow })} onClick={previousSlide} />
            {slides.map((slide, index) => (
                <div className={cn("slide", { active: index === current })} key={index}>
                    {index === current && (
                        <div className={cn("active-element")}>
                            {!readonly && onRemoveImage && (
                                <div className={cn("trash")} onClick={() => onRemoveImage(current)}>
                                    <BsTrash3 size={32} />
                                </div>
                            )}
                            <img src={slide} alt="EventImage" className={cn("image")} />
                        </div>
                    )}
                </div>
            ))}
            <BsArrowRightCircle className={cn("arrow", { show: showRightArrow })} onClick={nextSlide} />
        </section>
    );
};