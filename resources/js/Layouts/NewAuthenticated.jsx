import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
    Sidenav,
    DashboardNavbar,
    Configurator,
    Footer,
} from "@/widgets/layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function NewAuthenticated({ children }) {
    const [controller, dispatch] = useMaterialTailwindController();
    const [access, setAccess] = useState([]);
    const { sidenavType } = controller;

    {
        /*
        async function requestResourceLeaderList() {
            try {
                const response = await axios.get("/x-resource/leader-list");
                if (response.data.code !== 0) {
                    console.log("error");
                    throw new Error(response.data.msg);
                }
                return response.data.data;
            } catch (error) {
                console.error("There was a problem with the Axios request:", error);
                throw error;
            }
        }
    
        async function requestResourceAccessRightList() {
            try {
                const response = await axios.get("/x-resource/access-right");
                if (response.data.code !== 0) {
                    console.log("error");
                    throw new Error(response.data.msg);
                }
                return response.data.data;
            } catch (error) {
                console.error("There was a problem with the Axios request:", error);
                throw error;
            }
        }
    
        async function requestUserAccessRight() {
            try {
                const response = await axios.get("/x-resource/access-right-info");
                if (response.data.code !== 0) {
                    console.log("error");
                    throw new Error(response.data.msg);
                }
                return response.data.data;
            } catch (error) {
                console.error("There was a problem with the Axios request:", error);
                throw error;
            }
        }
    
        // Set Up
        async function setupLeaderListStorage() {
            if (localStorage.getItem("leaderList") === null) {
                const data = await requestResourceLeaderList();
                localStorage.setItem("leaderList", JSON.stringify(data));
                return;
            }
        }
    
        async function setupAccessRightListStorage() {
            if (localStorage.getItem("AccessRight") === null) {
                const data = await requestResourceAccessRightList();
                localStorage.setItem("AccessRight", JSON.stringify(data));
                return;
            }
        }
    
        async function setupUserAccessRight() {
            const data = await requestUserAccessRight();
            setAccess(data);
            return;
        }
        function delayNotif() {
            let notif = JSON.parse(localStorage.getItem("notif"));
    
            if (notif) {
                if (notif.type == "success") {
                    toast.success(notif.msg, {
                        position: "top-right",
                        autoClose: 3000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "light",
                    });
                } else if (notif.type == "error") {
                    toast.error(notif.msg, {
                        position: "top-right",
                        autoClose: 3000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "light",
                    });
                } else {
                    toast.info(notif.msg, {
                        position: "top-right",
                        autoClose: 3000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "light",
                    });
                }
            }
    
            localStorage.removeItem("notif");
        }
    
        useEffect(() => {
            const fetchData = async () => {
                setupLeaderListStorage();
                setupAccessRightListStorage();
                setupUserAccessRight();
                delayNotif();
            };
    
            fetchData();
        }, []);
        
        */
    }

    return (
        <div className="min-h-screen bg-black">
            <Sidenav
                brandImg={
                    sidenavType === "dark"
                        ? "/img/logo-ct.png"
                        : "/img/logo-ct-dark.png"
                }
                access={access}
            />
            <div className="p-4 flex flex-col min-h-screen xl:ml-80">
                <DashboardNavbar />

                {/* <IconButton
                    size="lg"
                    color="white"
                    className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
                    ripple={false}
                    onClick={() => setOpenConfigurator(dispatch, true)}
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </IconButton>*/}

                <main className="flex-grow"> {children}</main>

                <div className="text-white">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default NewAuthenticated;
