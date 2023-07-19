import { toast } from 'react-toastify';

export default {
    comingSoon() {
        toast('Coming Soon', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
        });
    }
};