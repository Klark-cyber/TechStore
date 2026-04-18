/** SweetAlertHandling **/
import Swal from "sweetalert2";
import { Messages } from "./config";

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    text: message,
    showConfirmButton: false,
    background: "#0d1020",
    color: "#fff",
    iconColor: "#ef4444",
    timer: 2500,
    timerProgressBar: true,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "center",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
    background: "#0d1020",
    color: "#fff",
    iconColor: "#2979ff",
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",   // navbar dan uzoqda, pastda
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    background: "#0d1020",
    color: "#fff",
    iconColor: "#2979ff",
    customClass: {
      popup: "ts-toast-popup",
    },
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then();
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
    background: "#0d1020",
    color: "#fff",
    iconColor: "#ef4444",
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};