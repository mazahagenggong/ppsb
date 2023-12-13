import React, {useEffect, useState} from 'react';
import Template from "@/components/template/admin/template";
import PanelContent from "@/components/panelContent";
import StatusPendaftaran from "@/components/pengaturan/status_pendaftaran";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import GelombangPendaftaran from "@/components/pengaturan/gelombang_pendaftaran";

const Index = () => {
    const {setActive, setShow} = useSidebarPanel();

    useEffect(() => {
        setActive('pengaturan_aplikasi');
        setShow("pengaturan");
    }, []);
    return (
        <Template>
            <PanelContent title={"Data Santri Baru"}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="section">
                            <StatusPendaftaran/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="section">
                            <GelombangPendaftaran/>
                        </div>
                    </div>
                </div>
            </PanelContent>
        </Template>
    );
};

export default Index;