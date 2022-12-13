import { useRef, useState } from "react";
import { Button, Checkbox, Input, Link, PasswordInput } from "@skbkontur/react-ui";
import { BsKey } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";

import { isValidUsername } from "./helpers";
import cn from "./Login.less";

const inputWidth = "100%";
const maxInputLength = 100;

export const Login = (): JSX.Element => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isKeepLogin, setIsKeepLogin] = useState(false);
    const container = useRef<ValidationContainer | null>(null);

    const signIn = async (): Promise<void> => {
        await container.current?.submit();
    };
    const validationInfo: ValidationInfo | null = isValidUsername(username)
        ? null
        : { message: "Имя должно быть длиннее 3 символов и короче 100", type: "submit" };

    return (
        <ValidationContainer ref={container}>
            <div className={cn("login-page")}>
                <div className={cn("login-page-card")}>
                    <ValidationWrapper validationInfo={validationInfo}>
                        <Input
                            value={username}
                            onValueChange={setUsername}
                            maxLength={maxInputLength}
                            leftIcon={<AiOutlineMail />}
                            width={inputWidth}
                            placeholder="Username"
                        />
                    </ValidationWrapper>
                    <PasswordInput
                        maxLength={maxInputLength}
                        placeholder="Password"
                        leftIcon={<BsKey />}
                        width={inputWidth}
                        detectCapsLock
                    />
                    <Checkbox checked={isKeepLogin} onValueChange={setIsKeepLogin}>
                        Запомнить
                    </Checkbox>
                    <Button use="primary" size="medium" onClick={signIn}>
                        Войти
                    </Button>
                    <div className={cn("login-page-additional-info")}>
                        <Link href="/reset-password">Забыли пароль?</Link>
                        <Link href="register">Нет аккаунта? Зарегистрироваться</Link>
                    </div>
                </div>
            </div>
        </ValidationContainer>
    );
};
