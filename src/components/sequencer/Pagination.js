import {
  Pagination as PaginationMain,
  PaginationPage,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const Pagination = ({
  currentPage,
  toggleLine,
  setCurrentPage,
  pagesCount,
  pages,
}) => {
  console.log(toggleLine + 1);
  const background = useColorModeValue("gray.300", "gray.500");
  return (
    <PaginationMain
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
              bg={background}
              borderBottom="4px"
              borderColor="transparent"
              // opacity={togglePage === page ? 0.7 : 1}
              _current={{
                textDecor: "underline",
                // borderColor: "purple.500",
              }}
            />
          ))}
        </PaginationPageGroup>
      </PaginationContainer>
    </PaginationMain>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  pagesCount: PropTypes.number,
  pages: PropTypes.arrayOf(PropTypes.number),
};
