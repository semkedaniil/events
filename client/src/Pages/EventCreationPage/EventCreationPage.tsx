import cn from "./EventCreationPage.less";

import React, { useRef, useState } from "react";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { ValidationWrapper, ValidationContainer } from "@skbkontur/react-ui-validations";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../ui/components/RowStack/RowStack";
import { Button, Input, InputSize } from "@skbkontur/react-ui";
import { useSearchParams } from "react-router-dom";
import { Location } from "../../Commons/types/Event";

const maxWidth = 450;
const maxLength = 100;
const defaultInputProps = {
    size: "medium" as InputSize,
    maxLength,
    width: maxWidth
}
export const EventCreationPage = () => {
    const [searchParams] = useSearchParams();
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const container = useRef<ValidationContainer>(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState<DeepNullable<Location>>({
        lat: lat ? (isNaN(Number(lat)) ? null : Number(lat)) : null,
        lng: lng ? (isNaN(Number(lng)) ? null : Number(lng)) : null,
    });
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1 className={cn("header")}>Создание события</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <ValidationContainer ref={container}>
                    <ColumnStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}></span>
                            <Input></Input>
                        </ColumnStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}>Название события</span>
                            <Input
                                {...defaultInputProps}
                                value={name}
                                onValueChange={setName}
                            />
                        </ColumnStack>
                        <ColumnStack className={cn("stack")}>
                            <span className={cn("title")}>Координаты события:</span>
                            <Input
                                {...defaultInputProps}
                                disabled
                                value={`${location?.lng}, ${location?.lat}`}
                            />
                            <Button use="link">Изменить координаты</Button>
                        </ColumnStack>
                    </ColumnStack>
                </ValidationContainer>
            </CommonLayout.Content>
        </CommonLayout>
    );
};