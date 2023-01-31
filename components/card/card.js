import styles from "./card.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import cls from "classnames";

const Card = (props) => {
  const {
    imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=859&q=80",
    size = "medium",
    id,
  } = props;

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleOnError = () => {
    console.log("Image error");
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };
  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        whileHover={{ ...scale }}
      >
        <Image
          src={imgUrl}
          alt="Movie picture"
          layout="fill"
          sizes="(max-width: 768px) 33vw"
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};
export default Card;
