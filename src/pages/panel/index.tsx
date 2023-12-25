import React, {useEffect} from 'react'
import Template from "@/components/template/admin/template";
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import PanelContent from "@/components/panelContent";

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
                <h1>ini dashboard</h1>
            </PanelContent>
        </Template>
    );
};

export default Index;