import { useRef, useState } from "react";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";
import { Button, Input } from "@skbkontur/react-ui";
import { AiOutlineMail } from "react-icons/ai";

import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { isValidEmail } from "../Register/helpers";

import cn from "./ResetPasswordPage.less";

const inputWidth = "100%";
const maxInputLength = 100;

export const ResetPasswordPage = (): JSX.Element => {
    const [email, setEmail] = useState("");
    const container = useRef<ValidationContainer | null>(null);

    const validationInfo: ValidationInfo | null = isValidEmail(email)
        ? null
        : {
              message: "Введите корректный адрес электронной почты",
              type: "submit",
          };
    const sentCode = async (): Promise<void> => {
        await container.current?.submit();
    };

    return (
        <ValidationContainer ref={container}>
            <div className={cn("login-page")}>
                <div className={cn("login-page-card", "reset-page-card")}>
                    <CommonLayout.Header>Введите адрес электронной почты для восстановления пароля</CommonLayout.Header>
                    <ValidationWrapper validationInfo={validationInfo}>
                        <Input
                            value={email}
                            onValueChange={setEmail}
                            maxLength={maxInputLength}
                            leftIcon={<AiOutlineMail />}
                            width={inputWidth}
                            placeholder="Email"
                        />
                    </ValidationWrapper>
                    <Button use="primary" onClick={sentCode}>
                        Отправить код на почту
                    </Button>
                </div>
            </div>
        </ValidationContainer>
    );
};
