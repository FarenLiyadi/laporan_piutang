import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { rupiah } from "@/utils/formatTanggal";

export default function CreateProduct({
    auth,
    brandList,
    categoryList,
    subcategoryList, // gak dipakai langsung karena subcategory dependent dari category
    unitList,
    prefill, // new prop untuk duplicate
}) {
    const [loading, setLoading] = useState(false);

    // IMPORTANT: props list harus dibungkus jadi state biar bisa ditambah tanpa refresh
    const [brands, setBrands] = useState(brandList || []);
    const [categories, setCategories] = useState(categoryList || []);
    const [units, setUnits] = useState(unitList || []);

    const [form, setForm] = useState({
        product_code: "",
        product_name: "",
        brand_id: null,
        category_id: null,
        subcategory_id: null,
        unit_id: null,
        retail_price: "",
        wholesale_code: "",
        ...(prefill || {}),
        retail_price:
            prefill?.retail_price != null
                ? String(parseInt(prefill.retail_price, 10))
                : "",
    });

    const [filteredSub, setFilteredSub] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // helper create inline (brand/category/unit)
    const createMasterInline = async ({ endpoint, name }) => {
        const clean = (name || "").trim().replace(/\s+/g, " ");
        if (clean.length < 2) {
            toast.error("Nama terlalu pendek");
            return null;
        }

        try {
            const res = await axios.post(endpoint, { name: clean });
            if (res.data.code !== 0) {
                toast.error(res.data.msg || "Gagal menambah data");
                return null;
            }
            toast.success(res.data.msg || "Berhasil menambah data");
            // backend harus return: { value, label }
            return res.data.data;
        } catch (err) {
            console.error(err);
            toast.error("Server error saat menambah data");
            return null;
        }
    };

    // Dependent dropdown: fetch subcategory by category
    useEffect(() => {
        const categoryId = form.category_id;

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
                    const list = res.data.data || [];
                    setFilteredSub(list);

                    // cuma reset kalau subcategory yg sekarang gak ada di list
                    setForm((prev) => {
                        const exists = list.some(
                            (s) => s.value === prev.subcategory_id
                        );
                        return exists
                            ? prev
                            : { ...prev, subcategory_id: null };
                    });
                } else {
                    toast.error(res.data.msg || "Gagal load subcategory");
                }
            } catch (err) {
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

        if (!productName) return toast.error("Nama produk wajib diisi");
        if (!form.brand_id)
            return toast.error("Pilih / tambah brand terlebih dahulu");
        if (!form.category_id) return toast.error("Pilih / tambah kategori");
        if (!form.unit_id) return toast.error("Pilih / tambah satuan");

        if (!Number.isFinite(retailPriceNum) || retailPriceNum < 0) {
            return toast.error(
                "Harga ecer wajib diisi dan tidak boleh negatif"
            );
        }

        const data = {
            ...form,
            product_code: productCode || "",
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

            router.visit("/admin/list-product");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan produk (server error)");
        } finally {
            setLoading(false);
        }
    };

    // selected option helper
    const selectedBrand = brands.find((b) => b.value === form.brand_id) || null;
    const selectedCategory =
        categories.find((c) => c.value === form.category_id) || null;
    const selectedSub =
        filteredSub.find((s) => s.value === form.subcategory_id) || null;
    const selectedUnit = units.find((u) => u.value === form.unit_id) || null;

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

                        {/* BRAND (Creatable) */}
                        <div>
                            <label className="font-medium">Brand</label>
                            <CreatableSelect
                                className="text-black"
                                options={brands}
                                value={selectedBrand}
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        brand_id: opt?.value ?? null,
                                    }))
                                }
                                onCreateOption={async (inputValue) => {
                                    const newOpt = await createMasterInline({
                                        endpoint: "/admin/brand/create-inline",
                                        name: inputValue,
                                    });

                                    if (!newOpt) return;

                                    setBrands((prev) => [newOpt, ...prev]);
                                    setForm((prev) => ({
                                        ...prev,
                                        brand_id: newOpt.value,
                                    }));
                                }}
                                placeholder="Pilih / ketik untuk tambah brand"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        {/* CATEGORY (Creatable) */}
                        <div>
                            <label className="font-medium">Kategori</label>
                            <CreatableSelect
                                className="text-black"
                                options={categories}
                                value={selectedCategory}
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        category_id: opt?.value ?? null,
                                    }))
                                }
                                onCreateOption={async (inputValue) => {
                                    const newOpt = await createMasterInline({
                                        endpoint:
                                            "/admin/category/create-inline",
                                        name: inputValue,
                                    });
                                    if (!newOpt) return;

                                    setCategories((prev) => [newOpt, ...prev]);

                                    // set category baru + reset subcategory
                                    setForm((prev) => ({
                                        ...prev,
                                        category_id: newOpt.value,
                                        subcategory_id: null,
                                    }));
                                }}
                                placeholder="Pilih / ketik untuk tambah kategori"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        {/* SUBCATEGORY (Creatable, dependent) */}
                        <div>
                            <label className="font-medium">
                                Subkategori (opsional)
                            </label>
                            <CreatableSelect
                                className="text-black"
                                options={filteredSub}
                                value={selectedSub}
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        subcategory_id: opt?.value ?? null,
                                    }))
                                }
                                onCreateOption={async (inputValue) => {
                                    if (!form.category_id) {
                                        toast.error(
                                            "Pilih kategori dulu sebelum menambah subkategori"
                                        );
                                        return;
                                    }

                                    const clean = (inputValue || "")
                                        .trim()
                                        .replace(/\s+/g, " ");
                                    if (clean.length < 2) {
                                        toast.error(
                                            "Nama subkategori terlalu pendek"
                                        );
                                        return;
                                    }

                                    try {
                                        const res = await axios.post(
                                            "/admin/subcategory/create-inline",
                                            {
                                                category_id: form.category_id,
                                                name: clean,
                                            }
                                        );

                                        if (res.data.code !== 0) {
                                            toast.error(
                                                res.data.msg ||
                                                    "Gagal menambah subkategori"
                                            );
                                            return;
                                        } else {
                                            toast.success(
                                                "Subkategori berhasil ditambahkan!"
                                            );
                                        }

                                        const newOpt = res.data.data; // { value, label }
                                        setFilteredSub((prev) => {
                                            const exists = prev.some(
                                                (s) => s.value === newOpt.value
                                            );
                                            if (exists) return prev;
                                            return [newOpt, ...prev];
                                        });
                                        setForm((prev) => ({
                                            ...prev,
                                            subcategory_id: newOpt.value,
                                        }));
                                    } catch (err) {
                                        console.error(err);
                                        toast.error(
                                            "Server error saat menambah subkategori"
                                        );
                                    }
                                }}
                                placeholder={
                                    form.category_id
                                        ? "Pilih / ketik untuk tambah subkategori"
                                        : "Pilih kategori dulu"
                                }
                                isDisabled={!form.category_id || loading}
                                isSearchable
                                isClearable
                            />
                        </div>

                        {/* UNIT (Creatable) */}
                        <div>
                            <label className="font-medium">Satuan</label>
                            <CreatableSelect
                                className="text-black"
                                options={units}
                                value={selectedUnit}
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        unit_id: opt?.value ?? null,
                                    }))
                                }
                                onCreateOption={async (inputValue) => {
                                    try {
                                        const res = await axios.post(
                                            "/admin/unit/create-inline",
                                            { name: inputValue }
                                        );

                                        if (res.data.code !== 0) {
                                            toast.error(
                                                res.data.msg ||
                                                    "Gagal menambah satuan"
                                            );
                                            return;
                                        }

                                        const newOpt = res.data.data; // { value, label }

                                        // OPTIONAL: prevent duplicate in state (kalau backend return existing)
                                        setUnits((prev) => {
                                            const exists = prev.some(
                                                (u) => u.value === newOpt.value
                                            );
                                            if (exists) return prev;
                                            return [newOpt, ...prev];
                                        });

                                        setForm((prev) => ({
                                            ...prev,
                                            unit_id: newOpt.value,
                                        }));
                                        toast.success(
                                            res.data.msg ||
                                                "Satuan berhasil ditambahkan!"
                                        );
                                    } catch (err) {
                                        console.error(err);
                                        toast.error(
                                            "Server error saat menambah satuan"
                                        );
                                    }
                                }}
                                placeholder="Pilih / ketik untuk tambah satuan"
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
