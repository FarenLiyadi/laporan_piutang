import { Background } from "@cloudinary/url-gen/qualifiers";
import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";


export default function Pagination({
    onChange,
    prevBtn,
    nextBtn,
    handleKeyDown,
    isPrevDisabled,
    isNextDisabled,
    page = "not set",
    totalPage = "not set",
}){

    const [inputPage, setInputPage] = useState(page);

    // When page prop changes, update inputPage too
    useEffect(() => {
        setInputPage(page);
    }, [page]);

    return (
        <div className="flex flex-wrap items-center justify-between w-full py-3 gap-3 sm:flex-col md:flex-row">
            {/* Select Length */}
            <div>
                <select
                id="src_length"
                className="src_change appearance-none block 
                    w-14 p-1 text-xs 
                    sm:w-16 sm:p-2 sm:text-sm
                    text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
                    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={onChange}
                >
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex flex-wrap w-full justify-between md:w-fit md:justify-start items-center gap-2">
                {/* Prev Button */}
                <Button
                    onClick={prevBtn}
                    disabled={isPrevDisabled}
                    className={`rounded-md 
                        text-xs px-2 py-1 
                        sm:text-sm sm:px-3 sm:py-2 
                        ${isPrevDisabled 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    id="prev_btn"
                    variant="filled"
                    size="sm"
                >
                    Prev
                </Button>

                {/* Page Input */}
                <div className="flex items-center mx-1">
                <input
                    type="number"
                    onKeyDown={handleKeyDown}
                    min={1}
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    max={totalPage}
                    className="w-10 p-1 text-center text-xs 
                    sm:w-12 sm:p-2 sm:text-sm 
                    bg-transparent text-white border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <p className="ml-1 text-white text-xs sm:text-sm">
                    {totalPage > 0 ? `of ${totalPage}` : ""}
                </p>
                </div>

                {/* Next Button */}
                <Button
                    id="next_btn"
                    onClick={nextBtn}
                    disabled={isNextDisabled}
                    variant="filled"
                    size="sm"
                    className={`rounded-md 
                        text-xs px-2 py-1 
                        sm:text-sm sm:px-3 sm:py-2
                        ${isNextDisabled 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-orange-500 hover:bg-orange-600"
                        }`}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
