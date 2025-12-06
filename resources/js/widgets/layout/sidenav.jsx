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
    BookmarkIcon,
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
        CUSTOMERS: "091",
        BANK: "092",
        SALES: "093",
        UNIT: "094",
        CATEGORY: "095",
        BRAND: "096",
        PRODUCT: "097",
        LABEL: "098",
        INVOICES: "100",
        PEMBAYARAN: "110",
        REPORT_PIUTANG_BEREDAR: "130",
        REPORT_PEMBAYARAN: "132",
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
                    ACCESS_CODES.BANK,
                    ACCESS_CODES.CUSTOMERS,
                    ACCESS_CODES.SALES,
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
                [
                    ACCESS_CODES.REPORT_PEMBAYARAN,
                    ACCESS_CODES.REPORT_PIUTANG_BEREDAR,
                    ACCESS_CODES.REPORT_PIUTANG_JATUH_TEMPO,
                    ACCESS_CODES.REPORT_PIUTANG_PER_CUSTOMER,
                    ACCESS_CODES.REPORT_PIUTANG_PER_SALES,
                ].includes(item.access_code) && item.r === 1
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
                    <div className=" pt-12 lg:pt-8 xl:pt-4 flex w-full  gap-2">
                        {/**
                        <img src="/img/logo-ct.png" className="w-12" alt="" />
                             */}
                        <p className="text-white text-2xl font-bold text-center uppercase">
                            KREDIT SGK
                        </p>
                    </div>
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
                                className="flex items-center mb-2 justify-between gap-4 px-4 space-x-4 capitalize"
                                fullWidth
                            >
                                <div className="flex  items-center gap-4">
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
                                                    className="flex ml-2 justify-start  capitalize gap-2 "
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
                                        menuCode={ACCESS_CODES.ACCESS_RIGHT}
                                        action="read"
                                    >
                                        <li
                                            key={"access-right"}
                                            className="max-w "
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

                    {MasterGroup && (
                        <li
                            key="masterdata"
                            onClick={() => SetOpenMasterData(!openMasterData)}
                        >
                            <Button
                                variant={
                                    route().current("list.customers.view") ||
                                    route().current("list.bank.view") ||
                                    route().current("list.sales.view") ||
                                    route().current(
                                        "list.kategori.pengeluaran.view"
                                    )
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center mb-2 justify-between gap-4 px-4 space-x-4 capitalize"
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
                                        menuCode={ACCESS_CODES.BANK}
                                        action="read"
                                    >
                                        <li
                                            key={"akun-bank"}
                                            className="max-w "
                                        >
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
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.CUSTOMERS}
                                        action="read"
                                    >
                                        <li
                                            key={"akun-customers"}
                                            className="max-w mt-2"
                                        >
                                            <a
                                                href="/admin/list-customers"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.customers.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start align-middle  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 512 512"
                                                        className="w-5 h-5 text-inherit"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M384 48c8.8 0 16 7.2 16 16l0 384c0 8.8-7.2 16-16 16L96 464c-8.8 0-16-7.2-16-16L80 64c0-8.8 7.2-16 16-16l288 0zM96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM240 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80l-64 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z"
                                                        />
                                                    </svg>
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Customers
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.SALES}
                                        action="read"
                                    >
                                        <li
                                            key={"akun-sales"}
                                            className="max-w mt-2"
                                        >
                                            <a
                                                href="/admin/list-sales"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.sales.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-inherit"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 640 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M41 7C31.6-2.3 16.4-2.3 7 7S-2.3 31.6 7 41l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L41 7zM599 7L527 79c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l72-72c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0zM7 505c9.4 9.4 24.6 9.4 33.9 0l72-72c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L7 471c-9.4 9.4-9.4 24.6 0 33.9zm592 0c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72zM320 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zM212.1 336c-2.7 7.5-4.1 15.6-4.1 24c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24c0-8.4-1.4-16.5-4.1-24c-.5-1.4-1-2.7-1.6-4c-9.4-22.3-29.8-38.9-54.3-43c-3.9-.7-7.9-1-12-1l-80 0c-4.1 0-8.1 .3-12 1c-.8 .1-1.7 .3-2.5 .5c-24.9 5.1-45.1 23-53.4 46.5zM175.8 224a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-26.5 32C119.9 256 96 279.9 96 309.3c0 14.7 11.9 26.7 26.7 26.7l56.1 0c8-34.1 32.8-61.7 65.2-73.6c-7.5-4.1-16.2-6.4-25.3-6.4l-69.3 0zm368 80c14.7 0 26.7-11.9 26.7-26.7c0-29.5-23.9-53.3-53.3-53.3l-69.3 0c-9.2 0-17.8 2.3-25.3 6.4c32.4 11.9 57.2 39.5 65.2 73.6l56.1 0zM464 224a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                                                        />
                                                    </svg>
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Sales
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.BRAND}
                                        action="read"
                                    >
                                        <li
                                            key={"brand"}
                                            className="max-w mt-2"
                                        >
                                            <a
                                                href="/admin/list-brand"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.brand.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-inherit"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 640 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64z"
                                                        />
                                                    </svg>
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Brand
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.CATEGORY}
                                        action="read"
                                    >
                                        <li
                                            key={"category"}
                                            className="max-w mt-2"
                                        >
                                            <a
                                                href="/admin/list-category"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.category.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <BookmarkIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Category
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                        <li
                                            key={"subcategory"}
                                            className="max-w mt-2"
                                        >
                                            <a
                                                href="/admin/list-subcategory"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.subcategory.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <BookmarkIcon className="w-5 h-5 text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Subcategory
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.UNIT}
                                        action="read"
                                    >
                                        <li key={"unit"} className="max-w mt-2">
                                            <a
                                                href="/admin/list-unit"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.unit.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-inherit"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 640 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M80 448C53.5 448 32 426.5 32 400L32 240C32 213.5 53.5 192 80 192L104 192L104 296C104 309.3 114.7 320 128 320C141.3 320 152 309.3 152 296L152 192L200 192L200 264C200 277.3 210.7 288 224 288C237.3 288 248 277.3 248 264L248 192L296 192L296 296C296 309.3 306.7 320 320 320C333.3 320 344 309.3 344 296L344 192L392 192L392 264C392 277.3 402.7 288 416 288C429.3 288 440 277.3 440 264L440 192L488 192L488 296C488 309.3 498.7 320 512 320C525.3 320 536 309.3 536 296L536 192L560 192C586.5 192 608 213.5 608 240L608 400C608 426.5 586.5 448 560 448L80 448z"
                                                        />
                                                    </svg>

                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Satuan
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                    <HasPermission
                                        access={access}
                                        menuCode={ACCESS_CODES.PRODUCT}
                                        action="read"
                                    >
                                        <li
                                            key={"product"}
                                            className="max-w mt-2"
                                        >
                                            <a
                                                href="/admin/list-product"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "list.product.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <svg
                                                        className="w-6 h-6 text-inherit"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 640 512"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M560.3 301.2C570.7 313 588.6 315.6 602.1 306.7C616.8 296.9 620.8 277 611 262.3L563 190.3C560.2 186.1 556.4 182.6 551.9 180.1L351.4 68.7C332.1 58 308.6 58 289.2 68.7L88.8 180C83.4 183 79.1 187.4 76.2 192.8L27.7 282.7C15.1 306.1 23.9 335.2 47.3 347.8L80.3 365.5L80.3 418.8C80.3 441.8 92.7 463.1 112.7 474.5L288.7 574.2C308.3 585.3 332.2 585.3 351.8 574.2L527.8 474.5C547.9 463.1 560.2 441.9 560.2 418.8L560.2 301.3zM320.3 291.4L170.2 208L320.3 124.6L470.4 208L320.3 291.4zM278.8 341.6L257.5 387.8L91.7 299L117.1 251.8L278.8 341.6z"
                                                        />
                                                    </svg>

                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right"
                                                    >
                                                        Product
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
                        menuCode={ACCESS_CODES.LABEL}
                        action="read"
                    >
                        <li key={"label"}>
                            <a href="/admin/list-label" className="">
                                <Button
                                    variant={
                                        route().current("list.label.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        className="w-5 h-5 text-inherit"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M433.2 103.1L581.4 253.4C609.1 281.5 609.1 326.5 581.4 354.6L425 512.9C415.7 522.3 400.5 522.4 391.1 513.1C381.7 503.8 381.6 488.6 390.9 479.2L547.3 320.8C556.5 311.5 556.5 296.4 547.3 287.1L399 136.9C389.7 127.5 389.8 112.3 399.2 103C408.6 93.7 423.8 93.8 433.1 103.2zM64.1 293.5L64.1 160C64.1 124.7 92.8 96 128.1 96L261.6 96C278.6 96 294.9 102.7 306.9 114.7L450.9 258.7C475.9 283.7 475.9 324.2 450.9 349.2L317.4 482.7C292.4 507.7 251.9 507.7 226.9 482.7L82.9 338.7C70.9 326.7 64.2 310.4 64.2 293.4zM208.1 208C208.1 190.3 193.8 176 176.1 176C158.4 176 144.1 190.3 144.1 208C144.1 225.7 158.4 240 176.1 240C193.8 240 208.1 225.7 208.1 208z"
                                        />
                                    </svg>
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize text-right "
                                    >
                                        Cetak Label
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.INVOICES}
                        action="read"
                    >
                        <li key={"invoices"}>
                            <a href="/admin/list-invoices" className="">
                                <Button
                                    variant={
                                        route().current("list.invoices.view") ||
                                        route().current(
                                            "update.invoices.view"
                                        ) ||
                                        route().current("create.invoices.view")
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 384 512"
                                        className="w-5 h-5 text-inherit"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 144zM80 352c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 336c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 240z"
                                        />
                                    </svg>
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize text-right "
                                    >
                                        Invoices
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.PEMBAYARAN}
                        action="read"
                    >
                        <li key={"invoices"}>
                            <a href="/admin/list-pembayaran" className="">
                                <Button
                                    variant={
                                        route().current(
                                            "list.pembayaran.view"
                                        ) ||
                                        route().current(
                                            "list.pembayaran.user.view"
                                        ) ||
                                        route().current("pembayaran.view")
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
                                        className="font-medium capitalize text-right "
                                    >
                                        Pembayaran
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
                                    route().current(
                                        "report-piutang-beredar.view"
                                    ) ||
                                    route().current(
                                        "report.piutang.beredar.user.view"
                                    ) ||
                                    route().current(
                                        "report.pembayaran.user.view"
                                    ) ||
                                    route().current("report.pembayaran.view")
                                        ? "gradient"
                                        : "text"
                                }
                                color={"white"}
                                className="flex items-center mb-2 justify-between gap-4 px-4 space-x-4 capitalize"
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
                                        menuCode={
                                            ACCESS_CODES.REPORT_PIUTANG_BEREDAR
                                        }
                                        action="read"
                                    >
                                        <li key={"report-piutang-beredar"}>
                                            <a
                                                href="/admin/report-piutang-beredar"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "report-piutang-beredar.view"
                                                        ) ||
                                                        route().current(
                                                            "report.piutang.beredar.user.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2  justify-start  capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5  text-inherit" />
                                                    <Typography
                                                        color="inherit"
                                                        className="font-medium capitalize text-right "
                                                    >
                                                        Report Piutang Beredar
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>

                                    <HasPermission
                                        access={access}
                                        menuCode={
                                            ACCESS_CODES.REPORT_PEMBAYARAN
                                        }
                                        action="read"
                                    >
                                        <li key={"report-pembayaran"}>
                                            <a
                                                href="/admin/report-pembayaran"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "report.pembayaran.view"
                                                        ) ||
                                                        route().current(
                                                            "report.pembayaran.user.view"
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
                                                        Report Pembayaran
                                                    </Typography>
                                                </Button>
                                            </a>
                                        </li>
                                    </HasPermission>
                                </div>
                            )}
                        </li>
                    )}

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
