import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { rupiah } from "@/utils/formatTanggal";

export default function UpdateProduct({
    auth,
    brandList,
    categoryList,
    unitList,
    product,
}) {
    const [loading, setLoading] = useState(false);

    // wrap props into state (biar bisa ditambah tanpa refresh)
    const [brands, setBrands] = useState(brandList || []);
    const [categories, setCategories] = useState(categoryList || []);
    const [units, setUnits] = useState(unitList || []);

    const [filteredSub, setFilteredSub] = useState([]);
    const normalizeNumber = (val) => {
        if (val === null || val === undefined) return "";
        return String(val).replace(/[^\d]/g, "");
    };
    const [form, setForm] = useState({
        product_code: product.product_code,
        product_name: product.product_name,
        brand_id: product.brand_id,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        unit_id: product.unit_id,
        retail_price: normalizeNumber(product.retail_price), // string biar input aman
        wholesale_code: product.wholesale_code,
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
            return res.data.data; // { value, label }
        } catch (err) {
            console.error(err);
            toast.error("Server error saat menambah data");
            return null;
        }
    };

    // Fetch subcategory for selected category (with abort + clear old list)
    useEffect(() => {
        const categoryId = form.category_id;

        if (!categoryId) {
            setFilteredSub([]);
            setForm((prev) => ({ ...prev, subcategory_id: null }));
            return;
        }

        setFilteredSub([]); // penting: biar gak kelihatan list lama
        const controller = new AbortController();

        (async () => {
            try {
                const res = await axios.get("/admin/subcategory-by-category", {
                    params: { category_id: categoryId },
                    signal: controller.signal,
                });

                if (res.data.code === 0) {
                    setFilteredSub(res.data.data || []);
                    // kalau subcategory_id yang lama tidak ada di category baru, reset
                    const exists = (res.data.data || []).some(
                        (s) => s.value === form.subcategory_id
                    );
                    if (!exists) {
                        setForm((prev) => ({ ...prev, subcategory_id: null }));
                    }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.category_id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (loading) return;

        const productName = (form.product_name || "").trim();
        const productCode = (form.product_code || "").trim();
        const retailPriceNum =
            form.retail_price === "" ? NaN : Number(form.retail_price);

        if (!productName) return toast.error("Nama produk wajib diisi");
        if (!form.brand_id) return toast.error("Pilih / tambah brand");
        if (!form.category_id) return toast.error("Pilih / tambah kategori");
        if (!form.unit_id) return toast.error("Pilih / tambah satuan");
        if (!Number.isFinite(retailPriceNum) || retailPriceNum <= 0)
            return toast.error("Harga ecer tidak boleh 0");

        try {
            setLoading(true);

            const response = await axios.post("/admin/update-product", {
                id: product.id,
                ...form,
                product_code: productCode,
                product_name: productName,
                retail_price: retailPriceNum,
            });

            if (response.data.code !== 0) {
                toast.error(response.data.msg || "Gagal update product");
                return;
            }

            localStorage.setItem(
                "notif",
                JSON.stringify({ type: "success", msg: response.data.msg })
            );

            router.visit("/admin/list-product"); // jangan window.location
        } catch (err) {
            console.error(err);
            toast.error("Gagal update product (server error)");
        } finally {
            setLoading(false);
        }
    };

    // selected option helpers
    const selectedBrand = brands.find((b) => b.value === form.brand_id) || null;
    const selectedCategory =
        categories.find((c) => c.value === form.category_id) || null;
    const selectedSub =
        filteredSub.find((s) => s.value === form.subcategory_id) || null;
    const selectedUnit = units.find((u) => u.value === form.unit_id) || null;

    return (
        <NewAuthenticated>
            <Head title="Update Produk" />

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[99]">
                    <RotatingLines
                        width="48"
                        strokeWidth="5"
                        strokeColor="white"
                    />
                </div>
            )}

            <div className="pt-5 sm:px-6 lg:px-8">
                <h2 className="text-2xl text-white font-bold mb-6">
                    Update Produk
                </h2>

                <div className="bg-card p-6 rounded-lg shadow text-white">
                    <form
                        onSubmit={submitHandler}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <label>Kode Produk</label>
                            <input
                                name="product_code"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.product_code}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label>Nama Produk</label>
                            <input
                                name="product_name"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.product_name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        {/* BRAND (Creatable) */}
                        <div>
                            <label>Brand</label>
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

                                    setBrands((prev) =>
                                        prev.some(
                                            (b) => b.value === newOpt.value
                                        )
                                            ? prev
                                            : [newOpt, ...prev]
                                    );
                                    setForm((prev) => ({
                                        ...prev,
                                        brand_id: newOpt.value,
                                    }));
                                    toast.success(
                                        "Brand berhasil ditambahkan!"
                                    );
                                }}
                                placeholder="Pilih / ketik untuk tambah brand"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        {/* CATEGORY (Creatable) */}
                        <div>
                            <label>Kategori</label>
                            <CreatableSelect
                                className="text-black"
                                options={categories}
                                value={selectedCategory}
                                onChange={(opt) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        category_id: opt?.value ?? null,
                                        // saat ganti kategori, reset subcategory
                                        subcategory_id: null,
                                    }))
                                }
                                onCreateOption={async (inputValue) => {
                                    const newOpt = await createMasterInline({
                                        endpoint:
                                            "/admin/category/create-inline",
                                        name: inputValue,
                                    });
                                    if (!newOpt) return;

                                    setCategories((prev) =>
                                        prev.some(
                                            (c) => c.value === newOpt.value
                                        )
                                            ? prev
                                            : [newOpt, ...prev]
                                    );
                                    setForm((prev) => ({
                                        ...prev,
                                        category_id: newOpt.value,
                                        subcategory_id: null,
                                    }));
                                    toast.success(
                                        "Kategori berhasil ditambahkan!"
                                    );
                                }}
                                placeholder="Pilih / ketik untuk tambah kategori"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        {/* SUBCATEGORY (Creatable, dependent) */}
                        <div>
                            <label>Subkategori (Opsional)</label>
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
                                        }

                                        const newOpt = res.data.data;

                                        setFilteredSub((prev) =>
                                            prev.some(
                                                (s) => s.value === newOpt.value
                                            )
                                                ? prev
                                                : [newOpt, ...prev]
                                        );
                                        setForm((prev) => ({
                                            ...prev,
                                            subcategory_id: newOpt.value,
                                        }));
                                        toast.success(
                                            "Subkategori berhasil ditambahkan!"
                                        );
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
                                isSearchable
                                isClearable
                                isDisabled={!form.category_id || loading}
                            />
                        </div>

                        {/* UNIT (Creatable) */}
                        <div>
                            <label>Satuan</label>
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
                                    const newOpt = await createMasterInline({
                                        endpoint: "/admin/unit/create-inline",
                                        name: inputValue,
                                    });
                                    if (!newOpt) return;

                                    setUnits((prev) =>
                                        prev.some(
                                            (u) => u.value === newOpt.value
                                        )
                                            ? prev
                                            : [newOpt, ...prev]
                                    );
                                    setForm((prev) => ({
                                        ...prev,
                                        unit_id: newOpt.value,
                                    }));
                                    toast.success(
                                        "Satuan berhasil ditambahkan!"
                                    );
                                }}
                                placeholder="Pilih / ketik untuk tambah satuan"
                                isSearchable
                                isClearable
                                isDisabled={loading}
                            />
                        </div>

                        <div>
                            <label>
                                Harga Ecer ({rupiah(form.retail_price || 0)})
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
                            <label>Kode Grosir Internal</label>
                            <input
                                name="wholesale_code"
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
                                {loading ? "Menyimpan..." : "Update Produk"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </NewAuthenticated>
    );
}
