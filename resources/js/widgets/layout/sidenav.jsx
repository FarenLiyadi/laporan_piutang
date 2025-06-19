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
        BANK: "092",
        REPORT_FINANCE: "133",
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
                [ACCESS_CODES.BANK].includes(item.access_code) && item.r === 1
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
                [ACCESS_CODES.REPORT_FINANCE].includes(item.access_code) &&
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
                                        menuCode={ACCESS_CODES.ACCESS_RIGHT}
                                        action="read"
                                    >
                                        <li
                                            key={"access-right"}
                                            className="max-w mt-2"
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
