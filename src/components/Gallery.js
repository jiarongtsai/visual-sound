import { useLocation, Link } from "react-router-dom";
import SequenceMotion from "./SequenceMotion";
import { GridWrapper, Square } from "./element/GridWrapper";
import { Img } from "./element/Img";

export default function Gallery({ works, isShown, setIsShown }) {
  let location = useLocation();

  return (
    <>
      <GridWrapper>
        {works &&
          works.map((work, i) => {
            return (
              <Link
                key={work.id}
                to={`/work/${work.id}`}
                state={{ backgroundLocation: location }}
              >
                <Square style={{ display: isShown[i] ? "block" : "none" }}>
                  <SequenceMotion
                    sheetmusic={work.sheetmusic}
                    bpm={work.bpm}
                    themeColor={work.themeColor}
                  />
                </Square>
                <Img
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
      </GridWrapper>
    </>
  );
}
