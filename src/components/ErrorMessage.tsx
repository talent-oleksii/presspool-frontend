import { FC } from "react";
import "./Loading.css";

const ErrorMessage: FC<{ message: any }> = ({ message }) => {
  return message ? (
    <span className="text-[10px] text-[red]">{message}</span>
  ) : null;
};

export default ErrorMessage;
