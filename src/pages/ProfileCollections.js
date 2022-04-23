import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/GridWrapper";
import { Img } from "../components/element/Img";
const userID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

export default function ProfileCollections() {
  const [collectedWorks, setCollectedWorks] = useState([]);
  const location = useLocation();
  useEffect(() => {
    Firebase.getUserCollection(userID).then((data) => {
      setCollectedWorks(data);
    });
  }, []);
  return (
    <>
      <GridWrapper>
        {collectedWorks.map((work) => {
          console.log(collectedWorks);
          return (
            <Link
              key={work.id}
              to={`/work/${work.id}`}
              state={{ backgroundLocation: location }}
            >
              <Img src={work.image_url} />
            </Link>
          );
        })}
      </GridWrapper>
    </>
  );
}
