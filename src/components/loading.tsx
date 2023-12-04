import React from 'react';
import style from '@/styles/loading.module.css';

const Loading = () => {
    return (
        <div className={`${style.loadingContainer}`}>
            <div className={`${style.loader}`}></div>
            <h1 className={`${style.loadingText}`}>Mencoba mendaftar, silahkan menunggu</h1>
        </div>
    );
};

export default Loading;