import React, {ReactNode, useEffect, useRef} from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}) => {
        const modalRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const handleOutsideClick = (event: MouseEvent) => {
                if (
                    isOpen &&
                    event.target instanceof Element &&
                    modalRef.current &&
                    !modalRef.current.contains(event.target)
                ) {
                    onClose();
                }
            };

            document.addEventListener('mousedown', handleOutsideClick);
            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
            };
        }, [isOpen, onClose]);
        return (
            <>
                {isOpen && (
                    <div
                        className="flex flex-col fixed inset-0 items-center justify-center h-full"
                        style={{zIndex: 9999}}>
                        <div className="bg-black opacity-50 fixed inset-0"></div>
                        <div ref={modalRef} className="z-50 h-[90vh] w-full md:w-1/2 p-6 rounded-md bg-white overflow-y-auto">
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
    }
;

export default Modal;