import Link from "next/link"
import {Icon} from '@iconify/react'
const Sidebar = () => {

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item" key={'1'}>
                    <Link
                        href={"/"}
                        className={`nav-link`}>
                        <i className="bi bi-mortarboard"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className="nav-heading">Master Data</li>
                <li className="nav-item">
                    <Link
                        className={`nav-link`}
                        data-bs-target="#components-nav"
                        data-bs-toggle="collapse"
                        style={{textDecoration: "none"}}
                        aria-expanded={true}
                        href="#">
                        <i className="bi bi-person" style={{textDecoration: "none"}}></i>
                        <span>Data Person</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="components-nav"
                        className={`nav-content collapse show`}
                        data-bs-parent="#sidebar-nav">
                        <li>
                            <Link
                                href={"/guru_dan_staff"}
                                className="active"
                                data-bs-target="#components-nav"
                                data-bs-toggle="collapse">
                                <Icon icon="gg:check-o" color="green" style={{marginRight: 5}}/>
                                <span>Guru & Staff</span>
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;