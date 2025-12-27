import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { rupiah } from "@/utils/formatTanggal";

export default function CreateProduct({
    auth,
    brandList,
    categoryList,
    subcategoryList, // kalau gak dipakai, mending hapus dari props
    unitList,
}) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        product_code: "",
        product_name: "",
        brand_id: null,
        category_id: null,
        subcategory_id: null,
        unit_id: null,
        retail_price: "", // string biar input enak
        wholesale_code: "",
    });

    const [filteredSub, setFilteredSub] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Dependent dropdown dengan cancel request
    useEffect(() => {
        const categoryId = form.category_id;

        // reset kalau category kosong
        if (!categoryId) {
            setFilteredSub([]);
            setForm((prev) => ({ ...prev, subcategory_id: null }));
            return;
        }

        const controller = new AbortController();

        (async () => {
            try {
                const res = await axios.get("/admin/subcategory-by-category", {
                    params: { category_id: categoryId },
                    signal: controller.signal,
                });

                if (res.data.code === 0) {
                    setFilteredSub(res.data.data || []);
                    setForm((prev) => ({ ...prev, subcategory_id: null }));
                } else {
                    toast.error(res.data.msg || "Gagal load subcategory");
                }
            } catch (err) {
                // abort = normal
                if (err?.name === "CanceledError") return;
                console.error(err);
                toast.error("Error mengambil data subcategory");
            }
        })();

        return () => controller.abort();
    }, [form.category_id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (loading) return;

        const productName = form.product_name.trim();
        const productCode = form.product_code.trim();
        const retailPriceNum =
            form.retail_price === "" ? NaN : Number(form.retail_price);

        // Validasi tegas
        if (!productName) return toast.error("Nama produk wajib diisi");
        if (!form.brand_id) return toast.error("Pilih brand terlebih dahulu");
        if (!form.category_id) return toast.error("Pilih kategori");
        if (!form.unit_id) return toast.error("Pilih satuan");

        // harga wajib >= 0 atau > 0? pilih salah satu.
        // gue set minimal 0 (boleh gratis). Kalau wajib > 0, ganti jadi <= 0.
        if (!Number.isFinite(retailPriceNum) || retailPriceNum < 0) {
            return toast.error(
                "Harga ecer wajib diisi dan tidak boleh negatif"
            );
        }

        const data = {
            ...form,
            product_code: productCode || "", // backend generate kalau kosong
            product_name: productName,
            retail_price: retailPriceNum,
        };

        try {
            setLoading(true);

            const response = await axios.post("/admin/create-product", data);

            if (response.data.code !== 0) {
                toast.error(response.data.msg || "Gagal menyimpan produk");
                return;
            }

            localStorage.setItem(
                "notif",
                JSON.stringify({ type: "success", msg: response.data.msg })
            );

            // Inertia navigation (tanpa full reload)
            router.visit("/admin/list-product");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan produk (server error)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <NewAuthenticated>
            <Head title="Tambah Produk" />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[99]">
                    <RotatingLines
                        width="48"
                        strokeWidth="5"
                        strokeColor="white"
                    />
                </div>
            )}

            <div className="pt-5 sm:px-6 lg:px-8">
                <h2 className="text-2xl text-white font-bold mb-6">
                    Tambah Produk
                </h2>

                <div className="bg-card p-6 rounded-lg shadow text-white">
                    <form
                        onSubmit={submitHandler}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <label className="font-medium">
                                Kode Produk (kosongkan = generate by system)
                            </label>
                            <input
                                name="product_code"
                                type="text"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.product_code}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="font-medium">Nama Produk</label>
                            <input
                                name="product_name"
                                type="text"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.product_name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="font-medium">Brand</label>
                            <Select
                                className="text-black"
                                options={brandList}
                                value={
                                    brandList.find(
                                        (b) => b.value === form.brand_id
                                    ) || null
                                }
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        brand_id: opt?.value ?? null,
                                    }))
                                }
                                placeholder="Pilih Brand"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        <div>
                            <label className="font-medium">Kategori</label>
                            <Select
                                className="text-black"
                                options={categoryList}
                                value={
                                    categoryList.find(
                                        (c) => c.value === form.category_id
                                    ) || null
                                }
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        category_id: opt?.value ?? null,
                                    }))
                                }
                                placeholder="Pilih Kategori"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        <div>
                            <label className="font-medium">
                                Subkategori (opsional)
                            </label>
                            <Select
                                options={filteredSub}
                                className="text-black"
                                value={
                                    filteredSub.find(
                                        (s) => s.value === form.subcategory_id
                                    ) || null
                                }
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        subcategory_id: opt?.value ?? null,
                                    }))
                                }
                                placeholder="Pilih Subcategory"
                                isDisabled={!form.category_id || loading}
                                isSearchable
                                isClearable
                            />
                        </div>

                        <div>
                            <label className="font-medium">Satuan</label>
                            <Select
                                options={unitList}
                                className="text-black"
                                value={
                                    unitList.find(
                                        (u) => u.value === form.unit_id
                                    ) || null
                                }
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        unit_id: opt?.value ?? null,
                                    }))
                                }
                                placeholder="Pilih Satuan"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        <div>
                            <label className="font-medium">
                                Harga Ecer (
                                {form.retail_price !== ""
                                    ? rupiah(form.retail_price)
                                    : "Rp 0"}
                                )
                            </label>
                            <input
                                name="retail_price"
                                type="number"
                                min="0"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.retail_price}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="font-medium">
                                Kode Grosir Internal
                            </label>
                            <input
                                name="wholesale_code"
                                type="text"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.wholesale_code}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold py-3 rounded text-white font-semibold disabled:opacity-60"
                            >
                                {loading ? "Menyimpan..." : "Simpan Produk"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </NewAuthenticated>
    );
}
