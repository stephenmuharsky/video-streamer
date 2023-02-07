import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import clsx from "classnames";
import { getYoutubeVideoById } from "@/lib/videos";
import NavBar from "@/components/nav/navbar";
import Like from "@/components/icons/like-icon";
import Dislike from "@/components/icons/dislike-icon";
import { useState, useEffect } from "react";
import Head from "next/head";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
  //data to fetch from API
  //   const video = {
  //     title: "Hi cute dohg",
  //     publishTime: "1990-01-01",
  //     description:
  //       "A  huge monkey donkey chases a squad of illiterate ninja dogs up a tree",
  //     channelTitle: "Paramount Pictures",
  //     viewCount: 10000000,
  //   };
  console.log({ context });
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: { video: videoArray.length > 0 ? videoArray[0] : [] },
    revalidate: 10, //In seconds
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["7ddBifCzUl8", "VWSVSPaszJk", "0MIw4xzxcTU"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  //console.log({ router });
  //console.log({ video });
  const videoId = router.query.videoId;
  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  const handleToggleLike = async () => {
    console.log("Like");
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDislike(toggleLike);
    const favourite = val ? 1 : 0;
    const response = await runRatingService(favourite);

    console.log("data", await response.json());
  };

  const runRatingService = async (favourited) => {
    return await fetch("/api/stats", {
      method: "POST",
      body: JSON.stringify({
        videoId,
        favourited,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    async function fetchFavourite() {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDislike(true);
        }
      }
    }
    fetchFavourite();
  }, []);

  const handleToggleDislike = async () => {
    console.log("Dislike");
    const val = !toggleDislike;

    setToggleDislike(!toggleDislike);
    setToggleLike(toggleDislike);
    const favourited = val ? 0 : 1;
    const response = await runRatingService(favourited);

    console.log("data", await response.json());
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>
      <NavBar />
      <Modal
        isOpen={true}
        contentLabel="Example Modal"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
          frameBorder="0"
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>

          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <Dislike selected={toggleDislike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast:</span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count:</span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
