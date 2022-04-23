import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/GridWrapper";
import { Thumbnail } from "../components/element/Thumbnail";
import { Img } from "../components/element/Img";

export default function User() {
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const { uid } = useParams();
  const location = useLocation();

  useEffect(() => {
    Firebase.getProfile(uid).then((data) => setProfile(data));

    Firebase.getUserWorks(uid).then((data) => {
      setUserWorks(data);
    });
  }, []);

  return (
    <>
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
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
