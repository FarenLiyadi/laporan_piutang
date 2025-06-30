import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { formatTanggalIndo } from "@/utils/formatTanggal";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";
import { Input, Typography } from "@material-tailwind/react";

export default function listUserPembayaran({ auth }) {
    const title = "List Pembayaran Piutang Customer";
    const now = new Date();

    const getStartOfMonth = () => {
        return new Date(now.getFullYear(), now.getMonth(), 0)
            .toISOString()
            .slice(0, 10); // format: 'YYYY-MM-DD'
    };

    const getEndOfMonth = () => {
        return new Date(now.getFullYear(), now.getMonth() + 1, 1)
            .toISOString()
            .slice(0, 10); // format: 'YYYY-MM-DD'
    };
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [username, setUsername] = useState("");
    const [dataListUser, setDataListUser] = useState({ item: [], total: 0 });
    const [counter, setCounter] = useState(1);
    const [startDate, setStartDate] = useState(getStartOfMonth);
    const [endDate, setEndDate] = useState(getEndOfMonth);
    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(number);
    };
    async function search() {
        const response = await getListUser(page, length, username);
        if (response) {
            setLoading(false);
        }

        console.log(response);

        setCounter((page - 1) * length + 1);
        setTotalPages(Math.ceil(response.total / length));
        setDataListUser(response);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                search();
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
        };

        fetchData();
    }, [username, length, page, startDate, endDate]);

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

    async function getListUser(page = 1, length = 10, username) {
        let parameter = {
            page: page,
            length: length,
            username: username,
            startDate: startDate,
            endDate: endDate,
        };

        try {
            const response = await axios.get(
                "/admin/list-pembayaran-user-request",
                {
                    params: parameter,
                }
            );
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
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
            setLoading(false);
            throw error;
        }
    }

    function resetPencarian() {
        setUsername("");
        document.getElementById("nama").value = "";
        setPage(1);
    }

    // console.log(customers);
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
                "/admin/delete-pembayaran",
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
    const submitFormDelete = async (id) => {
        // console.log(id);

        try {
            const response = await hapusPaket(id, page, length);
            // console.log(response);

            setCounter((page - 1) * length + 1);
            setTotalPages(Math.ceil(response.total / length));

            search();
        } catch (error) {
            console.error(error);
        }
        // if (confirm(`Yakin ingin menghapus paket ini ?`) == true) {

        // router.post(`/delete-paket`, { id: id });
        // }
    };
    return (
        <NewAuthenticated>
            <Head title="Daftar Pembayaran per Customer" />
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
                    <div></div>

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
                    <div className="p-4 sm:p-8 bg-card dark:bg-gray-800 shadow sm:rounded-lg">
                        <div>
                            <div className="flex justify-between items-center">
                                <label className="text-white font-bold text-3xl">
                                    Pencarian
                                </label>
                                <button
                                    onClick={resetPencarian}
                                    className="text-white dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-2 px-4 rounded-lg"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="my-2 grid grid-flow-col auto-cols-max gap-2">
                                <div className="">
                                    <label
                                        htmlFor="nama"
                                        className="block mb-2 font-medium text-white dark:text-dark"
                                    >
                                        Nama / invoice
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        placeholder="nama"
                                        className="src_change  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-dark dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(username) => {
                                            setUsername(username.target.value);
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
                                        Start date dibuat
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
                                        End date dibuat
                                    </Typography>
                                    <Input
                                        type="date"
                                        label="end date"
                                        value={endDate}
                                        onSelect={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="bg-white src_date"
                                        color="orange"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pb-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-card text-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <h2 className="text-3xl text-dark font-extrabold">
                            {title}
                        </h2>
                        <div className="pt-4 table-auto text-dark w-full">
                            <table className="border-collapse w-full border border-slate-500">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-600 text-xl p-2">
                                            #
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            Customer
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            nomor invoice
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            JT. invoice
                                        </th>

                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            bank
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            nominal
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            dibuat oleh
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            tgl dibuat
                                        </th>
                                        <th className="border border-slate-600 text-xl p-2">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                    {dataListUser.total === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="text-center font-bold text-2xl p-2"
                                            >
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (
                                        dataListUser.item.map((user, index) => (
                                            <tr key={index}>
                                                <td className="text-center border border-slate-600 py-2">
                                                    {counter + index}
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {
                                                        user?.invoice?.customer
                                                            ?.nama
                                                    }
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {
                                                        user?.invoice
                                                            ?.nomor_invoice
                                                    }
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {formatTanggalIndo(
                                                        user?.invoice
                                                            ?.jatuh_tempo
                                                    )}
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {user?.bank?.nama_bank}
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {rupiah(user?.nominal)}
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {
                                                        user?.created_by_user
                                                            .username
                                                    }
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {formatTanggalIndo(
                                                        user?.created_at
                                                    )}
                                                </td>

                                                <td className="text-center border border-slate-700">
                                                    <div className="">
                                                        <p
                                                            className="text-white inline-block  text-sm bg-gold dark:bg-gray-800 hover:text-dark py-1 px-1.5 font-semibold rounded"
                                                            onClick={() =>
                                                                submitFormDelete(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i
                                                                className="fa-solid fa-trash"
                                                                title="hapus"
                                                            ></i>
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
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
