import React from 'react'
import Link from "next/link"
import Image from "next/image";
import {deleteCookie} from "cookies-next";
import {useUserStore} from "@/utils/stores/user";
import {toast} from "react-toastify";

const Navbar = () => {
    const {nama, username, role} = useUserStore();
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const runtoast = () => {
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
    }
    return (
        <>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-lg-none">
                    </li>
                    <li className="nav-item dropdown pe-3" onClick={() => (setExpanded(!expanded))}>
                        <a className={`nav-link nav-profile d-flex align-items-center pe-0 ${expanded ? 'show' : ''}`}
                           href="#"
                           data-bs-toggle="dropdown" aria-expanded={false}>
                                <Image
                                    width="500"
                                    height="300"
                                    className="rounded-circle"
                                    src="/assets/img/logo.png"
                                    alt="gambar"
                                    priority
                                    style={{height: 'auto', width: 'auto'}}
                                />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{nama}</span>
                        </a>

                        <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${expanded ? 'show' : ''}`}
                            style={{
                                position: "absolute",
                                inset: "0 0 auto auto",
                                margin: "0",
                                transform: "translate(-16px, 38px)",
                            }}>
                            <li className="dropdown-header">
                                <h6>@{username}</h6>
                                <span>{role}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <Link
                                    className="dropdown-item d-flex align-items-center"
                                    style={{textDecoration: "none"}}
                                    onClick={() => {
                                        runtoast();
                                    }}
                                    href={"/panel/profile"}>
                                    <i className="bi bi-person"></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <hr className="dropdown-divider"/>
                            </li>

                            <li>
                                <button type="button" className="dropdown-item d-flex align-items-center" onClick={() => {
                                    deleteCookie('token');
                                    window.location.href = '/';
                                }}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </li>

                </ul>
            </nav>
        </>
    );
};

export default Navbar;