import React, {useEffect, useState} from 'react'
import Template from '@/components/template/admin/template';
import PanelContent from '@/components/panelContent';
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import Table from "@/components/table";
import Link from "next/link";
import {toast} from "react-toastify";

const Admin = () => {
    const {setActive, setShow} = useSidebarPanel();
    useEffect(() => {
        setActive('pengaturan');
        setShow("admin");
    }, []);
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
            name: "Role",
            id: "role",
        },
    ];

    const reload = async () => {
        setTablewiew(false);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTablewiew(true);
    }
    const aksi = [
        {
            name: "Hapus",
            url: "/user/hapus",
        }
    ];
    const url: string = "/user";
    const nama: string = "User";
    return (
        <Template>
            <PanelContent title={"Data User"}>
                <section className="section dashboard">
                    <div className="row">
                        <div className="col-lg-12">
                            {tablewiew && (
                                <Table data={{head, aksi, url, nama}}/>
                            )}
                            <center>
                                <Link
                                    href={"/panel/user/tambah"}
                                    className={"btn btn-primary"}
                                    onClick={() => {
                                        toast('🚀 Memuat Halaman', {
                                            position: "top-center",
                                            autoClose: 3000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "light",
                                        });
                                    }}
                                >
                                    Tambah User
                                </Link>
                            </center>
                        </div>
                    </div>
                </section>
            </PanelContent>
        </Template>
    )
}

export default Admin;