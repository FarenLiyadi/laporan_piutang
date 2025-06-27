import dayjs from "dayjs";
import "dayjs/locale/id";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(localeData);
dayjs.locale("id");
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTanggalIndo = (tanggal) => {
    return dayjs
        .tz(tanggal.replace(" ", "T"), "Asia/Makassar")
        .format("dddd, D MMMM YYYY");
};
export const formatTanggal = (tanggal) => {
    return dayjs
        .tz(tanggal.replace(" ", "T"), "Asia/Makassar")
        .format("D MMMM YYYY");
};
export const formatTanggalIndoLengkap = (tanggal) => {
    return dayjs
        .tz(tanggal.replace(" ", "T"), "Asia/Makassar")
        .format("D MMMM YYYY[, ] HH:mm");
};

export const formatJamIndo = (tanggal) => {
    return dayjs.tz(tanggal.replace(" ", "T"), "Asia/Makassar").format("HH:mm");
};

export const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(number);
};
