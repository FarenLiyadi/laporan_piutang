import React, { useState } from "react";

export default function FlashMessage({ className, message = "" }) {
    const [flash, setFlash] = useState(true);
    setTimeout(() => {
        setFlash(false);
    }, 2000);
    return (
        <div
            className={`absolute justify-end w-max rounded-lg  text-center top-0  right-0  bg-green-100  p-4 mb-4 text-sm text-green-700 ${className} ${
                flash ? "flex " : "hidden"
            } `}
        >
            {message}
        </div>
    );
}
