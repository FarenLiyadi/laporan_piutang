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
export const formatTanggalIndoLengkap = (tanggal) => {
    return dayjs
        .tz(tanggal.replace(" ", "T"), "Asia/Makassar")
        .format("dddd, D MMMM YYYY [Pukul] HH:mm");
};

export const formatJamIndo = (tanggal) => {
    return dayjs.tz(tanggal.replace(" ", "T"), "Asia/Makassar").format("HH:mm");
};
