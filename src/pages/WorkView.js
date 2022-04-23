import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Img } from "../components/element/Img";

export default function WorkView() {
  const [work, setWork] = useState({});
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    Firebase.getWork(id).then((data) => {
      setWork(data);
    });
  }, []);

  if (!work) return <div>Work Not Found</div>;
  return (
    <>
      <h1>{work.description}</h1>
      <Img src={work.image_url || ""} />
    </>
  );
}
