import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
    UserGroupIcon,
    UserIcon,
    DocumentIcon,
    FingerPrintIcon,
    IdentificationIcon,
    BookOpenIcon,
    MoonIcon,
    SunIcon,
    ChevronDownIcon,
    ClipboardDocumentCheckIcon,
    ChevronUpIcon,
    GiftIcon,
    WalletIcon,
    TagIcon,
    CircleStackIcon,
    BanknotesIcon,
    QrCodeIcon,
    CurrencyDollarIcon,
    DocumentChartBarIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    LockClosedIcon,
    GiftTopIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import {
    Avatar,
    Button,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { HomeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NewNavLink from "@/Components/NewNavLink";
import HasPermission from "@/Components/HasPermission";

export function Sidenav({ access }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openSidenav } = controller;

    const [openMasterData, SetOpenMasterData] = useState(false);
    const [openAdminData, SetOpenAdminData] = useState(false);
    const [openReportData, SetOpenReportData] = useState(false);

    const ACCESS_CODES = {
        DASHBOARD: "001",
        USER: "010",
        ACCESS_RIGHT: "011",
        USER_ACTIVITY: "012",
        CLIENT: "013",
        BIODATA: "020",
        SANGJIT: "030",
        TEAPAI: "040",
        PEMBERKATAN: "050",
        RESEPSI: "060",
        HADIAH: "070",
        UNDANGAN: "080",
        PAKET: "090",
        KATEGORI_PENGELUARAN: "091",
        BANK: "092",
        PENGELUARAN: "100",
        PENJUALAN: "110",
        SCAN_QR: "120",
        REPORT_MEJA: "130",
        MEJA: "140",
        REPORT_HADIAH: "131",
        REPORT_TAMU: "132",
        REPORT_FINANCE: "133",
        MEETING_SCHEDULE: "150",
        TIMELINE_CHECKLIST: "160",
        TIM_REGIST: "170",
        BARANG_SANGJIT: "180",
        WEBSITE_SETTINGS: "190",
    };

    const groupAdminAccess = () => {
        // Ensure access and access.details are defined
        if (!access || !Array.isArray(access.details)) {
            return false; // Or handle this case as appropriate
        }

        return access.details.some(
            (item) =>
                [
                    ACCESS_CODES.USER,
                    ACCESS_CODES.CLIENT,
                    ACCESS_CODES.ACCESS_RIGHT,
                    ACCESS_CODES.USER_ACTIVITY,
                ].includes(item.access_code) && item.r === 1
        );
    };

    const groupMasterAccess = () => {
        // Ensure access and access.details are defined
        if (!access || !Array.isArray(access.details)) {
            return false; // Or handle this case as appropriate
        }

        // Check if any item matches the criteria
        return access.details.some(
            (item) =>
                [
                    ACCESS_CODES.PAKET,
                    ACCESS_CODES.KATEGORI_PENGELUARAN,
                    ACCESS_CODES.BANK,
                ].includes(item.access_code) && item.r === 1
        );
    };

    const groupReportAccess = () => {
        // Ensure access and access.details are defined
        if (!access || !Array.isArray(access.details)) {
            return false; // Or handle this case as appropriate
        }

        // Check if any item matches the criteria
        return access.details.some(
            (item) =>
                [ACCESS_CODES.REPORT_MEJA].includes(item.access_code) &&
                item.r === 1
        );
    };

    let AdminGroup = groupAdminAccess();
    let MasterGroup = groupMasterAccess();
    let ReportGroup = groupReportAccess();

    return (
        <aside
            className={`bg-[#212121] shadow-sm ${
                openSidenav ? "translate-x-0" : "-translate-x-80"
            } fixed inset-0 z-50 my-4 ml-4 max-h-[calc(100vh-32px)] w-72 rounded-xl pb-4 transition-transform duration-300 xl:translate-x-0  border-blue-gray-100 overflow-auto no-scrollbar`}
        >
            <div className={`relative`}>
                <div to="" className=" px-8 text-center mx-auto w-max mb-4">
                    <div className=" pt-12 lg:pt-8 xl:pt-4 flex w-full justify-center  items-center gap-2">
                        <img src="/img/logo-ct.png" className="w-12" alt="" />
                        <p className="text-white font-bold uppercase">
                            Indotech Developer
                        </p>
                    </div>
                    <p className="text-white  text-right">Faren Liyadi</p>
                </div>
                <IconButton
                    variant="text"
                    color="white"
                    size="sm"
                    ripple={false}
                    className="absolute right-3 top-3 grid rounded-br-none rounded-tl-none xl:hidden"
                    onClick={() => setOpenSidenav(dispatch, false)}
                >
                    <XMarkIcon
                        strokeWidth={2.5}
                        className="h-5 w-5 text-white"
                    />
                </IconButton>
            </div>
            <div className="mx-2 ">
                <ul key={"Menu"} className="mb-0 flex flex-col gap-1">
                    <li className="mx-3.5 mt-0 mb-2">
                        <Typography
                            variant="small"
                            color={"white"}
                            className="font-black uppercase opacity-75"
                        >
                            Menu
                        </Typography>
                    </li>
                    <li key="Dashboard">
                        <a href="/dashboard">
                            <Button
                                variant={
                                    route().current("dashboard")
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center gap-4 px-4 capitalize"
                                fullWidth
                            >
                                <HomeIcon className="w-5 h-5 text-inherit" />
                                <Typography
                                    color="inherit"
                                    className="font-medium capitalize"
                                >
                                    Dashboard
                                </Typography>
                            </Button>
                        </a>
                    </li>
                    {AdminGroup && (
                        <li
                            key="admin"
                            onClick={() => SetOpenAdminData(!openAdminData)}
                        >
                            <Button
                                variant={
                                    route().current("list.user.view") ||
                                    route().current("detail.user.view") ||
                                    route().current("update.user.view") ||
                                    route().current("create.user.view") ||
                                    route().current("list.access-right.view") ||
                                    route().current(
                                        "create.access-right.view"
                                    ) ||
                                    route().current(
                                        "update.access-right.view"
                                    ) ||
                                    route().current(
                                        "detail.access-right.view"
                                    ) ||
                                    route().current("list.user.activity.view")
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center justify-between gap-4 px-4 space-x-4 capitalize"
                                fullWidth
                            >
                                <div className="flex items-center gap-4">
                                    <UserGroupIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Admin
                                    </Typography>
                                </div>
                                {openAdminData ? (
                                    <div className="ml-7">
                                        <ChevronUpIcon className="w-6 h-6 text-inherit" />
                                    </div>
                                ) : (
                                    <div className="ml-7">
                                        <ChevronDownIcon className="w-6 h-6 text-inherit" />
                                    </div>
                                )}
                            </Button>
                            {openAdminData && (
                                <div className=" ">
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.USER}
                                        action="read"
                                    >
                                        <li key={"list-user"} className="max-w">
                                            <a
                                                href="/admin/list-user"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.user.view"
                                                        ) ||
                                                        route().current(
                                                            "detail.user.view"
                                                        ) ||
                                                        route().current(
                                                            "update.user.view"
                                                        ) ||
                                                        route().current(
                                                            "create.user.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex mt-2 ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <UserIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Daftar Admin
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.CLIENT}
                                        action="read"
                                    >
                                        <li
                                            key={"list-client"}
                                            className="max-w"
                                        >
                                            <a
                                                href="/admin/list-client"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.client.view"
                                                        ) ||
                                                        route().current(
                                                            "detail.client.view"
                                                        ) ||
                                                        route().current(
                                                            "update.client.view"
                                                        ) ||
                                                        route().current(
                                                            "create.client.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex mt-2 ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <UserIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Daftar Client
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.ACCESS_RIGHT}
                                        action="read"
                                    >
                                        <li
                                            key={"access-right"}
                                            className="max-w"
                                        >
                                            <a
                                                href="/admin/list-access-right"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.access-right.view"
                                                        ) ||
                                                        route().current(
                                                            "create.access-right.view"
                                                        ) ||
                                                        route().current(
                                                            "update.access-right.view"
                                                        ) ||
                                                        route().current(
                                                            "detail.access-right.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <FingerPrintIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Hak Akses
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.USER_ACTIVITY}
                                        action="read"
                                    >
                                        <li
                                            key={"list-user-activity"}
                                            className="max-w"
                                        >
                                            <a
                                                href="/admin/list-user-activity"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.user.activity.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Aktivitas User
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                </div>
                            )}
                        </li>
                    )}
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.BIODATA}
                        action="read"
                    >
                        <li key="list-biodata">
                            <a href="/admin/list-biodata">
                                <Button
                                    variant={
                                        route().current("list.biodata.view") ||
                                        route().current(
                                            "create.biodata.view"
                                        ) ||
                                        route().current(
                                            "update.biodata.view"
                                        ) ||
                                        route().current("detail.biodata.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <IdentificationIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Biodata
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.SANGJIT}
                        action="read"
                    >
                        <li key="sangjit">
                            <a href="/admin/list-sangjit">
                                <Button
                                    variant={
                                        route().current("list.sangjit.view") ||
                                        route().current(
                                            "create.sangjit.view"
                                        ) ||
                                        route().current(
                                            "update.sangjit.view"
                                        ) ||
                                        route().current("detail.sangjit.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <ClipboardDocumentCheckIcon className="w-5 h-5  text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Sangjit
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.TEAPAI}
                        action="read"
                    >
                        <li key="teapai">
                            <a href="/admin/list-teapai">
                                <Button
                                    variant={
                                        route().current("list.teapai.view") ||
                                        route().current("create.teapai.view") ||
                                        route().current("update.teapai.view") ||
                                        route().current("detail.teapai.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <ClipboardDocumentCheckIcon className="w-5 h-5  text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Acara Pagi
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.PEMBERKATAN}
                        action="read"
                    >
                        <li key="pemberkatan">
                            <a href="/admin/list-pemberkatan">
                                <Button
                                    variant={
                                        route().current(
                                            "list.pemberkatan.view"
                                        ) ||
                                        route().current(
                                            "create.pemberkatan.view"
                                        ) ||
                                        route().current(
                                            "update.pemberkatan.view"
                                        ) ||
                                        route().current(
                                            "detail.pemberkatan.view"
                                        )
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <ClipboardDocumentCheckIcon className="w-5 h-5  text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Pemberkatan
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.RESEPSI}
                        action="read"
                    >
                        <li key="resepsi">
                            <a href="/admin/list-resepsi">
                                <Button
                                    variant={
                                        route().current("list.resepsi.view") ||
                                        route().current(
                                            "create.resepsi.view"
                                        ) ||
                                        route().current(
                                            "update.resepsi.view"
                                        ) ||
                                        route().current("detail.resepsi.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <ClipboardDocumentCheckIcon className="w-5 h-5  text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Resepsi
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.HADIAH}
                        action="read"
                    >
                        <li key="hadiah">
                            <a href="/admin/list-hadiah">
                                <Button
                                    variant={
                                        route().current(
                                            "list.hadiah.user.view"
                                        ) ||
                                        route().current("list-hadiah.view") ||
                                        route().current("detail.hadiah.view") ||
                                        route().current("update.hadiah.view") ||
                                        route().current("create.hadiah.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <GiftIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Hadiah
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.MEJA}
                        action="read"
                    >
                        <li key="meja">
                            <a href="/admin/list-meja">
                                <Button
                                    variant={
                                        route().current("list.meja.view") ||
                                        route().current(
                                            "list.meja.user.view"
                                        ) ||
                                        route().current("create.meja.view") ||
                                        route().current("update.meja.view") ||
                                        route().current("detail.meja.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Meja
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.UNDANGAN}
                        action="read"
                    >
                        <li key="undangan">
                            <a href="/admin/list-undangan">
                                <Button
                                    variant={
                                        route().current("list.undangan.view") ||
                                        route().current(
                                            "setting.undangan.online.view"
                                        ) ||
                                        route().current(
                                            "import.undangan.view"
                                        ) ||
                                        route().current(
                                            "list.undangan.user.view"
                                        ) ||
                                        route().current(
                                            "create.undangan.view"
                                        ) ||
                                        route().current(
                                            "update.undangan.view"
                                        ) ||
                                        route().current("detail.undangan.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <BookOpenIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Undangan
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    {MasterGroup && (
                        <li
                            key="masterdata"
                            onClick={() => SetOpenMasterData(!openMasterData)}
                        >
                            <Button
                                variant={
                                    route().current("list.paket.view") ||
                                    route().current("list.bank.view") ||
                                    route().current(
                                        "list.kategori.pengeluaran.view"
                                    )
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center justify-between gap-4 px-4 space-x-4 capitalize"
                                fullWidth
                            >
                                <div className="flex items-center gap-4">
                                    <CircleStackIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Master Data
                                    </Typography>
                                </div>
                                {openMasterData ? (
                                    <div className="ml-7">
                                        <ChevronUpIcon className="w-6 h-6 text-inherit" />
                                    </div>
                                ) : (
                                    <div className="ml-7">
                                        <ChevronDownIcon className="w-6 h-6 text-inherit" />
                                    </div>
                                )}
                            </Button>
                            {openMasterData && (
                                <div className=" ">
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.PAKET}
                                        action="read"
                                    >
                                        <li key={"paket"}>
                                            <a
                                                href="/admin/list-paket"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.paket.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex mt-2 ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <TagIcon className="w-5 h-5  text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right "
                                                    >
                                                        produk / paket
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={
                                            ACCESS_CODES.KATEGORI_PENGELUARAN
                                        }
                                        action="read"
                                    >
                                        <li
                                            key={"kategori-pengeluaran"}
                                            className="max-w"
                                        >
                                            <a
                                                href="/admin/kategori-pengeluaran"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.kategori.pengeluaran.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <CurrencyDollarIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Kategori pengeluaran
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.BANK}
                                        action="read"
                                    >
                                        <li key={"akun-bank"} className="max-w">
                                            <a
                                                href="/admin/list-bank"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.bank.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <BanknotesIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Bank
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                </div>
                            )}
                        </li>
                    )}
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.PENGELUARAN}
                        action="read"
                    >
                        <li key="pengeluaran">
                            <a href="/admin/list-pengeluaran">
                                <Button
                                    variant={
                                        route().current(
                                            "list.pengeluaran.view"
                                        ) ||
                                        route().current(
                                            "detail.pengeluaran.view"
                                        )
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <CurrencyDollarIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Pengeluaran
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.PENJUALAN}
                        action="read"
                    >
                        <li key="penjualan">
                            <a href="/admin/penjualan">
                                <Button
                                    variant={
                                        route().current(
                                            "list.penjualan.view"
                                        ) ||
                                        route().current("list.penjualan.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <WalletIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Penjualan
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.BARANG_SANGJIT}
                        action="read"
                    >
                        <li key="barang_sangjit">
                            <a href="/admin/list-barang-sangjit">
                                <Button
                                    variant={
                                        route().current(
                                            "list.barangsangjit.view"
                                        )
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <GiftTopIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        List Barang Sangjit
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.SCAN_QR}
                        action="read"
                    >
                        <li key="scan">
                            <a href="/admin/scan/list-undangan">
                                <Button
                                    variant={
                                        route().current(
                                            "scan.list.undangan.view"
                                        ) ||
                                        route().current("scanQr.view") ||
                                        route().current("scan.accessible.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <QrCodeIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Scan QR
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    {ReportGroup && (
                        <li
                            key="report"
                            onClick={() => SetOpenReportData(!openReportData)}
                        >
                            <Button
                                variant={
                                    route().current("report-meja.view") ||
                                    route().current("report-meja-user.view") ||
                                    route().current("report-hadiah.view") ||
                                    route().current(
                                        "report-hadiah-user.view"
                                    ) ||
                                    route().current("report-tamu.view") ||
                                    route().current("report-finance.view") ||
                                    route().current("report-tamu-user.view")
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center justify-between gap-4 px-4 space-x-4 capitalize"
                                fullWidth
                            >
                                <div className="flex items-center gap-4">
                                    <DocumentChartBarIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Report
                                    </Typography>
                                </div>
                                {openReportData ? (
                                    <div className="ml-7">
                                        <ChevronUpIcon className="w-6 h-6 text-inherit" />
                                    </div>
                                ) : (
                                    <div className="ml-7">
                                        <ChevronDownIcon className="w-6 h-6 text-inherit" />
                                    </div>
                                )}
                            </Button>
                            {openReportData && (
                                <div className=" ">
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.REPORT_MEJA}
                                        action="read"
                                    >
                                        <li key={"report-meja"}>
                                            <a
                                                href="/admin/report-meja"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "report-meja.view"
                                                        ) ||
                                                        route().current(
                                                            "report-meja-user.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex mt-2 ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5  text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right "
                                                    >
                                                        Report Meja
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.REPORT_HADIAH}
                                        action="read"
                                    >
                                        <li key={"report-meja"}>
                                            <a
                                                href="/admin/report-hadiah"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "report-hadiah.view"
                                                        ) ||
                                                        route().current(
                                                            "report-hadiah-user.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5  text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right "
                                                    >
                                                        Report Hadiah
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.REPORT_TAMU}
                                        action="read"
                                    >
                                        <li key={"report-tamu"}>
                                            <a
                                                href="/admin/report-tamu"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "report-tamu.view"
                                                        ) ||
                                                        route().current(
                                                            "report-tamu-user.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5  text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right "
                                                    >
                                                        Report Tamu
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.REPORT_FINANCE}
                                        action="read"
                                    >
                                        <li key={"report-finance"}>
                                            <a
                                                href="/admin/report-finance"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "report-finance.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2 justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5  text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right "
                                                    >
                                                        Report Finance
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                </div>
                            )}
                        </li>
                    )}
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.MEETING_SCHEDULE}
                        action="read"
                    >
                        <li key="scan">
                            <a href="/admin/meeting">
                                <Button
                                    variant={
                                        route().current("list.meeting.view") ||
                                        route().current(
                                            "detail.meeting.view"
                                        ) ||
                                        route().current(
                                            "update.meeting.view"
                                        ) ||
                                        route().current("create.meeting.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <CalendarDaysIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Meeting
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.TIMELINE_CHECKLIST}
                        action="read"
                    >
                        <li key="timeline">
                            <a href="/admin/timeline-checklist">
                                <Button
                                    variant={
                                        route().current("list.timeline.view") ||
                                        route().current(
                                            "detail.timeline.view"
                                        ) ||
                                        route().current("update.timeline.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5 text-inherit"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.75 3.375c0-1.036.84-1.875 1.875-1.875H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375Zm10.5 1.875a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25ZM12 10.5a.75.75 0 0 1 .75.75v.028a9.727 9.727 0 0 1 1.687.28.75.75 0 1 1-.374 1.452 8.207 8.207 0 0 0-1.313-.226v1.68l.969.332c.67.23 1.281.85 1.281 1.704 0 .158-.007.314-.02.468-.083.931-.83 1.582-1.669 1.695a9.776 9.776 0 0 1-.561.059v.028a.75.75 0 0 1-1.5 0v-.029a9.724 9.724 0 0 1-1.687-.278.75.75 0 0 1 .374-1.453c.425.11.864.186 1.313.226v-1.68l-.968-.332C9.612 14.974 9 14.354 9 13.5c0-.158.007-.314.02-.468.083-.931.831-1.582 1.67-1.694.185-.025.372-.045.56-.06v-.028a.75.75 0 0 1 .75-.75Zm-1.11 2.324c.119-.016.239-.03.36-.04v1.166l-.482-.165c-.208-.072-.268-.211-.268-.285 0-.113.005-.225.015-.336.013-.146.14-.309.374-.34Zm1.86 4.392V16.05l.482.165c.208.072.268.211.268.285 0 .113-.005.225-.015.336-.012.146-.14.309-.374.34-.12.016-.24.03-.361.04Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Timeline Checklist
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.TIM_REGIST}
                        action="read"
                    >
                        <li key="tim-regist">
                            <a href="/admin/list-tim-regist">
                                <Button
                                    variant={
                                        route().current("list.regist.view") ||
                                        route().current("update.regist.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5 text-inherit"
                                    >
                                        <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>

                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Tim Regist
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    <li key="change-password">
                        <a href="/admin/change-password">
                            <Button
                                variant={
                                    route().current("change.password.view")
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center gap-4 px-4 capitalize"
                                fullWidth
                            >
                                <LockClosedIcon className="w-5 h-5 text-inherit" />
                                <Typography
                                    color="inherit"
                                    className="font-medium capitalize"
                                >
                                    Change Password
                                </Typography>
                            </Button>
                        </a>
                    </li>

                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.WEBSITE_SETTINGS}
                        action="read"
                    >
                        <li key="website-settings">
                            <a href="/admin/website-settings">
                                <Button
                                    variant={
                                        route().current(
                                            "website.settings.view"
                                        ) ||
                                        route().current(
                                            "detail.website.settings.view"
                                        ) ||
                                        route().current(
                                            "update.website.settings.view"
                                        )
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <Cog6ToothIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Website Settings
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>

                    <li key="LogOut">
                        <NewNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                        >
                            <Button
                                variant="text"
                                color={"white"}
                                className="flex items-center gap-4 px-4 capitalize"
                                fullWidth
                                type="submit"
                            >
                                <IoIosLogOut className="w-5 h-5 text-inherit" />
                                <Typography
                                    color="inherit"
                                    className="font-medium capitalize"
                                >
                                    Logout
                                </Typography>
                            </Button>
                        </NewNavLink>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

// Sidenav.defaultProps = {
//     brandImg: "/img/logo-ct.png",
// };

// Sidenav.propTypes = {
//     brandImg: PropTypes.string,
// };

// Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
