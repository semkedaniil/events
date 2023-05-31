import { useState } from "react";

import cn from "./SubscribeButton.less";

interface SubscriberButtonProps {
    onSubscribe: () => Promise<void>;
    onUnsubscribe: () => Promise<void>;
    isUserSubscribed?: boolean;
}

export const SubscribeButton = ({ onSubscribe, onUnsubscribe, isUserSubscribed }: SubscriberButtonProps) => {
    const [subscribed, setSubscribed] = useState(isUserSubscribed);
    const onClick = async () => {
        setSubscribed(!subscribed);
        await (subscribed ? onUnsubscribe() : onSubscribe());
    };
    return (
        <div onClick={onClick} className={cn("mark-button")}>
            <a className={cn("link", { subscribed })}>
                <span>{subscribed ? "Отписаться" : "Подписаться"}</span>
            </a>
        </div>
    );
};
