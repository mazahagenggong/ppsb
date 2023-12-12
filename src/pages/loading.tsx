import React, {useState, useEffect, useRef} from 'react';
import useSWR from 'swr';
import styles from '@/styles/cover.module.css';
import {Fireworks} from '@fireworks-js/react'
import type {FireworksHandlers} from '@fireworks-js/react'
import axios from "axios";

const cekdata = async (url:string) => {
    const {data} = (await axios.get(url)).data;
    return await data;
};

const Loading = () => {
    const {data, isLoading, error} = useSWR('/api/setting/cek', cekdata);
    const [countdown, setCountdown] = useState<number>(10);

    useEffect(() => {
        if (data && !error) {
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }
    }, [data, error]);
    const ref = useRef<FireworksHandlers>(null)
    if (countdown === 0) {
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }

    return (
        <>
            <div>
                {isLoading ? (
                    <div className="alert alert-info" role="alert">
                        <strong>Perhatian!</strong> Sedang memuat data.
                    </div>
                ) : (
                    <div style={{color: "white"}}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                position: 'absolute',
                                zIndex: 1,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {countdown === 0 ? (
                                <h1 className='arab'>بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيْمِ</h1>
                            ) : (
                                <div className={`col ${styles.texthitung}`}>
                                    <h1>PSB MA ZAINUL HASAN 1 Genggong</h1>
                                    <h1>DI{data.status_pendaftaran.toUpperCase()} DALAM</h1>
                                    <h1 className={styles.hitung}>{countdown}</h1>
                                    <h1>DETIK</h1>
                                </div>
                            )}
                        </div>
                        <Fireworks
                            ref={ref}
                            options={{opacity: 0.5}}
                            style={{
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                position: 'fixed',
                                background: '#000'
                            }}
                        />
                    </div>
                )}

            </div>
        </>
    );
};

export default Loading;
