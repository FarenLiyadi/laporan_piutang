import { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import {
    formatTanggal,
    formatTanggalIndo,
    rupiah,
} from "@/utils/formatTanggal";
import Select from "react-select";

export default function reportHadiah({ auth, salesList }) {
    // console.log(salesList);

    // sales
    const [selected2, setSelected2] = useState(null);

    const [custName, setcustName] = useState("");
    const [pihak, setPihak] = useState("");
    const [loading, setLoading] = useState(false);
    const [jatuh_tempo, setjatuh_tempo] = useState(2);
    const [total_piutang, settotal_piutang] = useState(0);
    const [total_invoice, settotal_invoice] = useState(0);
    const [total_customer, settotal_customer] = useState(0);
    const [sort, setsort] = useState(0);

    const [data, setData] = useState([]);

    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get("id") ?? "";

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    async function search() {
        const response = await getReportTamu(userId, jatuh_tempo);
        // console.log(response);
        if (response) {
            setLoading(false);
        }
        // console.log(response);

        // setTotals({
        //     undangan: response.item.length,
        //     pax: paxCount,
        //     hadir: hadirCount,
        //     tidakHadir: tidakHadirCount,
        //     paxHadir: paxHadir,
        //     paxTidakHadir: paxTidakHadir,
        // });

        console.log(response.item);
        settotal_customer(response.total_customer);
        settotal_invoice(response.total_invoice);
        settotal_piutang(response.total_piutang);
        setData(response.item);
        setcustName(response.custName);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
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
    }, [jatuh_tempo, selected2, sort]);

    async function getReportTamu(user_id, jatuh_tempo) {
        let parameter = {
            user_id: user_id,
            jatuh_tempo: jatuh_tempo,
            sales: selected2?.value ?? "",
            sort: sort,
        };

        try {
            console.log(parameter);

            const response = await axios.get(
                "/admin/report-piutang-beredar-request",
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
        setPihak("");
        document.getElementById("jatuh_tempo").selectedIndex = 0;
    }
    const title = `Report Piutang ${jatuh_tempo == 0 ? "Tidak Sehat" : ""} ${
        jatuh_tempo == 1 ? "Jatuh Tempo" : ""
    } ${jatuh_tempo == 2 ? "Beredar" : ""}`;

    return (
        <NewAuthenticated>
            <style>
                {`
          @media print {
            .print-layout {
              position: relative;
            }
            .print-layout::before {
            content: "";
            position: absolute;
            background-color:transparant;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            background-image: url("/img/BG.png"); /* sesuaikan path jika berbeda */
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;  /* Full satu halaman */
            opacity: 0.2;  /* Bisa kamu atur sesuai kontras yang kamu mau */
            }
    
            .print-layout * {
              position: relative;
            z-index: 999;
            }
          }
        `}
            </style>
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
                                    Filter
                                </label>
                                {/* <button
                                    onClick={resetPencarian}
                                    className="text-white dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-1.5 px-3 rounded-lg"
                                >
                                    Reset
                                </button>*/}
                            </div>

                            <div className="my-2 grid grid-flow-col auto-cols-max gap-2">
                                <div className="md:w-56 w-full max-w-sm">
                                    <label
                                        htmlFor="jatuh tempo"
                                        className="block mb-1 text-md font-medium text-white"
                                    >
                                        Status Piutang
                                    </label>
                                    <select
                                        id="jatuh_tempo"
                                        name="jatuh_tempo"
                                        value={jatuh_tempo}
                                        onChange={(e) => {
                                            setjatuh_tempo(
                                                Number(e.target.value)
                                            );
                                        }}
                                        className="w-full text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value={2}>Beredar</option>
                                        <option value={1}>J. Tempo</option>
                                        <option value={0}>Tidak Sehat</option>
                                    </select>
                                </div>

                                <div className="">
                                    <label
                                        htmlFor="sales"
                                        className="block mb-1 font-medium text-white dark:text-white"
                                    >
                                        Sales
                                    </label>
                                    <Select
                                        options={salesList}
                                        value={selected2}
                                        onChange={setSelected2}
                                        isClearable
                                        isSearchable
                                        placeholder="Cari sales..."
                                    />
                                </div>
                                <div className="w-full max-w-sm">
                                    <label
                                        htmlFor="sort"
                                        className="block mb-1 text-md font-medium text-white"
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
                                        className="w-full   text-sm  border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value={0}>pilih</option>
                                        <option value={1}>max</option>
                                        <option value={2}>min</option>
                                    </select>
                                </div>
                                {/* <div className="md:w-56 w-full max-w-sm">
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
                                        }}
                                        className="w-full text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-gold focus:border-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value={2}>Semua</option>
                                        <option value={0}>Tidak sehat</option>
                                        <option value={1}>Sehat</option>
                                    </select>
                                </div>*/}
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
                                {title} {!userId ? "All" : custName}
                            </h2>

                            <button
                                type="button"
                                onClick={handlePrint}
                                className="dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 text-white font-bold py-1 px-2 rounded"
                                title="Print"
                            >
                                <i className="fa-solid fa-print"></i>
                            </button>
                        </div>
                        <div className="pt-4 table-auto overflow-x-auto text-dark w-full">
                            <table className="border-collapse w-full border border-slate-500">
                                <thead>
                                    <tr>
                                        <th className="text-start border border-slate-600 text-xl p-2">
                                            tgl. nota
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl p-2">
                                            nomor invoice
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl p-2">
                                            customer
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl p-2">
                                            grand total
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            sales
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl p-2">
                                            tgl. jt
                                        </th>
                                        <th className="text-center border border-slate-600 text-xl p-2">
                                            sisa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                    {data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center font-bold text-2xl p-2"
                                            >
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {data.map((dt, index) => (
                                                <tr key={index}>
                                                    <td className="border border-slate-700 px-3">
                                                        {formatTanggal(
                                                            dt.tanggal_nota
                                                        )}
                                                    </td>
                                                    <td className="border border-slate-700 px-3">
                                                        {dt.nomor_invoice}
                                                    </td>
                                                    <td className="border border-slate-700 px-3">
                                                        {dt?.customer?.nama ??
                                                            "-"}
                                                    </td>

                                                    <td className="border border-slate-700 px-3">
                                                        {rupiah(dt.grand_total)}
                                                    </td>
                                                    <td className="text-center border border-slate-700 px-3">
                                                        {dt?.sales?.nama ?? "-"}
                                                    </td>
                                                    <td className="border border-slate-700 px-3">
                                                        {formatTanggal(
                                                            dt.jatuh_tempo
                                                        )}
                                                    </td>
                                                    <td className="text-center border border-slate-700 px-3">
                                                        {rupiah(dt.sisa)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Totals Row */}
                                            <tr>
                                                <td
                                                    colSpan="2"
                                                    className="text-center font-bold border border-slate-700 px-3"
                                                >
                                                    Total Invoice:{" "}
                                                    {total_invoice}
                                                </td>
                                                <td
                                                    colSpan="3"
                                                    className="text-center font-bold border border-slate-700 px-3"
                                                >
                                                    Total Customer:{" "}
                                                    {total_customer}
                                                </td>
                                                <td
                                                    colSpan="2"
                                                    className="text-center font-bold border border-slate-700 px-3"
                                                >
                                                    Total Piutang:{" "}
                                                    {rupiah(total_piutang)}
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Printing */}
            <div className="hidden ">
                <div ref={componentRef} className="print-layout relative">
                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold">KREDIT SGK</h2>
                        <h2 className="text-3xl font-bold">
                            {title} {!userId ? "All" : custName}
                        </h2>
                    </div>

                    {/* Table Section */}
                    <div className="table-auto w-full">
                        <table className="border-collapse w-full border border-black">
                            <thead>
                                <tr>
                                    <th className="text-start border border-black text-xl p-2">
                                        tgl. nota
                                    </th>
                                    <th className="text-start border border-black text-xl p-2">
                                        nomor invoice
                                    </th>
                                    <th className="text-start border border-black text-xl p-2">
                                        customer
                                    </th>
                                    <th className="text-start border border-black text-xl p-2">
                                        grand total
                                    </th>
                                    <th className="text-center border border-black text-xl p-2">
                                        sales
                                    </th>
                                    <th className="text-start border border-black text-xl p-2">
                                        tgl. jt
                                    </th>
                                    <th className="text-center border border-black text-xl p-2">
                                        sisa
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="table-body">
                                {data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center font-bold text-2xl p-2"
                                        >
                                            No Data Found
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {data.map((dt, index) => (
                                            <tr key={index}>
                                                <td className="border border-black px-3">
                                                    {formatTanggal(
                                                        dt.tanggal_nota
                                                    )}
                                                </td>
                                                <td className="border border-black px-3">
                                                    {dt.nomor_invoice}
                                                </td>
                                                <td className="border border-black px-3">
                                                    {dt?.customer?.nama ?? "-"}
                                                </td>

                                                <td className="border border-black px-3">
                                                    {rupiah(dt.grand_total)}
                                                </td>
                                                <td className="text-center border border-black px-3">
                                                    {dt?.sales?.nama ?? "-"}
                                                </td>
                                                <td className="border border-black px-3">
                                                    {formatTanggal(
                                                        dt.jatuh_tempo
                                                    )}
                                                </td>
                                                <td className="text-center border border-black px-3">
                                                    {rupiah(dt.sisa)}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Totals Row */}
                                        <tr>
                                            <td
                                                colSpan="2"
                                                className="text-center font-bold border border-black px-3"
                                            >
                                                Total Invoice: {total_invoice}
                                            </td>
                                            <td
                                                colSpan="3"
                                                className="text-center font-bold border border-black px-3"
                                            >
                                                Total Customer: {total_customer}
                                            </td>
                                            <td
                                                colSpan="3"
                                                className="text-center font-bold border border-black px-3"
                                            >
                                                Total Piutang:{" "}
                                                {rupiah(total_piutang)}
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
