import NewAuthenticated from "@/Layouts/NewAuthenticated";
import React, { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
    Select,
    Option,
} from "@material-tailwind/react";
import Dropdown from "@/Components/Dropdown";
import { router, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import Pagination from "@/Components/Pagination";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkbox from "@/Components/Checkbox";
import { RotatingLines } from "react-loader-spinner";

export default function Index({ auth }) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setstatus] = useState(2);
    const [kondisi, setkondisi] = useState(2);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const role = auth.user.roles;
    const [searchBank, setSearchBank] = useState("");
    const [dataListPaket, setDataListPaket] = useState({
        item: [],
        total: 0,
    });
    const [counter, setCounter] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getListBank(
                    page,
                    length,
                    searchBank,
                    role
                );
                // console.log(response);

                setCounter((page - 1) * length + 1);
                setTotalPages(Math.ceil(response.total / length));
                setDataListPaket(response);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        setLoading(true);
        fetchData();
    }, [searchBank, role, length, page, status, kondisi]);

    async function getListBank(page = 1, length = 10, namaPaket, role) {
        let parameter = {
            page: page,
            length: length,
            namaPaket: searchBank,
            is_disabled: status,
            kondisi: kondisi,
        };

        try {
            const response = await axios.get("/admin/list-customers-request", {
                params: parameter,
            });
            console.log(response);

            if (response.data.code !== 0) {
                console.log("error");
                throw new Error(response.data.msg);
            }
            return response.data.data;
        } catch (error) {
            console.error("There was a problem with the Axios request:", error);
            throw error;
        }
    }

    function handleChangeLength() {
        let selectedLength = document.getElementById("src_length").value;
        setPage(1);
        setLength(parseInt(selectedLength));
    }

    function prevBtn() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    function nextBtn() {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            let tmp = e.target.value.trim();

            if (isNaN(tmp) || tmp === "" || tmp.includes(" ")) {
                toast.error("Please enter a valid number", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                return;
            }

            tmp = Number(tmp);

            if (tmp <= 0 || tmp > totalPages) {
                toast.error("Invalid Input", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                return;
            }

            setPage(tmp);
        }
    }
    function handleOpen() {
        window.location.href = "/admin/report-piutang-beredar-user";
    }
    return (
        <NewAuthenticated>
            {loading && (
                <div className="fixed inset-0  z-[99] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <RotatingLines
                            visible={true}
                            height="48"
                            width="48"
                            strokeWidth="5"
                            animationDuration="1"
                            ariaLabel="rotating-lines-loading"
                            strokeColor="white"
                        />
                        <p className="mt-4 text-xl font-semibold text-white">
                            Loading Data...
                        </p>
                    </div>
                </div>
            )}
            <Card className="h-full bg-card w-full p-4">
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-lg px-2 bg-card"
                >
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="white">
                                Report Piutang Beredar
                            </Typography>
                            <Typography
                                color="white"
                                className="mt-1 font-normal"
                            >
                                Data Customers
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button
                                className="flex bg-gold items-center gap-2"
                                size="sm"
                                onClick={handleOpen}
                            >
                                View All Customers
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-y-scroll  ">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 ml-auto md:mr-4">
                        {/* Input Search */}
                        <div className="md:w-56 w-full">
                            <label
                                htmlFor="status"
                                className="block mb-1 text-md font-medium text-white"
                            >
                                {" "}
                                Customer/Hp
                            </label>
                            <Input
                                label="Search Customers / Telepon"
                                className="text-dark bg-white"
                                onChange={(e) => setSearchBank(e.target.value)}
                                color="orange"
                                type="text"
                                variant="outlined"
                                size="sm"
                            />
                        </div>

                        {/* Dropdown Status */}
                        <div className="md:w-56 w-full max-w-sm">
                            <label
                                htmlFor="status"
                                className="block mb-1 text-md font-medium text-white"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={status}
                                onChange={(e) => {
                                    setstatus(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value={2}>Semua</option>
                                <option value={0}>Tidak aktif</option>
                                <option value={1}>Aktif</option>
                            </select>
                        </div>
                        <div className="md:w-56 w-full max-w-sm">
                            <label
                                htmlFor="status"
                                className="block mb-1 text-md font-medium text-white"
                            >
                                Kondisi
                            </label>
                            <select
                                id="kondisi"
                                name="kondisi"
                                value={kondisi}
                                onChange={(e) => {
                                    setkondisi(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value={2}>Semua</option>
                                <option value={0}>Tidak sehat</option>
                                <option value={1}>Sehat</option>
                            </select>
                        </div>
                    </div>

                    <table className="mt-4 w-full min-w-max mb-16 ">
                        <thead>
                            <tr className="">
                                <th
                                    key="#"
                                    className=" cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className=" flex items-center justify-center text-center font-normal leading-none  w-min"
                                        >
                                            #
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="nama"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            NAMA
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="alamat"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            ALAMAT
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="no_hp"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Telepon
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="is_enabled"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Status
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="kondisi"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Kondisi
                                        </Typography>
                                    </div>
                                </th>

                                <th
                                    key="AKSI"
                                    className="cursor-pointer border border-blue-gray-100 bg-card  p-6 transition-colors  hover:bg-[#3d3d3d] w-10"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                        {""}
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {dataListPaket.total === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-white font-bold text-2xl p-2"
                                    >
                                        No Data Found
                                    </td>
                                </tr>
                            ) : (
                                dataListPaket.item.map((e, index) => {
                                    const classes =
                                        "py-1  border border-blue-gray-50";

                                    return (
                                        <tr
                                            key={index}
                                            className={`${
                                                index % 2 === 0
                                                    ? "bg-card"
                                                    : "bg-[#2b2b2b]"
                                            } hover:bg-[#3d3d3d]`}
                                        >
                                            <td className={`${classes}`}>
                                                <div className="flex items-center justify-center ">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className="font-normal"
                                                    >
                                                        {counter + index}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className="font-normal"
                                                    >
                                                        {e.nama}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className="font-normal"
                                                    >
                                                        {e.alamat}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className="font-normal"
                                                    >
                                                        {e.no_hp}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className={`font-normal text-center ${
                                                            e.is_enabled == 1
                                                                ? "bg-green-600"
                                                                : "bg-red-600"
                                                        } rounded-md`}
                                                    >
                                                        {e.is_enabled == 0
                                                            ? "Tidak aktif"
                                                            : "Aktif"}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className={`font-normal text-center ${
                                                            e.status == 1
                                                                ? "bg-green-600"
                                                                : "bg-red-600"
                                                        } rounded-md`}
                                                    >
                                                        {e.status == 0
                                                            ? "Tidak sehat"
                                                            : "Sehat"}
                                                    </Typography>
                                                </div>
                                            </td>

                                            <td className={`${classes} w-min `}>
                                                <div className=" flex justify-center ">
                                                    {" "}
                                                    <a
                                                        href={`report-piutang-beredar-user?id=${e.id}`}
                                                        className="text-white  text-sm dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 py-1 px-1.5 font-semibold rounded"
                                                    >
                                                        <i
                                                            className="fa-solid fa-eye"
                                                            title="Detail"
                                                        ></i>
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className=" flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Pagination
                        onChange={handleChangeLength}
                        prevBtn={prevBtn}
                        nextBtn={nextBtn}
                        handleKeyDown={handleKeyDown}
                        isPrevDisabled={page == 1}
                        isNextDisabled={page == totalPages}
                        page={page}
                        totalPage={totalPages}
                    />
                </CardFooter>
            </Card>
        </NewAuthenticated>
    );
}
