import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Thumbnail } from "../components/element/Thumbnail";
import styled from "styled-components";
import { AuthContext } from "../components/auth/Auth";
import Gallery from "../components/Gallery";
import {
  Flex,
  Grid,
  GridItem,
  Box,
  useDisclosure,
  Image,
  Text,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import UsersModal from "../components/UsersModal";

export default function User() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState({});

  const user = useContext(AuthContext);
  const { uid } = useParams();
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentFollowers, setCurrentFollowers] = useState(0);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = false;

  useEffect(() => {
    //authcontext 的延遲問題如何解決
    if (user?.uid === uid) {
      navigate(`/profile`);
    }
  }, [user]);

  useEffect(() => {
    Firebase.getProfile(uid).then((data) => {
      setProfile(data);
      setIsFollowing(data.followers.includes(user?.uid));
      setCurrentFollowers(data.followers?.length || 0);
    });
  }, []);

  useEffect(() => {
    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (typeof pagingRef.current === "undefined") return;
      isFetching = true;
      Firebase.getWorks(pagingRef.current, null, uid).then(
        ({ fetchWorks, lastVisibleWork }) => {
          setUserWorks((pre) => [...pre, ...fetchWorks]);
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
  }, []);

  //fix me : navigate to userpage doesn't work
  // const chat = (userID) => {
  //   navigate(`/message/${userID}`);
  // };

  const chat = async (userID) => {
    const mid = await Firebase.getChatroom(user.uid, userID);
    navigate(`/message/${mid}`);
  };

  async function openFollowers() {
    const FollowerListWithInfo = await Promise.all(
      profile.followers.map(async (id) => {
        const data = await Firebase.getUserBasicInfo(id);
        return data;
      })
    );
    setAction({
      name: "Follower List",
      userList: FollowerListWithInfo,
      invokeFunction: chat,
      buttonText: "Message",
    });
    onOpen();
  }

  async function openFollowing() {
    const FollowingListWithInfo = await Promise.all(
      profile.following.map(async (id) => {
        const data = await Firebase.getUserBasicInfo(id);
        return data;
      })
    );
    setAction({
      name: "Following List",
      userList: FollowingListWithInfo,
      invokeFunction: chat,
      buttonText: "Message",
    });
    onOpen();
  }

  function handleFollow() {
    if (!isFollowing) {
      Firebase.followUser(user.uid, uid, profile.followers).then(() => {
        setIsFollowing(true);
        setCurrentFollowers((v) => v + 1);
      });
      return;
    }
    Firebase.unfollowUser(user.uid, uid, profile.followers).then(() => {
      setIsFollowing(false);
      setCurrentFollowers((v) => v - 1);
    });
  }

  function handleChat() {
    Firebase.getChatroom(user.uid, uid).then((mid) => {
      navigate(`/message/${mid}`);
    });
  }

  return (
    <>
      <UsersModal isOpen={isOpen} onClose={onClose} action={action} />

      <Flex mt={24} direction="column" align="center">
        <Flex
          direction={["column", "column", "row"]}
          justify="center"
          align={["center", "center", "flex-start"]}
          w="70%"
        >
          <Box flexBasis="30%">
            <Image
              src={profile.user_thumbnail}
              w="50%"
              rounded="full"
              mx="auto"
            />
          </Box>
          <Grid
            flexBasis="40%"
            h="200px"
            templateRows="repeat(5, 1fr)"
            templateColumns="repeat(3, 1fr)"
            gap={3}
            alignItems="center"
            justifyItems={["center", "center", "flex-start"]}
          >
            <GridItem colSpan={[3, 3, 2]}>
              <Heading fontSize="xl">{profile.user_name}</Heading>
            </GridItem>
            <GridItem colSpan={[3, 3, 1]}>
              <Flex>
                <Button colorScheme="purple" onClick={handleChat} mr={2}>
                  Message
                </Button>
                <Button
                  variant={"outline"}
                  _hover={{
                    textDecoration: "none",
                    bg: useColorModeValue("gray.200", "gray.800"),
                  }}
                  onClick={handleFollow}
                >
                  {!isFollowing ? "follow" : "unfollow"}
                </Button>
              </Flex>
            </GridItem>
            <GridItem colSpan={1} d="flex">
              {/* need real data */}
              <Text fontWeight="600" mr={2}>
                {0}
              </Text>
              <Text>Works</Text>
            </GridItem>
            <GridItem
              colSpan={1}
              d="flex"
              onClick={openFollowers}
              cursor="pointer"
            >
              <Text fontWeight="600" mr={2}>
                {profile.followers?.length || 0}
              </Text>
              <Text>Followers</Text>
            </GridItem>
            <GridItem
              colSpan={1}
              d="flex"
              onClick={openFollowing}
              cursor="pointer"
            >
              <Text fontWeight="600" mr={2}>
                {profile.following?.length || 0}
              </Text>
              <Text>Following</Text>
            </GridItem>
            <GridItem rowSpan={2} colSpan={3} alignSelf="flex-start">
              <Text>{profile.user_bio}</Text>
            </GridItem>
          </Grid>
        </Flex>
        <Gallery works={userWorks} isShown={isShown} setIsShown={setIsShown} />
        <div ref={endofPageRef}></div>
      </Flex>
    </>
  );
}
