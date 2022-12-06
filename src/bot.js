require("dotenv").config();

const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
const PREFIX = "$";
const ytdl = require('ytdl-core');



client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "kick") {
      const user = message.mentions.users.first();
      if (!user) return message.reply("Please mention a user to kick!");
      const member = message.guild.member(user);
      if (!member) return message.reply("That user isn't in this guild!");
      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You don't have permission to do that!");
      if (!member.kickable) return message.reply("I can't kick this user!");
      member
        .kick()
        .then((member) => {
          message.channel.send(`${member.user.tag} has been kicked!`);
        })
        .catch((err) => {
          message.channel.send("I was unable to kick the member.");
          console.error(err);
        })
        .then(() => {
          message.delete();
        })
        .catch(console.error);
    } else if (command === "ban") {
      const user = message.mentions.users.first();
      if (!user) return message.reply("Please mention a user to ban!");
      const member = message.guild.member(user);
      if (!member) return message.reply("That user isn't in this guild!");
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("You don't have permission to do that!");
      if (!member.bannable) return message.reply("I can't ban this user!");
      member
        .ban()
        .then((member) => {
          message.channel.send(`${member.user.tag} has been banned!`);
        })
        .then(() => {
          message.delete();
        })
        .catch(console.error);
    } else if (command === "time") {
      const time = new Date();
      const timeString = time.toLocaleString();
      message.channel.send(timeString);
    } else if (command === "ping") {
      const m = await message.channel.send("Ping?");
      m.edit(
        `Pong! Latency is ${
          m.createdTimestamp - message.createdTimestamp
        }ms. API Latency is ${Math.round(client.ws.ping)}ms`
      );
    } else if (command === "help") {
      message.channel.send(
        "$kick @user - Kicks a user\n$ban @user - Bans a user\n$time - Shows the current time\n$ping - Shows the current ping"
      );
    } else if (command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o => {});
        message.channel.send(sayMessage);
    } else if (command === "prune") {
    
        const deleteCount = parseInt(args[0], 10);
        
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        
        const fetched = await message.channel.messages.fetch({limit: deleteCount});
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    } else if (command === "lockdown") {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("You don't have permission to do that!");
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
            return message.reply("I don't have permission to do that!");
        message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: false
        });
        message.channel.send("Channel locked down!");
    } else if (command === "unlock") {
        if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.reply("You don't have permission to do that!");
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
            return message.reply("I don't have permission to do that!");
        message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: true
        });
        message.channel.send("Channel unlocked!");
    
    } else if (command === "userinfo") {
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply("Please provide a valid user!");
        const userInfo = new MessageEmbed()
            .setTitle(`${user.username}`)
            .setColor(user.displayColor)
            .setDescription(`${user.id}`)
            .setFooter(`User created at: ${user.createdAt}`)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();
        message.channel.send(userInfo);
    } else if (command === "info") {
        const info = new MessageEmbed()
            .setTitle("Info")
            .setColor("#00ff00")
            .setDescription(`This is a bot made by ${message.author.username}`)
            .setFooter("Made with discord.js")
            .setTimestamp();
        message.channel.send(info);
    } 
        
}
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
