import React, {useEffect} from 'react'
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";
import Spinner from "@/components/spinner";

const fetcher = async (url: string) => {
    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie("token") ?? "xxx"
        }
    });
    return res.data;
}
const Index = () => {
    const {setActive, setShow} = useSidebarPanel();
    const {data, isLoading, error} = useSWR('/api/semuapendaftar', fetcher);
    useEffect(() => {
        const initializeSidebar = () => {
            setActive('null');
            setShow('dashboard');
        };

        initializeSidebar();
    }, [setActive, setShow]);
    return (
        <Template>
            <PanelContent title={"Dashboard"}>
                {isLoading && (
                    <div id="loading" className="loading-container">
                        <Spinner text={"Megambil Data"}/>
                    </div>
                )}
                {error && (
                    <h1>Terjadi Kesalahan</h1>
                )}
                {data && (
                    <div className={"flex flex-row md:flex-col"}>
                        <div className={"flex flex-col w-full md:w-1/4 p-6 rounded-lg shadow bg-blue-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Total Pendaftar</h1>
                                <p className={"text-white text-2xl font-bold"}>{data.data.length}</p>
                            </center>
                        </div>
                        <div className={"flex flex-col w-full md:w-1/4 p-6 rounded-lg shadow bg-green-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Terverifikasi</h1>
                                <p className={"text-white text-2xl font-bold"}>0</p>
                            </center>
                        </div>
                        <div className={"flex flex-col w-full md:w-1/4 p-6 rounded-lg shadow bg-yellow-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Menunggu Verifikasi</h1>
                                <p className={"text-white text-2xl font-bold"}>0</p>
                            </center>
                        </div>
                        <div className={"flex flex-col w-full md:w-1/4 p-6 rounded-lg shadow bg-red-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Belum Verifikasi</h1>
                                <p className={"text-white text-2xl font-bold"}>0</p>
                            </center>
                        </div>
                    </div>
                )}
            </PanelContent>
        </Template>
    );
};

export default Index;