import NewAuthenticated from "@/Layouts/NewAuthenticated";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CurrencyDollarIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
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
import { PencilIcon } from "@heroicons/react/24/solid";

import Dropdown from "@/Components/Dropdown";
import { router, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import Pagination from "@/Components/Pagination";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
    formatTanggal,
    formatTanggalIndo,
    rupiah,
} from "@/utils/formatTanggal";

export default function index({ auth, bank }) {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get("id");
    const [loading, setLoading] = useState(false);
    // console.log(bank);

    const [dataListPaket, setDataListPaket] = useState({
        item: [],
    });
    const [nama, setnama] = useState("");

    // get data view
    const fetchData = async () => {
        setLoading(true);

        try {
            const response = await getListPaket();
            setnama(response.namaCustomer);
            setDataListPaket({ item: response.items });
            // console.log(response.items);
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    async function getListPaket() {
        let parameter = {
            id: userId,
        };
        // console.log(parameter);

        try {
            const response = await axios.get("/admin/pembayaran-user-request", {
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
    // end data view

    async function postPembayaran() {
        setLoading(true);
        const invalidItem = dataListPaket.item.find(
            (item) => Number(item.nominal_bayar) > 0 && !item.bank_id
        );
        const invalidItem2 = dataListPaket.item.find(
            (item) => Number(item.nominal_bayar) > 0 && !item.tgl_bayar
        );

        if (invalidItem) {
            toast.error(
                `Bank belum dipilih untuk invoice ${invalidItem.nomor_invoice}. Silakan pilih bank terlebih dahulu.`,
                {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                }
            );
            setLoading(false);
            return; // hentikan eksekusi
        }
        if (invalidItem2) {
            toast.error(
                `tanggal pembayaran belum dipilih untuk invoice ${invalidItem2.nomor_invoice}. Silakan pilih tanggal terlebih dahulu.`,
                {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                }
            );
            setLoading(false);
            return; // hentikan eksekusi
        }
        const payload = {
            data: dataListPaket.item
                .filter(
                    (item) =>
                        Number(item.nominal_bayar) > 0 &&
                        item.bank_id &&
                        item.tgl_bayar
                )
                .map((item) => ({
                    invoice_id: item.id,
                    nomor_invoice: item.nomor_invoice,
                    nominal_bayar: Number(item.nominal_bayar),
                    bank_id: item.bank_id,
                    tgl_bayar: item.tgl_bayar,
                    catatan_bayar: item.catatan_bayar || null,
                })),
        };
        try {
            // console.log(payload);

            const response = await axios.post(
                "/admin/create-pembayaran",
                payload
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
            fetchData();
            setLoading(false);
            // window.location.reload();
        } catch (error) {
            console.error("There was a problem with the Axios request:", error);
            setLoading(false);
            throw error;
        }
    }

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...dataListPaket.item];
        updatedItems[index][field] = value;
        setDataListPaket({ item: updatedItems });
    };
    const handleFillNominal = (index) => {
        const updatedItems = [...dataListPaket.item];
        updatedItems[index].nominal_bayar = updatedItems[index].sisa;
        setDataListPaket({ item: updatedItems });
    };

    const totalPiutang = dataListPaket.item.reduce(
        (sum, item) => sum + Number(item.sisa || 0),
        0
    );

    const totalPembayaran = dataListPaket.item.reduce(
        (sum, item) =>
            sum +
            (Number(item.nominal_bayar) > 0 ? Number(item.nominal_bayar) : 0),
        0
    );

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
                    className="rounded-none bg-card"
                >
                    <div className="mb-8 flex items-center bg-card justify-between gap-8">
                        <div className="">
                            <Typography variant="h5" color="white">
                                Detail piutang {nama}
                            </Typography>
                        </div>
                        <div className="flex shrink-0  flex-col sm:flex-row">
                            <Button
                                className="flex px-2 items-center bg-gold gap-1"
                                size="sm"
                                disabled={dataListPaket.item.length == 0}
                                onClick={() => {
                                    postPembayaran();
                                }}
                            >
                                <PlusCircleIcon
                                    strokeWidth={2}
                                    className="h-4 w-4"
                                />{" "}
                                save
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-y-scroll ">
                    <p className="text-white font-bold">
                        Total Piutang: {rupiah(totalPiutang)}
                    </p>
                    <p className="text-white font-bold">
                        Total nominal Pembayaran: {rupiah(totalPembayaran)}
                    </p>
                    <table className="mt-4 w-full min-w-max mb-16 ">
                        <thead>
                            <tr className="">
                                <th
                                    key="#"
                                    className="px-2 cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
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
                                    key="tanggal"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Tgl. nota
                                        </Typography>
                                    </div>
                                </th>

                                <th
                                    key="invoice_number"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            No. Invoice
                                        </Typography>
                                    </div>
                                </th>

                                <th
                                    key="sisa"
                                    className="cursor-pointer border border-blue-gray-100 bg-card transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Sisa
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="nominal_bayar"
                                    className="cursor-pointer border border-blue-gray-100 bg-gray-600 transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            nominal bayar
                                        </Typography>
                                    </div>
                                </th>
                                <th
                                    key="Bank"
                                    className="cursor-pointer border border-blue-gray-100 bg-gray-600 transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Bank
                                        </Typography>
                                    </div>
                                </th>

                                <th
                                    key="Catatan_bayar"
                                    className="cursor-pointer border border-blue-gray-100 bg-gray-600 transition-colors hover:bg-[#3d3d3d]"
                                >
                                    <div className=" flex justify-center">
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none "
                                        >
                                            Catatan bayar
                                        </Typography>
                                    </div>
                                </th>

                                <th
                                    key="Tgl.bayar"
                                    className="cursor-pointer border border-blue-gray-100 bg-gray-600 transition-colors hover:bg-[#3d3d3d] p-6 "
                                >
                                    <Typography
                                        variant="small"
                                        color="white"
                                        className="flex items-center justify-between gap-2 font-normal leading-none "
                                    >
                                        Tgl. Bayar
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {dataListPaket.item.length == 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center border text-white font-bold text-2xl p-2"
                                    >
                                        No Data Found
                                    </td>
                                </tr>
                            ) : (
                                dataListPaket.item.map((data, index) => {
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
                                                    <button
                                                        type="button"
                                                        className="bg-green-600 m-1 text-white text-xs px-1 py-1 rounded hover:bg-green-700"
                                                        onClick={() =>
                                                            handleFillNominal(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <CurrencyDollarIcon
                                                            strokeWidth={2}
                                                            className="h-5 w-5"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={`${classes}`}>
                                                <div className="flex px-1 items-center justify-center ">
                                                    <Typography
                                                        variant="small"
                                                        color="white"
                                                        className="font-normal"
                                                    >
                                                        {formatTanggal(
                                                            data.tanggal_nota
                                                        )}
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
                                                        {data.nomor_invoice}
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
                                                        {rupiah(
                                                            Number(
                                                                data.grand_total
                                                            ) -
                                                                Number(
                                                                    data.total_bayar
                                                                )
                                                        )}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-white">
                                                        {rupiah(
                                                            data.nominal_bayar
                                                        )}
                                                    </p>
                                                    <input
                                                        type="number"
                                                        placeholder="nominal bayar"
                                                        className="src_change w-40 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        value={
                                                            data.nominal_bayar
                                                        }
                                                        max={data.sisa}
                                                        onFocus={(e) => {
                                                            e.target.select(); // ← aktifkan jika ingin semua teks terseleksi saat klik
                                                        }}
                                                        onChange={(e) => {
                                                            const value =
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                );
                                                            const sisa = Number(
                                                                data.sisa
                                                            );

                                                            // Cegah input melebihi sisa
                                                            if (value > sisa) {
                                                                handleInputChange(
                                                                    index,
                                                                    "nominal_bayar",
                                                                    sisa
                                                                );
                                                            } else {
                                                                handleInputChange(
                                                                    index,
                                                                    "nominal_bayar",
                                                                    value
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <select
                                                        value={
                                                            data.bank_id || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "bank_id",
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Pilih Bank
                                                        </option>
                                                        {bank.map((item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.nama_bank}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <textarea
                                                        value={
                                                            data.catatan_bayar ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "catatan_bayar",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className={`${classes} px-2`}>
                                                <div className="flex flex-col justify-center">
                                                    <input
                                                        type="datetime-local"
                                                        id="tanggal_nota"
                                                        placeholder="Tanggal Pemberkatan"
                                                        className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        value={data.tgl_bayar}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                index,
                                                                "tgl_bayar",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </NewAuthenticated>
    );
}
