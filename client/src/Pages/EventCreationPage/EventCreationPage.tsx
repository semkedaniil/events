import React, { useEffect, useRef, useState } from "react";
import { ValidationWrapper, ValidationContainer } from "@skbkontur/react-ui-validations";
import _ from "lodash";
import {
    Button,
    DatePicker,
    FileUploaderAttachedFile,
    FileUploaderRef,
    Input,
    InputSize,
    Loader,
    Modal,
    Textarea,
    Toast,
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
import { DateRange, Location, EventDto } from "../../Commons/types/Event";
import { getMapTheme, initialViewState, MAPBOX_TOKEN } from "../Map/MapBox/MapBox";
import GeocoderControl from "../Map/Controls/GeocoderControl";
import { useAuthStore } from "../../stores/userStore/userStore";

import cn from "./EventCreationPage.less";
import { getLocationOrDefault, getValidationInfo } from "./helpers";
import { DateTimePicker } from "../../Commons/components/DateTimePicker";
import { ClockAnimation } from "./ClockAnimation/ClockAnimation";
import { PhotoUploader } from "../../Commons/components/PhotoUploader";
import { updateUserAvatar } from "../../api/userInfo/userInfo";
import { ImageSlider } from "../EventPage/PhotoSlider/Slider";

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
    const [dateRange, setDateRange] = useState<DateRange<Date> | null>(null);
    const container = useRef<ValidationContainer>(null);
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [photos, setPhotos] = useState<File[]>([]);
    const [location, setLocation] = useState<DeepNullable<Location>>({
        lat: getLocationOrDefault(searchParams.get("lat")),
        lng: getLocationOrDefault(searchParams.get("lng")),
    });

    const fileUploader = useRef<FileUploaderRef>(null);
    const validationInfo = getValidationInfo(name, location, dateRange);
    const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);

    useEffect(() => {
        const objectsUrls = photos.map(URL.createObjectURL);
        setPreviewPhotos(objectsUrls);
        return () => {
            previewPhotos.map(URL.revokeObjectURL);
        };
    }, [photos]);

    const onMapClick = ({ lngLat: coordinates }: mapboxgl.MapLayerMouseEvent) => {
        setNewLocationCoords(coordinates);
    };
    const onCloseModal = () => {
        setShowModal(false);
        setNewLocationCoords(null);
    };

    const onFileUploaderClick = () => {
        fileUploader.current?.getRootNode()?.getElementsByTagName("input")[0].click();
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

    const onUploadFile = async (files: FileUploaderAttachedFile[]): Promise<void> => {
        const photos = files.filter(file => file.validationResult.isValid).map(file => file.originalFile);
        setPhotos(_.uniqBy(photos, "name"));
    };

    const onCreateEvent = () => {
        const isValid = container.current?.validate();
        if (isValid && location && location.lng && location.lat && dateRange && !error) {
            const newEvent: EventDto = {
                name,
                location: location as Location,
                dateRange: {
                    startDate: dateRange.startDate.toLocaleString(),
                    endDate: dateRange.endDate?.toLocaleString() ?? undefined,
                },
                creator: user?.username,
                tags,
                description,
                photos,
            };
            console.log(newEvent);
            setLoading(true);
            try {
                // make api request
            } finally {
                setLoading(false);
                // navigate("..");
            }
        }
    };

    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Создание события</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <Loader active={loading}>
                    {showModal && (
                        <Modal onClose={onCloseModal}>
                            <Modal.Header>
                                <b>Выберите новое местоположение</b>
                            </Modal.Header>
                            <Modal.Body>
                                <Map
                                    onClick={onMapClick}
                                    id="eventCreationMap"
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
                                <RowStack>
                                    <Button use="primary" size="medium" onClick={onSaveCoordinates}>
                                        Сохранить
                                    </Button>
                                    <Button use="default" size="medium" onClick={onCloseModal}>
                                        Закрыть
                                    </Button>
                                </RowStack>
                            </Modal.Footer>
                        </Modal>
                    )}
                    <ValidationContainer ref={container}>
                        <RowStack className={cn("row-stack")}>
                            <ColumnStack className={cn("content-wrapper")}>
                                <ColumnStack className={cn("stack")}>
                                    <span className={cn("title")}>Название события</span>
                                    <ValidationWrapper validationInfo={validationInfo.name}>
                                        <Input {...defaultInputProps} value={name} onValueChange={setName} />
                                    </ValidationWrapper>
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
                                        showLengthCounter
                                    />
                                </ColumnStack>
                                <ColumnStack className={cn("stack")}>
                                    <span className={cn("title")}>Фотографии</span>
                                    <Button size="medium" onClick={onFileUploaderClick}>
                                        <span>Добавить фотографии к событию</span>
                                        <PhotoUploader
                                            ref={fileUploader}
                                            onError={() => setError(true)}
                                            onChangeFiles={onUploadFile}
                                        />
                                    </Button>
                                </ColumnStack>
                                <ColumnStack className={cn("stack")}>
                                    <span className={cn("title")}>Координаты события</span>

                                    <RowStack align="center">
                                        <ValidationWrapper validationInfo={validationInfo.location}>
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
                                        </ValidationWrapper>
                                    </RowStack>
                                </ColumnStack>
                                <RowStack className={cn("dates")}>
                                    <ColumnStack>
                                        <span className={cn("title")}>Начало</span>
                                        <ValidationWrapper validationInfo={validationInfo.dateRangeLeft}>
                                            <DateTimePicker
                                                size="medium"
                                                defaultTime=""
                                                width="fit-content"
                                                onChange={value => {
                                                    if (value) {
                                                        setDateRange(prevState => ({
                                                            ...prevState,
                                                            startDate: value,
                                                        }));
                                                    }
                                                }}
                                                value={dateRange?.startDate}
                                            />
                                        </ValidationWrapper>
                                    </ColumnStack>
                                    <ClockAnimation />
                                    <ColumnStack>
                                        <span className={cn("title")}>Конец</span>
                                        <ValidationWrapper validationInfo={validationInfo.dateRangeRight}>
                                            <DateTimePicker
                                                disabled={!dateRange?.startDate}
                                                defaultTime=""
                                                size="medium"
                                                width="fit-content"
                                                value={new Date(dateRange?.startDate ?? "")}
                                                onChange={value => {
                                                    if (dateRange?.startDate) {
                                                        setDateRange({
                                                            startDate: dateRange.startDate,
                                                            endDate: value ?? undefined,
                                                        });
                                                    }
                                                }}
                                            />
                                        </ValidationWrapper>
                                    </ColumnStack>
                                </RowStack>
                                <ColumnStack className={cn("stack")}>
                                    <span className={cn("title")}>Теги</span>
                                    <TokenInput
                                        {...defaultInputProps}
                                        delimiters={[","]}
                                        className={cn("tokens")}
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
                                        onValueChange={value =>
                                            (tags.length < 10 || value.length < 10) && setTags(value)
                                        }
                                        renderToken={(item, tokenProps) => (
                                            <Token key={item} {...tokenProps}>
                                                {item}
                                            </Token>
                                        )}
                                    />
                                </ColumnStack>
                            </ColumnStack>
                            <ColumnStack className={cn("preview-photos")}>
                                {previewPhotos.length !== 0 && (
                                    <ImageSlider slides={previewPhotos} className={cn("image-slider")} />
                                )}
                            </ColumnStack>
                        </RowStack>
                    </ValidationContainer>
                </Loader>
            </CommonLayout.Content>
            <CommonLayout.Footer>
                <RowStack>
                    <Button use="primary" size="medium" onClick={onCreateEvent}>
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