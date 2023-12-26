import React from 'react';
import {SubmitHandler, useForm, UseFormRegister} from "react-hook-form";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import {useUserStore} from "@/utils/stores/user";
import {getCookie} from "cookies-next";
import axios from "axios";
import Password from "@/components/buttons/password";

const Profile = () => {
    const {nama, username, telegram} = useUserStore();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<any>()
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            showWaitLoading("Mengubah data...")
            await axios.post("/api/user/edit", data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getCookie("token")}`
                }
            });
            await LoadingTimer("Berhasil Menyimpan Data", "success", 3000);
        } catch (error) {
            await LoadingTimer("Terjadi Kesalahan", "error", 2000);
        }
    }
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Profile</h4>
                </div>
                <div className="card-body">
                    <form className={"form-control mb-3"} onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label className={"mb-1"} htmlFor="Nama">Nama <strong
                                style={{color: "red"}}>*</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("nama", {required: true})}
                                defaultValue={nama ?? ""}
                                placeholder="Nama"/>
                        </div>
                        <div className="form-group mb-3">
                            <label className={"mb-1"} htmlFor="username">Username <strong
                                style={{color: "red"}}>*</strong></label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("username", {required: true})}
                                defaultValue={username ?? ""}
                                placeholder="Username"/>
                        </div>
                        <div className="form-group mb-3">
                            <label className={"mb-1"} htmlFor="username">ID Telegram</label>
                            <input
                                type="number"
                                className="form-control"
                                {...register("telegram")}
                                defaultValue={telegram ?? ""}
                                placeholder="ID Telegram"/>
                        </div>
                        <center>
                            <button type="submit"
                                    className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full m-3">Simpan
                            </button>
                            <Password/>
                        </center>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;