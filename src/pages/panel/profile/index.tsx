import React from 'react';
import PanelContent from "@/components/panelContent";
import Template from "@/components/template/admin/template";
import Profile from "@/components/card/profile";

const Index = () => {
    return (
        <Template>
            <PanelContent title={"Profile"}>
                <Profile/>
            </PanelContent>
        </Template>
    );
};

export default Index;