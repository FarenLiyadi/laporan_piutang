import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useState } from "react";

export function StatisticsCard({ color, icon, title, value, footer }) {
    const [showPasswordFields, setShowPasswordFields] = useState({
        password: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswordFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    return (
        <Card className="border text-white bg-[#212121] border-[#212121] shadow-sm">
            <CardHeader
                variant="gradient"
                color={color}
                floated={false}
                shadow={false}
                className="absolute text-white grid h-12 w-12 place-items-center"
            >
                {icon}
            </CardHeader>
            <CardBody className="p-4 text-right ">
                <Typography variant="small" className="font-normal text-white">
                    {title}
                </Typography>
                <Typography variant="h5" color="white">
                    {showPasswordFields.password ? value : "****"}
                </Typography>
                <Typography variant="paragraph" color="white">
                    <button
                        type="button"
                        className=" text-white"
                        onClick={() => togglePasswordVisibility("password")}
                    >
                        <i
                            className={`fa-solid ${
                                showPasswordFields.password
                                    ? "fa-eye-slash"
                                    : "fa-eye"
                            }`}
                        ></i>
                    </button>
                </Typography>
            </CardBody>
            {footer && (
                <CardFooter
                    color="text-white"
                    className="text-white  border-t border-white p-4"
                >
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}

StatisticsCard.defaultProps = {
    color: "blue",
    footer: null,
};

StatisticsCard.propTypes = {
    color: PropTypes.oneOf([
        "white",
        "blue-gray",
        "gray",
        "brown",
        "deep-orange",
        "orange",
        "amber",
        "yellow",
        "lime",
        "light-green",
        "green",
        "teal",
        "cyan",
        "light-blue",
        "blue",
        "indigo",
        "deep-purple",
        "purple",
        "pink",
        "red",
    ]),
    icon: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    value: PropTypes.node.isRequired,
    footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
