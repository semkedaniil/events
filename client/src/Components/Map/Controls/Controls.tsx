import { useCallback, useState, useEffect, SetStateAction } from "react";
import { useMap } from "react-map-gl";
import { Button, Input } from "@skbkontur/react-ui";

import RightIcon from "../../../assets/arrow_right.svg";

import cn from "./Controls.less";

export const Controls = (): JSX.Element => {
    const { eventMap } = useMap();
    const [inputValue, setInputValue] = useState("");
    const [hasError, setHasError] = useState(false);
    const [isClosed, setIsClosed] = useState(true);

    useEffect((): undefined | (() => void) => {
        if (!eventMap) {
            return undefined;
        }

        const onMove = (): void => {
            const { lng, lat } = eventMap.getCenter();
            setInputValue(`${lng.toFixed(3)}, ${lat.toFixed(3)}`);
            setHasError(false);
        };
        eventMap.on("move", onMove);
        onMove();

        return (): void => {
            eventMap.off("move", onMove);
        };
    }, [eventMap]);

    const onChange = useCallback((event: { target: { value: SetStateAction<string> } }): void => {
        setInputValue(event.target.value);
    }, []);

    const onSubmit = useCallback((): void => {
        const [lng, lat] = inputValue.split(",").map(Number);
        if (Math.abs(lng) <= 180 && Math.abs(lat) <= 85 && eventMap) {
            eventMap.easeTo({
                center: [lng, lat],
                duration: 1000,
            });
        } else {
            setHasError(true);
        }
    }, [eventMap, inputValue]);

    const onClickSwitchButton = (): void => {
        setIsClosed(!isClosed);
    };

    return (
        <div className={cn("map-controls", { closed: isClosed })}>
            <span className={cn("caption")}>Центр</span>
            <Input
                title="Поиск"
                type="text"
                value={inputValue}
                onChange={onChange}
                style={{ color: hasError ? "red" : "black" }}
            />
            <Button title="Искать" onClick={onSubmit}>
                Искать
            </Button>
            <div className={cn("switch-button", { closed: !isClosed })} onClick={onClickSwitchButton}>
                <img src={RightIcon} alt="switch-button" />
            </div>
        </div>
    );
};
