import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { getInfo } from "../api";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
  margin-top: 500px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonCover = styled.div`
  height: 100px;
  padding: 0px 25px;
  position: relative;
  display: flex;
  bottom: 20px;
  justify-content: space-between;
`;

const ButtonOne = styled.button`
  border: 3px solid rgba(0, 0, 0, 0.6);
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: relative;
  z-index: 999;
  background-color: rgba(255, 2555, 255, 0.3);
  cursor: pointer;
  &:hover {
    background-color: rgba(233, 218, 193, 0.7);
  }
`;

const ButtonTwo = styled.button`
  border: 3px solid rgba(0, 0, 0, 0.6);
  width: 50px;
  height: 50px;
  border-radius: 25px;
  position: relative;
  z-index: 999;
  background-color: rgba(255, 2555, 255, 0.3);
  cursor: pointer;
  &:hover {
    background-color: rgba(233, 218, 193, 0.7);
  }
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  color: red;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    color: white;
    font-family: "Roboto", sans-serif;
    font-weight: 500;
  }
`;

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  position: relative;
  z-index: 999;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
  z-index: 999;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  z-index: 999;
  color: ${(props) => props.theme.white.lighter};
`;

const Searchdiv = styled.div`
  height: 100px;
  position: relative;
  bottom: 350px;
`;

const VoteAver = styled.span`
  padding: 20px;
  position: relative;
  top: -80px;
  z-index: 999;
  color: ${(props) => props.theme.white.lighter};
`;

const Poplular = styled.span`
  padding: 20px;
  position: relative;
  top: -80px;
  z-index: 999;
  color: ${(props) => props.theme.white.lighter};
`;

const Searchfor = styled.h1`
  font-size: 50px;
`;

const rowVariants = {
  hidden: (back) => ({
    x: back ? window.outerWidth - 20 : -window.outerWidth - 20,
  }),
  visble: {
    x: 0,
  },
  exiting: (back) => ({
    x: back ? -window.outerWidth - 20 : window.outerWidth - 20,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.2,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery(["search", "key"], () =>
    getInfo(keyword)
  );
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const keywordMatch = keyword.match(/\w{1,10}/);
  const Id = keyword.match(/\d+/g);
  const SearchId = Id ? Id[0] : Id;
  const [back, setBack] = useState(false);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const onSearchClicked = (searchId) => {
    history.push(`/search?keyword=${keyword}/${searchId}`);
    setOpen((prev) => !prev);
  };
  const movingIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const incraseIndex = () => {
    if (data) {
      setBack(false);
      movingIndex();
    }
  };
  const decreseIndex = () => {
    if (data) {
      setBack(true);
      movingIndex();
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOverlayClick = () => history.replace("/tv");
  const clickedMovie =
    SearchId && data?.results.find((movie) => movie.id === +SearchId);
  return (
    <Wrapper>
      <Searchdiv>
        <Searchfor>{`Search for "${keywordMatch}"`}</Searchfor>
      </Searchdiv>
      <ButtonCover>
        <ButtonOne onClick={incraseIndex}></ButtonOne>
        <ButtonTwo onClick={decreseIndex}></ButtonTwo>
      </ButtonCover>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <AnimatePresence
              custom={back}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={back}
                variants={rowVariants}
                initial="hidden"
                animate="visble"
                exit="exiting"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((seacrch) => (
                    <Box
                      key={seacrch.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onSearchClicked(seacrch.id)}
                      transition={{ type: "tween" }}
                      bgphoto={
                        seacrch.backdrop_path
                          ? makeImagePath(seacrch.backdrop_path, "w300")
                          : makeImagePath(seacrch.poster_path, "w300")
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{seacrch.title ? seacrch.title : seacrch.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {open ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie style={{ top: scrollY.get() + 100 }}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path
                              ? makeImagePath(
                                  clickedMovie.backdrop_path,
                                  "w300"
                                )
                              : makeImagePath(clickedMovie.poster_path, "w300")
                          )})`,
                        }}
                      />
                      <BigTitle>
                        {clickedMovie.title
                          ? clickedMovie.title
                          : clickedMovie.name}
                      </BigTitle>
                      <BigOverview>
                        {clickedMovie.overview
                          ? clickedMovie.overview
                          : "There is a no overview."}
                      </BigOverview>
                      <VoteAver>
                        Grade: {clickedMovie ? clickedMovie.vote_average : null}
                      </VoteAver>
                      <Poplular>
                        Vote:
                        {clickedMovie ? clickedMovie.vote_count : null}
                      </Poplular>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
/* 
{bigMovieMatch ? (
  <>
    <Overlay
      onClick={onOverlayClick}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
    <BigMovie style={{ top: scrollY.get() + 100 }}>
      {clickedMovie && (
        <>
          <BigCover
            style={{
              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                clickedMovie.backdrop_path,
                "w500"
              )})`,
            }}
          />
          <BigTitle>{clickedMovie.title}</BigTitle>
          <BigOverview>{clickedMovie.overview}</BigOverview>
        </>
      )}
    </BigMovie>
  </>
) : null} */
export default Search;
