require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
  website: {
    response: 'https://spacejelly.dev'
  },
  upvote: {
    response: (argument) => `Successfully upvoted ${argument}`
  }
}

const client = new tmi.Client({
  connection: {
    reconnect: true
  },
  channels: [
    'spacejellybot'
  ],
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  }
});

client.connect();

client.on('message', async (channel, context, message) => {
  const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();

  if ( !isNotBot ) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { response } = commands[command] || {};

  if ( typeof response === 'function' ) {
    client.say(channel, response(argument));
  } else if ( typeof response === 'string' ) {
    client.say(channel, response);
  }
});