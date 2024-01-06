import React, {useEffect, useState, ReactNode} from 'react'
import Head from "next/head"
import THeader from "@/components/template/admin/header"
import Navbar from "@/components/template/admin/navbar"
import Sidebar from "@/components/template/admin/sidebar"
import Footer from "@/components/template/footer"
import {useToogleSidebarPanel} from "@/utils/stores/sidebarPanel";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useUserStore} from "@/utils/stores/user";
import axios from "axios";
import {getCookie} from "cookies-next";

interface TemplatePros {
    children: ReactNode;
}

const Template: React.FC<TemplatePros> = ({children}) => {
    const {setNama, setUsername, setRole, setTelegram} = useUserStore();
    const token = getCookie('token');
    const {active} = useToogleSidebarPanel();
    useEffect(() => { 
            if (active) {
                document.body.className = '';
            } else {
                document.body.className = 'toggle-sidebar';
            }
            axios.post("/api/auth/detail", {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                setNama(res.data.data.nama);
                setUsername(res.data.data.username);
                setRole(res.data.data.role);
                setTelegram(res.data.data.telegram);
            }).catch((err) => {
                console.log(err);
            })
    },[active,setNama,setUsername,setRole,setTelegram,token])
    return (
        <>
            <Head>
                <title>Panel MA ZAHA 1</title>
                <meta name="Pendaftaran Santri Baru MA Zainul Hasan 1 Genggong" content="MA ZAHA 1 Project"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/assets/img/logo.png"/>
            </Head>
            <div style={{backgroundColor: 'white'}}>
                <THeader>
                    <Navbar/>
                </THeader>
                <Sidebar/>
                <div id="main" className="bg-[#f8fcfc]">
                    <ToastContainer />
                    {children}
                </div>
            </div>
            <Footer/>
        </>
    )
}
export default Template;
