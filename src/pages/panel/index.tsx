import React, {useEffect} from 'react'
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";
import Countdata from "@/components/dashboard/countdata";
import Gelombang from "@/components/dashboard/gelombang";
import IP from "@/components/dashboard/info_pendaftaran";
import IPD from "@/components/dashboard/info_pendaftaran_donat";
import Sekolah from "@/components/dashboard/sekolah";
import DivJurusan from "@/components/dashboard/div_jurusan";

const Index = () => {
    const {setActive, setShow} = useSidebarPanel();
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
                <center>
                    <Countdata/>
                    <hr className={"m-5"}/>
                    <p className={"text-2xl"}>Grafik Pendaftar:</p>
                    <div className={"flex flex-col md:flex-row"}>
                        <Gelombang/>
                        <Sekolah/>
                    </div>
                    <DivJurusan/>
                    <hr className={"m-5"}/>
                    <p className={"text-2xl"}>Informasi Pendaftar:</p>
                    <div className={"flex flex-col md:flex-row"}>
                        <IP/>
                        <IPD/>
                    </div>
                </center>
            </PanelContent>
        </Template>
    );
};

export default Index;