import { useEffect } from "react";

export default (map) => {
  useEffect(() => {
    const handlePress = (event) => {
      const handler = map[event.key];
      if (typeof handler === "function") {
        handler();
      }
    };

    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [map]);
};
