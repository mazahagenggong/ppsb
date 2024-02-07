import {create} from 'zustand';

type ModalEditNamaStore = {
    modalNama: boolean;
    setModalNama: (value: boolean) => void;
};

export const useModalEditNamaStore = create<ModalEditNamaStore>((set) => ({
    modalNama: false,
    setModalNama: (value) => set({modalNama: value}),
}));