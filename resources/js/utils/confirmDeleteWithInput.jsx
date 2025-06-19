// utils/confirmDeleteWithInput.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
if (!document.getElementById("swal-zindex-style")) {
    const style = document.createElement("style");
    style.id = "swal-zindex-style";
    style.innerHTML = `
        .swal-custom-zindex {
            z-index: 9999 !important;
        }
    `;
    document.head.appendChild(style);
}
const MySwal = withReactContent(Swal);

export async function confirmDeleteWithInput() {
    const firstConfirm = await MySwal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",

        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
            container: "swal-custom-zindex",
        },
    });

    if (!firstConfirm.isConfirmed) return false;

    const secondConfirm = await MySwal.fire({
        title: "Please Confirm",
        text: 'Type "DELETE" to proceed.',
        icon: "warning",
        input: "text",
        inputPlaceholder: 'Type "DELETE"',
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Confirm",
        customClass: {
            container: "swal-custom-zindex",
        },
        preConfirm: (value) => {
            if (value !== "DELETE") {
                Swal.showValidationMessage("You must type DELETE to proceed");
            }
            return value;
        },
    });

    return secondConfirm.isConfirmed && secondConfirm.value === "DELETE";
}
