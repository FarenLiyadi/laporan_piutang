import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import Dropdown from "@/Components/Dropdown";
import Select from "react-select";
import { rupiah } from "@/utils/formatTanggal";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";

export default function listProduct({ auth, categoryList, brandList }) {
    const title = "Data Produk";

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [categorySelected, setCategorySelected] = useState(null);
    const [brandSelected, setBrandSelected] = useState(null);

    const [page, setPage] = useState(1);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    const [dataList, setDataList] = useState({
        item: [],
        total: 0,
    });

    const [counter, setCounter] = useState(1);

    async function loadData() {
        setLoading(true);

        const response = await getListProduct(page, length, search);
        if (response) setLoading(false);

        setCounter((page - 1) * length + 1);
        setTotalPages(Math.ceil(response.total / length));
        setDataList(response);
    }

    useEffect(() => {
        loadData();
    }, [page, length, search, categorySelected, brandSelected]);
    useEffect(() => {
        const notif = localStorage.getItem("notif");
        if (notif) {
            const { type, msg } = JSON.parse(notif);

            if (type === "success") toast.success(msg);
            else toast.error(msg);

            localStorage.removeItem("notif");
        }
    }, []);

    async function getListProduct(page = 1, length = 10) {
        const params = {
            page,
            length,
            search,
            category_id: categorySelected ? categorySelected.value : null,
            brand_id: brandSelected ? brandSelected.value : null,
        };

        try {
            const response = await axios.get("/admin/list-product-request", {
                params,
            });

            if (response.data.code !== 0) {
                toast.error(response.data.msg);
                throw new Error(response.data.msg);
            }

            return response.data.data;
        } catch (error) {
            setLoading(false);
            toast.error("Terjadi kesalahan");
            throw error;
        }
    }

    async function deleteProduct(e, id) {
        e.preventDefault();

        const confirmed = await confirmDeleteWithInput();
        if (!confirmed) return;

        try {
            const response = await axios.post("/admin/delete-product", {
                item_id: id,
            });

            if (response.data.code !== 0) {
                toast.error(response.data.msg || "Gagal menghapus");
                return;
            }

            toast.success(response.data.msg);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.msg || error.message);
        }
    }

    function handleChangeLength() {
        const selectedLength = document.getElementById("src_length").value;
        setPage(1);
        setLength(parseInt(selectedLength));
    }

    return (
        <NewAuthenticated>
            {loading && (
                <div className="fixed  inset-0 z-[99] flex items-center justify-center bg-transparent">
                    <RotatingLines
                        width="54"
                        strokeWidth="5"
                        strokeColor="gold"
                    />
                </div>
            )}

            <div className="pt-5 px-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">{title}</h2>
                    <button
                        type="button"
                        className="text-white bg-gold text-lg rounded-lg px-4 py-2"
                        onClick={() =>
                            (window.location.href = "/admin/create-product")
                        }
                    >
                        + Produk
                    </button>
                </div>

                {/* FILTER SECTION */}
                <div className="mt-6 p-4 bg-[#212121] rounded-lg text-white space-y-4">
                    {/* Search */}
                    <div>
                        <label className="font-medium">Pencarian Produk</label>
                        <input
                            type="text"
                            className="w-full mt-2 p-2 bg-white text-black rounded"
                            placeholder="Cari nama atau kode produk..."
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="text-black">
                        <label className="font-medium text-white">
                            Kategori
                        </label>
                        <Select
                            options={categoryList}
                            value={categorySelected}
                            onChange={setCategorySelected}
                            isClearable
                            isSearchable
                            placeholder="Pilih kategori..."
                        />
                    </div>

                    {/* Brand Filter */}
                    <div className="text-black">
                        <label className="font-medium text-white">Brand</label>
                        <Select
                            options={brandList}
                            value={brandSelected}
                            onChange={setBrandSelected}
                            isClearable
                            isSearchable
                            placeholder="Pilih brand..."
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="mt-6 bg-card p-4 rounded-lg text-white overflow-x-auto">
                    <table className="w-full border border-slate-600">
                        <thead>
                            <tr>
                                <th className="border p-2">#</th>
                                <th className="border p-2">Kode Produk</th>
                                <th className="border p-2">Nama Produk</th>
                                <th className="border p-2">Brand</th>
                                <th className="border p-2">Kategori</th>
                                <th className="border p-2">Subkategori</th>
                                <th className="border p-2">Satuan</th>
                                <th className="border p-2">Harga </th>
                                <th className="border p-2">Kode Grosir</th>
                                <th className="border p-2">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataList.total === 0 ? (
                                <tr>
                                    <td
                                        colSpan={10}
                                        className="text-center p-4"
                                    >
                                        Tidak ada data produk
                                    </td>
                                </tr>
                            ) : (
                                dataList.item.map((p, index) => (
                                    <tr key={index}>
                                        <td className="border p-2 text-center">
                                            {counter + index}
                                        </td>
                                        <td className="border p-2">
                                            {p.product_code}
                                        </td>
                                        <td className="border p-2">
                                            {p.product_name}
                                        </td>
                                        <td className="border p-2">
                                            {p.brand?.brand_name ?? "-"}
                                        </td>
                                        <td className="border p-2">
                                            {p.category?.category_name ?? "-"}
                                        </td>
                                        <td className="border p-2">
                                            {p.subcategory?.subcategory_name ??
                                                "-"}
                                        </td>
                                        <td className="border p-2">
                                            {p.unit?.unit_name ?? "-"}
                                        </td>
                                        <td className="border p-2">
                                            {rupiah(p.retail_price ?? 0)}
                                        </td>
                                        <td className="border p-2">
                                            {p.wholesale_code ?? "-"}
                                        </td>

                                        <td className="p-1 text-center border border-slate-700">
                                            <Dropdown className="absolute">
                                                <Dropdown.Trigger>
                                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white dark:text-gray-400 bg-gold dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
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
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <p
                                                        className={
                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                        }
                                                        onClick={() =>
                                                            (window.location.href = `/admin/update-product?id=${p.id}`)
                                                        }
                                                    >
                                                        Edit
                                                    </p>

                                                    <p
                                                        className={
                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                        }
                                                        onClick={(e) =>
                                                            deleteProduct(
                                                                e,
                                                                p.id
                                                            )
                                                        }
                                                    >
                                                        Hapus
                                                    </p>
                                                    <p
                                                        className={
                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                        }
                                                        onClick={() =>
                                                            (window.location.href = `/admin/create-product?duplicate_id=${p.id}`)
                                                        }
                                                    >
                                                        Duplicate
                                                    </p>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <Pagination
                        onChange={handleChangeLength}
                        prevBtn={() => page > 1 && setPage(page - 1)}
                        nextBtn={() => page < totalPages && setPage(page + 1)}
                        handleKeyDown={(e) =>
                            e.key === "Enter" && setPage(Number(e.target.value))
                        }
                        isPrevDisabled={page === 1}
                        isNextDisabled={page === totalPages}
                        page={page}
                        totalPage={totalPages}
                    />
                </div>
            </div>
        </NewAuthenticated>
    );
}
