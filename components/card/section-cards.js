import styles from "./section-cards.module.css";
import Card from "./card";
import Link from "next/link";
import clsx from "classnames";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;
  //console.log({ videos });
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(shouldWrap && styles.wrap, styles.cardWrapper)}>
        {videos.map((video, idx) => {
          return (
            <Link href={`/video/${video.id}`} legacyBehavior>
              <a>
                <Card
                  id={idx}
                  imgUrl={video.imgUrl}
                  size={size}
                  shouldScale={shouldScale}
                />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
