import cn from "./ScoreBox.less";

interface ScoreBoxProps {
    title: string;
    score: number;
}

export const ScoreBox = ({ score, title }: ScoreBoxProps): JSX.Element => (
    <div className={cn("score-box")}>
        <span className={cn("title")}>{title}</span>
        <span className={cn("score")}>{score}</span>
    </div>
);
