Movie Review App

This app is designed to help you discover, rate, and organize your favorite movies.
Technologies Used:

    a)Frontend: React Native with  TypeScript and build with Expo
    b)Backend: 
           -User Info - Node.js,Mongoose ODM, MongoDB atlas
           -User Bookmarks and ratings -Graphql (query language) ,with apollo client and prisma ORM
    c)Authentication: JWT Tokens stored in async storage
    d)API: OMDb (Open Movie Database) with api key
    e)Others: 
           -react-native-navigation:for navigating the app
           -react-native-modal: for creating a custom drawer and modal
         

Features:

    User Authentication:
        Users can sign up and log in securely using our Node.js backend with MongoDB for data storage.
        JWT tokens are generated upon successful login and stored securely in Async Storage to maintain user sessions.

    Movie Search and Information:
        Utilizing the OMDb API, users can search for movies.
        Search results are displayed in a FlatList and can be expanded to view more information such as cast, plot, and ratings from various sources.
        Users can also filter search results by genre, year, and language.
        Recent searches for each user are stored in async storage

    User Interaction:
        Movies can be rated by users and added to their favorites or watchlists.
        Users can write reviews for movies, which are stored in our backend.
        Dark mode can be toggled ,with current theme being stored in async storage

    Navigation and UI:
        Implemented a drawer for easy navigation throughout the app.
        Enhanced the back button behavior for smoother user experience.
        Loading states, confirmation messages, success, and error messages have been added for better user feedback.

    Bookmark and Watchlist Organization:
        Added a Bookmarks screen where users can organize their watchlists, to-be-rated lists, and rated movie lists.



