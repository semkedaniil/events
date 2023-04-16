import { useRef, useState } from "react";
import { Button, Checkbox, Input, Link, Loader, PasswordInput } from "@skbkontur/react-ui";
import { BsKey } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";

import { isValidUsername } from "./helpers";
import cn from "./Login.less";
import { login } from "../../api/auth/auth";
import { useAuthStore } from "../../stores/userStore/auth";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const inputWidth = "100%";
const maxInputLength = 100;

export const Login = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isKeepLogin, setIsKeepLogin] = useState(false);
    const container = useRef<ValidationContainer | null>(null);

    const authStore = useAuthStore();

    const signIn = async (): Promise<void> => {
        const isValid = await container.current?.validate();
        if (!isValid) {
            return;
        }
        setLoading(true);
        try {
            const token = await login(username, password);
            authStore.setToken(token);
            navigate("/");
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const getValidationInfo = () => {
        const result: Record<string, ValidationInfo> = {};
        if (!isValidUsername(username)) {
            result.username = { message: "Имя должно быть длиннее 3 символов и короче 100", type: "submit" };
        }
        if (!password.trim()) {
            result.password = { message: "Пароль должен быть не пустым", type: "submit" };
        }

        return result;
    };
    const validationInfo = getValidationInfo();

    return (
        <ValidationContainer ref={container}>
            <Loader active={loading} className={cn("loader")}>
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
                        <ValidationWrapper validationInfo={validationInfo.password}>
                            <PasswordInput
                                style={{ width: "100%"}}
                                maxLength={maxInputLength}
                                onValueChange={setPassword}
                                placeholder="Password"
                                leftIcon={<BsKey />}
                                width={inputWidth}
                                detectCapsLock
                            />
                        </ValidationWrapper>
                        <div className={cn("check-box-row")}>
                            <Checkbox checked={isKeepLogin} onValueChange={setIsKeepLogin}>
                                Запомнить
                            </Checkbox>
                            {error && <span className={cn("error")}>Мы вас не узнали, попробуйте еще раз</span>}
                        </div>
                        <Button use="primary" size="medium" onClick={signIn}>
                            Войти
                        </Button>
                        <div className={cn("login-page-additional-info")}>
                            <Link href="/reset-password">Забыли пароль?</Link>
                            <Link href="register">Нет аккаунта? Зарегистрироваться</Link>
                        </div>
                    </div>
                </div>
            </Loader>
        </ValidationContainer>
    );
};
