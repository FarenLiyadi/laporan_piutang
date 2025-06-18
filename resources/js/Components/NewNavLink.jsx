import { Link } from "@inertiajs/react";

export default function NewNavLink({
    active = false,
    className = "",
    as = "a",
    children,
    ...props
}) {
    // If you want to avoid button inside button, change as="button" to as="div"
    const Tag = as === "button" ? "div" : as;

    return (
        <Link
            {...props}
            as={Tag}
            className={`w-full flex items-start text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
