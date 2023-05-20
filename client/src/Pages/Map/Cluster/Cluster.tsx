import Supercluster from "supercluster";
import { Tooltip } from "@skbkontur/react-ui";

import { pluralize } from "../../../Commons/utlis";

interface ClusterProps {
    properties: Supercluster.ClusterProperties;
    leaves: Supercluster.PointFeature<Supercluster.AnyProps>[];
}

const size = 60;

export const Cluster = ({ leaves, properties: { point_count: pointCount } }: ClusterProps): JSX.Element => {
    const renderTooltipMenu = () => {
        const pluralString = pluralize(pointCount, ["событие", "события", "событий"]);
        const isMoreThan10 = pointCount > 10;
        return (
            <div>
                <span>
                    Здесь всего {pointCount} {pluralString}:
                </span>
                <span>
                    {leaves.slice(0, 10).map(({ properties: { name, id } }, index) => (
                            <div key={index.toString() + id}>
                                {index + 1}. {name}
                            </div>
                        ))}
                    {isMoreThan10 && <div>И еще {pointCount - 10}...</div>}
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
                {pointCount}
            </div>
        </Tooltip>
    );
};