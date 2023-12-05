import React, {useState, useEffect} from 'react';
import Modal from '@/components/modal';

const Login: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleLoginClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                className="bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                onClick={handleLoginClick}
            >
                Login
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Login</h3>
                <form className="w-full max-w-full mb-3">
                    <div className="flex flex-wrap flex-col -mx-3 mb-6">
                        <div className="md:mb-0">
                            <input
                                className="text-center appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="kode"
                                type="text"
                                placeholder={"Kode Login"}/>
                            <center>
                                <button
                                    className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full my-1 md:mx-3"
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Login");
                                    }}>
                                    Login
                                </button>
                            </center>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Login;