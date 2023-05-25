import { useCallback, useState, useEffect, SetStateAction, useRef, memo } from "react";
import { useMap } from "react-map-gl";
import { Button, DatePicker, Input, RadioGroup, Token, TokenInput, TokenInputType } from "@skbkontur/react-ui";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";
import _ from "lodash";
import { parse } from "date-fns";

import RightIcon from "../../../assets/arrow_right.svg";
import { RowStack } from "../../../ui/components/RowStack/RowStack";
import { CommonLayout } from "../../../ui/components/CommonLayout/CommonLayout";
import { EventType, Event } from "../../../Commons/types/Event";
import { isNightNow } from "../MapBox/MapBox";
import { getTags } from "../../../api/tags/tags";
import { useEventsStore } from "../../../stores/eventsStore/eventsStore";
import { EventList } from "../../../Commons/components/EventCard/EventCard";

import cn from "./Controls.less";

const inputWidth = 270;
const maxInputLength = 100;

const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;

const parseDate = (date: string) => new Date(date.replace(pattern, "$3-$2-$1"));

export const Controls = (): JSX.Element => {
    const { eventMap } = useMap();
    const { events } = useEventsStore();
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
    const isNight = isNightNow();
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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

    const onSubmit = (): void => {
        const isValid = container.current?.validate();
        if (!isValid) {
            return;
        }

        const startDate = from !== "" && parse(from, "dd.MM.yyyy", new Date());
        const endDate = to !== "" && new Date(to);
        const filteredEvents: Event[] = events
            .filter(event => (name?.trim() == null ? true : event.name.toLowerCase().includes(name.toLowerCase())))
            .filter(event =>
                creatorName.trim() ? event.creator?.toLowerCase()?.includes(creatorName.toLowerCase()) : true
            )
            .filter(event => (startDate ? new Date(event.dateRange.startDate) >= startDate : true))
            .filter(event => (endDate && event.dateRange.endDate ? new Date(event.dateRange.endDate) <= endDate : true))
            .filter(event => (tags && event.tags ? _.difference(tags, event.tags).length === 0 : true));
        setFilteredEvents(filteredEvents);
        const [lng, lat] = coords.split(",").map(Number);
        if (Math.abs(lng) <= 180 && Math.abs(lat) <= 85 && eventMap) {
            eventMap.easeTo({
                center: [lng, lat],
                duration: 1000,
            });
        } else {
            setHasError(true);
        }
    };

    const onClickSwitchButton = (): void => {
        setIsClosed(!isClosed);
    };

    const getTagsNames = (q: string) =>
        getTags().then(
            tags =>
                tags
                    .map(tag => tag.name)
                    .filter(
                        tagName => tagName.toLowerCase().includes(q.toLowerCase()) || tagName.toString() === q
                    ) as never[]
        );
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
                className={cn("map-controls", { closed: isClosed, light: isNight })}
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
                <RowStack align="center">
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
                        items={[
                            [
                                EventType.LOCAL,
                                <span key={EventType.LOCAL} className={cn({ type: isNight })}>
                                    {EventType.LOCAL}
                                </span>,
                            ],
                            [
                                EventType.GLOBAL,
                                <span key={EventType.GLOBAL} className={cn({ type: isNight })}>
                                    {EventType.GLOBAL}
                                </span>,
                            ],
                        ]}
                    />
                </RowStack>
                <RowStack>
                    <span className={cn("caption")}>Теги</span>
                    <TokenInput
                        width={inputWidth}
                        style={{ maxHeight: 200, overflow: "auto" }}
                        type={TokenInputType.Combined}
                        getItems={getTagsNames}
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
                <Button use={isNight ? "default" : "primary"} title="Искать" onClick={onSubmit}>
                    Отфильтровать
                </Button>
                {filteredEvents.length > 0 && (
                    <>
                        <CommonLayout.Header className={cn("map-control-header")}>
                            <h2>Отфильтрованные события</h2>
                        </CommonLayout.Header>
                        <EventList events={filteredEvents} className={cn("filtered-events")} />
                    </>
                )}
            </div>
        </ValidationContainer>
    );
};
