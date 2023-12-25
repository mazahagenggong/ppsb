import React, {useEffect} from 'react';
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";
import Table from "@/components/table"

const Index = () => {
    const {setActive, setShow} = useSidebarPanel();
    const [tablewiew, setTablewiew] = React.useState<boolean>(true);
    const head: { name: string, id: string }[] = [
        {
            name: "#",
            id: "nomor_urut",
        },
        {
            name: "Nomor Pendaftaran",
            id: "nomor",
        },
        {
            name: "Nama",
            id: "nama",
        },
        {
            name: "Status Pembayaran",
            id: "pembayaran.status",
        },
    ];

    const reload = async() => {
        setTablewiew(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTablewiew(true);
    }
    useEffect(() => {
        const initializeSidebar = () => {
            setActive('santri_baru');
            setShow("pendaftar");
        };

        initializeSidebar();
    }, [setActive, setShow]);
    const aksi= [
        {
            name: "Detail",
            url: "/panel/santri_baru/detail/",
        },
    ];
    const url: string = "/santri/santri_registrasi";
    const nama: string = "Santri Baru";
    return (
        <Template>
            <PanelContent title={"Data Santri Baru"}>
                <section className="section dashboard">
                    <div className="row">
                        <div className="col-lg-12">
                            {tablewiew && (
                                <Table data={{head, aksi, url, nama}}/>
                            )}
                        </div>
                    </div>
                </section>
            </PanelContent>
        </Template>
    );
};

export default Index;