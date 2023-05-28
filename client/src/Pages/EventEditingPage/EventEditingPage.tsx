import { Navigate, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import {
    Button,
    FileUploaderAttachedFile,
    FileUploaderRef,
    Input,
    Loader,
    Textarea,
    Toast,
    Token,
    TokenInput,
    TokenInputType,
} from "@skbkontur/react-ui";
import _ from "lodash";

import { deleteEventImage, getEvent, updateEvent } from "../../api/events/events";
import { Event, EventDto, Location } from "../../Commons/types/Event";
import { useAuthStore } from "../../stores/userStore/userStore";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import cn from "../EventCreationPage/EventCreationPage.less";
import { MapCoordsPicker } from "../../Commons/components/MapCoordsPicker/MapCoordsPicker";
import { getValidationInfo } from "../EventCreationPage/helpers";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { PhotoUploader } from "../../Commons/components/PhotoUploader";
import { DateTimePicker } from "../../Commons/components/DateTimePicker";
import { ClockAnimation } from "../EventCreationPage/ClockAnimation/ClockAnimation";
import { ImageSlider } from "../EventPage/PhotoSlider/Slider";
import { defaultInputProps } from "../EventCreationPage/EventCreationPage";
import { getTags } from "../../api/tags/tags";

export const EventEditingPage = () => {
    const navigate = useNavigate();
    const { user, isAuth } = useAuthStore();
    const { id = "" } = useParams<"id">();
    const [event, setEvent] = useState<Event>();
    const [loading, setLoading] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event>();
    const [showModal, setShowModal] = useState(false);
    const container = useRef<ValidationContainer>(null);
    const validationInfo =
        currentEvent && getValidationInfo(currentEvent.name, currentEvent.location, currentEvent.dateRange);
    const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
    const [photos, setPhotos] = useState<File[]>([]);
    const fileUploader = useRef<FileUploaderRef>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        loadEvent();
    }, []);

    useEffect(
        () => () => {
            previewPhotos.map(URL.revokeObjectURL);
        },
        []
    );

    if (!isAuth || !user) {
        return <Navigate to="/login" />;
    }
    const onCloseModal = () => {
        setShowModal(false);
    };

    const onFileUploaderClick = () => {
        fileUploader.current?.getRootNode()?.getElementsByTagName("input")[0].click();
    };

    const onUploadFile = async (files: FileUploaderAttachedFile[]): Promise<void> => {
        const photos = _.uniqBy(
            files.filter(file => file.validationResult.isValid).map(file => file.originalFile),
            "name"
        );
        setPhotos(photos);
        const objectsUrls = photos.map(URL.createObjectURL);
        setPreviewPhotos([...(event?.photos ?? []), ...objectsUrls]);
    };

    const onSaveCoordinates = (newLocationCoords: Location | null) => {
        if (newLocationCoords && event) {
            setCurrentEvent({ ...event, location: newLocationCoords });
        }
        setShowModal(false);
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
    const onSaveEvent = async () => {
        const isValid = await container.current?.validate();
        let uploadError = false;
        if (isValid && currentEvent && !error) {
            setLoading(true);
            try {
                const newEventDto: EventDto = {
                    id: currentEvent.id.toString(),
                    name: currentEvent.name,
                    location: currentEvent.location as Location,
                    dateRange: currentEvent.dateRange,
                    tags: currentEvent.tags?.map(x => x.name),
                    description: currentEvent.description,
                    photos,
                };
                setEvent(currentEvent);
                await updateEvent(newEventDto);
            } catch (error) {
                if (error) {
                    uploadError = true;
                }
            } finally {
                setLoading(false);
                if (!uploadError) {
                    Toast.push("Событие успешно создано!");
                }
                fileUploader.current?.reset();
                navigate("/events");
            }
        }
    };

    const onRemoveImage = async (url: string, id: number) => {
        const shift = event?.photos?.length ?? 0;
        setPhotos(photos => photos.filter((_, index) => index !== id - shift));
        setPreviewPhotos(photos => photos.filter((_, index) => index !== id));
        if (event?.id && !url.includes("blob")) {
            await deleteEventImage(url, event?.id);
        }
    };

    console.log(validationInfo);
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl="/events" />
                <h1 className={cn("header")}>Редактирование события</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <Loader active={loading}>
                    {showModal && <MapCoordsPicker onSaveCoordinates={onSaveCoordinates} onCloseModal={onCloseModal} />}
                    <ValidationContainer ref={container}>
                        {currentEvent && (
                            <RowStack className={cn("row-stack")}>
                                <ColumnStack className={cn("content-wrapper")}>
                                    <ColumnStack className={cn("stack")}>
                                        <span className={cn("title")}>Название события</span>
                                        <ValidationWrapper validationInfo={validationInfo?.name}>
                                            <Input
                                                {...defaultInputProps}
                                                value={currentEvent.name}
                                                onValueChange={name => setCurrentEvent({ ...currentEvent, name })}
                                            />
                                        </ValidationWrapper>
                                    </ColumnStack>
                                    <ColumnStack className={cn("stack")}>
                                        <span className={cn("title")}>Описание</span>
                                        <Textarea
                                            {...defaultInputProps}
                                            autoResize
                                            maxLength={500}
                                            value={currentEvent.description}
                                            onValueChange={description =>
                                                setCurrentEvent({
                                                    ...currentEvent,
                                                    description,
                                                })
                                            }
                                            lengthCounter={currentEvent.description?.length}
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
                                            <ValidationWrapper validationInfo={validationInfo?.location}>
                                                <Input
                                                    {...defaultInputProps}
                                                    disabled
                                                    value={`${currentEvent.location?.longitude}, ${currentEvent.location?.latitude}`}
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
                                            <ValidationWrapper validationInfo={validationInfo?.dateRangeLeft}>
                                                <DateTimePicker
                                                    size="medium"
                                                    defaultTime=""
                                                    width="fit-content"
                                                    onChange={value => {
                                                        if (value) {
                                                            setCurrentEvent({
                                                                ...currentEvent,
                                                                dateRange: {
                                                                    startDate: value,
                                                                    endDate: currentEvent?.dateRange.endDate,
                                                                },
                                                            });
                                                        }
                                                    }}
                                                    value={currentEvent.dateRange?.startDate}
                                                />
                                            </ValidationWrapper>
                                        </ColumnStack>
                                        <ClockAnimation />
                                        <ColumnStack>
                                            <span className={cn("title")}>Конец</span>
                                            <ValidationWrapper validationInfo={validationInfo?.dateRangeRight}>
                                                <DateTimePicker
                                                    disabled={!currentEvent.dateRange?.startDate}
                                                    defaultTime=""
                                                    size="medium"
                                                    width="fit-content"
                                                    value={
                                                        currentEvent.dateRange?.endDate
                                                            ? new Date(currentEvent.dateRange?.endDate)
                                                            : undefined
                                                    }
                                                    onChange={value => {
                                                        if (currentEvent.dateRange?.startDate) {
                                                            setCurrentEvent({
                                                                ...currentEvent,
                                                                dateRange: {
                                                                    startDate: currentEvent.dateRange.startDate,
                                                                    endDate: value ?? undefined,
                                                                },
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
                                            getItems={getTagsNames}
                                            menuAlign="left"
                                            menuWidth={currentEvent.tags?.length === 10 ? "0px" : undefined}
                                            selectedItems={currentEvent.tags?.map(x => x.name)}
                                            onValueChange={value =>
                                                currentEvent.tags &&
                                                (currentEvent.tags?.length < 10 || value.length < 10) &&
                                                setCurrentEvent({
                                                    ...currentEvent,
                                                    tags: value.map(x => ({ name: x })),
                                                })
                                            }
                                            renderToken={(item, tokenProps) => (
                                                <Token key={item} {...tokenProps}>
                                                    {item}
                                                </Token>
                                            )}
                                        />
                                        <RowStack className={cn("footer")}>
                                            <Button use="primary" size="medium" onClick={onSaveEvent}>
                                                Сохранить
                                            </Button>
                                            <Button
                                                size="medium"
                                                onClick={() => event && setCurrentEvent({ ...event })}
                                            >
                                                Отменить
                                            </Button>
                                        </RowStack>
                                    </ColumnStack>
                                </ColumnStack>
                                <ColumnStack className={cn("preview-photos")}>
                                    {previewPhotos.length > 0 && (
                                        <ImageSlider
                                            slides={previewPhotos}
                                            className={cn("image-slider")}
                                            onRemoveImage={onRemoveImage}
                                        />
                                    )}
                                </ColumnStack>
                            </RowStack>
                        )}
                    </ValidationContainer>
                </Loader>
            </CommonLayout.Content>
        </CommonLayout>
    );

    async function loadEvent() {
        const currentId = Number(id);
        setLoading(true);
        try {
            if (!isNaN(currentId)) {
                const serverEvent = await getEvent(currentId);
                if (serverEvent) {
                    setCurrentEvent(serverEvent);
                    setPreviewPhotos(serverEvent.photos ?? []);
                    setEvent(serverEvent);
                }
            }
        } finally {
            setLoading(false);
        }
    }
};
