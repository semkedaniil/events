import { GoBackLink } from "../../ui/components/GoBackLink/GoBackLink";
import { CommonLayout } from "../../ui/components/CommonLayout/CommonLayout";
import { useEffect, useState } from "react";
import { Event } from "../../Commons/types/Event";
import { getUserEvents } from "../../api/events/events";
import { Link, Loader } from "@skbkontur/react-ui";
import cn from "./Events.less";
import { ColumnStack } from "../../ui/components/ColumnStack/ColumnStack";
import { RowStack } from "../../ui/components/RowStack/RowStack";

export const Events = (): JSX.Element => {
    const [userEvents, setUserEvents] = useState<Event[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

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
                        }) => (
                            <div key={id} className={cn("event")}>
                                {photos?.[0] && <img className={cn("img")} src={photos?.[0]} height={100} alt={name} />}
                                <div className={cn("main-info")}>
                                    <Link title="Открыть страницу события" href={`/event/${id}`}>
                                        <h2 className={cn("name")}>{name}</h2>
                                    </Link>
                                    <main>{description}</main>
                                    <footer>
                                        {creator && <span className={cn("author")}>Автор: {creator}</span>}
                                        <ColumnStack className={cn("date-range")}>
                                            <span>Начало: {startDate.toLocaleString()}</span>
                                            {endDate && <span>Конец: {endDate.toLocaleString()}</span>}
                                        </ColumnStack>
                                        <div>Количество лайков {dislikes}</div>
                                        <div>Количество дизлайков {likes}</div>
                                    </footer>
                                </div>
                            </div>
                        )
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
