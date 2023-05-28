import { BsFillHeartFill, BsHeartbreakFill } from "react-icons/bs";
import _ from "lodash";
import { useEffect, useState } from "react";

import { RowStack } from "../RowStack/RowStack";
import { Event } from "../../../Commons/types/Event";
import { setMark } from "../../../api/mark/mark";
import { useAuthStore } from "../../../stores/userStore/userStore";

import cn from "./MarksBlock.less";

interface MarksBlockProps {
    className?: string;
    event: Event;
    onValueChange?: (event: Event) => void;
    withoutCaption?: boolean;
}

export const MarksBlock = ({
    className,
    event,
    onValueChange,
    withoutCaption,
}: MarksBlockProps): JSX.Element | null => {
    const { user } = useAuthStore();
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    useEffect(() => {
        if (event) {
            setIsLiked(event?.marks.likes.find(like => like.userId === user?.id)?.isLiked ?? false);
            setIsDisliked(event?.marks.dislikes.find(like => like.userId === user?.id)?.isLiked === false ?? false);
        }
    }, [event]);

    if (!user) {
        return null;
    }

    const {
        marks: { likes, dislikes },
        id,
    } = event;
    const onLike = async () => {
        if (isLiked) {
            onValueChange?.({ ...event, marks: { likes: likes.filter(like => like.userId !== user.id), dislikes } });
            await setMark(id, null);
        } else {
            const newLikes = _.uniqBy([...likes, { isLiked: true, userId: user.id }], "userId");
            const newDislikes = dislikes.filter(like => like.userId !== user.id);
            onValueChange?.({ ...event, marks: { likes: newLikes, dislikes: newDislikes } });
            await setMark(id, true);
        }
        setIsLiked(!isLiked);
        setIsDisliked(false);
    };

    const onDislike = async () => {
        if (isDisliked) {
            onValueChange?.({ ...event, marks: { dislikes: dislikes.filter(like => like.userId !== user.id), likes } });
            await setMark(id, null);
        } else {
            const newDislikes = _.uniqBy([...dislikes, { isLiked: false, userId: user.id }], "userId");
            const newLikes = likes.filter(like => like.userId !== user.id);
            onValueChange?.({ ...event, marks: { dislikes: newDislikes, likes: newLikes } });
            await setMark(id, false);
        }
        setIsDisliked(!isDisliked);
        setIsLiked(false);
    };
    return (
        <RowStack className={cn("marks", className)}>
            <div onClick={onLike} className={cn("mark-button")}>
                <a className={cn("link", { liked: isLiked })}>
                    <RowStack align="center">
                        <BsFillHeartFill color="red" />
                        {!withoutCaption && <span>Лайк</span>}
                        <span>{likes?.length}</span>
                    </RowStack>
                </a>
            </div>
            <div onClick={onDislike} className={cn("mark-button")}>
                <a className={cn("link", { disliked: isDisliked })}>
                    <RowStack align="center">
                        <BsHeartbreakFill color="red" />
                        {!withoutCaption && <span>Дизлайк</span>}
                        <span>{dislikes?.length}</span>
                    </RowStack>
                </a>
            </div>
        </RowStack>
    );
};
