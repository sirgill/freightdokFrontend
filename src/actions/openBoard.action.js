import axios from "axios";
import { notification } from "./alert";

export const bookNow = async (body) => {
  try {
    const response = await axios.post("http://localhost:8000/sendMail", body);
    const { data, status } = response;
    if (data.success) {
      notification(data.message);
    } else {
      notification(data.message, "error");
    }
  } catch (error) {
    console.log(error);
  }
};
