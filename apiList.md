# TechBuddies API's

## AuthRouther
- POST /signup
- POST /login
- POST /logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter
- POST /request/send/:status/:userId  -- status: interested
- POST /request/send/ignored/:userId  -- status: ignored
- POST /request/review/accepted/:requestId  -- status: accepted
- POST /request/review/rejected/:requestId  -- status: rejected

status: ["interested", "ignored", "accepted", "rejected"]

## UserRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed