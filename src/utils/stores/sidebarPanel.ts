import {create} from 'zustand';

type SidebarPanel = {
    active: string | null;
    setActive: (value: string | null) => void;
    show: string | null;
    setShow: (value: string | null) => void;
};
export const useSidebarPanel = create<SidebarPanel>((set) => ({
    active: null,
    setActive: (value) => set({active: value}),
    show: null,
    setShow: (value) => set({show: value}),
}));

type ToogleSidebarPanel = {
    active: boolean;
    setActive: (value: boolean) => void;
};
export const useToogleSidebarPanel = create<ToogleSidebarPanel>((set) => ({
    active: true,
    setActive: (value) => set({active: value}),
}));