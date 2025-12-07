import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function LabelCart({ auth }) {
    const [searchText, setSearchText] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem("labelCart")) || [];
    });

    // SEARCH PRODUCT
    const handleSearch = async (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.length < 2) {
            setSearchResult([]);
            return;
        }

        const res = await axios.get("/admin/search-product", {
            params: { q: text },
        });

        if (res.data.code === 0) {
            setSearchResult(res.data.data);
        }
    };

    // ADD ITEM
    const addToCart = (item) => {
        const already = cart.find((c) => c.id === item.id);
        if (already) return toast.info("Produk sudah ada di daftar");

        const newCart = [...cart, { ...item, qty: 1 }];
        setCart(newCart);
        localStorage.setItem("labelCart", JSON.stringify(newCart));
        setSearchResult([]); // close dropdown
        setSearchText(""); // clear search
    };
    useEffect(() => {
        localStorage.removeItem("labelCart");
    }, []);
    // UPDATE QTY
    const updateQty = (id, qty) => {
        const newCart = cart.map((item) =>
            item.id === id ? { ...item, qty: Number(qty) } : item
        );
        setCart(newCart);
        localStorage.setItem("labelCart", JSON.stringify(newCart));
    };

    // PRINT
    const goPrint = () => {
        if (cart.length === 0) return toast.error("Daftar label kosong");

        window.open("/admin/print-label", "_blank", "noopener,noreferrer");
    };

    return (
        <NewAuthenticated>
            <div className="p-6 text-white">
                {/* TITLE */}
                <h2 className="text-2xl font-bold mb-4">Print Label Produk</h2>
                <p className="opacity-80 mb-6">
                    Pilih produk dan tentukan jumlah label yang ingin dicetak.
                </p>

                {/* SEARCH BOX */}
                <div className="relative">
                    <input
                        type="text"
                        className="w-full p-3 text-black rounded-lg shadow bg-white"
                        placeholder="Cari produk berdasarkan nama / kode..."
                        value={searchText}
                        onChange={handleSearch}
                    />

                    {/* SEARCH DROPDOWN */}
                    {searchResult.length > 0 && (
                        <div
                            className="
                            absolute w-full mt-2 bg-white text-black rounded-lg shadow-lg 
                            max-h-56 overflow-y-auto z-20
                        "
                        >
                            {searchResult.map((p) => (
                                <div
                                    key={p.id}
                                    className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {p.product_name}
                                        </div>
                                        <div className="text-sm opacity-70">
                                            {p.product_code}
                                        </div>
                                    </div>
                                    {!p.disabled && (
                                        <button
                                            className="bg-gold px-3 py-1 rounded text-white"
                                            onClick={() => addToCart(p)}
                                        >
                                            + Add
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CART LIST */}
                <h3 className="mt-8 text-xl font-bold">Daftar Label</h3>

                <div className="mt-3 bg-[#1e1e1e] p-4 rounded-lg shadow">
                    {cart.length === 0 ? (
                        <p className="opacity-60 text-center py-4">
                            Belum ada produk.
                        </p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-2">Produk</th>
                                    <th className="py-2 text-center">Qty</th>
                                    <th className="py-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-gray-800"
                                    >
                                        <td className="py-3">
                                            <div className="font-semibold">
                                                {item.product_name}
                                            </div>
                                            <div className="text-sm opacity-70">
                                                {item.product_code}
                                            </div>
                                        </td>

                                        <td className="py-3 text-center">
                                            <input
                                                type="number"
                                                className="p-2 w-20 text-black rounded bg-white"
                                                value={item.qty}
                                                onChange={(e) =>
                                                    updateQty(
                                                        item.id,
                                                        e.target.value
                                                    )
                                                }
                                                onFocus={(e) =>
                                                    e.target.select()
                                                }
                                            />
                                        </td>

                                        <td className="py-3 text-right">
                                            <button
                                                className="bg-red-600 px-3 py-1 rounded text-white"
                                                onClick={() => {
                                                    const newCart = cart.filter(
                                                        (c) => c.id !== item.id
                                                    );
                                                    setCart(newCart);
                                                    localStorage.setItem(
                                                        "labelCart",
                                                        JSON.stringify(newCart)
                                                    );
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PRINT BUTTON */}
                <button
                    className="mt-6 w-full bg-gold py-3 rounded-lg text-black font-bold text-lg"
                    onClick={goPrint}
                >
                    PRINT LABEL
                </button>
            </div>
        </NewAuthenticated>
    );
}
