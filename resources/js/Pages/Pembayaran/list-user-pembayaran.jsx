import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { formatTanggalIndo } from "@/utils/formatTanggal";

export default function listUserPembayaran({ auth }) {
    const title = "Daftar Piutang Customer";
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [username, setUsername] = useState("");
    const [dataListUser, setDataListUser] = useState({ item: [], total: 0 });
    const [counter, setCounter] = useState(1);
    const [sort, setsort] = useState(0);
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
    }, [username, length, page, sort]);

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
            sort: sort,
        };

        try {
            const response = await axios.get("/admin/list-pembayaran-request", {
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

    function pageAddUser() {
        window.location.href = "/admin/list-pembayaran-user";
    }

    return (
        <NewAuthenticated>
            <Head title="Daftar Pengeluaran per Customer" />
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
                                        Nama
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
                                <div className="w-full max-w-sm">
                                    <label
                                        htmlFor="sort"
                                        className="block mb-3 text-md font-medium text-white"
                                    >
                                        Sort
                                    </label>
                                    <select
                                        id="sort"
                                        name="sort"
                                        value={sort}
                                        onChange={(e) => {
                                            setsort(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="w-full   text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value={0}>pilih</option>
                                        <option value={1}>max</option>
                                        <option value={2}>min</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pb-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-card text-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl text-dark font-extrabold">
                                {title}
                            </h2>
                            <button
                                type="button"
                                onClick={pageAddUser}
                                className="text-white  bg-[#e49f28] dark:bg-[#e49f28] hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-1 px-2 rounded"
                                title="Tambah"
                            >
                                <p>List Pembayaran</p>
                            </button>
                        </div>
                        <div className="pt-4 table-auto text-dark w-full">
                            <table className="border-collapse w-full border border-slate-500">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-600 text-xl p-2">
                                            #
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            Nama
                                        </th>

                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            Total piutang
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
                                                colSpan="4"
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
                                                    {user?.nama}
                                                </td>
                                                <td className="text-center border border-slate-700 px-3">
                                                    {rupiah(user?.sisa)}
                                                </td>

                                                <td className="text-center border border-slate-700">
                                                    <div className="">
                                                        <a
                                                            href={`pembayaran-user?id=${user.id}`}
                                                            className="text-white mr-2 text-sm bg-gold dark:bg-gray-800 hover:text-dark py-1 px-1.5 font-semibold rounded"
                                                        >
                                                            <i
                                                                className="fa-solid fa-square-plus"
                                                                title="tambah pembayaran"
                                                            ></i>
                                                        </a>
                                                        {/* <a
                                                            href={`list-pembayaran-user?id=${user.id}`}
                                                            className="text-white mr-2 text-sm bg-gold dark:bg-gray-800 hover:text-dark py-1 px-1.5 font-semibold rounded"
                                                        >
                                                            <i
                                                                className="fa-solid fa-circle-info"
                                                                title="list pembayaran piutang"
                                                            ></i>
                                                        </a>*/}
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
