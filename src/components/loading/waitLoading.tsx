import React from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Spinner from '@/components/loading/spinner';

const MySwal = withReactContent(Swal);


const showWaitLoading = (text: string) => {
    return MySwal.fire({
        title: <strong>Harap bersabar</strong>,
        html: <Spinner text={text}/>,
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
};

const showWaitPercent = (text: string, extended: string) => {
    return MySwal.fire({
        title: <strong>Harap bersabar</strong>,
        html: <Spinner text={text} extended={extended}/>,
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
};

type SweetAlertIcon = "success" | "error" | "warning" | "info" | "question";
const LoadingTimer = (text: string, icon: SweetAlertIcon, time: number) => {
    let title;
    switch (icon) {
        case 'success':
            title = <strong>Sae</strong>;
            break;
        case 'error':
            title = <strong>Adduuuh!</strong>;
            break;
        case "warning":
            title = <strong>Perhatian</strong>;
            break;
        case "info":
            title = <strong>Info</strong>;
            break;
        case "question":
            title = <strong>Ongguen?</strong>;
            break;
        default:
            title = <strong>Nantek lun ghi...</strong>;
            break;
    }
    return MySwal.fire({
        title: <strong>{title}</strong>,
        html: <span dangerouslySetInnerHTML={{__html: text}}/>,
        icon: icon,
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: time,
    });
};

const CloseSwal = () => {
    return MySwal.close();
}

export {showWaitLoading, showWaitPercent, LoadingTimer, CloseSwal};