# Ilias RSS Notifier
This is a simple script that checks for new posts on the [Ilias](https://www.ilias.de/) RSS feed and sends a notification to the user via Discord Webhooks.

## Environment Variables
The following environment variables are __required__:
* `URL` - Ilias RSS Feed URL
* `USER` - Ilias Username
* `PASS` - Ilias RSS Private Feed Password

Optional environment variables:
* `POLL_INTERVAL`: The interval in __seconds__ between each poll of the RSS feed. (min: 30, default: 300)
* `MESSAGE_COLOR_NEWFILE` - Discord Webhook Message Color (default: #003c65)
* `MESSAGE_COLOR_FORUM` - Discord Webhook Message Color (default: #003c65)
* `WEBHOOK_URL` - Discord Webhook URL
* `MESSAGE_AUTHOR` - Discord Webhook Message Author (eg. Ilias RSS Notifier)
* `MESSAGE_AUTHOR_URL` - Discord Webhook Message Author URL (eg. Link to Ilias)
* `MESSAGE_AUTHOR_ICON` - Discord Webhook Message Author Icon (eg. Link to Ilias Logo)
* `MESSAGE_FOOTER` - Discord Webhook Message Footer (eg. #time for time of message OR Sent by Ilias RSS Notifier)
* `MESSAGE_THUMBNAIL_NEWFILE` - Discord Webhook Message Thumbnail on new File Msg(eg. Link to Ilias Logo)
* `MESSAGE_THUMBNAIL_FORUM` - Discord Webhook Message Thumbnail on Forum Msg(eg. Link to Ilias Logo)
* `DATA_PATH` - Path to the data file (default: ./data/ | Needed for sendedMsgs.txt to keep track of already sended messages after restart/crash)

## Installation
### Manual
1. Clone the repository
2. Install TypeScript and Node.js
   - `npm install typescript --save-dev` (or `yarn add typescript --dev`)
3. Install dependencies
   - `npm install`
4. Build the project
    - `npm run build` or `tsc`
5. Create a `.env` or set the environment variables manually (see above)
6. Run the script
    - Cd into the `out` folder and run `npm start`

### Docker
* **Github Repository:**
    1. Clone the repository or get from Github Packages (`docker pull ghcr.io/flamtky/ilias-rss-notifier:latest`)
    2. Change timezone in [Dockerfile](/Dockerfile) (Default: 'Europe/Berlin')
    3. Build the Docker image (__only on manual build__)
        - `docker build -t ilias-rss-notifier .`
    4. Run the Docker container
        - `docker run -d --name ilias-rss-notifier -e <ENVIRONMENT_VARIABLES> ilias-rss-notifier`
