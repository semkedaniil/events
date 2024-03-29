import React, { useRef, useState } from "react";
import {
    Button,
    DatePicker,
    FileUploaderAttachedFile,
    FileUploaderRef,
    Input,
    LangCodes,
    Loader,
    LocaleContext,
    Modal,
    Toast,
} from "@skbkontur/react-ui";
import { TiDeleteOutline } from "react-icons/ti";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { Navigate } from "react-router-dom";

import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { useAuthStore } from "../../stores/userStore/userStore";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { deleteUserAvatar, updateUserAvatar, updateUserInfo } from "../../api/userInfo/userInfo";
import { UserAvatar } from "../../ui/components/UserAvatar/UserAvatar";
import { PhotoUploader } from "../../Commons/components/PhotoUploader";

import cn from "./ProfilePage.less";
import { getValidationInfo } from "./helpers";

const inputWidth = 400;

const maxInputLength = 100;

export const ProfilePage = () => {
    const { user, setToken, isAuth } = useAuthStore();
    const [username, setUsername] = useState<string | undefined>(user?.username);
    const [birthday, setBirthday] = useState(user?.birthday ?? "Birthday");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const container = useRef<ValidationContainer | null>(null);
    const fileUploader = useRef<FileUploaderRef>(null);
    const [showModal, setShowModal] = useState(false);
    const onCancel = () => {
        setUsername(user?.username);
        setBirthday(user?.birthday ?? "BirthDate");
    };
    const validationInfo = getValidationInfo(username, birthday);
    const onSaveCredentials = async () => {
        if (username === user?.username && birthday === user?.birthday) {
            return;
        }
        const isValid = await container.current?.validate();
        if (!isValid || error) {
            return;
        }
        setLoading(true);
        try {
            const token = await updateUserInfo({ username, birthday });
            setToken(token);
        } finally {
            fileUploader.current?.reset();
            setLoading(false);
            setTimeout(() => {
                Toast.push("Изменения успешно сохранены!");
            }, 1000);
        }
    };

    const onUploadFile = async ([file]: FileUploaderAttachedFile[]): Promise<void> => {
        setLoading(true);
        try {
            if (file?.validationResult.isValid || Boolean(file)) {
                const newToken = await updateUserAvatar(file?.originalFile ?? null);
                setToken(newToken);
            }
        } finally {
            setLoading(false);
            setTimeout(() => {
                Toast.push("Изменения успешно сохранены!");
            }, 1000);
        }
    };

    const onFileUploaderClick = () => {
        fileUploader.current?.getRootNode()?.getElementsByTagName("input")[0].click();
    };

    const onShowModal = () => {
        setShowModal(true);
    };

    const onHideModal = () => {
        setShowModal(false);
    };

    const onDeleteAvatar = async () => {
        setShowModal(false);
        const token = await deleteUserAvatar();
        fileUploader.current?.reset();
        setToken(token);
    };

    return (
        <ValidationContainer ref={container}>
            <Loader active={loading} delayBeforeSpinnerShow={0} minimalDelayBeforeSpinnerHide={1000}>
                {showModal && (
                    <Modal onClose={onHideModal}>
                        <Modal.Header>
                            <b>Удалить фотографию?</b>
                        </Modal.Header>
                        <Modal.Footer>
                            <RowStack>
                                <Button size="medium" use="primary" onClick={onDeleteAvatar}>
                                    Удалить
                                </Button>
                                <Button size="medium" onClick={onHideModal}>
                                    Отменить
                                </Button>
                            </RowStack>
                        </Modal.Footer>
                    </Modal>
                )}
                <CommonLayout>
                    <CommonLayout.Header>
                        <GoBackLink backUrl=".." />
                        <h1>Личные данные</h1>
                    </CommonLayout.Header>
                    <CommonLayout.Content className={cn("content")}>
                        <div className={cn("avatar-wrapper")}>
                            <UserAvatar username={username} className={cn("avatar")} onClick={onFileUploaderClick} />
                            {user?.avatarUrl && (
                                <div className={cn("remove-button")} title="Удалить" onClick={onShowModal}>
                                    <TiDeleteOutline size={36} />
                                </div>
                            )}
                            <Button size="medium" onClick={onFileUploaderClick}>
                                <span>Изменить фото</span>
                                <PhotoUploader
                                    ref={fileUploader}
                                    onError={() => setError(true)}
                                    onChangeFiles={onUploadFile}
                                />
                            </Button>
                        </div>
                        <div className={cn("credentials")}>
                            <ColumnStack>
                                <span className={cn("muted-text")}>Никнейм</span>
                                <ValidationWrapper validationInfo={validationInfo.username}>
                                    <Input
                                        value={username}
                                        onValueChange={setUsername}
                                        maxLength={maxInputLength}
                                        width={inputWidth}
                                        placeholder="Username"
                                    />
                                </ValidationWrapper>
                            </ColumnStack>
                            <ColumnStack>
                                <span className={cn("muted-text")}>Дата рождения</span>
                                <LocaleContext.Provider
                                    value={{
                                        langCode: LangCodes.ru_RU,
                                    }}
                                >
                                    <ValidationWrapper validationInfo={validationInfo.birthdate}>
                                        <DatePicker
                                            width="100%"
                                            onValueChange={(value): void => setBirthday(value)}
                                            value={birthday}
                                        />
                                    </ValidationWrapper>
                                </LocaleContext.Provider>
                            </ColumnStack>
                            <RowStack>
                                <Button size="medium" use="primary" onClick={onSaveCredentials}>
                                    Сохранить
                                </Button>
                                <Button size="medium" use="default" onClick={onCancel}>
                                    Отменить
                                </Button>
                            </RowStack>
                        </div>
                    </CommonLayout.Content>
                </CommonLayout>
            </Loader>
        </ValidationContainer>
    );
};
