import { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/GridWrapper";
import { Img } from "../components/element/Img";

export default function ProfileCollections() {
  const user = useContext(AuthContext);

  const [collectedWorks, setCollectedWorks] = useState([]);
  const location = useLocation();
  useEffect(() => {
    Firebase.getUserCollection(user.uid).then((data) => {
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
