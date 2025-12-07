import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { rupiah } from "@/utils/formatTanggal";

export default function CreateProduct({
    auth,
    brandList,
    categoryList,
    subcategoryList, // sementara tidak dipakai, biarin saja
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
        retail_price: "",
        wholesale_code: "",
    });

    const [filteredSub, setFilteredSub] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // === DEPENDENT DROPDOWN: SUBCATEGORY BERDASARKAN CATEGORY ===
    useEffect(() => {
        if (!form.category_id) {
            setFilteredSub([]);
            setForm((prev) => ({ ...prev, subcategory_id: null }));
            return;
        }

        const fetchSub = async () => {
            try {
                const res = await axios.get("/admin/subcategory-by-category", {
                    params: { category_id: form.category_id },
                });

                if (res.data.code === 0) {
                    setFilteredSub(res.data.data);
                    // reset subcategory ketika category ganti
                    setForm((prev) => ({ ...prev, subcategory_id: null }));
                } else {
                    toast.error(res.data.msg || "Gagal load subcategory");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error mengambil data subcategory");
            }
        };

        fetchSub();
    }, [form.category_id]);

    const submitHandler = async (e) => {
        e.preventDefault();

        // VALIDASI DASAR
        if (!form.product_name.trim())
            return toast.error("Nama produk wajib diisi");
        if (!form.brand_id) return toast.error("Pilih brand terlebih dahulu");
        if (!form.category_id) return toast.error("Pilih kategori");
        if (!form.unit_id) return toast.error("Pilih satuan");
        if (Number(form.retail_price) <= -1)
            return toast.error("Harga ecer tidak boleh kosong atau negatif");

        const data = {
            ...form,
            retail_price: Number(form.retail_price),
            // kalau backend lu pakai wholesale_item_code, ubah ini:
            // wholesale_item_code: form.wholesale_code,
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
                JSON.stringify({
                    type: "success",
                    msg: response.data.msg,
                })
            );
            window.location.href = "/admin/list-product";
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
                        {/* KODE PRODUK */}
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
                            />
                        </div>

                        {/* NAMA PRODUK */}
                        <div>
                            <label className="font-medium">Nama Produk</label>
                            <input
                                name="product_name"
                                type="text"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.product_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* BRAND */}
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
                                    setForm({
                                        ...form,
                                        brand_id: opt?.value || null,
                                    })
                                }
                                placeholder="Pilih Brand"
                                isSearchable
                                isClearable
                            />
                        </div>

                        {/* CATEGORY */}
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
                                    setForm({
                                        ...form,
                                        category_id: opt?.value || null,
                                    })
                                }
                                placeholder="Pilih Kategori"
                                isSearchable
                                isClearable
                            />
                        </div>

                        {/* SUBCATEGORY (OPTIONAL, DEPENDENT) */}
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
                                    setForm({
                                        ...form,
                                        subcategory_id: opt?.value || null,
                                    })
                                }
                                placeholder="Pilih Subcategory"
                                isDisabled={!form.category_id}
                                isSearchable
                                isClearable
                            />
                        </div>

                        {/* UNIT */}
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
                                    setForm({
                                        ...form,
                                        unit_id: opt?.value || null,
                                    })
                                }
                                placeholder="Pilih Satuan"
                                isSearchable
                                isClearable
                            />
                        </div>

                        {/* HARGA ECER */}
                        <div>
                            <label className="font-medium">
                                Harga Ecer (
                                {form.retail_price
                                    ? rupiah(form.retail_price)
                                    : "Rp 0"}
                                )
                            </label>
                            <input
                                name="retail_price"
                                type="number"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.retail_price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* WHOLESALE CODE */}
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
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="col-span-2 mt-4">
                            <button
                                type="submit"
                                className="w-full bg-gold py-3 rounded text-white font-semibold"
                            >
                                Simpan Produk
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </NewAuthenticated>
    );
}
