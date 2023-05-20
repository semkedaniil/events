import React from "react";
import cn from "./ClockAnimation.less";

export const ClockAnimation = () => {
    return (
        <div className={cn("clock")}>
            <hr />
            <div className={cn("hours")} />
            <div className={cn("minutes")} />
        </div>
    );
};