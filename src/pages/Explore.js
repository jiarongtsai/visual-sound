import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import {
  Button,
  Center,
  Box,
  Stack,
  FormControl,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Select } from "chakra-react-select";
import IntersectionGallery from "../components/gallery/IntersectionGallery";

export default function Explore() {
  const [alltags, setAlltags] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  let queryTerm = searchParams.get("query");

  useEffect(() => {
    Firebase.getAllTags().then((data) => {
      setAlltags(data);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let newQuery = formData.get("query");
    if (!newQuery) return;
    setSearchParams({ query: newQuery });
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
                placeholder="Search..."
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
              type="submit"
            />
          </Center>
        </form>
      </Stack>

      <Stack mt={12}>
        <IntersectionGallery term={queryTerm} currentUserID={null} />
      </Stack>
    </Box>
  );
}
