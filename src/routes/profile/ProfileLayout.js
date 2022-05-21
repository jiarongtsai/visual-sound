import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Firebase } from "../../utils/firebase";
import { AuthContext } from "../../components/auth/Auth";
import UsersModal from "../../components/UsersModal";
import EditProfileModal from "./EditProfileModal";
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
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export default function ProfileLayout() {
  const [profile, setProfile] = useState({});
  const [action, setAction] = useState({});
  const [currentFocus, setCurrentFocus] = useState(0);
  const [user, loading, error] = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/profile") {
      setCurrentFocus(0);
      return;
    }
    setCurrentFocus(1);
  }, [location.pathname]);

  useEffect(() => {
    const snapshot = Firebase.onSnapshotProfile(user.uid, (data) =>
      setProfile(data)
    );
    return () => {
      snapshot();
    };
  }, []);

  const unfollow = async (userID) => {
    await Firebase.unfollowUser(user.uid, userID);
    setAction((pre) => ({
      ...pre,
      userList: pre.userList.filter((user) => user.author_id !== userID),
    }));
  };

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
      invokeFunction: unfollow,
      buttonText: "Unfollow",
    });
    onOpen();
  }

  return (
    <>
      <UsersModal isOpen={isOpen} onClose={onClose} action={action} />
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        profile={profile}
        setProfile={setProfile}
      />
      <Flex mt={20} direction="column" align="center">
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
              <Heading fontSize="xl">{profile.user_name}</Heading>
            </GridItem>
            <GridItem colSpan={[3, 3, 1]}>
              <Button
                variant={"outline"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.800"),
                }}
                leftIcon={<EditIcon />}
                onClick={onEditOpen}
              >
                Edit Profile
              </Button>
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
              <Text>{profile.user_bio}</Text>
            </GridItem>
          </Grid>
        </Flex>

        <Tabs colorScheme="purple" w="90%" mb={8} index={currentFocus}>
          <TabList justifyContent="center">
            <Tab>
              <Link to="">Work</Link>
            </Tab>
            <Tab>
              <Link to="collection">Collection</Link>
            </Tab>
          </TabList>
        </Tabs>
        <Outlet />
      </Flex>
    </>
  );
}
