import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { getPopTv, getTv } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const PopButtonCover = styled.div`
  height: 100px;
  padding: 0px 25px;
  position: relative;
  top: 380px;
  display: flex;
  justify-content: space-between;
`;

const ButtonCover = styled.div`
  height: 100px;
  padding: 0px 25px;
  position: relative;
  top: 80px;
  display: flex;
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

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Barnner = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const PopSlider = styled.div`
  padding-bottom: 100px;
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
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  position: relative;
  z-index: 999;
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

const TitleDiv = styled.div`
  width: 300px;
  bottom: 10px;
`;

const SliderTitle = styled.span`
  font-size: 42px;
  font-weight: 500;
`;

const TitleDive = styled.div`
  width: 500px;
  height: 200px;
  display: flex;
  align-items: flex-end;
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

const popoffset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch("/tv/:tvId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery(["tv", "onTheAir"], getTv);
  const { data: popData, isLoading: isPopLoading } = useQuery(
    ["poptv", "pop"],
    getPopTv
  );
  const [index, setIndex] = useState(0);
  const [popIndex, setPopIndex] = useState(0);
  const [back, setBack] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [exit, setExit] = useState(false);
  const movingIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const totalTvs = data.results.length - 1;
    const maxIndex = Math.floor(totalTvs / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };
  const popMovingIndex = () => {
    if (exit) return;
    toggleExit();
    const totalTvs = popData.results.length - 1;
    const maxIndex = Math.floor(totalTvs / popoffset) - 1;
    setPopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
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
  const incrasePopIndex = () => {
    if (popData) {
      setBack(false);
      popMovingIndex();
    }
  };
  const decreasePopIndex = () => {
    if (popData) {
      setBack(true);
      popMovingIndex();
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const toggleExit = () => setExit((prev) => !prev);
  const ontvClicked = (tvId) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
  const popClickedTv =
    bigTvMatch?.params.tvId &&
    popData?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Barnner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Barnner>
          <TitleDiv>
            <SliderTitle>New Tv Show</SliderTitle>
          </TitleDiv>
          <ButtonCover>
            <ButtonOne onClick={incraseIndex}></ButtonOne>
            <ButtonTwo onClick={decreseIndex}></ButtonTwo>
          </ButtonCover>
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
                  .map((tv) => (
                    <Box
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => ontvClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w300")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie style={{ top: scrollY.get() + 100 }}>
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>
                        {clickedTv.overview
                          ? clickedTv.overview
                          : "There is a no overview."}
                      </BigOverview>
                      <VoteAver>
                        Grade: {clickedTv ? clickedTv.vote_average : null}
                      </VoteAver>
                      <Poplular>
                        Vote:
                        {clickedTv ? clickedTv.vote_count : null}
                      </Poplular>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          <PopButtonCover>
            <ButtonOne onClick={incrasePopIndex}></ButtonOne>
            <ButtonTwo onClick={decreasePopIndex}></ButtonTwo>
          </PopButtonCover>
          <TitleDive>
            <SliderTitle>Popular Tv Show</SliderTitle>
          </TitleDive>
          {isPopLoading ? (
            <Loader>Loading...</Loader>
          ) : (
            <PopSlider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleExit}
              >
                <Row
                  custom={back}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visble"
                  exit="exiting"
                  transition={{ type: "tween", duration: 1 }}
                  key={popIndex}
                >
                  {popData?.results
                    .slice(1)
                    .slice(
                      popoffset * popIndex,
                      popoffset * popIndex + popoffset
                    )
                    .map((tv) => (
                      <Box
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => ontvClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.backdrop_path, "w300")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </PopSlider>
          )}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie style={{ top: scrollY.get() + 100 }}>
                  {popClickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            popClickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{popClickedTv.name}</BigTitle>
                      <BigOverview>
                        {popClickedTv.overview
                          ? popClickedTv.overview
                          : "There is a no overview."}
                      </BigOverview>
                      <VoteAver>
                        Grade: {clickedTv ? clickedTv.vote_average : null}
                      </VoteAver>
                      <Poplular>
                        Vote:
                        {clickedTv ? clickedTv.vote_count : null}
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

export default Tv;
