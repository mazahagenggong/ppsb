import React, {useEffect} from 'react';
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";

const Index = () => {
    const {setActive, setShow} = useSidebarPanel();
    const [tablewiew, setTablewiew] = React.useState<boolean>(true);
    const head: { name: string, id: string }[] = [
        {
            name: "#",
            id: "nomor_urut",
        },
        {
            name: "Nama",
            id: "nama",
        },
        {
            name: "Jabatan",
            id: "jabatan",
        },
        {
            name: "Bidang Studi",
            id: "bidang_studi",
        },
        {
            name: "No Hp",
            id: "no_hp",
        }
    ];

    const reload = async() => {
        setTablewiew(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTablewiew(true);
    }
    useEffect(() => {
        setActive('santri_baru');
        setShow("pendaftar");
    }, []);
    return (
        <Template>
            <PanelContent title={"Data Santri Baru"}>
                <h1>ini data santri baru</h1>
            </PanelContent>
        </Template>
    );
};

export default Index;