import React, {useEffect} from 'react';
import axios from "axios";
import Pagination from "@/components/pagination/pagination";
import {getCookie} from "cookies-next";
import {Icon} from '@iconify/react';
import moment from "moment";
import 'moment/locale/id';
import Link from "next/link";
import Swal from "sweetalert2";
import Spinner from "@/components/spinner";
import withReactContent from "sweetalert2-react-content";
import useSWR from "swr";
import {CloseSwal, LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";

const SweetSwal = withReactContent(Swal)

interface DataProps {
    head: { name: string, id: string }[];
    aksi: any;
    url: string;
    nama: string;
}

interface TableProps {
    data: DataProps;
}

const Table: React.FC<TableProps> = ({data}) => {
    const {head, aksi, url, nama} = data;
    const [keyword, setKeyword] = React.useState<string>("");
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const {data: dt, error: err, isLoading: load, mutate} = useSWR(url, () => getData());
    const [pagedata, setPageData] = React.useState<number[]>([]);

    async function getData() {
        let data: {};
        if (keyword === "") {
            data = {
                page: currentPage,
                length: 10,
            };
        } else {
            data = {
                page: currentPage,
                keyword: keyword,
                length: 10,
            };
        }
        const res = await axios.post(`/api/${url}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token") ?? "",
            }
        });
        const resdata = res.data;
        setPageData([
            resdata.data.length ?? 0,
            resdata.data.recordsTotal ?? 0,
            resdata.data.recordsFiltered ?? 0,
            resdata.data.start ?? 0,
            resdata.data.data.length ?? 0,
        ]);

        return await res.data;
    }

    useEffect(() => {
        mutate().then(() => {
            return;
        });
    }, [keyword, currentPage, mutate]);

    const handleSearch = (searchKeyword: string) => {
        setKeyword(searchKeyword);
    };

    const handlePageChange = async (page: number) => {
        showWaitLoading('Mengambil data.');
        setCurrentPage(page);
        await mutate();
        CloseSwal();
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch(keyword);
        }
    };

    const handleHapus = async (id: string, url: string) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                SweetSwal.fire({
                    title: <strong>Harap bersabar</strong>,
                    html: <Spinner text={"Menghapus data."}/>,
                    icon: 'info',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                });
                const token = getCookie("token");
                try {
                    const res = await axios.delete(`/api/${url}/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token ?? "",
                        }
                    });
                    if (res.status === 200) {
                        Swal.fire({
                                title: 'Berhasil!',
                                html: 'Data berhasil dihapus',
                                icon: 'success',
                                allowOutsideClick: true,
                                showConfirmButton: false,
                                timer: 1500,
                            }
                        ).then(() => {
                            mutate();
                        })
                    } else {
                        await Swal.fire({
                                title: 'Gagal!',
                                html: 'Data gagal dihapus',
                                icon: 'error',
                                allowOutsideClick: true,
                                showConfirmButton: false,
                                timer: 1500,
                            }
                        );
                        console.log(res)
                    }
                } catch (e:any){
                    console.log(e);
                    await Swal.fire({
                        title: 'Gagal!',
                        html: e.response?.data?.message ?? 'Gagal menghapus data',
                        icon: 'error',
                        allowOutsideClick: true,
                        showConfirmButton: false,
                        timer: 1500,
                    }
                );  
                }
            }
        })
    }
    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form id="search-form">
                            <div className="input-group mb-3">
                                <label htmlFor="search-input"></label>
                                <input type="text" className="form-control"
                                       placeholder={`Cari ${nama}`}
                                       name="cari"
                                       id="search-input"
                                       onChange={(event) => {
                                           setCurrentPage(1);
                                           setKeyword(event.target.value)
                                       }}
                                       onKeyDown={handleKeyPress}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {load && (
                <div id="loading" className="loading-container">
                    <Spinner text={"Megambil Data."}/>
                </div>
            )}
            {dt && dt.data.length === 0 ? (
                <div className="row">
                    <div className="col-md-12" id="no-data-found">
                        <div className="alert alert-danger">Data tidak ditemukan</div>
                    </div>
                </div>
            ) : (
                <div className="flex row">
                    <div className="container">
                        <div className="flex flex-col">
                            <div className="overflow-x-auto">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                    <tr>
                                        {head.map((item, key) => {
                                            let nk = item.name + item.id + key;
                                            nk = nk.replace(/[^a-zA-Z0-9]/g, "");
                                            return (
                                                <th key={nk}>{item.name}</th>
                                            );
                                        })}
                                        {aksi.length > 0 && (
                                            <th key="aksi">Aksi</th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dt && dt.data.data.map((item: any, key: React.Key | null | undefined) => {
                                        let nk2 = item.id + key;
                                        nk2 = nk2.replace(/[^a-zA-Z0-9]/g, "");
                                        return (
                                            <tr key={key}>
                                                {head.map((item2, key2) => {
                                                    let nk3 = `data-${item2.id}-${key2}-${item.id}`;
                                                    nk3 = nk3.replace(/[^a-zA-Z0-9]/g, "");

                                                    const path = item2.id.split('.');
                                                    let value: any = item;
                                                    for (const prop of path) {
                                                        if (value && typeof value === 'object' && prop in value) {
                                                            if (item2.id === 'pembayaran.status') {
                                                                if (value[prop] === "menunggu"){
                                                                    value = 'Menunggu Verifikasi';
                                                                } else {
                                                                    value = value[prop];
                                                                }
                                                            } else {
                                                                value = value[prop];
                                                            }
                                                        } else {
                                                            value = undefined;
                                                            break;
                                                        }
                                                    }
                                                    return (
                                                        <React.Fragment key={nk3}>
                                                            {item2.id === 'created_at' || item2.id === 'updated_at' ? (
                                                                <td>{moment(item[item2.id]).format('D MMMM YYYY')}</td>
                                                            ) : (
                                                                <td>{value}</td>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                                {aksi.length > 0 && (
                                                    <td key={`data-aksi-${nk2}`}>
                                                        <div className="flex flex-row">
                                                            {aksi.map((item3: {
                                                                    name: string;
                                                                    url: string;
                                                                }) => {
                                                                    switch (item3.name) {
                                                                        case 'Edit':
                                                                            return (
                                                                                <Link href={`${item3.url}/${item.id}`}
                                                                                      key={`edit-${nk2}`}
                                                                                      className={"cursor-pointer mx-2"}>
                                                                                    <Icon
                                                                                        icon="line-md:edit"
                                                                                        color="#03a60e"
                                                                                        width="24"
                                                                                        height="24"
                                                                                    />
                                                                                </Link>
                                                                            );
                                                                        case 'Hapus':
                                                                            return (
                                                                                <Icon
                                                                                    icon="line-md:account-delete"
                                                                                    color="#d9070e"
                                                                                    width="24"
                                                                                    height="24"
                                                                                    key={`hapus-${nk2}`}
                                                                                    className={"cursor-pointer mx-2"}
                                                                                    onClick={async () => {
                                                                                        await handleHapus(item.id, item3.url);
                                                                                    }}
                                                                                />
                                                                            );
                                                                        case 'Detail':
                                                                            return (
                                                                                <Link href={`${item3.url}${item.id}`}
                                                                                      key={`edit-${nk2}`}
                                                                                      className={"cursor-pointer mx-2"}>
                                                                                    <Icon
                                                                                        icon="carbon:order-details"
                                                                                        color="green"
                                                                                        width="24"
                                                                                        height="24"
                                                                                    />
                                                                                </Link>
                                                                            );
                                                                        default:
                                                                            break;
                                                                    }
                                                                }
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-content-center">
                                {dt && dt.data.length > 0 && (
                                    <div className="d-flex justify-content-center">
                                        <Pagination
                                            itemsLength={pagedata[4]}
                                            currentPage={currentPage}
                                            itemsPerPage={pagedata[0]}
                                            totalItems={pagedata[1]}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Table;

