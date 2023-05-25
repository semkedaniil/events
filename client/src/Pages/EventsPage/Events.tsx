import { useEffect, useState } from "react";
import { Link } from "@skbkontur/react-ui";
import {Navigate} from "react-router-dom";

import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { Event } from "../../Commons/types/Event";
import { getUserEvents } from "../../api/events/events";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import {useAuthStore} from "../../stores/userStore/userStore";

import cn from "./Events.less";


export const Events = (): JSX.Element => {
    const { isAuth } = useAuthStore();

    const [userEvents, setUserEvents] = useState<Event[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

    if (!isAuth) {
        return <Navigate to="/login" />;
    }
    
    return (
        <CommonLayout>
            <CommonLayout.Header>
                <GoBackLink backUrl=".." />
                <h1>Events</h1>
            </CommonLayout.Header>
            <CommonLayout.Content>
                <div className={cn("events")}>
                    {userEvents.map(
                        ({
                            id,
                            name,
                            marks: { dislikes, likes },
                            dateRange: { startDate, endDate },
                            photos,
                            description,
                            creator,
                        }) => {
                            const start = new Date(startDate).toLocaleString();
                            const end = endDate && new Date(endDate).toLocaleString();
                            return (
                                <div key={id} className={cn("event")}>
                                    {photos?.[0] && (
                                        <img className={cn("img")} src={photos?.[0]} height={100} alt={name} />
                                    )}
                                    <div className={cn("main-info")}>
                                        <Link title="Открыть страницу события" href={`/event/${id}`}>
                                            <h2 className={cn("name")}>{name}</h2>
                                        </Link>
                                        <main>{description}</main>
                                        <footer>
                                            {creator && <span className={cn("author")}>Автор: {creator}</span>}
                                            <ColumnStack className={cn("date-range")}>
                                                <span>Начало: {start}</span>
                                                {endDate && <span>Конец: {end}</span>}
                                            </ColumnStack>
                                            <div>Количество лайков {dislikes?.length ?? 0}</div>
                                            <div>Количество дизлайков {likes?.length ?? 0}</div>
                                        </footer>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </CommonLayout.Content>
        </CommonLayout>
    );

    async function loadEvents() {
        const events = await getUserEvents();
        setUserEvents(events);
    }
};
