import {
  Pagination,
  PaginationPage,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { useColorModeValue } from "@chakra-ui/react";

export default ({ currentPage, setCurrentPage, pagesCount, pages }) => {
  const currentBackground = useColorModeValue("gray.300", "gray.500");

  return (
    <Pagination
      my={4}
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <PaginationContainer>
        <PaginationPageGroup mx={2}>
          {pages.map((page) => (
            <PaginationPage
              w={10}
              key={`pagination_page_${page}`}
              page={page}
              _current={{
                bg: currentBackground,
              }}
            />
          ))}
        </PaginationPageGroup>
      </PaginationContainer>
    </Pagination>
  );
};
