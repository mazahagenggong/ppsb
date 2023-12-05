import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-black opacity-50 fixed inset-0"></div>
                    <div className="z-10 w-full md:w-1/2 p-6 bg-white rounded-md">
                        <div className="flex justify-end">
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={onClose}
                            >
                                x
                            </button>
                        </div>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;