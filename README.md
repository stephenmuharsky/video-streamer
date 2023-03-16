This a Netflix styles Next.js project that integrates with magic.auth for authorization, Hasura.io (GraphQL Client) for data storage, and the YouTube API for retrieving videos.

Upon authentication, a JWT token is generated, which is what links the user to the datastore.

On the home screen, users can select a video (drawn from the YouTube API) from a few preselected categories representing the kind of videos that I like, as well as from the dynamic 'favourites' category.

Once a user selects a video, they can watch the video as well as see information about it such as the description and view count. They can also perform 'like' or 'dislike' actions which add/remove the video from a 'favourites' list (viewed on a separate page). This action is performed by editing a row in the datastore.
