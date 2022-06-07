import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import IntersectionGallery from "../components/gallery/IntersectionGallery";
import { UsersModal } from "../components/UsersModal";
import Loader from "../components/Loader";
import { AlertModal } from "../components/AlertModal";

export default function User() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState({});
  const [profile, setProfile] = useState({});
  const [user, loading, error] = useContext(AuthContext);
  const bgColor = useColorModeValue("gray.200", "gray.800");
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  useEffect(() => {
    if (user?.uid === uid) {
      navigate(`/profile`);
    }
  }, [user, uid]);

  useEffect(() => {
    const snapshot = Firebase.onSnapshotProfile(uid, (data) => {
      setProfile(data);
    });

    return () => {
      snapshot();
    };
  }, [user, uid]);

  const chat = async (userID) => {
    if (!user) {
      onAlertOpen();
      return;
    }
    const mid = await Firebase.getChatroom(user?.uid, userID);
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
      buttonText: "Chat",
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
      buttonText: "Chat",
    });
    onOpen();
  }

  function handleFollow() {
    if (!user) {
      onAlertOpen();
      return;
    }
    if (!profile.followers?.includes(user?.uid)) {
      Firebase.followUser(user.uid, uid);
      return;
    }
    Firebase.unfollowUser(user.uid, uid);
  }

  function handleOpenCharoomt() {
    if (!user) {
      onAlertOpen();
      return;
    }
    Firebase.getChatroom(user.uid, uid).then((mid) => {
      navigate(`/message/${mid}`);
    });
  }
  if (loading) return <Loader />;

  return (
    <>
      <UsersModal isOpen={isOpen} onClose={onClose} action={action} />
      <AlertModal
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        content="Only Registered users could interact with others."
      />
      <Flex mt={[10, 10, 20]} direction="column" align="center">
        <Flex
          direction={["column", "column", "row"]}
          justify="center"
          align={["center", "center", "flex-start"]}
          w="70%"
        >
          <Box flexBasis="30%">
            <Image
              src={profile.user_thumbnail}
              w="150px"
              h="150px"
              objectFit="cover"
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
              <Heading fontSize="xl" mt={[3, 3, 0]}>
                {profile.user_name}
              </Heading>
            </GridItem>
            <GridItem colSpan={[3, 3, 1]}>
              <Flex>
                <Button
                  colorScheme="purple"
                  onClick={handleOpenCharoomt}
                  mr={2}
                  w="80px"
                >
                  Chat
                </Button>
                <Button
                  w="92px"
                  variant={"outline"}
                  _hover={{
                    textDecoration: "none",
                    bg: { bgColor },
                  }}
                  onClick={handleFollow}
                >
                  {profile.followers?.includes(user?.uid)
                    ? "unfollow"
                    : "follow"}
                </Button>
              </Flex>
            </GridItem>
            <GridItem colSpan={1} d="flex">
              <Text fontWeight="600" mr={2} minWidth="15px">
                {profile.works_count || 0}
              </Text>
              <Text>Works</Text>
            </GridItem>
            <GridItem
              colSpan={1}
              d="flex"
              onClick={openFollowers}
              cursor="pointer"
            >
              <Text fontWeight="600" mr={2} minWidth="15px">
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
              <Text fontWeight="600" mr={2} minWidth="15px">
                {profile.following?.length || 0}
              </Text>
              <Text>Following</Text>
            </GridItem>
            <GridItem rowSpan={2} colSpan={3} alignSelf="flex-start">
              <Box h={["60px", "60px", "120px"]} overflow="auto" w="100%">
                <Text>{profile.user_bio}</Text>
              </Box>
            </GridItem>
          </Grid>
        </Flex>
        <IntersectionGallery term={null} currentUserID={uid} />
      </Flex>
    </>
  );
}
