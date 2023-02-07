import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner/Banner";
import NavBar from "@/components/nav/navbar";
import SectionCards from "@/components/card/section-cards";
import {
  getVideos,
  getPopularVideos,
  getStaticVideos,
  getWatchItAgainVideos,
} from "@/lib/videos";
import videoData from "../data/videos.json";
import { verifyToken } from "@/lib/utils";
import { useRedirectUser } from "@/utils/redirectUser";

export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // if (!userId) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }
  ``;
  const historicalEpicVideos = await getVideos("historical movie trailer");
  const productivityVideos = await getVideos("productivity videos");
  const travelVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();

  // const historicalEpicVideos = getStaticVideos(videoData);
  // const productivityVideos = getStaticVideos(videoData);
  // const travelVideos = getStaticVideos(videoData);
  // const popularVideos = getStaticVideos(videoData);

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);

  //queryHasuraGQL();

  //console.log({ hasuraStuff });
  return {
    //, travelVideos, productivityVideos
    props: {
      historicalEpicVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  historicalEpicVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchItAgainVideos = [],
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Steflix</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar username="stephen@gmail.com" />
        <Banner
          title="300"
          subTitle="Spartans battle Persians"
          imgUrl="/static/300.jpg"
          videoId="UrIbxk7idYA"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="Historical Epic"
            videos={historicalEpicVideos}
            size={"large"}
          />
          <SectionCards
            title="Watch it again"
            videos={watchItAgainVideos}
            size={"small"}
          />

          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size={"small"}
          />
          <SectionCards title="Travel" videos={travelVideos} size={"medium"} />
          <SectionCards title="Popular" videos={popularVideos} size={"small"} />
        </div>
      </div>
    </div>
  );
}
