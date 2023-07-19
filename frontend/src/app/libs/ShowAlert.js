import Swal from 'sweetalert2'

export default {
    updated(message = null) {
        Swal.fire({
            title: 'Sukses',
            text: message !== null ? message : 'Data berhasil diperbarui',
            icon: 'success',
        })
    },
    created(message = null) {
        Swal.fire({
            title: 'Sukses',
            text: message ? message : 'Data berhasil disimpan',
            icon: 'success',
        })
    },
    deleted(message = null) {
        Swal.fire({
            title: 'Sukses',
            text: message ? message : 'Data berhasil dihapus',
            icon: 'success',
        })
    },
    failed(error = null) {
        Swal.fire({
            title: 'Gagal',
            text: error ? error : 'Terjadi kesalahan pada sistem',
            icon: 'error',
        })
    },
    warning(warn = null) {
        Swal.fire({
            title: 'Warning',
            text: warn ? warn : 'Ups, ada kesalahan',
            icon: 'warning',
        })
    },
    confirm(ask = null) {
        return Swal.fire({
            title: 'Konfirmasi',
            text: ask ? ask : 'Anda yakin?',
            icon: 'warning',
            showCancelButton: true,
        })
    }
};