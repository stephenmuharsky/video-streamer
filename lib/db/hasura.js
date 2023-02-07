export async function insertStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
  mutation insertStats( $userId: String!, $videoId: String!) {
    insert_stats_one(object:{
      userId: $userId, 
      videoId: $videoId, 
     }) 
      {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    { userId, videoId },
    token
  );
}

export async function updateStats(
  token,
  { userId, videoId, favourited, watched }
) {
  const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    update_stats(
      where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, 
      _set: {favourited: $favourited, watched: $watched}) {
      returning {
        favourited
        id
        userId
        videoId
        watched
      }
    }
  }
`;

  return await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    { favourited, userId, watched, videoId },
    token
  );
}

export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}
      ){
      id
      userId
      videoId
      watched
      favourited
    }
  }
`;

  const res = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    { userId, videoId },
    token
  );

  console.log({ res });
  return res?.data?.stats;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;
  const res = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer, email, publicAddress },
    token
  );

  console.log({ res, issuer });
  return res;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
query isNewUser($issuer: String!) {
  users(where: {issuer: {_eq: $issuer}}) {
    id
    email
    issuer
  }
}
`;

  const res = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );
  console.log({ res, issuer });
  return res?.data?.users?.length === 0;
}

export async function queryHasuraGQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  // console.log("result", await result.json());
  return await result.json();
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query getWatchedVideos($userId: String!) {
    stats(where: {
      watched: {_eq: true},
      userId: {_eq: $userId}
    }) {
      videoId
    }
  }
`;

  const res = await queryHasuraGQL(
    operationsDoc,
    "getWatchedVideos",
    { userId },
    token
  );

  console.log({ res });
  return res?.data?.stats;
}

export async function getMyListVideos(userId, token) {
  const operationsDoc = `
  query favouritedVideos($userId: String!) {
    stats(where: {
      userId: {_eq: $userId}, 
      favourited: {_eq: 1}
    }) {
      videoId
    }
  }
`;

  const res = await queryHasuraGQL(
    operationsDoc,
    "favouritedVideos",
    { userId },
    token
  );

  console.log({ res });
  return res?.data?.stats;
}

// const operationsDoc = `
//   query MyQuery {
//     users(where: {issuer: {_eq: "did:ethr:0xd42BB0829d3fC5475307a5f8Dc0dAC734467f4e7"}}) {
//       id
//       email
//       issuer
//     }
//   }
// `;

// function fetchMyQuery() {
//   return queryHasuraGQL(
//     operationsDoc,
//     "MyQuery",
//     {},
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweGQ0MkJCMDgyOWQzZkM1NDc1MzA3YTVmOERjMGRBQzczNDQ2N2Y0ZTciLCJwdWJsaWNBZGRyZXNzIjoiMHhkNDJCQjA4MjlkM2ZDNTQ3NTMwN2E1ZjhEYzBkQUM3MzQ0NjdmNGU3IiwiZW1haWwiOiJzbXVoYXJza0BnbWFpbC5jb20iLCJvYXV0aFByb3ZpZGVyIjpudWxsLCJwaG9uZU51bWJlciI6bnVsbCwid2FsbGV0cyI6W10sImlhdCI6MTY3NTIwMTMwNiwiZXhwIjoxNjc1ODA2MTA2LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiZGlkOmV0aHI6MHhkNDJCQjA4MjlkM2ZDNTQ3NTMwN2E1ZjhEYzBkQUM3MzQ0NjdmNGU3In19.mytRtb2TunBHY4zIsq2on2v-ZxREUdbY-i9c_L0HGDo"
//   );
// }

// export async function startFetchMyQuery() {
//   const { errors, data } = await fetchMyQuery();
//   if (errors) {
//     console.error(errors);
//   }

//   console.log(data);
// }
