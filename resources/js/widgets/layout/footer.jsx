import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function Footer({ routes }) {
    const year = new Date().getFullYear();

    return (
        <footer className="py-2">
            <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <Typography
                    variant="small"
                    className="font-normal text-white text-inherit"
                    color="white"
                >
                    &copy; {year}{" "}
                    <a
                        href={"#"}
                        target="_blank"
                        className="transition-colors text-white hover:text-red-600 font-bold"
                    >
                        Indotech Developer
                    </a>{" "}
                </Typography>
                <ul className="flex items-center gap-4">
                    {routes.map(({ name, path }, index) => (
                        <li key={name || `route-${index}`}>
                            <Typography
                                as="a"
                                href={path}
                                target="_blank"
                                variant="small"
                                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
                            >
                                {name}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
}

Footer.defaultProps = {
    routes: [
        { name: "", path: "#" },
        { name: "", path: "#" },
        { name: "", path: "#" },
    ],
};

Footer.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.object),
};

export default Footer;
