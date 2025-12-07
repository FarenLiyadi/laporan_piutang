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
import Select from "react-select";

export default function Index({ auth, categoryList }) {
    const [page, setPage] = useState(1);
    console.log(categoryList);

    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const role = auth.user.roles;
    const [searchBank, setSearchBank] = useState("");
    const [dataListPaket, setDataListPaket] = useState({
        item: [],
        total: 0,
    });
    const [counter, setCounter] = useState(1);

    const [formData, setFormData] = useState({
        client_id: "",
        subcategory_name: "",
        category_id: null,
    });

    const [selected, setSelected] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

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
    }, [searchBank, role, length, page, selected]);

    async function getListBank(page = 1, length = 10, namaPaket, role) {
        let parameter = {
            page: page,
            length: length,
            namaPaket: searchBank,
            category_id: selected ? selected.value : null,
        };

        try {
            const response = await axios.get(
                "/admin/list-subcategory-request",
                {
                    params: parameter,
                }
            );
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
    async function postPaket(page = 1, length = 10) {
        const parameter = new FormData();

        parameter.append("subcategory_name", formData.subcategory_name);
        parameter.append("category_id", formData.category_id);

        parameter.append("page", page);
        parameter.append("length", length);

        try {
            console.log(parameter);

            const response = await axios.post(
                "/admin/create-subcategory",
                parameter,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

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
    async function updatePaket(page = 1, length = 10) {
        const parameter = new FormData();

        parameter.append("client_id", formData.client_id);
        parameter.append("subcategory_name", formData.subcategory_name);
        parameter.append("category_id", formData.category_id);

        parameter.append("page", page);
        parameter.append("length", length);

        try {
            const response = await axios.post(
                "/admin/update-subcategory",
                parameter,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

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

    async function hapusPaket(id, page = 1, length = 10) {
        const confirmed = await confirmDeleteWithInput();
        if (!confirmed) return;

        let parameter = {
            id: id,
            page: page,
            length: length,
        };

        try {
            const response = await axios.post(
                "/admin/delete-subcategory",
                parameter
            );
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
    const [openEdit, setOpenEdit] = useState(false);
    const handleOpen = () => {
        setFormData({
            subcategory_name: "",
            selected2: null,
        });
        setOpen((cur) => !cur);
    };
    const handleOpenEdit = (e) => {
        setFormData({
            client_id: e.id,
            subcategory_name: e.subcategory_name,
            category_id: e.category_id,
        });
        setOpenEdit((cur) => !cur);
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(number);
    };

    const submitForm = async (e) => {
        handleOpen();
        e.preventDefault();

        try {
            const response = await postPaket(page, length);
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
    };
    const submitFormEdit = async (e) => {
        e.preventDefault();
        setOpenEdit((cur) => !cur);

        try {
            const response = await updatePaket(page, length);
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
    };

    const submitFormDelete = async (e, id) => {
        // console.log(id);
        e.preventDefault();
        // const confirmed = await confirmDeleteWithInput();
        // if (!confirmed) return;
        try {
            const response = await hapusPaket(id, page, length);
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
                                Subcategory
                            </Typography>
                            <Typography
                                color="white"
                                className="mt-1 font-normal"
                            >
                                Data subcategory
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
                                Tambah subcategory
                            </Button>
                            {/** create subcategory */}
                            <Dialog
                                size="xl"
                                open={open}
                                handler={handleOpen}
                                className="bg-black text-white p-6 "
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0.9, y: -100 },
                                }}
                            >
                                <div className="bg-card p-4 rounded-lg ">
                                    <DialogHeader className="text-white">
                                        Form Tambah Subcategory
                                    </DialogHeader>

                                    <DialogBody className="grid gap-4 text-white">
                                        <form
                                            onSubmit={submitForm}
                                            className="space-y-4"
                                        >
                                            <div className=" flex text-black flex-col">
                                                <label
                                                    htmlFor="category2"
                                                    className="block mb-2 font-medium text-white dark:text-white"
                                                >
                                                    Category
                                                </label>
                                                <Select
                                                    options={categoryList}
                                                    value={
                                                        categoryList.find(
                                                            (o) =>
                                                                o.value ===
                                                                formData.category_id
                                                        ) || null
                                                    }
                                                    onChange={(opt) =>
                                                        setFormData({
                                                            ...formData,
                                                            category_id: opt
                                                                ? opt.value
                                                                : null,
                                                        })
                                                    }
                                                    isClearable
                                                    isSearchable
                                                    placeholder="Pilih category..."
                                                />
                                            </div>
                                            <Input
                                                label="Nama subcategory"
                                                name="subcategory_name"
                                                value={
                                                    formData.subcategory_name
                                                }
                                                onChange={handleChange}
                                                required
                                                color="white"
                                                className="text-white"
                                                labelProps={{
                                                    className: "text-white",
                                                }}
                                            />

                                            <DialogFooter className="gap-2">
                                                <Button
                                                    variant="outlined"
                                                    color="white"
                                                    onClick={handleOpen}
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="orange"
                                                >
                                                    Simpan
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogBody>
                                </div>
                            </Dialog>

                            {/** update subcategory */}
                            <Dialog
                                size="xl"
                                open={openEdit}
                                handler={handleOpenEdit}
                                className="bg-black text-white p-6 "
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0.9, y: -100 },
                                }}
                            >
                                <div className="bg-card p-4 rounded-lg ">
                                    <DialogHeader className="text-white">
                                        Form Edit Subcategory
                                    </DialogHeader>

                                    <DialogBody className="grid gap-4 text-white">
                                        <form
                                            onSubmit={submitFormEdit}
                                            className="space-y-4"
                                        >
                                            <div className=" flex text-black flex-col">
                                                <label
                                                    htmlFor="category2"
                                                    className="block mb-2 font-medium text-white dark:text-white"
                                                >
                                                    Category
                                                </label>
                                                <Select
                                                    options={categoryList}
                                                    value={
                                                        categoryList.find(
                                                            (o) =>
                                                                o.value ===
                                                                formData.category_id
                                                        ) || null
                                                    }
                                                    onChange={(opt) =>
                                                        setFormData({
                                                            ...formData,
                                                            category_id: opt
                                                                ? opt.value
                                                                : null,
                                                        })
                                                    }
                                                    isClearable
                                                    isSearchable
                                                    placeholder="Pilih category..."
                                                />
                                            </div>
                                            <Input
                                                label="Nama subcategory/Merk"
                                                name="subcategory_name"
                                                value={
                                                    formData.subcategory_name
                                                }
                                                onChange={handleChange}
                                                required
                                                color="white"
                                                className="text-white"
                                                labelProps={{
                                                    className: "text-white",
                                                }}
                                            />

                                            <DialogFooter className="gap-2">
                                                <Button
                                                    variant="outlined"
                                                    color="white"
                                                    onClick={handleOpenEdit}
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    color="orange"
                                                >
                                                    Edit
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogBody>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-y-scroll  ">
                    <div className="flex items-center justify-end gap-4 md:mr-4">
                        {/* SEARCH INPUT */}
                        <div className="w-56">
                            <Input
                                label="Search subcategory name"
                                onChange={(e) => setSearchBank(e.target.value)}
                                color="orange"
                                type="text"
                                variant="outlined"
                                size="sm"
                                className="bg-white text-dark"
                            />
                        </div>

                        {/* CATEGORY SELECT */}
                        <div className="w-56 flex flex-col">
                            <Select
                                options={categoryList}
                                value={selected}
                                onChange={setSelected}
                                isClearable
                                isSearchable
                                placeholder="Cari category..."
                            />
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
                                            CATEGORY
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="namasub"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            NAMA SUBCATEGORY
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
                                        colSpan="3"
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
                                                        {e.category
                                                            .category_name ??
                                                            ""}
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
                                                        {e.subcategory_name}
                                                    </Typography>
                                                </div>
                                            </td>

                                            <td className={`${classes} w-min `}>
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
                                                                        handleOpenEdit(
                                                                            e
                                                                        )
                                                                    }
                                                                >
                                                                    edit
                                                                </p>
                                                                {e.document && (
                                                                    <a
                                                                        href={`download-file-subcategory/${e.id}`}
                                                                        className="cursor-pointer block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                                                                    >
                                                                        Download
                                                                        File
                                                                    </a>
                                                                )}
                                                                <p
                                                                    className={
                                                                        "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                    }
                                                                    onClick={(
                                                                        event
                                                                    ) =>
                                                                        submitFormDelete(
                                                                            event,
                                                                            e.id
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
