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
    const {data, isLoading, error} = useSWR('/api/semuapendaftar', fetcher, {refreshInterval: 1000});
    const [totalPendaftar, setTotalPendaftar] = React.useState(0);
    const [totalTerverifikasi, setTotalTerverifikasi] = React.useState(0);
    const [totalMenunggu, setTotalMenunggu] = React.useState(0);
    const [totalBelum, setTotalBelum] = React.useState(0);
    useEffect(() => {
        const initializeSidebar = () => {
            setActive('null');
            setShow('dashboard');
        };
        const aturdata = async () => {
            if (data && data.data.length > 0) {
                setTotalPendaftar(data.data.length);
                let totalTerverifikasi = 0;
                let totalMenunggu = 0;
                let totalBelum = 0;
                await data.data.map((item: any) => {
                    if (item.pembayaran && item.pembayaran.status === "Lunas") {
                        totalTerverifikasi++;
                    }
                    if (item.pembayaran && item.pembayaran.status === "menunggu") {
                        totalMenunggu++;
                    }
                    if(!item.pembayaran) {
                        totalBelum++;
                    }
                });
                setTotalTerverifikasi(totalTerverifikasi);
                setTotalMenunggu(totalMenunggu);
                setTotalBelum(totalBelum);
            }
        }

        aturdata();
        initializeSidebar();
    }, [setActive, setShow, data]);
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
                    <div className={"flex flex-col md:flex-row"}>
                        <div className={"flex flex-col w-[80vw] md:w-1/4 p-6 rounded-lg shadow bg-blue-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Total Pendaftar</h1>
                                <p className={"text-white text-2xl font-bold"}>{totalPendaftar}</p>
                            </center>
                        </div>
                        <div className={"flex flex-col w-[80vw] md:w-1/4 p-6 rounded-lg shadow bg-green-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Terverifikasi</h1>
                                <p className={"text-white text-2xl font-bold"}>{totalTerverifikasi}</p>
                            </center>
                        </div>
                        <div className={"flex flex-col w-[80vw] md:w-1/4 p-6 rounded-lg shadow bg-yellow-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Menunggu Verifikasi</h1>
                                <p className={"text-white text-2xl font-bold"}>{totalMenunggu}</p>
                            </center>
                        </div>
                        <div className={"flex flex-col w-[80vw] md:w-1/4 p-6 rounded-lg shadow bg-red-700 m-3"}>
                            <center>
                                <h1 className={"text-white text-2xl font-bold"}>Belum Verifikasi</h1>
                                <p className={"text-white text-2xl font-bold"}>{totalBelum}</p>
                            </center>
                        </div>
                    </div>
                )}
            </PanelContent>
        </Template>
    );
};

export default Index;