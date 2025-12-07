import { useEffect } from "react";

export default function PrintLabel() {
    const cart = JSON.parse(localStorage.getItem("labelCart")) || [];

    useEffect(() => {
        setTimeout(() => window.print(), 300);
    }, []);

    // Expand qty → list label individual
    const flatLabels = [];
    cart.forEach((item) => {
        for (let i = 0; i < item.qty; i++) {
            flatLabels.push(item);
        }
    });

    // Group per 2 label → 1 row
    const chunk = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const rows = chunk(flatLabels, 2); // 2 label per baris

    const style = `
        @page { size: auto; margin: 0; }
        body { margin: 0; padding: 0; }

        .label-row {
            width: 7cm;
            height: 1.6cm;
            display: grid;
            grid-template-columns: 3.3cm 3.3cm;
            column-gap: 0.4cm;
            page-break-inside: avoid;
        }

        .label-box {
            width: 3.3cm;
            height: 1.5cm;
            padding: 1mm;
            padding-left: 2mm;
            overflow: hidden;
            font-size: 8px;
            line-height: 1.1;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    `;
    const truncate = (text, max) => {
        if (!text) return "";
        return text.length > max ? text.slice(0, max) + "…" : text;
    };
    return (
        <div>
            <style dangerouslySetInnerHTML={{ __html: style }} />

            {rows.map((row, i) => (
                <div className="label-row" key={i}>
                    {row.map((item, j) => (
                        <div className="label-box" key={j}>
                            <div>{truncate(item.product_name, 55)}</div>

                            <div className="mt-[1px]">{item.product_code}</div>
                            <div className="mb-[1px] mt-[1px]">
                                {item.wholesale_code} / {item.unit_name}
                            </div>
                            <div>
                                Rp{" "}
                                {Number(item.retail_price).toLocaleString(
                                    "id-ID"
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Jika hanya 1 item dalam row → kolom kanan kosong */}
                    {row.length === 1 && <div className="label-box"></div>}
                </div>
            ))}
        </div>
    );
}
