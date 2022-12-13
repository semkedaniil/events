import React, { useRef, useState } from "react";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { Button, DatePicker, Input, LangCodes, Link, LocaleContext, PasswordInput } from "@skbkontur/react-ui";
import { AiOutlineMail } from "react-icons/ai";
import { BsKey } from "react-icons/bs";

import cn from "./Register.less";
import { getRegistrationValidationInfo } from "./helpers";

const inputWidth = "100%";
const maxInputLength = 100;

export const Register = (): JSX.Element => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");
    const [isKeepLogin, setIsKeepLogin] = useState(false);
    const container = useRef<ValidationContainer | null>(null);
    const [birthDate, setBirthDate] = useState<string | null>("BirthDate");

    const signIn = async (): Promise<void> => {
        await container.current?.submit();
    };

    const validationInfo = getRegistrationValidationInfo(username, email, password, repeatedPassword, birthDate);

    return (
        <ValidationContainer ref={container}>
            <div className={cn("login-page")}>
                <div className={cn("login-page-card")}>
                    <ValidationWrapper validationInfo={validationInfo.username}>
                        <Input
                            value={username}
                            onValueChange={setUsername}
                            maxLength={maxInputLength}
                            leftIcon={<AiOutlineMail />}
                            width={inputWidth}
                            placeholder="Username"
                        />
                    </ValidationWrapper>
                    <ValidationWrapper validationInfo={validationInfo.email}>
                        <Input
                            value={email}
                            onValueChange={setEmail}
                            maxLength={maxInputLength}
                            leftIcon={<AiOutlineMail />}
                            width={inputWidth}
                            placeholder="Email@mail.com"
                        />
                    </ValidationWrapper>
                    <ValidationWrapper validationInfo={validationInfo.password}>
                        <PasswordInput
                            onValueChange={setPassword}
                            maxLength={maxInputLength}
                            placeholder="Password"
                            leftIcon={<BsKey />}
                            width="300px"
                            value={password}
                            detectCapsLock
                        />
                    </ValidationWrapper>
                    <ValidationWrapper validationInfo={validationInfo.repeatedPassword}>
                        <PasswordInput
                            maxLength={maxInputLength}
                            placeholder="Repeat password"
                            leftIcon={<BsKey />}
                            width="300px"
                            value={repeatedPassword}
                            onValueChange={setRepeatedPassword}
                            detectCapsLock
                        />
                    </ValidationWrapper>
                    <LocaleContext.Provider
                        value={{
                            langCode: LangCodes.ru_RU,
                        }}>
                        <ValidationWrapper validationInfo={validationInfo.birthdate}>
                            <DatePicker
                                width="100%"
                                onValueChange={(value): void => setBirthDate(value)}
                                value={birthDate}
                            />
                        </ValidationWrapper>
                    </LocaleContext.Provider>
                    <Button use="primary" size="medium" onClick={signIn}>
                        Зарегистрироваться
                    </Button>
                    <div className={cn("login-page-additional-info")}>
                        <Link href="/login">Уже есть аккаунт? Войти</Link>
                    </div>
                </div>
            </div>
        </ValidationContainer>
    );
};
