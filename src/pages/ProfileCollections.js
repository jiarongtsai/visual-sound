import { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../components/auth/Auth";
import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/element/GridWrapper";
import { Img } from "../components/element/Img";
import CollectionWrapper from "../components/CollectionWrapper";
import { Flex } from "@chakra-ui/react";

export default function ProfileCollections() {
  const user = useContext(AuthContext);
  const [collectedWorks, setCollectedWorks] = useState([]);
  const [categorizedWorks, setCategorizedWorks] = useState([]);
  const location = useLocation();
  useEffect(() => {
    (async () => {
      const allCollections = await Firebase.getUserCollection(user.uid);
      const UserData = await Firebase.getProfile(user.uid);
      const collectionMap = UserData.collection_map;
      if (collectionMap) {
        const categorized = categorize(collectionMap, allCollections);
        setCategorizedWorks(categorized);
      }
      setCollectedWorks(allCollections);
    })();
  }, []);

  function categorize(obj, arr) {
    let result = [];
    for (const [term, list] of Object.entries(obj)) {
      const inclusesArr = arr.filter((item) => list.includes(item.id));
      result.push({ term: term, list: inclusesArr });
    }
    return result;
  }

  return (
    <>
      <div>All</div>
      <Flex wrap="wrap" w="90%" justify="center">
        <CollectionWrapper />
        <CollectionWrapper />
        <CollectionWrapper />
        <CollectionWrapper />
        <CollectionWrapper />
      </Flex>
      <GridWrapper>
        {collectedWorks.map((work) => {
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
      {categorizedWorks?.map((category) => {
        return (
          <div key={category.term}>
            <div>{category.term}</div>
            <GridWrapper>
              {category.list?.map((work) => {
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
          </div>
        );
      })}
    </>
  );
}
