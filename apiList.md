# DevConnect APIs

## Auth Routes
-POST /auth/signup
-POST /auth/login
-POST /auth/logout

## Profile Routes
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

## Connection Request Routes
-POST /request/send/:status/:toUserID

-POST /request/review/:status/:requestId

## User Routes
-GET /user/requests/recieved
-GET /user/connections
-GET /user/feed


Status :- ignored,interested,accepted,rejected

