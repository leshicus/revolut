## Money Exchange widget
[Online demo](https://revolut-test.herokuapp.com/)<br>

Fx from <b>fixer.io:</b> [Fx api](https://api.fixer.io)<br>
For now, for the testing purposes there is a post processing after receiving fx from api, to imitate currency changes.
To turn it off in `src/constants.js` set: <br>
`export const SIMULATE_RATE_CHANGE = false`

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Available Scripts
### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

