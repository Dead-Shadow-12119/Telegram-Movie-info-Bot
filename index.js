const TelegramBot = require('node-telegram-bot-api');
require("dotenv").config();
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const request = require ('request');

console.log("Bot is Ready");
bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Bot booted successfully ! \nType /help to get information ');
});
bot.onText(/\/help/, (msg) => {

  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'This bot will help you to get movie information by using a simple command "/movie [movie name] " ');
});

bot.onText(/\/movie (.+)/, (msg, match) => {
  
  const chatId = msg.chat.id;
  const movie = match[1];
   request(`http://www.omdbapi.com/?t=${movie}&apikey=${process.env.API_KEY}`, function(error,response,body){
   	
   	if(!error && response.statusCode == 200) {
   	bot.sendMessage(chatId, '_Looking for_ ' + movie + '...', {parse_mode: 'Markdown'})
        .then(function (msg){
         const res = JSON.parse(body);
         if(res.Response == 'False'){
         	    if(error){
         	       console.log(error);
                  }
          bot.sendMessage(chatId, 'No Results found! ');
         }else{
          bot.sendPhoto(chatId, res.Poster,{caption: 'Result: \nTitle : ' + res.Title + '\nReleased on : ' + res.Released + '\nRated : ' + res.Rated + '\nGenre : ' + res.Genre + '\nIMBD Ratings : ' + res.imdbRating + ''})
        }
     });
    }
  });
});
