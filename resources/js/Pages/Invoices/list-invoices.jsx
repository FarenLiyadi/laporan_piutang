import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import Dropdown from "@/Components/Dropdown";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";
import {
    formatJamIndo,
    formatTanggal,
    formatTanggalIndo,
    formatTanggalIndoLengkap,
    rupiah,
} from "@/utils/formatTanggal";
import {
    Button,
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Typography,
} from "@material-tailwind/react";

export default function listInvoices({ auth }) {
    const title = "Data Invoices";
    const today = new Date();
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState({});
    const [username, setUsername] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setstatus] = useState(0);
    const [page, setPage] = useState(1);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [dataListPemberkatan, setdataListPemberkatan] = useState({
        item: [],
        total: 0,
    });
    const cart = [];
    const [counter, setCounter] = useState(1);

    async function search() {
        const response = await getListPemberkatan(page, length, username);
        if (response) {
            setLoading(false);
        }
        setCounter((page - 1) * length + 1);
        setTotalPages(Math.ceil(response.total / length));
        setdataListPemberkatan(response);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                search();
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [length, page, username, status, startDate, endDate]);

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

    async function deletePemberkatan(e, id) {
        e.preventDefault();

        const confirmed = await confirmDeleteWithInput();
        if (!confirmed) return;

        const data = {
            item_id: id,
        };

        try {
            const response = await axios.post("/admin/delete-invoices", data);
            if (response.data.code !== 0) {
                toast.error(response.data.msg, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                throw new Error(response.data.msg);
            }
            // Untuk Nofitikasi
            toast.success(response.data.msg, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
            search();
        } catch (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
            console.error("There was a problem with the Axios request:", error);
            throw error;
        }
    }

    async function getListPemberkatan(page = 1, length = 10, username = "") {
        let parameter = {
            page: page,
            length: length,
            username: username,
            status: status,
            startDate: startDate,
            endDate: endDate,
        };

        try {
            // console.log(parameter);

            const response = await axios.get("/admin/list-invoices-request", {
                params: parameter,
            });
            if (response.data.code !== 0) {
                toast.error(response.data.msg, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                throw new Error(response.data.msg);
            }
            return response.data.data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    function pageAddPemberkatan() {
        window.location.href = "/admin/create-invoices";
    }
    function pageUpdatePemberkatan(data) {
        // console.log(data);
        if (data?.pembayaran.length > 0) {
            return toast.error("hapus  pembayaran terlebih dahulu", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
        }

        window.location.href = `/admin/update-invoices?id=${data.id}`;
    }
    function resetPencarian() {
        const inputs = document.querySelectorAll(
            ".src_keyup, .src_change, .src_date"
        );
        inputs.forEach(function (input) {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            } else if (input.tagName === "SELECT") {
                // Handle Select2 elements
                if (input.classList.contains("js-select2")) {
                    // Use Select2's method to reset
                    $(input).val(0).trigger("change");
                } else {
                    input.selectedIndex = 0;
                }
            } else {
                input.value = "";

                if (input._flatpickr) {
                    input._flatpickr.clear();
                }
            }
        });

        setUsername("");
        setPage(1);
    }
    const [openDetail, setOpenDetail] = useState(false);

    const handleOpenDetail = (item) => {
        console.log(item);
        setDetail(item);
        // console.log("tester date", cart);

        setOpenDetail(!openDetail);
    };
    return (
        <NewAuthenticated>
            <Dialog
                size="xxl"
                open={openDetail}
                handler={handleOpenDetail}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="bg-card rounded-lg px-4"
            >
                <div className="bg-card">
                    <DialogHeader>
                        <div className="text-white w-full">
                            <p className="mb-4 text-2xl font-semibold">
                                Detail Invoice
                            </p>

                            <div className="  grid grid-cols-2 gap-x-6 gap-y-2 text-lg">
                                <p>No : {detail?.nomor_invoice ?? ""}</p>
                                <p>Customer : {detail?.customer?.nama ?? ""}</p>
                                <p>Sales : {detail?.sales?.nama ?? "-"}</p>
                                <p>
                                    Tgl. Nota :{" "}
                                    {detail?.tanggal_nota
                                        ? formatTanggalIndoLengkap(
                                              detail.tanggal_nota
                                          )
                                        : "-"}
                                </p>
                                <p>
                                    Tgl. Dibuat :{" "}
                                    {detail?.created_at
                                        ? formatTanggalIndoLengkap(
                                              detail.created_at
                                          )
                                        : "-"}
                                </p>
                                <p>
                                    Dibuat oleh :{" "}
                                    {detail?.created_by_user?.username
                                        ? detail.created_by_user.username
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    <DialogBody>
                        <Card className="h-full w-full overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr key="head">
                                        <th
                                            key="no"
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                No
                                            </Typography>
                                        </th>
                                        <th
                                            key="item"
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                Tanggal
                                            </Typography>
                                        </th>
                                        <th
                                            key="vendor"
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                Bank
                                            </Typography>
                                        </th>
                                        <th
                                            key="harga"
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                Nominal
                                            </Typography>
                                        </th>
                                        <th
                                            key="catatan"
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                Catatan
                                            </Typography>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    {detail?.pembayaran?.length > 0
                                        ? detail.pembayaran.map((e, index) => {
                                              return (
                                                  <tr
                                                      key={index}
                                                      className="even:bg-blue-gray-100/50"
                                                  >
                                                      <td className="p-4">
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal"
                                                          >
                                                              {index + 1}
                                                          </Typography>
                                                      </td>
                                                      <td className="p-4">
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal"
                                                          >
                                                              {formatTanggalIndoLengkap(
                                                                  e.created_at
                                                              )}
                                                          </Typography>
                                                      </td>

                                                      <td className="p-4">
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal"
                                                          >
                                                              {e.bank.nama_bank}
                                                          </Typography>
                                                      </td>
                                                      <td className="p-4">
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal"
                                                          >
                                                              {rupiah(
                                                                  e.nominal
                                                              )}
                                                          </Typography>
                                                      </td>
                                                      <td className="p-4">
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal"
                                                          >
                                                              {e.catatan ?? "-"}
                                                          </Typography>
                                                      </td>
                                                  </tr>
                                              );
                                          })
                                        : "not yet"}

                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-end pr-4"
                                        >
                                            <span>Total Bayar :</span>{" "}
                                        </td>
                                        <td className="text-start pr-4">
                                            {rupiah(detail.total_bayar)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-end pr-4"
                                        >
                                            <span>Grand Total Invoice :</span>{" "}
                                        </td>
                                        <td className="text-start pr-4">
                                            {rupiah(detail.grand_total)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-end pr-4 text-red-500"
                                        >
                                            <span>Sisa :</span>{" "}
                                        </td>
                                        <td className="text-start pr-4">
                                            {rupiah(
                                                detail.grand_total -
                                                    detail.total_bayar
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>
                        <div className="mt-4 border border-white p-4 rounded-lg">
                            <p className="text-lg text-white">
                                Catatan invoice :
                            </p>
                            <p className="text-lg text-white">
                                {detail?.catatan ?? "-"}
                            </p>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={handleOpenDetail}
                            className="mr-2"
                        >
                            <span>Close</span>
                        </Button>
                    </DialogFooter>
                </div>
            </Dialog>
            <Head title={title} />
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

            <div className="pt-5">
                <div className="flex justify-between my-auto sm:px-6 lg:px-8 space-y-6">
                    <div>
                        <button
                            type="button"
                            className="text-white bg-gold text-lg hover:opacity-90  rounded-lg px-4 py-2"
                            onClick={pageAddPemberkatan}
                        >
                            + Invoice
                        </button>
                    </div>

                    {/* BreadCrumb Navigation */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <a
                                    href="/"
                                    className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Dashboard
                                </a>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                        className="rtl:rotate-180 w-3 h-3 text-white mx-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-white md:ms-2 dark:text-gray-400">
                                        {title}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="py-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-[#212121] dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="flex justify-between items-center">
                            <label className="font-bold text-white text-3xl">
                                Pencarian
                            </label>
                            <button
                                onClick={resetPencarian}
                                className="hint-text  text-white dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-2 px-4 rounded-lg"
                            >
                                Reset
                            </button>
                        </div>
                        <div className="my-2  grid grid-flow-col auto-cols-max gap-4">
                            {/* Input Nama */}
                            <div className="w-full max-w-sm">
                                <label
                                    htmlFor="nama"
                                    className="block mb-2 text-md font-medium text-white"
                                >
                                    Nama / invoice
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    name="nama"
                                    className="bg-gray-50 src_change border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gold focus:border-gold block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>

                            <div className="">
                                <Typography
                                    variant="paragraph"
                                    color="white"
                                    className="mb-2"
                                >
                                    Start date
                                </Typography>
                                <Input
                                    type="date"
                                    label="start date"
                                    value={startDate}
                                    onSelect={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="bg-white src_date"
                                    color="orange"
                                />
                            </div>
                            <div className="">
                                <Typography
                                    variant="paragraph"
                                    color="white"
                                    className="mb-2"
                                >
                                    End date
                                </Typography>
                                <Input
                                    type="date"
                                    label="end date"
                                    value={endDate}
                                    onSelect={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-white src_date"
                                    color="orange"
                                />
                            </div>
                            {/* Select Status */}
                            <div className="w-full max-w-sm">
                                <label
                                    htmlFor="status"
                                    className="block mb-3 text-md font-medium text-white"
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
                                    className="w-full   text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value={0}>Semua</option>
                                    <option value={1}>Kredit</option>
                                    <option value={2}>Lunas</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pb-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-card dark:bg-gray-800 shadow sm:rounded-lg overflow-x-auto">
                        <h2 className="text-3xl font-extrabold text-white">
                            {title}
                        </h2>
                        <div className="pt-4 table-auto w-full pb-24">
                            <table className="border-collapse w-full border border-slate-500 text-white">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-600 text-lg p-2">
                                            #
                                        </th>
                                        <th className="border border-slate-600 text-start text-lg p-2">
                                            Tgl nota
                                        </th>
                                        <th className="border border-slate-600 text-start text-lg p-2">
                                            No. Invoice
                                        </th>
                                        <th className="border border-slate-600 text-start text-lg p-2">
                                            Customer
                                        </th>
                                        <th className="border border-slate-600 text-lg p-2">
                                            Grand total
                                        </th>
                                        <th className="border border-slate-600 text-lg p-2">
                                            Bayar
                                        </th>
                                        <th className="border border-slate-600 text-lg p-2">
                                            Status
                                        </th>
                                        <th className="border border-slate-600 text-lg p-2">
                                            Tgl. J.tempo
                                        </th>
                                        <th className="border border-slate-600 text-lg p-2">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                    {dataListPemberkatan.total === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="text-center font-bold text-2xl p-2"
                                            >
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (
                                        dataListPemberkatan.item.map(
                                            (data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="text-center text-md border border-slate-600 py-2">
                                                            {counter + index}
                                                        </td>
                                                        <td className="text-start border border-slate-700 text-md px-3">
                                                            {formatTanggalIndoLengkap(
                                                                data.tanggal_nota
                                                            )}
                                                        </td>
                                                        <td className="text-start border border-slate-700 text-md px-3">
                                                            {data.nomor_invoice}
                                                        </td>
                                                        <td className="text-start border border-slate-700 text-md px-3">
                                                            {data?.customer
                                                                ?.nama ?? "-"}
                                                        </td>
                                                        <td className="text-start border border-slate-700 text-md px-3">
                                                            {rupiah(
                                                                data.grand_total
                                                            ) ?? "-"}
                                                        </td>
                                                        <td className="text-start border border-slate-700 text-md px-3">
                                                            {rupiah(
                                                                data.total_bayar
                                                            ) ?? "-"}
                                                        </td>
                                                        <td className=" text-start border border-slate-700 text-md px-1">
                                                            <p
                                                                className={`${
                                                                    Number(
                                                                        data.total_bayar
                                                                    ) >=
                                                                    Number(
                                                                        data.grand_total
                                                                    )
                                                                        ? "bg-green-600"
                                                                        : "bg-red-600"
                                                                } text-center rounded-lg`}
                                                            >
                                                                {Number(
                                                                    data.total_bayar
                                                                ) >=
                                                                Number(
                                                                    data.grand_total
                                                                )
                                                                    ? "Lunas"
                                                                    : "Kredit"}
                                                            </p>
                                                        </td>
                                                        <td className="text-start border border-slate-700 text-md px-3">
                                                            {formatTanggal(
                                                                data.jatuh_tempo
                                                            )}
                                                        </td>
                                                        <td className=" p-1 text-center border border-slate-700">
                                                            <Dropdown className="absolute">
                                                                <Dropdown.Trigger>
                                                                    <span className="inline-flex rounded-md">
                                                                        <button
                                                                            type="button"
                                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                                        >
                                                                            aksi
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
                                                                                handleOpenDetail(
                                                                                    data
                                                                                )
                                                                            }
                                                                        >
                                                                            detail
                                                                        </p>
                                                                        <p
                                                                            className={
                                                                                "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                            }
                                                                            // href={`/admin/update-invoices?id=${data.id}`}
                                                                            onClick={() =>
                                                                                pageUpdatePemberkatan(
                                                                                    data
                                                                                )
                                                                            }
                                                                        >
                                                                            edit
                                                                        </p>
                                                                        <p
                                                                            className={
                                                                                "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                            }
                                                                            onClick={(
                                                                                event
                                                                            ) =>
                                                                                deletePemberkatan(
                                                                                    event,
                                                                                    data.id
                                                                                )
                                                                            }
                                                                        >
                                                                            hapus
                                                                        </p>
                                                                    </div>
                                                                </Dropdown.Content>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
