import { isMobile } from "../../utils/utils";

import { Section } from "./Components/Section/Section";

export const GameRules = (): JSX.Element => {
    const text = isMobile(navigator.userAgent || navigator.vendor)
        ? "Проведите пальцами, чтобы перемещать числа."
        : "Используйте клавиши со стрелками на клавиатуре для перемещения чисел.";

    return (
        <Section id="howToPlaySection" title="Как играть?">
            <p>
                {text} Одинаковые числа будут объединены в одно, когда они соприкоснутся. После каждого хода новое число
                (<strong>2</strong>&nbsp;или&nbsp;<strong>4</strong>) генерируется в случайном пустом месте. Объедините
                числа и постройте блок с 2048, чтобы <strong>выиграть</strong> игру!
            </p>
        </Section>
    );
};
