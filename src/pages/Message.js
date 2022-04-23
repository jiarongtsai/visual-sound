import React, { useContext } from "react";
import { AuthContext } from "../auth/Auth";
export default function Message() {
  const user = useContext(AuthContext);
  return <div>Message</div>;
}
