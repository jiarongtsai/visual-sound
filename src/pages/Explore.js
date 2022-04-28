import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import {
  Button,
  Center,
  Box,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import Gallery from "../components/Gallery";

export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  const [input, setInput] = useState("");
  const [alltags, setAlltags] = useState([]);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = false;

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
    <Box mt={16}>
      <Stack mb={4}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Center>
            <InputGroup w={80}>
              <InputLeftElement
                pointerEvents="none"
                children={<Search2Icon color="gray.500" />}
              />
              <Input
                placeholder="Searching..."
                name="query"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                list="opts"
              />
            </InputGroup>
            <Button
              type="submit"
              colorScheme="teal"
              variant="solid"
              ml={2}
              // onClick={(e) => handleSubmit(e)}
            >
              Search
            </Button>
          </Center>

          <datalist id="opts">
            {alltags.map((tag, i) => (
              <option key={i}>{tag}</option>
            ))}
          </datalist>
        </form>
      </Stack>
      <Stack>
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
