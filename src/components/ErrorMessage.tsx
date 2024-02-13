import { FC } from "react";
import "./Loading.css";

const ErrorMessage: FC<{ message: any }> = ({ message }) => {
  return message ? <span className="text-xs text-[red]">{message}</span> : null;
};

export default ErrorMessage;
