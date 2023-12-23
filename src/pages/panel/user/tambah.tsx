import React, {useEffect, useState} from 'react'
import Template from '@/components/template/admin/template';
import PanelContent from '@/components/panelContent';
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import {useForm, SubmitHandler, UseFormRegister} from "react-hook-form"
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import axios from "axios";
import {getCookie} from "cookies-next";

const Tambah = () => {
    const {setActive, setShow} = useSidebarPanel();
    useEffect(() => {
        setActive('pengaturan');
        setShow("admin");
    }, []);
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<any>()
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            showWaitLoading("Menambah user...");
            const add_data = await axios.post("/api/user/tambah", data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie("token")}`
                }
            });
            if (!add_data.data.success) {
                await LoadingTimer("Terjadi Kesalahan", "error", 2000);
                return;
            }
            await LoadingTimer("Berhasil Menyimpan Data", "success", 3000);
            window.location.href = "/panel/user";
        } catch (error) {
            await LoadingTimer("Terjadi Kesalahan", "error", 2000);
        }
    }

    // eslint-disable-next-line react/display-name
    const SelectRole = React.forwardRef<
        HTMLSelectElement,
        { label: string } & ReturnType<UseFormRegister<any>>
    >(({onChange, onBlur, name, label}, ref) => (
        <>
            <label className={"mb-1"}>{label} <strong style={{color: "red"}}>*</strong></label>
            <select name={name} ref={ref} onChange={onChange} onBlur={onBlur} className={"form-control"}>
                <option value="">-- Pilih --</option>
                <option value="admin">Admin</option>
                <option value="panitia">Panitia</option>
            </select>
        </>
    ))
    return (
        <Template>
            <PanelContent title={"Tambah User"}>
                <center>
                <div className="flex flex-col w-full md:w-1/2">
                    <form className={"form-control mb-3"} onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label className={"mb-1"} htmlFor="Nama">Nama <strong style={{color: "red"}}>*</strong></label>
                            <input type="text" className="form-control" {...register("nama", {required: true})}
                                   placeholder="Nama"/>
                        </div>
                        <div className="form-group mb-3">
                            <label className={"mb-1"} htmlFor="username">Username <strong style={{color: "red"}}>*</strong></label>
                            <input type="text" className="form-control" {...register("username", {required: true})}
                                   placeholder="Username"/>
                        </div>
                        <div className="form-group mb-3">
                            <SelectRole label={"Pilih Role"} {...register("role", {required: true})}/>
                        </div>
                        <center>
                            <button type="submit" className="btn btn-success mb-3">Tambah</button>
                        </center>
                    </form>
                </div>
                </center>
            </PanelContent>
        </Template>
    )
}

export default Tambah;