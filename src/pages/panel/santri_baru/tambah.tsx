import React from 'react';
import PanelContent from "@/components/panelContent";
import Template from "@/components/template/admin/template";
import Daftar from "@/components/template/main/daftar";

const Tambah = () => {
    return (
        <Template>
            <PanelContent title={"Tambah Santri Baru"}>
                <Daftar/>
            </PanelContent>
        </Template>
    );
};

export default Tambah;