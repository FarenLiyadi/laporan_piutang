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
} from "@material-tailwind/react";
import Dropdown from "@/Components/Dropdown";
import { router, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import Pagination from "@/Components/Pagination";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Index({ auth }) {
    const [page, setPage] = useState(1);

    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const role = auth.user.roles;
    const [searchBank, setSearchBank] = useState("");
    const [dataListPaket, setDataListPaket] = useState({
        item: [],
        total: 0,
    });
    const [counter, setCounter] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_bank: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getListBank(
                    page,
                    length,
                    searchBank,
                    role
                );
                console.log(response);

                setCounter((page - 1) * length + 1);
                setTotalPages(Math.ceil(response.total / length));
                setDataListPaket(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [searchBank, role, length, page]);

    async function getListBank(page = 1, length = 10, namaPaket, role) {
        let parameter = {
            page: page,
            length: length,
            namaPaket: searchBank,
            roles: role,
        };

        try {
            const response = await axios.get("/admin/list-bank-request", {
                params: parameter,
            });
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
    async function postPaket(
        nama_bank,

        role,
        page = 1,
        length = 10
    ) {
        let parameter = {
            nama_bank: nama_bank,

            roles: role,
            page: page,
            length: length,
        };

        try {
            const response = await axios.post("/admin/create-bank", parameter);
            if (response.data.code !== 0) {
                console.log("error");

                throw new Error(response.data.msg);
            }
            toast.success(response.data.data.flash, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });

            return response.data.data;
        } catch (error) {
            console.error("There was a problem with the Axios request:", error);
            throw error;
        }
    }

    async function hapusPaket(id, role, page = 1, length = 10) {
        const confirmed = await confirmDeleteWithInput();
        if (!confirmed) return;

        let parameter = {
            id: id,
            roles: role,
            page: page,
            length: length,
        };

        try {
            const response = await axios.post("/admin/delete-bank", parameter);
            if (response.data.code !== 0) {
                console.log("error");
                throw new Error(response.data.msg);
            }

            toast.success(response.data.data.flash, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });

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

    //akan dihapus

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setData({ paket: "", harga: 0 });
        setOpen((cur) => !cur);
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(number);
    };

    const submitForm = async () => {
        handleOpen();

        try {
            const response = await postPaket(
                data.nama_bank,

                role,
                page,
                length
            );
            console.log(response);

            setCounter((page - 1) * length + 1);
            setTotalPages(Math.ceil(response.total / length));

            setDataListPaket(response);
        } catch (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
            console.error(error);
        }

        // post(route("tambahpaket"));
        // router.post("/list-paket/create", data);

        setData({ paket: "", harga: 0 });
    };

    const submitFormDelete = async (id) => {
        // console.log(id);

        try {
            const response = await hapusPaket(id, role, page, length);
            console.log(response);

            setCounter((page - 1) * length + 1);
            setTotalPages(Math.ceil(response.total / length));

            setDataListPaket(response);
        } catch (error) {
            console.error(error);
        }
        // if (confirm(`Yakin ingin menghapus paket ini ?`) == true) {

        // router.post(`/delete-paket`, { id: id });
        // }
    };

    //batas akan dihapus

    return (
        <NewAuthenticated>
            <Card className="h-full bg-card w-full p-4">
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-lg px-2 bg-card"
                >
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="white">
                                Akun Bank
                            </Typography>
                            <Typography
                                color="white"
                                className="mt-1 font-normal"
                            >
                                Data Bank
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button
                                className="flex bg-gold items-center gap-2"
                                size="sm"
                                onClick={handleOpen}
                            >
                                <PlusCircleIcon
                                    strokeWidth={2}
                                    className="h-4 w-4"
                                />{" "}
                                Tambah Bank
                            </Button>
                            <Dialog
                                size="xs"
                                open={open}
                                handler={handleOpen}
                                className="bg-transparent shadow-none"
                            >
                                <form onSubmit={submitForm}>
                                    <Card className="mx-auto bg-card w-full max-w-[24rem]">
                                        <CardBody className="flex flex-col gap-4">
                                            <Typography
                                                variant="h4"
                                                color="white"
                                            >
                                                Tambah Bank
                                            </Typography>
                                            <Typography
                                                className="mb-3 font-normal"
                                                variant="paragraph"
                                                color="white"
                                            >
                                                Silahkan mengisi data dengan
                                                lengkap.
                                            </Typography>
                                            <Typography
                                                className="-mb-2 text-white"
                                                variant="h6"
                                            >
                                                Nama bank
                                            </Typography>
                                            <Input
                                                label="Nama Bank"
                                                size="lg"
                                                type="text"
                                                value={data.nama_bank}
                                                color="orange"
                                                className="bg-white"
                                                onChange={(e) =>
                                                    setData(
                                                        "nama_bank",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.nama_bank}
                                                className=""
                                            />
                                        </CardBody>
                                        <CardFooter className="pt-0">
                                            <Button
                                                variant="filled"
                                                onClick={submitForm}
                                                fullWidth
                                                className="bg-gold"
                                                disabled={processing}
                                            >
                                                Save
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-y-scroll  ">
                    <div className="ml-auto md:mr-4 md:w-56">
                        <Input
                            label="Search Bank"
                            className=" text-dark bg-white"
                            onChange={(e) => setSearchBank(e.target.value)}
                            color="orange"
                            type="text"
                            variant="outlined"
                            size="sm"
                        />
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
                                    key="paket"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            NAMA BANK
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
                                dataListPaket.item.map(
                                    ({ nama_bank, id }, index) => {
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
                                                <td
                                                    className={`${classes} px-2`}
                                                >
                                                    <div className="flex flex-col justify-center">
                                                        <Typography
                                                            variant="small"
                                                            color="white"
                                                            className="font-normal"
                                                        >
                                                            {nama_bank}
                                                        </Typography>
                                                    </div>
                                                </td>

                                                <td
                                                    className={`${classes} w-min `}
                                                >
                                                    <div className="">
                                                        <Dropdown className="absolute">
                                                            <Dropdown.Trigger>
                                                                <span className="inline-flex rounded-md">
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center text-xs md:text-sm px-1 py-1 md:px-3 md:py-2 border border-transparent leading-4 font-medium rounded-md text-white dark:text-gray-400 bg-[#e49f28] dark:bg-[#e49f28] hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                                    >
                                                                        Aksi
                                                                        <svg
                                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </span>
                                                            </Dropdown.Trigger>

                                                            <Dropdown.Content>
                                                                <div className="relative z-50">
                                                                    <p
                                                                        className={
                                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                        }
                                                                        onClick={() =>
                                                                            submitFormDelete(
                                                                                id
                                                                            )
                                                                        }
                                                                    >
                                                                        hapus
                                                                    </p>
                                                                </div>
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
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
