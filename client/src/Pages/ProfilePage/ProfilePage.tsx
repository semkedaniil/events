import React, { useEffect, useRef, useState } from "react";
import { Button, DatePicker, Input, LangCodes, Loader, LocaleContext } from "@skbkontur/react-ui";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";

import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { useAuthStore } from "../../stores/userStore/auth";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { updateUserInfo } from "../../api/userInfo/userInfo";

import cn from "./ProfilePage.less";
import { getValidationInfo, stringToColor } from "./helpers";

const inputWidth = 400;

const maxInputLength = 100;

export const ProfilePage = () => {
    const { user, setToken } = useAuthStore();
    const [username, setUsername] = useState<string | undefined>(user?.username);
    const [birthday, setBirthday] = useState(user?.birthday ?? "Birthday");
    const [loading, setLoading] = useState(false);
    const container = useRef<ValidationContainer | null>(null);
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
        if (!isValid) {
            return;
        }
        setLoading(true);
        try {
            const token = await updateUserInfo({ username, birthday });
            setToken(token);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ValidationContainer ref={container}>
            <Loader active={loading}>
                <CommonLayout>
                    <CommonLayout.Header>
                        <GoBackLink backUrl=".." />
                        <h1>Личные данные</h1>
                    </CommonLayout.Header>
                    <CommonLayout.Content className={cn("content")}>
                        <div className={cn("avatar-wrapper")}>
                            <div
                                className={cn("avatar")}
                                style={{ backgroundColor: stringToColor(username ?? "default") }}
                            >
                                {user?.username.trim()[0]}
                            </div>
                            <Button use="default">Изменить фото</Button>
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
                                <Button use="primary" onClick={onSaveCredentials}>
                                    Сохранить
                                </Button>
                                <Button use="default" onClick={onCancel}>
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
