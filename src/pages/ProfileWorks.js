import { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/GridWrapper";
import { Img } from "../components/element/Img";

export default function ProfileWorks() {
  const user = useContext(AuthContext);
  const [userWorks, setUserWorks] = useState([]);
  const location = useLocation();
  useEffect(() => {
    Firebase.getUserWorks(user.uid).then((data) => {
      setUserWorks(data);
    });
  }, []);
  return (
    <>
      <GridWrapper>
        {userWorks.map((work) => {
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
