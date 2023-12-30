import Link from "next/link"
import {Icon} from '@iconify/react'
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";
import {useUserStore} from "@/utils/stores/user";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {LoadingTimer} from "@/components/loading/waitLoading";

const Sidebar = () => {
    const {active, setActive, show, setShow} = useSidebarPanel();
    const {role} = useUserStore();
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
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <Link
                        href={"/panel"}
                        className={`nav-link ${show === 'dashboard' ? '' : 'collapsed'}`}
                        onClick={() => {
                            setActive(null);
                            setShow('dashboard');
                            runtoast();
                        }}>
                        <i className="bi bi-mortarboard"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li className="nav-heading">Master Data</li>

                <li className="nav-item">
                    <Link
                        href={"/panel/santri_baru/tambah"}
                        className={`nav-link ${show === 'tsb' ? '' : 'collapsed'}`}
                        onClick={() => {
                            setActive(null);
                            setShow('tsb');
                            runtoast();
                        }}>
                        <i className="bi bi-person-plus"></i>
                        <span>Tambah Santri Baru</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        className={`nav-link ${show === 'pendaftar' ? '' : 'collapsed'}`}
                        data-bs-target="#components-nav"
                        data-bs-toggle="collapse"
                        style={{textDecoration: "none"}}
                        aria-expanded={show === 'pendaftar' ? true : false}
                        href="#"
                        onClick={() => {
                            if (show === 'pendaftar') {
                                setShow('')
                            } else {
                                setShow('pendaftar')
                            }
                        }}>
                        <i className="bi bi-people" style={{textDecoration: "none"}}></i>
                        <span>Pendaftar</span>
                        <i className={`bi bi-chevron-down ms-auto`}></i>
                    </Link>
                    <ul id="components-nav"
                        className={`nav-content ${show === 'pendaftar' ? 'collapsed' : 'collapse'}`}
                        data-bs-parent="#sidebar-nav">
                        <li>
                            <Link
                                href={"/panel/santri_baru"}
                                className={active === 'santri_baru' ? 'active' : ''}
                                data-bs-target="#components-nav"
                                data-bs-toggle="collapse"
                                onClick={() => {
                                    runtoast();
                                }}
                                style={{textDecoration: "none"}}
                            >
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Data Santri Baru</span>
                            </Link>
                        </li>
                        {role === 'admin' && (
                            <li>
                                <Link
                                    href={"/panel/santri_baru/verifikasi"}
                                    className={active === 'perlu_verifikasi' ? 'active' : ''}
                                    data-bs-target="#components-nav"
                                    data-bs-toggle="collapse"
                                    onClick={() => {
                                        runtoast();
                                    }}
                                    style={{textDecoration: "none"}}
                                >
                                    <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                    <span>Perlu Verifikasi</span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                href={"/panel/santri_baru/registrasi"}
                                className={active === 'registrasi' ? 'active' : ''}
                                data-bs-target="#components-nav"
                                data-bs-toggle="collapse"
                                onClick={() => {
                                    runtoast();
                                }}
                                style={{textDecoration: "none"}}
                            >
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Registrasi</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                {role === 'admin' && (
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${show === 'pengaturan' ? '' : 'collapsed'}`}
                            data-bs-target="#components-nav"
                            data-bs-toggle="collapse"
                            style={{textDecoration: "none"}}
                            aria-expanded={show === 'pengaturan' ? true : false}
                            href="#"
                            onClick={() => {
                                if (show === 'pengaturan') {
                                    setShow('')
                                } else {
                                    setShow('pengaturan')
                                }
                            }}>
                            <i className="bi bi-gear" style={{textDecoration: "none"}}></i>
                            <span>Pengaturan</span>
                            <i className={`bi bi-chevron-down ms-auto`}></i>
                        </Link>

                        <ul id="components-nav"
                            className={`nav-content ${show === 'pengaturan' ? 'collapsed' : 'collapse'}`}
                            data-bs-parent="#sidebar-nav">
                            <li>
                                <Link
                                    href={"/panel/pengaturan_aplikasi"}
                                    className={active === 'pengaturan_aplikasi' ? 'active' : ''}
                                    data-bs-target="#components-nav"
                                    data-bs-toggle="collapse"
                                    onClick={() => {
                                        runtoast();
                                    }}
                                    style={{textDecoration: "none"}}
                                >
                                    <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                    <span>Pengaturan Aplikasi</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={"/panel/user"}
                                    className={active === 'user' ? 'active' : ''}
                                    data-bs-target="#components-nav"
                                    data-bs-toggle="collapse"
                                    onClick={() => {
                                        runtoast();
                                    }}
                                    style={{textDecoration: "none"}}
                                >
                                    <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                    <span>User</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                )}

                <li className="nav-item">
                    <Link
                        className={`nav-link ${show === 'laporan' ? '' : 'collapsed'}`}
                        data-bs-target="#components-nav"
                        data-bs-toggle="collapse"
                        style={{textDecoration: "none"}}
                        aria-expanded={show === 'laporan' ? true : false}
                        href="#"
                        onClick={() => {
                            if (show === 'laporan') {
                                setShow('')
                            } else {
                                setShow('laporan')
                            }
                        }}>
                        <i className="bi bi-list-task" style={{textDecoration: "none"}}></i>
                        <span>Laporan</span>
                        <i className={`bi bi-chevron-down ms-auto`}></i>
                    </Link>
                    <ul id="components-nav"
                        className={`nav-content ${show === 'laporan' ? 'collapsed' : 'collapse'}`}
                        data-bs-parent="#sidebar-nav">
                        <li>
                            <Link
                                href={"/panel/santri_baru"}
                                className={active === 'laporan_semua_data' ? 'active' : ''}
                                data-bs-target="#components-nav"
                                data-bs-toggle="collapse"
                                onClick={(e) => {
                                    runtoast();
                                    LoadingTimer("Fitur masih tahap pengembangan", "info", 3000);
                                    e.preventDefault();
                                }}
                                style={{textDecoration: "none"}}
                            >
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Semua Data</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={"/panel/santri_baru"}
                                className={active === 'data_registrasi' ? 'active' : ''}
                                data-bs-target="#components-nav"
                                data-bs-toggle="collapse"
                                onClick={(e) => {
                                    runtoast();
                                    LoadingTimer("Fitur masih tahap pengembangan", "info", 3000);
                                    e.preventDefault();
                                }}
                                style={{textDecoration: "none"}}
                            >
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Data Registrasi</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={"/panel/santri_baru"}
                                className={active === 'kartu_tes' ? 'active' : ''}
                                data-bs-target="#components-nav"
                                data-bs-toggle="collapse"
                                onClick={(e) => {
                                    runtoast();
                                    LoadingTimer("Fitur masih tahap pengembangan", "info", 3000);
                                    e.preventDefault();
                                }}
                                style={{textDecoration: "none"}}
                            >
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Cetak Kartu Tes</span>
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;