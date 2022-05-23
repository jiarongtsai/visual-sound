import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import SequencerMotionOnly from "../sequencer/SequencerMotionOnly";
import { WorkGrid, VideoWrapper, CoverImage } from "./element";

export default function Gallery({ works, isShown, setIsShown }) {
  let location = useLocation();

  return (
    <>
      <WorkGrid>
        {works &&
          works.map((work, i) => {
            return (
              <Link
                key={work.id}
                to={`/work/${work.id}`}
                state={{ backgroundLocation: location }}
              >
                <VideoWrapper
                  style={{ display: isShown[i] ? "block" : "none" }}
                >
                  <SequencerMotionOnly
                    sheetmusic={work.sheetmusic}
                    bpm={work.bpm}
                    themeColor={work.themeColor}
                  />
                </VideoWrapper>
                <CoverImage
                  src={work.image_url}
                  onMouseEnter={() =>
                    setIsShown((pre) => [
                      ...pre.slice(0, i),
                      true,
                      ...pre.slice(i + 1),
                    ])
                  }
                  onMouseLeave={() =>
                    setIsShown((pre) => [
                      ...pre.slice(0, i),
                      false,
                      ...pre.slice(i + 1),
                    ])
                  }
                />
              </Link>
            );
          })}
      </WorkGrid>
    </>
  );
}

Gallery.propTypes = {
  works: PropTypes.array,
  isShown: PropTypes.array,
  setIsShown: PropTypes.func,
};
