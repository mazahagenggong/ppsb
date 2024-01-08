import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {setCookie} from "cookies-next";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";

export default function Login() {
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [remember, setRemember] = React.useState<boolean>(false);

    const handleLogin = async () => {
        if (username === "") {
            await LoadingTimer('Username tidak boleh kosong', 'error', 1500);
            return;
        }
        if (password === "") {
            await LoadingTimer('Password tidak boleh kosong', 'error', 1500);
            return;
        }
        const data: { username: string, password: string, remember: boolean } = {
            username,
            password,
            remember
        }
        showWaitLoading('Mencoba login.');
        try {
            const login = await axios.post(`/api/auth/signin`, data);
            const token: string = login.data.data.token;
            const expired: string = login.data.data.expires;
            if (remember) {
                setCookie('token', token, {maxAge: 604800});
            } else {
                setCookie('token', token, {maxAge: 86400});
            }
            await LoadingTimer('Login berhasil<br>Sesi akan disimpan untuk ' + expired, 'success', 1500);
            window.location.href = '/panel';
        } catch (error: any) {
            let msg: string;
            if (typeof error.response?.data?.message !== 'undefined') {
                msg = error.response.data.message;
            } else {
                msg = error;
            }
            console.log(error)
            await LoadingTimer('Login gagal<br>' + msg, 'error', 1500);
        }
    }
    return (
        <>
            <div className={"flex flex-col items-center justify-center h-screen"}>
                <div className="justify-content-center py-4">
                    <Link
                        href={{
                            pathname: '/',
                        }}
                        className={"flex flex-col align-items-center w-auto text-decoration-none"}
                    >
                        <Image
                            src="/assets/img/logo.png"
                            alt="Logo Animasi"
                            className="img-fluid w-25 h-25"
                            width={500}
                            height={500}
                            priority
                        />
                        <span className={"text-4xl text-black font-bold"}>Beta PPSB MA Zainul Hasan 1</span>
                    </Link>
                </div>
                <div className="card mb-3 md:w-1/4 text-left">
                    <div className="card-body">
                        <div className="pt-4 pb-2">
                            <center>
                                <h5 className="card-title text-center pb-0 fs-4">Login</h5>
                            </center>
                        </div>

                        <form className="row g-3 needs-validation" noValidate>
                            <div className="col-12">
                                <label htmlFor="username" className="form-label">Username</label>
                                <div className="input-group has-validation">
                                    <span className="input-group-text" id="inputGroupPrepend">@</span>
                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoFocus
                                        required/>
                                </div>
                            </div>

                            <div className="col-12">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required/>
                            </div>

                            <div className="col-12">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="remember"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}/>
                                    <label className="form-check-label" htmlFor="rememberMe">Ingat saya</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <button
                                    className="btn btn-primary w-100"
                                    type="button"
                                    onClick={handleLogin}>
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}