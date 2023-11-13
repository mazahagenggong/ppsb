import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Head from "next/head"

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>PPSB - MA ZAHA 1</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/assets/img/logo.png"/>
            </Head>
            <Component {...pageProps} />
        </>
    )
}