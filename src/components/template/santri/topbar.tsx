import React from 'react';
import {Icon} from '@iconify/react';
import Image from "next/image";
import Link from "next/link";
import Login from "@/components/buttons/login";
import {deleteCookie} from "cookies-next";

const Topbar = () => {
    const [menu, setMenu] = React.useState<string>("hidden");
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return (
        <>
            <header>
                <nav
                    className={`flex flex-wrap items-center justify-between w-full py-2 md:py-0 text-lg text-gray-700 px-10 md:px-72`}
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
                                <button
                                    className="bg-amber-700 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        deleteCookie("token_santri");
                                        window.location.href = "/";
                                    }}
                                >
                                    Logout
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