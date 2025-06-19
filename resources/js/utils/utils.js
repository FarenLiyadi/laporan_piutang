export const resetPencarian = () => {
    const inputs = document.querySelectorAll('.src_keyup, .src_change, .src_date');
    inputs.forEach(input => {
        if (input.type === "checkbox" || input.type === "radio") {
            input.checked = false;
        } else if (input.tagName === "SELECT") {
            input.selectedIndex = 0;
        } else {
            input.value = '';

            if (input._flatpickr) {
                input._flatpickr.clear();
            }
        }
    });
};