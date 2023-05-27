import React, { useEffect, useRef, useState } from "react";
import { ValidationWrapper, ValidationContainer } from "@skbkontur/react-ui-validations";
import _ from "lodash";
import {
    Button,
    FileUploaderAttachedFile,
    FileUploaderRef,
    Input,
    InputSize,
    Loader,
    Textarea,
    Toast,
    Token,
    TokenInput,
    TokenInputType,
} from "@skbkontur/react-ui";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { DateRange, Location, EventDto } from "../../Commons/types/Event";
import { useAuthStore } from "../../stores/userStore/userStore";
import { DateTimePicker } from "../../Commons/components/DateTimePicker";
import { PhotoUploader } from "../../Commons/components/PhotoUploader";
import { ImageSlider } from "../EventPage/PhotoSlider/Slider";
import { createEvent } from "../../api/events/events";
import { getTags } from "../../api/tags/tags";
import { MapCoordsPicker } from "../../Commons/components/MapCoordsPicker/MapCoordsPicker";

import { ClockAnimation } from "./ClockAnimation/ClockAnimation";
import { getLocationOrDefault, getValidationInfo } from "./helpers";
import cn from "./EventCreationPage.less";

const maxWidth = 450;
const maxLength = 100;
export const defaultInputProps = {
    size: "medium" as InputSize,
    maxLength,
    width: maxWidth,
};

export const EventCreationPage = () => {
    const { isAuth } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [dateRange, setDateRange] = useState<DateRange<Date> | null>(null);
    const container = useRef<ValidationContainer>(null);
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [photos, setPhotos] = useState<File[]>([]);
    const [location, setLocation] = useState<DeepNullable<Location>>({
        latitude: getLocationOrDefault(searchParams.get("lat")),
        longitude: getLocationOrDefault(searchParams.get("lng")),
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

    const onCloseModal = () => {
        setShowModal(false);
    };

    const onFileUploaderClick = () => {
        fileUploader.current?.getRootNode()?.getElementsByTagName("input")[0].click();
    };

    const onSaveCoordinates = (newLocationCoords: Location | null) => {
        if (newLocationCoords) {
            setLocation(newLocationCoords);
        }
        setShowModal(false);
    };

    const onUploadFile = async (files: FileUploaderAttachedFile[]): Promise<void> => {
        const photos = files.filter(file => file.validationResult.isValid).map(file => file.originalFile);
        setPhotos(_.uniqBy(photos, "name"));
    };

    const onCreateEvent = async () => {
        const isValid = container.current?.validate();
        if (isValid && location && location.longitude && location.latitude && dateRange && !error) {
            setLoading(true);
            let error = false;
            try {
                const newEvent: EventDto = {
                    name,
                    location: location as Location,
                    dateRange,
                    tags,
                    description,
                    photos,
                };
                await createEvent(newEvent);
            } catch (error_) {
                if (error_) {
                    error = true;
                }
            } finally {
                setLoading(false);
                if (!error) {
                    Toast.push("Событие успешно создано!");
                }
                navigate("..");
            }
        }
    };

    const onRemoveImage = (url: string, id: number) => {
        setPhotos(photos => photos.filter((_, index) => index !== id));
        setPreviewPhotos(photos => photos.filter((_, index) => index !== id));
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

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Создание события</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <Loader active={loading}>
                    {showModal && <MapCoordsPicker onSaveCoordinates={onSaveCoordinates} onCloseModal={onCloseModal} />}
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
                                                value={`${location?.longitude}, ${location?.latitude}`}
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
                                                        setDateRange(previousState => ({
                                                            ...previousState,
                                                            startDate: value,
                                                        }));
                                                    }
                                                }}
                                                value={
                                                    (dateRange?.startDate && new Date(dateRange.startDate)) ?? undefined
                                                }
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
                                                value={(dateRange?.endDate && new Date(dateRange.endDate)) ?? undefined}
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
                                        getItems={getTagsNames}
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
                                    <RowStack className={cn("footer")}>
                                        <Button use="primary" size="medium" onClick={onCreateEvent}>
                                            Создать
                                        </Button>
                                        <Button size="medium" onClick={() => navigate("..")}>
                                            Закрыть
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
                    </ValidationContainer>
                </Loader>
            </CommonLayout.Content>
        </CommonLayout>
    );
};