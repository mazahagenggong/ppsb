import React, {useState} from 'react';
import Modal from "@/components/modal/default";
import axios from "axios";

const Prestasi = ({data}: { data: any }) => {
    const [modal, setModal] = useState(false)
    const [prestasinya, setPrestasinya] = useState("")

    const handlePrestasi = () => {
        setModal(true)
    }
    const handleCloseModal = () => {
        setModal(false);
    };
    return (
        <div>
            <button type={"button"} className={"btn btn-secondary"} onClick={() => handlePrestasi()}>Prestasi</button>
            <Modal isOpen={modal} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Prestasi</h3>
                <form className="w-full max-w-full mb-3">
                    <div className="flex flex-wrap flex-col -mx-3 mb-6">
                        <div className="md:mb-0">
                            <div className="w-full md:w-1/2 px-3 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="prestasi">
                                    Jenis Prestasi
                                </label>
                                <div>
                                    <select
                                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
                                        id="prestasi" onChange={(e) => setPrestasinya(e.target.value)}
                                        required={true}>
                                        <option value="">-- Pilih --</option>
                                        <option value="tahfidz">Tahfidz 5 juz</option>
                                        <option value="alfiyah">Alfiyah 500 Bait</option>
                                        <option value="porseni">Juara 1-3 Porseni Kabupaten</option>
                                        <option value="peringkat_kelas">Peringkat 1 di kelas 9</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <center>
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full my-1 md:mx-3"
                                    type="submit"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (prestasinya && prestasinya !== "") {
                                            try {
                                                await axios.post("/api/test/prestasi",{
                                                    id: data.id,
                                                    prestasi:prestasinya
                                                })
                                                alert("sukses")
                                            } catch (e) {
                                                alert(e)
                                            }
                                        } else {
                                            alert(data.id)
                                        }
                                    }}>
                                    Edit
                                </button>
                            </center>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Prestasi;