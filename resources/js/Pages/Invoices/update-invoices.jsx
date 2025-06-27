import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { rupiah } from "@/utils/formatTanggal";

export default function createPemberkatan({
    auth,
    customerList,
    salesList,
    salesFix,
    invoice,
}) {
    const getCurrentDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        now.setMinutes(now.getMinutes() - offset); // agar sesuai timezone lokal
        return now.toISOString().slice(0, 16); // potong ke format YYYY-MM-DDTHH:MM
    };
    console.log(salesFix);

    const [tanggal_nota, settanggal_nota] = useState(invoice.tanggal_nota);
    const [jatuh_tempo, setjatuh_tempo] = useState(invoice.jatuh_tempo);
    const [grand_total, setgrand_total] = useState(Number(invoice.grand_total));
    const [nomor_invoice, setnomor_invoice] = useState(invoice.nomor_invoice);
    const [catatan, setcatatan] = useState(invoice.catatan);
    const [errors, setErrors] = useState({});
    // customer
    const [selected, setSelected] = useState(customerList[0]);
    // sales
    const [selected2, setSelected2] = useState(salesFix[0]);

    async function submitHandler(e) {
        e.preventDefault();

        let errors = {};

        if (!selected?.value.trim()) {
            return toast.error("pilih customer terlebih dahulu", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
        }

        if (grand_total <= 0) {
            return toast.error("grand total tidak bisa 0", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
        }
        if (!jatuh_tempo) {
            return toast.error("pilih tanggal jatuh tempo terlebih dahulu", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
        }

        if (Object.keys(errors).length === 0) {
            const data = {
                customer: selected?.value,
                sales: selected2?.value,
                jatuh_tempo: jatuh_tempo,
                tanggal_nota: tanggal_nota,
                grand_total: Number(grand_total),
                nomor_invoice: nomor_invoice,
                catatan: catatan,
                id: invoice.id,
            };

            try {
                console.log(data);

                const response = await axios.post(
                    "/admin/update-invoices",
                    data
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
                // Untuk Nofitikasi
                localStorage.setItem(
                    "notif",
                    JSON.stringify({
                        type: "success",
                        msg: response.data.msg,
                    })
                );
                window.location.href = "/admin/list-invoices";
            } catch (error) {
                toast.error(error, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                console.error(
                    "There was a problem with the Axios request:",
                    error
                );
                throw error;
            }
        } else {
            setErrors(errors);
        }
    }
    return (
        <NewAuthenticated>
            <Head title="Update invoice" />

            <div className="pt-5 overflow-auto">
                <div className="flex justify-between items-baseline my-auto sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl text-white font-bold">
                        Update Invoice
                    </h2>

                    {/* BreadCrumb Navigation */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <a
                                        href="/"
                                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Dashboard
                                    </a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                        className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
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
                                    <a
                                        href={`/admin/list-invoices`}
                                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Daftar Invoice
                                    </a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                        className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
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
                                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                        Update Invoice
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
                            <form onSubmit={submitHandler}>
                                <div className="my-2 grid grid-cols-2 justify-center gap-4">
                                    <div className="">
                                        <label
                                            htmlFor="nomor_invoice"
                                            className="capitalize block mb-2 font-medium text-white dark:text-white"
                                        >
                                            nomor invoice (can't edit)
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            id="nomor_invoice"
                                            placeholder="nomor invoice"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={nomor_invoice}
                                            onChange={(event) => {
                                                setnomor_invoice(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                        {errors.nomor_invoice && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.nomor_invoice}
                                            </div>
                                        )}
                                    </div>
                                    <div className="">
                                        <label
                                            htmlFor="tanggal_nota"
                                            className="capitalize block mb-2 font-medium text-white dark:text-white"
                                        >
                                            tanggal nota
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="tanggal_nota"
                                            placeholder="Tanggal Pemberkatan"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={tanggal_nota}
                                            onChange={(event) => {
                                                settanggal_nota(
                                                    event.target.value
                                                );
                                            }}
                                        />
                                        {errors.tanggal_nota && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.tanggal_nota}
                                            </div>
                                        )}
                                    </div>
                                    <div className="">
                                        <label
                                            htmlFor="customer"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Customer (can't edit)
                                        </label>
                                        <Select
                                            isDisabled={true}
                                            options={customerList}
                                            value={selected}
                                            onChange={setSelected}
                                            isClearable
                                            isSearchable
                                            placeholder="Cari customer..."
                                            styles={{
                                                singleValue: (base, state) => ({
                                                    ...base,
                                                    color: state.isDisabled
                                                        ? "black"
                                                        : base.color,
                                                }),
                                                input: (base, state) => ({
                                                    ...base,
                                                    color: state.isDisabled
                                                        ? "black"
                                                        : base.color,
                                                }),
                                                placeholder: (base, state) => ({
                                                    ...base,
                                                    color: state.isDisabled
                                                        ? "#555"
                                                        : base.color,
                                                }),
                                            }}
                                        />
                                    </div>
                                    <div className="">
                                        <label
                                            htmlFor="sales"
                                            className="block mb-2 font-medium text-white dark:text-white"
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
                                    <div>
                                        <label
                                            htmlFor="grand_total"
                                            className="capitalize block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Grand Total ({rupiah(grand_total)})
                                        </label>
                                        <input
                                            type="number"
                                            id="grand_total"
                                            placeholder="grand total"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={grand_total}
                                            onChange={(event) => {
                                                setgrand_total(
                                                    event.target.value
                                                );
                                            }}
                                            onFocus={(e) => {
                                                e.target.select(); // ← aktifkan jika ingin semua teks terseleksi saat klik
                                            }}
                                        />
                                        {errors.grand_total && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.grand_total}
                                            </div>
                                        )}
                                    </div>
                                    <div className="">
                                        <label
                                            htmlFor="jatuh_tempo"
                                            className="capitalize block mb-2 font-medium text-white dark:text-white"
                                        >
                                            tanggal jatuh tempo
                                        </label>
                                        <input
                                            type="date"
                                            id="jatuh_tempo"
                                            placeholder="Tanggal Pemberkatan"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={jatuh_tempo}
                                            onChange={(event) => {
                                                setjatuh_tempo(
                                                    event.target.value
                                                );
                                            }}
                                        />

                                        {errors.jatuh_tempo && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.jatuh_tempo}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label
                                            htmlFor="catatan"
                                            className="capitalize block mb-2 font-medium text-white dark:text-white"
                                        >
                                            catatan
                                        </label>
                                        <textarea
                                            type="text"
                                            id="catatan"
                                            placeholder="Catatan"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={catatan}
                                            onChange={(event) => {
                                                setcatatan(event.target.value);
                                            }}
                                        />
                                        {errors.catatan && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.catatan}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-5 col-span-2">
                                        <button
                                            type="submit"
                                            className="capitalize text-white w-full bg-gold font-medium rounded-lg px-5 py-2.5 "
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
