# santaAI Project

- Demo URL: https://santaai.vercel.app/

- ChatGPT-3 is gaining an incredible amount of usage and popularity. So I created one! The theme is you visit a north pole and finds Santa's workroom. You don't see him but you can hear him. He exists!

- Designed for Desktop only.

## Main Stack - M.E.R.N

### Frontend

- HTML/CSS/JS(three.js) for the main frame work
- Blender/Photoshop for all the art work

### Backend

- Express/Socket
- ChatGPT

### Installation

You can install the latest version using npm:
cd to client and server folder then
`npm install`

### Generate Working Website on your localhost

- Create `.env` file inside server
- Fill in the followings
- OPENAI_API_KEY= https://openai.com/api/ <-- Go to this link and Sign Up, then you should get API Access Key. Copy it without the ""
- Local development client:
  npm run dev
- Local development server:
  npm run server

### To update

- Just update github and vercel will automatically re-deploy/update.

## Note:

In Camera.js line 42, it makes the three.js to be somewhat fixed from rotating every where
