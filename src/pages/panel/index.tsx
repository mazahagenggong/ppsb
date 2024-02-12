import React, {useEffect} from 'react'
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";
import Countdata from "@/components/dashboard/countdata";
import Gelombang from "@/components/dashboard/gelombang";

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
                    <hr className={"m-5"} />
                    <Gelombang/>
                </center>
            </PanelContent>
        </Template>
    );
};

export default Index;