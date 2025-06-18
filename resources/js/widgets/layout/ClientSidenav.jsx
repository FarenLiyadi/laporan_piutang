import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
    UserGroupIcon,
    BookOpenIcon,
    MoonIcon,
    SunIcon,
    ChevronDownIcon,
    ClipboardDocumentCheckIcon,
    ChevronUpIcon,
    GifIcon,
    GiftIcon,
    WalletIcon,
    TagIcon,
    CircleStackIcon,
    BanknotesIcon,
    QrCodeIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon,
    LockClosedIcon,
    DocumentTextIcon,
    DocumentChartBarIcon,
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

export function ClientSidenav({ access }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const { openSidenav } = controller;

    const [openReportData, SetOpenReportData] = useState(false);

    const ACCESS_CODES = {
        DASHBOARD: "001",
        USER: "010",
        ACCESS_RIGHT: "011",
        USER_ACTIVITY: "012",
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
        MEETING: "150",
        TIMELINE_CHECKLIST: "160",
        REPORT_MEJA: "130",
        REPORT_HADIAH: "131",
        REPORT_TAMU: "132",
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

    let ReportGroup = groupReportAccess();

    return (
        <aside
            className={`bg-[#212121] shadow-sm ${
                openSidenav ? "translate-x-0" : "-translate-x-80"
            } fixed inset-0 z-50 my-4 ml-4 max-h-[calc(100vh-32px)] w-72 rounded-xl pb-4 transition-transform duration-300 xl:translate-x-0  border-blue-gray-100 overflow-auto no-scrollbar`}
        >
            <div className={`relative`}>
                <div to="" className=" px-8 text-center mx-auto w-max">
                    <div className=" lg:pt-8 xl:pt-4 flex w-full justify-center">
                        <img src="/img/logo.png" className="w-28 " alt="" />
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
                        <a href="dashboard">
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
                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.BIODATA}
                        action="read"
                    >
                        <li key="biodata">
                            <a href="biodata">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.biodata.view"
                                        ) ||
                                        route().current(
                                            "client.update.biodata.view"
                                        )
                                            ? "gradient"
                                            : "text"
                                    }
                                    color={"white"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                >
                                    <UserGroupIcon className="w-5 h-5 text-inherit" />
                                    <Typography
                                        color="inherit"
                                        className="font-medium capitalize"
                                    >
                                        Biodata
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
                            <a href="sangjit">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.sangjit.view"
                                        ) ||
                                        route().current(
                                            "client.update.sangjit.view"
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
                                        Sangjit
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
                            <a href="teapai">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.teapai.view"
                                        ) ||
                                        route().current(
                                            "client.update.teapai.view"
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
                                        Acara Pagi
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
                            <a href="pemberkatan">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.pemberkatan.view"
                                        ) ||
                                        route().current(
                                            "client.update.pemberkatan.view"
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
                                        Pemberkatan
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
                            <a href="resepsi">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.resepsi.view"
                                        ) ||
                                        route().current(
                                            "client.update.resepsi.view"
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
                                        Resepsi
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
                            <a href="list-hadiah">
                                <Button
                                    variant={
                                        route().current(
                                            "client.list.hadiah.view"
                                        ) ||
                                        route().current(
                                            "client.detail.hadiah.view"
                                        ) ||
                                        route().current(
                                            "client.update.hadiah.view"
                                        ) ||
                                        route().current(
                                            "client.create.hadiah.view"
                                        )
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
                                        Hadiah
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
                            <a href="list-undangan">
                                <Button
                                    variant={
                                        route().current(
                                            "client.list.undangan.view"
                                        ) ||
                                        route().current(
                                            "client.update.undangan.view"
                                        )
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
                                        Undangan
                                    </Typography>
                                </Button>
                            </a>
                        </li>
                    </HasPermission>
                    
                    {ReportGroup && (
                        <div
                            key="report"
                            onClick={() => SetOpenReportData(!openReportData)}
                        >
                            <Button
                                variant={
                                    route().current("client.report-meja.view") ||
                                    route().current("client.report-hadiah.view") ||
                                    route().current("client.report-tamu.view")
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
                                                href="report-meja"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "client.report-meja.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex mt-2 ml-2 justify-start capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5 text-inherit" />
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
                                                href="report-hadiah"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current(
                                                            "client.report-hadiah.view"
                                                        )
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2 justify-start capitalize gap-2 "
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5 text-inherit" />
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
                                                href="report-tamu"
                                                className=""
                                            >
                                                <Button
                                                    variant={
                                                        route().current("client.report-tamu.view")
                                                            ? "gradient"
                                                            : "text"
                                                    }
                                                    color={"white"}
                                                    className="flex ml-2 justify-start capitalize gap-2"
                                                    fullWidth
                                                >
                                                    <DocumentTextIcon className="w-5 h-5 text-inherit" />
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
                                </div>
                            )}
                        </div>
                    )}

                    <HasPermission
                        access={access}
                        menuCode={ACCESS_CODES.MEETING}
                        action="read"
                    >
                        <li key="meeting">
                            <a href="detail-meeting">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.meeting.view"
                                        )
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
                            <a href="/detail-timeline-checklist">
                                <Button
                                    variant={
                                        route().current(
                                            "client.detail.timeline.view"
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

                    <li key="change-password">
                        <a href="/change-password">
                            <Button
                                variant={
                                    route().current(
                                        "client.change.password.view"
                                    )
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
                                variant={"text"}
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

export default ClientSidenav;
