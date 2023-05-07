import { useCallback, useState, useEffect, SetStateAction, useRef } from "react";
import { useMap } from "react-map-gl";
import { Button, DatePicker, Input, RadioGroup, Token, TokenInput, TokenInputType } from "@skbkontur/react-ui";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";

import RightIcon from "../../../assets/arrow_right.svg";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { CommonLayout } from "../../../ui/components/CommonLayout/CommonLayout";

import cn from "./Controls.less";

const inputWidth = 270;
const maxInputLength = 100;

const enum EventType {
    LOCAL = "Локальный",
    GLOBAL = "Глобальный",
}

const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;

const parseDate = (date: string) => new Date(date.replace(pattern, "$3-$2-$1"));

export const Controls = (): JSX.Element => {
    const { eventMap } = useMap();
    const [coords, setCoords] = useState("");
    const [name, setName] = useState("");
    const [participantsCount, setParticipantsCount] = useState<Nullable<number>>(null);
    const [tags, setTags] = useState([]);
    const [creatorName, setCreatorName] = useState("");
    const [type, setType] = useState<EventType>(EventType.LOCAL);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const container = useRef<ValidationContainer | null>(null);
    const controlsRef = useRef<HTMLDivElement>(null);

    const [hasError, setHasError] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect((): undefined | (() => void) => {
        if (!eventMap) {
            return undefined;
        }

        const onMove = (): void => {
            const { lng, lat } = eventMap.getCenter();
            setCoords(`${lng.toFixed(6)}, ${lat.toFixed(6)}`);
            setHasError(false);
        };
        eventMap.on("move", onMove);
        onMove();

        return (): void => {
            eventMap.off("move", onMove);
        };
    }, [eventMap]);

    const onChangeCoords = useCallback((event: { target: { value: SetStateAction<string> } }): void => {
        setCoords(event.target.value);
    }, []);

    const onSubmit = useCallback((): void => {
        const isValid = container.current?.validate();
        if (!isValid) {
            return;
        }
        const [lng, lat] = coords.split(",").map(Number);
        if (Math.abs(lng) <= 180 && Math.abs(lat) <= 85 && eventMap) {
            eventMap.easeTo({
                center: [lng, lat],
                duration: 1000,
            });
        } else {
            setHasError(true);
        }
    }, [eventMap, coords]);

    const onClickSwitchButton = (): void => {
        setIsClosed(!isClosed);
    };
    const validationInfo: ValidationInfo | null =
        (from && to && parseDate(from).getTime() - parseDate(to).getTime()) > 0
            ? {
                  message: "Введите корректный промежуток времени",
                  type: "submit",
              }
            : null;
    const numberRegexp = /^\d+$/;
    const menuWidth = controlsRef.current?.clientWidth;
    return (
        <ValidationContainer ref={container}>
            {menuWidth && (
                <div
                    style={{
                        left: isClosed ? 0 : menuWidth - 18,
                    }}
                    className={cn("switch-button", { closed: !isClosed })}
                    onClick={onClickSwitchButton}>
                    <img src={RightIcon} alt="switch-button" />
                </div>
            )}
            <div
                className={cn("map-controls", { closed: isClosed })}
                style={{
                    left:
                        isClosed && controlsRef.current?.clientWidth ? -controlsRef.current.clientWidth - 5 : undefined,
                }}
                ref={controlsRef}>
                <CommonLayout.Header className={cn("map-control-header")}>
                    <h2>Фильтрация событий</h2>
                </CommonLayout.Header>
                <RowStack>
                    <span className={cn("caption")}>Центр</span>
                    <Input
                        maxLength={maxInputLength}
                        width={inputWidth}
                        title="Поиск"
                        type="text"
                        value={coords}
                        onChange={onChangeCoords}
                        style={{ color: hasError ? "red" : "black" }}
                    />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Название</span>
                    <Input
                        maxLength={maxInputLength}
                        width={inputWidth}
                        title="Поиск"
                        type="text"
                        value={name}
                        onValueChange={setName}
                        style={{ color: hasError ? "red" : "black" }}
                    />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Создатель</span>
                    <Input
                        maxLength={maxInputLength}
                        width={inputWidth}
                        title="Поиск"
                        type="text"
                        value={creatorName}
                        onValueChange={setCreatorName}
                        style={{ color: hasError ? "red" : "black" }}
                    />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Количество участников</span>
                    <Input
                        maxLength={10}
                        width={inputWidth}
                        onValueChange={value => {
                            if (value === "") {
                                setParticipantsCount(null);
                            }
                            if (numberRegexp.test(value)) {
                                setParticipantsCount(Number(value));
                            }
                        }}
                        value={participantsCount?.toString() ?? ""}
                    />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Даты</span>с
                    <ValidationWrapper validationInfo={validationInfo}>
                        <DatePicker width={110} value={from} onValueChange={setFrom} enableTodayLink />
                    </ValidationWrapper>
                    по
                    <DatePicker menuAlign="right" width={110} value={to} onValueChange={setTo} enableTodayLink />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Тип события</span>
                    <RadioGroup
                        value={type}
                        onValueChange={setType}
                        width={inputWidth}
                        inline
                        name="number-simple"
                        items={[EventType.LOCAL, EventType.GLOBAL]}
                    />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Теги</span>
                    <TokenInput
                        width={inputWidth}
                        style={{ maxHeight: 200, overflow: "auto" }}
                        type={TokenInputType.Combined}
                        getItems={q =>
                            Promise.resolve(
                                [
                                    "First",
                                    "Second",
                                    "asdasdsad",
                                    "Fourth",
                                    "Fifth",
                                    "Sixth",
                                    "First1",
                                    "Second1",
                                    "Third1",
                                    "Fourth1",
                                    "Fifth1",
                                    "Sixth1",
                                    "First2",
                                    "Second2",
                                    "Third2",
                                    "Fourth2",
                                    "Fifth2",
                                    "Sixth2",
                                ].filter(
                                    x => x.toLowerCase().includes(q.toLowerCase()) || x.toString() === q
                                ) as never[]
                            )
                        }
                        menuAlign="left"
                        menuWidth={tags.length === 10 ? "0px" : undefined}
                        selectedItems={tags}
                        onValueChange={value => (tags.length < 10 || value.length < 10) && setTags(value)}
                        renderToken={(item, tokenProps) => (
                            <Token key={item} {...tokenProps}>
                                {item}
                            </Token>
                        )}
                    />
                </RowStack>
                <Button use="primary" title="Искать" onClick={onSubmit}>
                    Отфильтровать
                </Button>
                <CommonLayout.Header className={cn("map-control-header")}>
                    <h2>Отфильтрованные события</h2>
                </CommonLayout.Header>
                <div className={cn("events")}>
                    {Array.from({ length: 5 }, (x, index) => (
                        <div key={index} className={cn("event")}>
                            Здесь должна быть карточка события
                        </div>
                    ))}
                </div>
            </div>
        </ValidationContainer>
    );
};
