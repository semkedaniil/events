import React, { useRef, useState } from "react";
import { ValidationWrapper, ValidationContainer } from "@skbkontur/react-ui-validations";
import {
    Button,
    DatePicker,
    Input,
    InputSize,
    Modal,
    Textarea,
    Token,
    TokenInput,
    TokenInputType,
} from "@skbkontur/react-ui";
import { useNavigate, useSearchParams } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import mapboxgl from "mapbox-gl";

import markerPng from "../../assets/marker.png";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import {DateRange, Location, EventDto} from "../../Commons/types/Event";
import { getMapTheme, initialViewState, MAPBOX_TOKEN } from "../Map/MapBox/MapBox";
import GeocoderControl from "../Map/Controls/GeocoderControl";
import {useAuthStore} from "../../stores/userStore/userStore";

import cn from "./EventCreationPage.less";

const maxWidth = 450;
const maxLength = 100;
const defaultInputProps = {
    size: "medium" as InputSize,
    maxLength,
    width: maxWidth,
};
export const EventCreationPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [newLocationCoords, setNewLocationCoords] = useState<Location | null>(null);
    const [tags, setTags] = useState([]);
    const [dateRange, setDateRange] = useState<DateRange | null>(null);
    const container = useRef<ValidationContainer>(null);
    const [name, setName] = useState("");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const [location, setLocation] = useState<DeepNullable<Location>>({
        lat: lat ? (isNaN(Number(lat)) ? null : Number(lat)) : null,
        lng: lng ? (isNaN(Number(lng)) ? null : Number(lng)) : null,
    });

    // const validationInfo = getValidationInfo();
    const onMapClick = ({ lngLat: coordinates }: mapboxgl.MapLayerMouseEvent) => {
        setNewLocationCoords(coordinates);
    };
    const onCloseModal = () => {
        setShowModal(false);
        setNewLocationCoords(null);
    };

    const onMarkerClick = (event: mapboxgl.MapboxEvent<MouseEvent>) => {
        event.originalEvent.stopPropagation();
        setNewLocationCoords(null);
    };

    const onSaveCoordinates = () => {
        if (newLocationCoords) {
            setLocation(newLocationCoords);
        }
        setShowModal(false);
    };

    const onCreateEvent = () => {
        const isValid = container.current?.validate();
        if (isValid) {
            // const newEvent: EventDto = {
            //     name,
            //     location,
            //     dateRange,
            //     creator: user?.username,
            //     tags,
            //     description,
            //     photos,
            // };
            setLoading(true);
            try {
                // make api request
            } finally {
                setLoading(false);
                navigate("..");
            }
        }
    }

    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Создание события</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                {showModal && (
                    <Modal onClose={onCloseModal}>
                        <Modal.Header>
                            <b>Выберите новое местоположение</b>
                        </Modal.Header>
                        <Modal.Body>
                            <Map
                                onClick={onMapClick}
                                id="eventIdMap"
                                initialViewState={initialViewState}
                                projection="globe"
                                style={{ width: "100%", height: "250px", borderRadius: "16px" }}
                                mapStyle={getMapTheme()}
                                mapboxAccessToken={MAPBOX_TOKEN}>
                                <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN || ""} position="top-left" />
                                {newLocationCoords && (
                                    <Marker
                                        onClick={onMarkerClick}
                                        draggable
                                        longitude={newLocationCoords.lng}
                                        latitude={newLocationCoords.lat}
                                        onDragEnd={({ lngLat }) => setNewLocationCoords(lngLat)}>
                                        <img src={markerPng} width={35} height={35} alt="marker" />
                                    </Marker>
                                )}
                            </Map>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button use="primary" onClick={onSaveCoordinates}>
                                Сохранить
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
                <ValidationContainer ref={container}>
                    <ColumnStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}>Название события</span>
                            <Input {...defaultInputProps} value={name} onValueChange={setName} />
                        </ColumnStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}>Описание</span>
                            <Textarea
                                {...defaultInputProps}
                                autoResize
                                maxLength={500}
                                value={description}
                                onValueChange={setDescription}
                                lengthCounter={description.length}
                                showLengthCounter></Textarea>
                        </ColumnStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}>Координаты события</span>

                            <RowStack align="center">
                                <Input
                                    {...defaultInputProps}
                                    disabled
                                    value={`${location?.lng}, ${location?.lat}`}
                                    rightIcon={
                                        <Button use="backless" onClick={() => setShowModal(true)}>
                                            Изменить
                                        </Button>
                                    }
                                />
                            </RowStack>
                        </ColumnStack>
                        <RowStack className={cn("dates")}>
                            <ColumnStack>
                                <span className={cn("title")}>Начало</span>
                                <DatePicker
                                    size="medium"
                                    width="fit-content"
                                    value={dateRange?.startDate}
                                    onValueChange={value =>
                                        setDateRange(previousState => ({
                                            ...previousState,
                                            startDate: value,
                                        }))
                                    }
                                />
                            </ColumnStack>
                            <ColumnStack>
                                <span className={cn("title")}>Конец</span>
                                <DatePicker
                                    disabled={!dateRange?.startDate}
                                    size="medium"
                                    width="fit-content"
                                    value={dateRange?.endDate}
                                    onValueChange={value => {
                                        if (dateRange?.startDate) {
                                            setDateRange({ startDate: dateRange.startDate, endDate: value });
                                        }
                                    }}
                                />
                            </ColumnStack>
                        </RowStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}>Теги</span>
                            <TokenInput
                                {...defaultInputProps}
                                style={{ maxHeight: 200, overflow: "auto" }}
                                type={TokenInputType.Combined}
                                getItems={q =>
                                    // todo: create api method getTags
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
                        </ColumnStack>
                    </ColumnStack>
                </ValidationContainer>
            </CommonLayout.Content>
            <CommonLayout.Footer>
                <RowStack>
                    <Button use="primary" size="medium">
                        Создать
                    </Button>
                    <Button size="medium" onClick={() => navigate("..")}>
                        Закрыть
                    </Button>
                </RowStack>
            </CommonLayout.Footer>
        </CommonLayout>
    );
};