import Supercluster from "supercluster";
import { Tooltip } from "@skbkontur/react-ui";
import { pluralize } from "../../../Commons/utlis";

interface ClusterProps {
    properties: Supercluster.ClusterProperties;
    leaves: Supercluster.PointFeature<Supercluster.AnyProps>[];
}

const size = 60;

export const Cluster = ({ leaves, properties: { point_count } }: ClusterProps): JSX.Element => {
    const renderTooltipMenu = () => {
        const pluralString = pluralize(point_count, ["событие", "события", "событий"]);
        const isMoreThan10 = point_count > 10;
        return (
            <div>
                <span>
                    Здесь всего {point_count} {pluralString}:
                </span>
                <span>
                    {leaves.slice(0, 10).map(({ properties: { id } }, index) => {
                        // todo create link to event page
                        return (
                            <div key={index.toString() + id}>
                                {index + 1}. {id}
                            </div>
                        );
                    })}
                    {isMoreThan10 && <div>И еще {point_count - 10}...</div>}
                </span>
            </div>
        );
    };

    return (
        <Tooltip render={renderTooltipMenu}>
            <div
                style={{
                    width: size,
                    height: size,
                    zIndex: 20,
                    cursor: "pointer",
                    fontSize: "16px",
                    backgroundColor: "#51bbd6",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                {point_count}
            </div>
        </Tooltip>
    );
};