import { findVideoIdByUser, insertStats, updateStats } from "@/lib/db/hasura";
import { verifyToken } from "@/lib/utils";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send();
    } else {
      const inputParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inputParams;
      if (videoId) {
        // const decodedToken = jwt.verify(
        //   token,
        //   process.env.NEXT_PUBLIC_JWT_SECRET
        // );
        //console.log({ decodedToken });

        const userId = await verifyToken(token);
        //videoId = "CKGN-useSD8";
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doStatsExist = findVideo?.length > 0;
        console.log({ userId });
        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;
          if (doStatsExist) {
            //update row
            const response = await updateStats(token, {
              userId,
              videoId,
              favourited,
              watched,
            });
            res.send({
              message: "i will keep you updated",
              data: response,
            });
          } else {
            //add to table
            const response = await insertStats(token, {
              userId,
              videoId,
            });
            res.send({
              message: "i will add you to the network",
              data: response,
            });
          }
        } else {
          if (doStatsExist) {
            res.send(findVideo);
          } else {
            res.status(404);
            res.send({ user: null, msg: "video not found" });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error occured /stats", error);
    res.status(500).send({ done: false, error: error?.message });
  }
}

//     }
//     if (req.method === "POST") {
//     //console.log({ cookies: req.cookies });

//     try {
//       const token = req.cookies.token;
//       if (!token) {
//         res.status(403).send();
//       } else {
//         const { videoId, favourited, watched = true } = req.body;
//         if (videoId) {
//           const decodedToken = jwt.verify(
//             token,
//             process.env.NEXT_PUBLIC_JWT_SECRET
//           );
//           //console.log({ decodedToken });

//           const userId = decodedToken.issuer;
//           //videoId = "CKGN-useSD8";
//           const findVideo = await findVideoIdByUser(token, userId, videoId);
//           const doStatsExist = findVideo?.length > 0;
//           console.log({ userId });
//           //console.log({ doStatsExist });
//           if (doStatsExist) {
//             //update row
//             const response = await updateStats(token, {
//               userId,
//               videoId,
//               favourited,
//               watched,
//             });
//             res.send({
//               message: "i will keep you updated",
//               data: response,
//             });
//           } else {
//             //add to table
//             const response = await insertStats(token, {
//               userId,
//               videoId,
//             });
//             res.send({
//               message: "i will add you to the network",
//               data: response,
//             });
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error occured /stats", error);
//       res.status(500).send({ done: false, error: error?.message });
//     }
//   } else {
//     try {
//       const token = req.cookies.token;
//       if (!token) {
//         res.status(403).send();
//       } else {
//         const { videoId } = req.body;
//         if (videoId) {
//           const decodedToken = jwt.verify(
//             token,
//             process.env.NEXT_PUBLIC_JWT_SECRET
//           );
//           //console.log({ decodedToken });

//           const userId = decodedToken.issuer;
//           //videoId = "CKGN-useSD8";
//           const findVideo = await findVideoIdByUser(token, userId, videoId);
//           const doStatsExist = findVideo?.length > 0;
//           console.log({ userId });
//           //console.log({ doStatsExist });
//           if (doStatsExist) {
//             res.send(findVideo);
//           }
//         } else {
//           res.status(404);
//           res.send({ user: null, msg: "video not found" });
//         }
//       }
//     } catch (error) {
//       console.error("Error occured /stats", error);
//       res.status(500).send({ done: false, error: error?.message });
//     }
