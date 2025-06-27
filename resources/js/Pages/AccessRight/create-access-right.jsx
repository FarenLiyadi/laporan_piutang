import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

export default function createAccessRight({ auth }) {
    const [name, setname] = useState("");
    const [for_regist, setfor_regist] = useState(0);
    const [createChecked, setCreateChecked] = useState(false);
    const [readChecked, setReadChecked] = useState(false);
    const [updateChecked, setUpdateChecked] = useState(false);
    const [deleteChecked, setDeleteChecked] = useState(false);
    const [errors, setErrors] = useState({});
    let counter = 1;

    function showAccessRightForm() {
        const accessRights = [
            {
                nama_akses: "Dashboard",
                kode_akses: "001",
            },
            {
                nama_akses: "User",
                kode_akses: "010",
            },

            {
                nama_akses: "Hak Akses",
                kode_akses: "011",
            },
            {
                nama_akses: "Aktivitas User",
                kode_akses: "012",
            },

            {
                nama_akses: "Bank",
                kode_akses: "092",
            },
            {
                nama_akses: "Sales",
                kode_akses: "093",
            },
            {
                nama_akses: "Invoices",
                kode_akses: "100",
            },
            {
                nama_akses: "Customers",
                kode_akses: "091",
            },

            {
                nama_akses: "Report Finance",
                kode_akses: "133",
            },
        ];

        const detail = accessRights;
        for (var k in detail) {
            createAccessRightForm(detail[k]);
        }
    }

    function createAccessRightForm(access) {
        var tableElement = document.getElementById("table-body");

        var row = tableElement.insertRow(-1);
        var tdcnt = row.insertCell(0);
        var td1 = row.insertCell(1);
        var td2 = row.insertCell(2);
        var td3 = row.insertCell(3);
        var td4 = row.insertCell(4);
        var td5 = row.insertCell(5);

        tdcnt.innerHTML = counter;
        td1.innerHTML = access?.nama_akses;
        td2.innerHTML = `<input className="form-check-input" type="checkbox" name="c[]" value="${access?.kode_akses}">`;
        td3.innerHTML = `<input className="form-check-input" type="checkbox" name="r[]" value="${access?.kode_akses}">`;
        td4.innerHTML = `<input className="form-check-input" type="checkbox" name="u[]" value="${access?.kode_akses}">`;
        td5.innerHTML = `<input className="form-check-input" type="checkbox" name="d[]" value="${access?.kode_akses}">`;
        counter++;

        td1.className = "border border-slate-600 px-2 py-2";
        td2.className = "text-center border border-slate-600 px-1 py-2";
        td3.className = "text-center border border-slate-600 px-1 py-2";
        td4.className = "text-center border border-slate-600 px-1 py-2";
        td5.className = "text-center border border-slate-600 px-1 py-2";
        tdcnt.className = "text-center border border-slate-600 px-1 py-2";
    }

    useEffect(() => {
        showAccessRightForm();
    }, []);

    const checkedAllAccessRights = (permissionType) => {
        const checkboxes = document.getElementsByName(`${permissionType}[]`);
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
    };

    const uncheckAllAccessRights = (permissionType) => {
        const checkboxes = document.getElementsByName(`${permissionType}[]`);
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });
    };

    const handleCreateChange = () => {
        setCreateChecked(!createChecked);
        if (!createChecked) {
            checkedAllAccessRights("create");
            checkedAllAccessRights("c");
        } else {
            uncheckAllAccessRights("create");
            uncheckAllAccessRights("c");
        }
    };

    const handleReadChange = () => {
        setReadChecked(!readChecked);
        if (!readChecked) {
            checkedAllAccessRights("read");
            checkedAllAccessRights("r");
        } else {
            uncheckAllAccessRights("read");
            uncheckAllAccessRights("r");
        }
    };

    const handleUpdateChange = () => {
        setUpdateChecked(!updateChecked);
        if (!updateChecked) {
            checkedAllAccessRights("update");
            checkedAllAccessRights("u");
        } else {
            uncheckAllAccessRights("update");
            uncheckAllAccessRights("u");
        }
    };

    const handleDeleteChange = () => {
        setDeleteChecked(!deleteChecked);
        if (!deleteChecked) {
            checkedAllAccessRights("delete");
            checkedAllAccessRights("d");
        } else {
            uncheckAllAccessRights("delete");
            uncheckAllAccessRights("d");
        }
    };

    function checkAllAccessRights(actionType) {
        const accessRights = document.querySelectorAll(
            `input[name="${actionType}[]"]`
        );
        const accessValues = [];

        accessRights.forEach((el) => {
            accessValues.push(el.value);
        });

        return accessValues;
    }

    function captureAllAccessRights() {
        const accessRightsArray = [];

        const actionTypes = ["c", "r", "u", "d"];

        actionTypes.forEach((actionType) => {
            const accessRights = checkAllAccessRights(actionType);

            accessRights.forEach((accessCode) => {
                let existingAccess = accessRightsArray.find(
                    (item) => item.menu === accessCode
                );

                if (!existingAccess) {
                    existingAccess = {
                        menu: accessCode,
                        c: 0,
                        r: 0,
                        u: 0,
                        d: 0,
                    };
                    accessRightsArray.push(existingAccess);
                }

                if (
                    document.querySelector(
                        `input[name="${actionType}[]"][value="${accessCode}"]`
                    ).checked
                ) {
                    existingAccess[actionType] = 1;
                }
            });
        });

        return JSON.stringify(accessRightsArray);
    }

    async function submitHandler(e) {
        e.preventDefault();

        let errors = {};

        if (!name.trim()) {
            errors.name = "Nama Hak Akses Harus diisi.";
        }

        const accessData = captureAllAccessRights();

        if (Object.keys(errors).length === 0) {
            const data = {
                actor_id: auth.user.id,
                name: name,
                for_regist: for_regist,
                access: accessData,
            };

            console.log("Submit", data);

            try {
                const response = await axios.post(
                    "/admin/create-access-right",
                    data
                );
                if (response.data.code !== 0) {
                    toast.error(response.data.msg, {
                        position: "top-right",
                        autoClose: 3000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "light",
                    });
                    return;
                }
                // Untuk Nofitikasi
                localStorage.setItem(
                    "notif",
                    JSON.stringify({
                        type: "success",
                        msg: response.data.msg,
                    })
                );

                window.location.href = "/admin/list-access-right";
            } catch (error) {
                toast.error("Something Went Wrong", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
            }
        } else {
            setErrors(errors);
        }
    }

    return (
        <NewAuthenticated>
            <Head title="Tambah Hak Akses" />

            <div className="pt-5 overflow-auto">
                <div className="flex justify-between items-baseline my-auto sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl font-bold"></h2>

                    {/* BreadCrumb Navigation */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <a
                                        href="/"
                                        className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Dashboard
                                    </a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                        className="rtl:rotate-180 w-3 h-3 text-white mx-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                    <a
                                        href={`/admin/list-access-right`}
                                        className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Daftar Hak Akses
                                    </a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                        className="rtl:rotate-180 w-3 h-3 text-white mx-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-white 0 md:ms-2 dark:text-gray-400">
                                        Tambah Hak Akses
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="py-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="mx-4 lg:mx-0">
                        <form onSubmit={submitHandler}>
                            <div className="p-4 sm:p-8 grid bg-[#212121] grid-cols-12 gap-4  dark:bg-gray-800 shadow sm:rounded-lg">
                                <div className="md:col-span-4 col-span-12 my-2 grid grid-cols-1 auto-rows-max gap-4">
                                    <label className="capitalize text-white font-bold text-2xl">
                                        Tambah Hak Akses
                                    </label>
                                    <div>
                                        <label
                                            htmlFor="nama"
                                            className="capitalize block mb-2 font-medium text-white dark:"
                                        >
                                            Nama Hak Akses
                                        </label>
                                        <input
                                            type="text"
                                            id="nama"
                                            placeholder="Nama Hak Akses"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                            value={name}
                                            onChange={(event) => {
                                                setname(event.target.value);
                                            }}
                                        />
                                        {errors.name && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="nama"
                                            className="capitalize block mb-2 font-medium text-white"
                                        >
                                            For Tim Regist
                                        </label>
                                        <input
                                            className=" h-6 rounded-md w-6"
                                            type="checkbox"
                                            name="for_regist"
                                            value={for_regist}
                                            checked={for_regist}
                                            onChange={(event) => {
                                                setfor_regist(
                                                    event.target.checked
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-8 col-span-12 my-2 grid grid-cols-1 auto-rows-max gap-3 overscroll-x-auto">
                                    <div className="text-end">
                                        <button
                                            type="submit"
                                            className="rounded py-1 px-2 font-semibold text-white dark:text-gray-400 bg-[#e49f28] dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 "
                                        >
                                            Tambah
                                        </button>
                                    </div>
                                    <table className="border-collapse  w-full text-white border border-slate-500">
                                        <thead>
                                            <tr>
                                                <th className="border border-slate-600 py-2">
                                                    #
                                                </th>
                                                <th className="border border-slate-600 py-2">
                                                    Akses
                                                </th>
                                                <th className="border border-slate-600 py-2">
                                                    C
                                                    <input
                                                        id="checkbox-create"
                                                        className="form-check-input ms-1 rounded"
                                                        type="checkbox"
                                                        name="create[]"
                                                        onChange={
                                                            handleCreateChange
                                                        }
                                                    ></input>
                                                </th>
                                                <th className="border border-slate-600 py-2">
                                                    R
                                                    <input
                                                        id="checkbox-read"
                                                        className="form-check-input ms-1 rounded"
                                                        type="checkbox"
                                                        name="read[]"
                                                        onChange={
                                                            handleReadChange
                                                        }
                                                    ></input>
                                                </th>
                                                <th className="border border-slate-600 py-2">
                                                    U
                                                    <input
                                                        id="checkbox-update"
                                                        className="form-check-input ms-1 rounded"
                                                        type="checkbox"
                                                        name="update[]"
                                                        onChange={
                                                            handleUpdateChange
                                                        }
                                                    ></input>
                                                </th>
                                                <th className="border border-slate-600 py-2">
                                                    D
                                                    <input
                                                        id="checkbox-delete"
                                                        className="form-check-input ms-1 rounded"
                                                        type="checkbox"
                                                        name="delete[]"
                                                        onChange={
                                                            handleDeleteChange
                                                        }
                                                    ></input>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-body"></tbody>
                                    </table>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
