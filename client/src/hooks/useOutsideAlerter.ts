import { RefObject, useEffect, useState } from "react";

export function useOutsideAlerter(reference: RefObject<any>): boolean {
    const [clickedOutside, setClickedOutside] = useState(false);
    useEffect((): (() => void) => {
        function handleClickOutside(event: any): void {
            setClickedOutside(reference.current && !reference.current.contains(event.target));
        }

        document.addEventListener("mousedown", handleClickOutside);
        return (): void => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [reference]);

    return clickedOutside;
}
