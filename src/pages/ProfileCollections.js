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
  const [currentTerm, setCurrentTerm] = useState("all");

  const location = useLocation();
  useEffect(() => {
    (async () => {
      const allCollections = await Firebase.getUserCollection(user.uid);
      const UserData = await Firebase.getProfile(user.uid);
      const collectionMap = UserData.collection_map;
      if (!collectionMap) {
        setCollectedWorks({
          term: "all",
          list: allCollections,
        });
        return;
      }
      const categorized = categorize(collectionMap, allCollections);
      setCollectedWorks([
        {
          term: "all",
          list: allCollections,
        },
        ...categorized,
      ]);
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
      {collectedWorks.length > 1 ? (
        <Flex my={2} w={["960px"]} overflow="scroll">
          {collectedWorks.map((category) => (
            <CollectionWrapper
              key={category.term}
              collectionName={category.term}
              imageUrl={category.list[0].image_url}
              setCurrentTerm={setCurrentTerm}
            />
          ))}
        </Flex>
      ) : (
        ""
      )}
      <GridWrapper>
        {collectedWorks
          .filter(({ term }) => term === currentTerm)[0]
          ?.list.map((work) => (
            <Link
              key={work.id}
              to={`/work/${work.id}`}
              state={{ backgroundLocation: location }}
            >
              <Img src={work.image_url} />
            </Link>
          ))}
      </GridWrapper>
    </>
  );
}
