import create from 'zustand'

const useStore = create(set => ({
    selectedRows: [],
    sidebarLogo: "",
    parentName: "",

    setSelectedRows: (rows) => set({ selectedRows: rows }),
    setSidebarLogo: (logo) => set({ sidebarLogo: logo }),
    setParentName: (name) => set({ parentName: name }),
}));

export default useStore;