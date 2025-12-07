import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Select from "react-select";
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
    const [filteredSub, setFilteredSub] = useState([]);

    const [form, setForm] = useState({
        product_code: product.product_code,
        product_name: product.product_name,
        brand_id: product.brand_id,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        unit_id: product.unit_id,
        retail_price: Number(product.retail_price), // ← penting!
        wholesale_code: product.wholesale_code,
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // LOAD INITIAL SUBCATEGORY
    useEffect(() => {
        if (!product.category_id) return;

        axios
            .get("/admin/subcategory-by-category", {
                params: { category_id: product.category_id },
            })
            .then((r) => {
                if (r.data.code === 0) setFilteredSub(r.data.data);
            });
    }, []);

    // LOAD SUBCATEGORY WHEN CATEGORY CHANGED
    useEffect(() => {
        if (!form.category_id) {
            setFilteredSub([]);
            setForm((p) => ({ ...p, subcategory_id: null }));
            return;
        }

        axios
            .get("/admin/subcategory-by-category", {
                params: { category_id: form.category_id },
            })
            .then((r) => {
                if (r.data.code === 0) setFilteredSub(r.data.data);
            });
    }, [form.category_id]);

    // SUBMIT
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!form.product_name.trim())
            return toast.error("Nama produk wajib diisi");
        if (!form.brand_id) return toast.error("Pilih brand");
        if (!form.category_id) return toast.error("Pilih kategori");
        if (!form.unit_id) return toast.error("Pilih satuan");
        if (Number(form.retail_price) <= 0)
            return toast.error("Harga ecer tidak boleh 0");

        try {
            setLoading(true);

            const response = await axios.post("/admin/update-product", {
                id: product.id,
                ...form,
                retail_price: Number(form.retail_price),
            });

            if (response.data.code !== 0) return toast.error(response.data.msg);

            localStorage.setItem(
                "notif",
                JSON.stringify({
                    type: "success",
                    msg: response.data.msg,
                })
            );
            window.location.href = "/admin/list-product";
        } catch (err) {
            toast.error("Gagal update product");
        } finally {
            setLoading(false);
        }
    };

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
                            />
                        </div>

                        <div>
                            <label>Nama Produk</label>
                            <input
                                name="product_name"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.product_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Brand</label>
                            <Select
                                className="text-black"
                                options={brandList}
                                value={brandList.find(
                                    (b) => b.value === form.brand_id
                                )}
                                onChange={(opt) =>
                                    setForm({ ...form, brand_id: opt?.value })
                                }
                            />
                        </div>

                        <div>
                            <label>Kategori</label>
                            <Select
                                className="text-black"
                                options={categoryList}
                                value={categoryList.find(
                                    (c) => c.value === form.category_id
                                )}
                                onChange={(opt) =>
                                    setForm({
                                        ...form,
                                        category_id: opt?.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label>Subkategori (Opsional)</label>
                            <Select
                                className="text-black"
                                options={filteredSub}
                                value={filteredSub.find(
                                    (s) => s.value === form.subcategory_id
                                )}
                                onChange={(opt) =>
                                    setForm({
                                        ...form,
                                        subcategory_id: opt?.value || null,
                                    })
                                }
                                isClearable
                                isDisabled={!form.category_id}
                            />
                        </div>

                        <div>
                            <label>Satuan</label>
                            <Select
                                className="text-black"
                                options={unitList}
                                value={unitList.find(
                                    (u) => u.value === form.unit_id
                                )}
                                onChange={(opt) =>
                                    setForm({ ...form, unit_id: opt?.value })
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Harga Ecer ({rupiah(form.retail_price)})
                            </label>
                            <input
                                name="retail_price"
                                type="number"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.retail_price}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Kode Grosir Internal</label>
                            <input
                                name="wholesale_code"
                                className="w-full p-2 mt-1 rounded bg-white text-black"
                                value={form.wholesale_code}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-2 mt-4">
                            <button
                                type="submit"
                                className="w-full bg-gold py-3 rounded text-white font-semibold"
                            >
                                Update Produk
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </NewAuthenticated>
    );
}
