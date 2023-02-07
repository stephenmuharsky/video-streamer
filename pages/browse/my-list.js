import SectionCards from "@/components/card/section-cards";
import NavBar from "@/components/nav/navbar";
import styles from "@/styles/MyList.module.css";
import Head from "next/head";
import { getMyList } from "@/lib/videos";
import { useRedirectUser } from "@/utils/redirectUser";

export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUser(context);

  //   if (!userId) {
  //     return {
  //       props: {},
  //       redirect: {
  //         destination: "/login",
  //         permanent: false,
  //       },
  //     };
  //   }
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  //   console.log({ userId });
  //   console.log({ token });

  const favouritedVideos = await getMyList(userId, token);

  return {
    props: {
      favouritedVideos,
    },
  };
}

const MyList = ({ favouritedVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My List"
            videos={favouritedVideos}
            size="small"
            shouldWrap={true}
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};
export default MyList;
