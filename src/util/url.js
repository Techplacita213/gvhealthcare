const LIVE_URL=process.env.NODE_ENV==="development"?
    "http://localhost:5000/"
:
"https://docto231.herokuapp.com/"

export {LIVE_URL}