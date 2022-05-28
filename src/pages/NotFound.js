import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Image,
  Text,
  Button,
  Container,
} from "@chakra-ui/react";
import onboardingVisual from "../asset/illustration/visualsound.png";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Container mt={[10, 10, 20]} justify="center" align="center">
      <Heading as="h4" fontSize="21px" fontFamily="Exo 2, sans-serif">
        404 Not Found
      </Heading>
      <Text mt={2}>
        We looked all over, but can not find what you are looking for.
      </Text>
      <Image
        src={onboardingVisual}
        w={["30%", "30%", "60%"]}
        mx="auto"
        mt={4}
      />
      <Button colorScheme="purple" onClick={() => navigate(-1)} mt={8}>
        Back to Previous
      </Button>
    </Container>
  );
}
