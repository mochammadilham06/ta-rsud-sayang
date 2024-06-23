import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

export const showResponseModal = (success: boolean, message?: string) => {
  MySwal.fire({
    title: success ? message ?? 'Action Successful' : message ?? 'Action Failed',
    icon: success ? 'success' : 'error',
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    showCloseButton: true,
  });
};
