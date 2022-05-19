import { useState, useEffect, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import {
  Button,
  Center,
  Box,
  Stack,
  FormControl,
  IconButton,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Select } from "chakra-react-select";
import Gallery from "../components/Gallery";
import { AuthContext } from "../components/auth/Auth";

export default function Explore() {
  const [user, loading, error] = useContext(AuthContext);
  const [exploreworks, setExploreworks] = useState([]);
  const [alltags, setAlltags] = useState([]);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = false;
  const [selectedOption, setSelectedOption] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  let queryTerm = searchParams.get("query");

  useEffect(() => {
    Firebase.getAllTags().then((data) => {
      setAlltags(data);
    });
  }, []);

  useEffect(() => {
    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (typeof pagingRef.current === "undefined") return;
      isFetching = true;

      Firebase.getWorks(pagingRef.current, queryTerm).then(
        ({ fetchWorks, lastVisibleWork }) => {
          setExploreworks((pre) => [...pre, ...fetchWorks]);
          setIsShown((pre) => [
            ...pre,
            ...Array(fetchWorks.length).fill(false),
          ]);
          pagingRef.current = lastVisibleWork;
          isFetching = false;
        }
      );
    });
    pagingObserver.observe(endofPageRef.current);
    return () => {
      endofPageRef.current && pagingObserver.unobserve(endofPageRef.current);
    };
  }, [queryTerm]);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let newQuery = formData.get("query");
    if (!newQuery) return;
    pagingRef.current = null;
    setSearchParams({ query: newQuery });
    setExploreworks([]);
    setIsShown([]);
  }
  return (
    <Box mt={12}>
      <Stack>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Center maxW={["280px", "280px", "300px", "420px"]} mx="auto">
            <FormControl>
              <Select
                name="query"
                options={alltags.map((tag) => ({
                  value: tag,
                  label: tag,
                }))}
                placeholder="Search by tags..."
                closeMenuOnSelect={true}
                selectedOptionColor="purple"
                defaultValue={selectedOption}
                onChange={setSelectedOption}
              />
            </FormControl>
            <Button
              rightIcon={<Search2Icon />}
              type="submit"
              colorScheme="purple"
              variant="solid"
              w="100px"
              ml={2}
              px={8}
              d={["none", "none", "inline-flex"]}
            >
              Search
            </Button>
            <IconButton
              aria-label="Search database"
              colorScheme="purple"
              icon={<Search2Icon />}
              ml={2}
              d={["initial", "initial", "none"]}
            />
          </Center>
        </form>
      </Stack>
      <Stack mt={12}>
        <Gallery
          works={exploreworks}
          isShown={isShown}
          setIsShown={setIsShown}
        />
      </Stack>
      <div ref={endofPageRef}></div>
    </Box>
  );
}
