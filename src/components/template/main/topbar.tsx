import React from 'react';
import {Icon} from '@iconify/react';
import Image from "next/image";
import Link from "next/link";

const Topbar = () => {
    const [menu, setMenu] = React.useState<string>("hidden");
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return (
        <>
            <header>
                <nav
                    className={`flex flex-wrap items-center justify-between w-full py-2 md:py-0 text-lg text-gray-700 ${
                        isMobile ? 'px-10' : 'px-72'
                    }`}
                    style={{
                        backgroundColor: '#088474'
                    }}>
                    <div>
                        <Link href="/">
                            <Image
                                src="/ma-white.png"
                                alt="MA Logo"
                                className="img-fluid"
                                width={100}
                                height={24}
                                priority
                                style={{height: 'auto', width: 'auto'}}
                            />
                        </Link>
                    </div>

                    {menu === "hidden" ? (
                        <Icon icon="gg:menu-round" color="white" width="32" height="32"
                              className="h-6 w-6 cursor-pointer md:hidden block" onClick={() => setMenu("")}/>
                    ) : (
                        <Icon icon="iconoir:xbox-x" color="white" width="32" height="32"
                              className="h-6 w-6 cursor-pointer md:hidden block" onClick={() => setMenu("hidden")}/>
                    )
                    }

                    <div className={`${menu} w-full md:flex md:items-center md:w-auto`}>
                        <ul
                            className="pt-4 text-base text-gray-700 md:flex md:justify-between md:pt-0">
                            <li>
                                <Link className="md:p-4 py-2 block hover:text-purple-400 text-white" href="#daftar"
                                      style={{textDecoration: "none"}}>Daftar</Link>
                            </li>
                            <li>
                                <Link className="md:p-4 py-2 block hover:text-purple-400 text-white" href="#sekretariat"
                                      style={{textDecoration: "none"}}>Panitia</Link>
                            </li>
                            <li>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Masuk
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default Topbar;