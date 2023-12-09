import Link from "next/link"
import {Icon} from '@iconify/react'
import {useSidebarPanel} from "@/utils/stores/sidebarPanel";

const Sidebar = () => {
    const {active, setActive, show, setShow} = useSidebarPanel();
    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item" key={'1'}>
                    <Link
                        href={"/panel"}
                        className={`nav-link ${show === 'dashboard' ? '' : 'collapsed'}`}
                        onClick={() => {
                            setActive(null);
                            setShow('dashboard');
                        }}>
                        <i className="bi bi-mortarboard"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className="nav-heading">Master Data</li>
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
                        <i className="bi bi-person" style={{textDecoration: "none"}}></i>
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
                                style={{textDecoration: "none"}}
                            >
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Data Santri Baru</span>
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;