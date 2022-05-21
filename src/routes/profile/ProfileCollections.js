import { useState, useEffect, useContext } from "react";
import { Flex } from "@chakra-ui/react";
import { Firebase } from "../../utils/firebase";
import { AuthContext } from "../../components/auth/Auth";
import CollectionWrapper from "./CollectionWrapper";
import Gallery from "../../components/gallery/Gallery";
import Loader from "../../components/Loader";

export default function ProfileCollections() {
  const [user, loading, error] = useContext(AuthContext);
  const [collectedWorks, setCollectedWorks] = useState([]);
  const [currentTerm, setCurrentTerm] = useState("all");

  const [isShown, setIsShown] = useState([]);

  useEffect(() => {
    (async () => {
      const allCollections = await Firebase.getUserCollection(user.uid);
      const UserData = await Firebase.getProfile(user.uid);
      const collectionMap = UserData.collection_map;
      if (!collectionMap) {
        setCollectedWorks([
          {
            term: "all",
            list: allCollections,
          },
        ]);
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

  if (loading) return <Loader />;

  if (collectedWorks.length === 1)
    return <div>Go 'Explore' to collect more works</div>;

  return (
    <>
      <Flex w="70%" maxW="960px" overflow="scroll">
        {collectedWorks.map((category) =>
          !category.list.length ? (
            ""
          ) : (
            <CollectionWrapper
              key={category.term}
              collectionName={category.term}
              imageUrl={category.list[0]?.image_url}
              currentTerm={currentTerm}
              setCurrentTerm={setCurrentTerm}
            />
          )
        )}
      </Flex>
      <Gallery
        works={
          collectedWorks.filter(({ term }) => term === currentTerm)[0]?.list
        }
        isShown={isShown}
        setIsShown={setIsShown}
      />
    </>
  );
}
