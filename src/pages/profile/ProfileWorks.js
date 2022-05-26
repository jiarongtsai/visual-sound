import { useContext } from "react";
import { AuthContext } from "../../components/auth/Auth";
import IntersectionGallery from "../../components/gallery/IntersectionGallery";
import Loader from "../../components/Loader";

export default function ProfileWorks() {
  const [user, loading, error] = useContext(AuthContext);

  if (loading) return <Loader />;
  return (
    <IntersectionGallery term={null} currentUserID={user.uid} isCurrentUser />
  );
}
