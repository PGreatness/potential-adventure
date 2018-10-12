/** 
 * This is the almost complete JavaScript code of the Discord bot, Potater-Bot.
 * All essential and private variables have been hidden in a non-uploaded file to avoid
 * falling in the wrong hands. These will work given that bot-settings.json and 
 * user-settings.json have been provided in the same directory as the code for Potater-Bot.
 * This code is free to use for anyone as long as credit is given to the original source.
 * The code is undergoing constant updates. Any suggestions provided will be extremely 
 * helpful and aid the fulfillment of this project. Thank you.
 * 
 * Produced by: Ahnaf Hasan
 * GitHub: https://github.com/PGreatness
*/

//USES NODEMON, PLEASE HAVE NODEMON INSTALLED
const Discord = require("discord.js"); //REQUIRED
const botSettings = require("./bot-settings.json"); //uses TOKEN in bot-settings.json
const userSettings = require("./user-settings.json"); //uses data gathered on users WIP
const TOKEN = botSettings.TOKEN; //login token, REQUIRED
const PREFIX = "!"; //command trigger
const fs = require('fs'); //file creating method
var bot = new Discord.Client();
//derp batman image
var bat = "https://vignette.wikia.nocookie.net/warframe/images/5/5f/Batman_derp_by_uchihirokilove-d59h7in.png/revision/latest?cb=20151020102248";
var att = new Discord.RichEmbed().addField("bats", ":3").setImage(bat);
var fortunes = [
	"Yes",
	"No",
	"Maybe",
	"Ask Tahid, he thinks his head is bigger than the universe",
	"Not really, but a bot's gotta do what a bot's gotta do",
	"Yeeet",
	"Follow your heart. Go as far as you can throw it",
	"That question is not suitable for young audiences. Please, ban yourself. Nub, bys",
	"What do YOU think?",
	"Why do you ask me this? You already know the answer.",
	"The answer to that is simple: Batman did",
	"BECAUSE I'M BATMAN"
];
//Signal bot is ready to accept commands
bot.on("ready", function () {
	console.log("Ready");
});
//Greet a new member of the guild and set role to lowest role (French Fries)
bot.on("guildMemberAdd", function (member) {
	member.guild.channels.find("name", "pg-peeps").send(member.toString() + " Welcome to the squad!");

	member.addRole(member.guild.roles.find("name", "French Fries"));

});

bot.on("message", function (message) {
	//Do nothing if message is sent by a bot
	if (message.author.equals(bot.user)) return;

	//Greet fellow human
	if (message.content == "hello") {
		message.channel.send("Hi there!");
	}
	console.log(message.content);
	var filePath = `./Chat Logs/${message.author.username}.json`;
	var log = `${message.createdAt} ${message.author.username} : ${message.content}`;
	console.log("trying to access file...");
	if (!fs.existsSync("./Chat Logs")) {
		console.log("dir does not exist, making now");
		fs.mkdirSync("./Chat Logs");
	}

	fs.exists(filePath, (exists) => {
		if (exists) {
			var file = require(filePath);
			file.ChatLog = file.ChatLog + `, ${log}`;
			fs.writeFile(filePath, JSON.stringify(file, null, "\t"), (err) => {
				console.log(err);
			});
		}else{
			console.log("making file....");
			json = {
				ChatLog : log
			}
			json = JSON.stringify(json, null, "\t");
			fs.writeFile(filePath, json, (err) => {
				console.log(err);
			});
		}
	});
	//Message not meant for bot
	if (!message.content.startsWith(PREFIX)) return;

	//store an array of strings split at " " excluding the prefix that will be interpreted individually
	//E.g : ["help", "help"]
	var args = message.content.substring(PREFIX.length).split(" ");
	//store an array of strings split at "," excluding the prefix and concat them at " "s
	//E.g ["idon'twantcake", "justwater"]
	var args2 = message.content.substring(PREFIX.length).split(",").join(" "); //UNUSED ATM
	//store an array of strings split at "," and concatted at " "s
	//USED IN A VERY SPECIFIC CONTEXT, MAY BE DELETED IN FUTURE EDITS
	var args3 = message.content.substring(7).split(",").join(" ");

	switch (args[0].toLowerCase()) {
		/** 
		 * Command: HELP
		 * @param: none
		 * @param: command
		 * Takes a string input to show commands related to said string
		 * Returns an embedded message
		*/
		case "help":
			var comms = new Discord.RichEmbed()
				.addField("ping", "Pong!")
				.addField("info", "Show info about me :3")
				.addField("8ball", "Do you seek your future? Check it now!")
				.addField("embed", "Send a special kind of message!")
				.addField("senpai", "I will always notice you!!!!<3")
				.addField("game", "Request people to join you in the game! Mention them to exclude from invite.")
				.addField("how", "Get detailed instructions on how a certain command works!")
				.addField("report", "Report users for breaching the BNBR contract");
				//Admin commands
			if (args[1] === "mod") {
					comms.addField("Moderator Only:", "Mods are HorselessDude so far")
					.addField("kick", "Kicks user. Requires a reason!")
					.addField("ban", "Bans a user. Requires a reason after the name. Message deletion days are optional.")
					.setColor('ORANGE')
					.setThumbnail(bot.user.avatarURL);
			}else{
					comms.setColor('ORANGE')
					.setThumbnail(bot.user.avatarURL);
			}
			console.log(comms);
			return message.channel.send("Hello! There are a multitude of commands available:", comms);
			break;
			/**
			 * Command: HOW
			 * @param: none
			 * @param: command
			 * Takes a string input to display proper usage of the command given
			 * Returns an embedded message
			 */
		case "how":
			let uEmbed = new Discord.RichEmbed();
			if (!args[1]) {
				uEmbed.addField("!how [command]", "Find useful instructions on the usage of certain commands. Exclude trigger (!)");
				return message.channel.send(uEmbed);
			}
				switch (args[1].toLowerCase()) {
				case "help":
					uEmbed.addField("!help [rank]", "Displays the help page, dummy");
					break;
				case "ping":
					uEmbed.addField("!ping", "Recieve pong");
					break;
				case "info":
					uEmbed.addField("!info", "Recieve the good stuff about me");
					break;
				case "8ball":
					uEmbed.addField("!8ball []", "Recieve error handling statement")
					uEmbed.addField("!8ball [QUESTION]", "Ask a question in order to recieve an answer.");
					break;
				case "embed":
					uEmbed.addField("!embed", "Recieve embedded message. WIP");
					break;
				case "report": 
					uEmbed.addField("!report [MENTIONED PERSON] [REASON]", "Report a person for breaching of the BNBR contract");
					break;
				case "senpai":
					uEmbed.addField("!senpai", "Become noticed by me :3");
					break;
				case "game":
					uEmbed.addField("!game [EXCLUDE][EXCLUDE]...", "Mention people to play with you. You must be in a voice channel **and** playing a game in order to use this commmand. Mention people after the command to exclude them");
					break;
				case "how":
					uEmbed.addField("!how [COMMAND]", "This is how you are viewing this dummy! Use this to see how to use some of the commands");
					break;
				case "kick":
					uEmbed.addField("!kick [MENTIONED PERSON] [REASON]", "Kick a person. They must be mentioned **and** a reason to do so must be given.");
					break;
				case "ban":
					uEmbed.addField("!ban [MENTIONED PERSON] [REASON]", "Ban the mentioned person from the server. They must be mentioned **and** a reason must be given.");
					break;
				default:
					uEmbed.addField("This command does not exist", "Try again");
					break;
				}
			message.channel.send(uEmbed);
			break;
		case "ping":
		/**
		 * Command: PING
		 * @param: none
		 * Returns the ping of the message author.
		 * WIP, STAND-IN FUNCTION PUT IN PLACE
		 */
			var pingOfUser = message.client.ping;
			message.channel.send(`Your ping is: **${pingOfUser}ms**`);
			break;
		case "info":
		/**
		 * Command: INFO
		 * @param: none
		 * Returns information about the bot
		 */
			message.channel.send("I'm a handy little robo to help out HorselessDude :3");
			break;
		case "8ball":
		/**
		 * Command: 8(eight)BALL
		 * @param: string
		 * Takes a string, preferrably a question, and return a random answer from fortunes
		 * Returns a string
		 */
			if (args[1]) {//this and the following IF statements can be removed without worry
				var fort = fortunes[Math.floor(Math.random() * fortunes.length)];
				message.channel.send(fort);
				if (fort === "BECAUSE I'M BATMAN")
					message.channel.send(att);
				break;
			} else {
				message.channel.send("What? What am I supposed to predict?! Is this tahid!?");
				break;
			}
		case "embed":
		/**
		 * WIP
		 * Command: EMBED
		 * @param: none
		 * Returns an embedded message
		 * WIP
		 */
			var embed = new Discord.RichEmbed()
				.addField("Helo, peeps", "Peep")
				.setThumbnail(message.author.avatarURL);
			message.channel.send(embed);
			break;
		case "senpai":
		/**
		 * Command: SENPAI
		 * @param: none
		 * Returns a string with the author of the previous message mentioned
		 */
			message.channel.send(message.author.toString() + " always will, baby gurl B~)");
			break;
		case "game":
		/**
		 * Command: GAME
		 * @param: none
		 * @param: User Mentions
		 * Precondition: Message author is in a voice channel
		 *               Message author is playing a Discord recognized game
		 * Returns a embedded message inviting everyone in the guild to the game the author
		 * is playing. Excludes the users mentioned
		 */
			let mentioned = message.content.split(" ").splice(1);
			let everyoneArr = message.guild.members.array();
			let voicers;
			let voicersArr = [];
			let playingGame;
			if (message.member.voiceChannel == null) {
				return message.channel.send("You must be in a voice channel to do this");
			}else{
				voicers = message.member.voiceChannel.members.array();
			}
			if (message.member.presence.game == null) {
				return message.channel.send("You must be playing a game to do this");
			}else{
				playingGame = message.member.presence.game.name;
			}
			for (i = 0; i < everyoneArr.length; i++) {
				if (!voicers.includes(everyoneArr[i], everyoneArr)) {
					voicersArr.push(everyoneArr[i].user.toString());
				}
			}
			for (j = 0; j < mentioned.length; j++) {
				if (voicersArr.includes(mentioned[j], mentioned)) {
					let index = voicersArr.indexOf(mentioned[i]);
					voicersArr.splice(index, 1);
				}
			}
			let botIndex = voicersArr.indexOf(bot.user);
			voicersArr.splice(botIndex, 1);
			let gembed = new Discord.RichEmbed()
				.addField(`${message.author.username} asked you to play!`, `Playing: ***${playingGame}***` )
				.addField(`Join now in ${message.member.voiceChannel.name}!`, `${voicersArr}`);
			return message.channel.send(gembed);
		break;
		case "spam":
		/**
		 * Command: SPAM
		 * @param: User Mention
		 * @param: String
		 * Takes the user mentioned and spams by repeated sending 100 messages that the author
		 * wrote. SHOULD NOT BE USED, EVIL
		 * Administrator of the server cannot be spammed and will cause the author to be spammed 
		 */
			var spammer = message.author;
			if (!args[1]) {
				return message.channel.send("No one mentioned");
			}else{
				if (message.mentions.members.first().hasPermission("ADMINISTRATOR")) {
					message.channel.send("You cannot spam admin! Get spammed yo!");
					for (a = 0; a < 100; a++) {
						try {
							spammer.send("Get trashed. That person was an admin!");
							}
					catch (error) {
						console.log(e);
						message.channel.send("Nevermind, i got blocked ;-;");
						return;
					}
				}
			}
				if (!message.content.split(" ").splice(2).join(" ")) {
					return message.channel.send("No message");
				}else{
				var firstMention = message.mentions.users.first();
				for (s = 0; s < 100; s++)
					firstMention.send(message.content.split(" ").splice(2).join(" "));
				}
			}
			break;
		case "kick":
		/** 
		 * Command: KICK
		 * @param: User Mention,
		 *         String
		 * Takes a mentioned user and kicks the person out of the guild. A reason is required.
		 * Returns an embedded message detailing the kick. Kicked person recieves a direct 
		 * message(DM) of the embed as well
		*/
			let author = message.author.username;
			let messageArray = message.content.split(" ");
			let reason = messageArray.splice(2).join(" ");
			let toKick = message.mentions.users.first();
			if (toKick === bot.user) {
				console.log(`Kick attempted on bot by ${author}`);
				return message.channel.send("You can't kick bots!!");
			}
			if (toKick == null)
				return message.channel.send("Please mention someone. Don't just write their name!");
			if (message.mentions.members.first().hasPermission("ADMINISTRATOR"))
				return message.channel.send("I'm sorry, but that player has admin permissions");
			if (!message.member.hasPermission("KICK_MEMBERS"))
				return message.channel.send("NIEN! YOU NO HAVE PERMISSIONS!");
			if (!toKick)
				return message.channel.send("You didn't say who!");
			if (!reason) {
				return message.channel.send("You did not specify a reason!");
			}
			message.guild.member(toKick).kick(reason);
			const kickEmbed = new Discord.RichEmbed()
				.setAuthor(`${toKick.username} was kicked by ${author}`, toKick.displayAvatarURL)
				.addField("Kick Information:", "*User Kicked*")
				.addField("Kickee:", `${toKick.tag}`)
				.addField("Moderator: ", `${message.author.tag}`)
				.addField("Reason:", `${reason}`);
			message.channel.send(kickEmbed);
			message.channel.send("Done!");
			message.mentions.users.first().send(kickEmbed);
			break;
		case "ban":
		/** 
		 * Command: BAN
		 * @param: User Mention,
		 *         String
		 * Takes a mentioned user and bans the person from the guild. A reason is required.
		 * Returns an embedded message detailing the ban. Banned person recieves a direct 
		 * message(DM) of the embed as well
		*/
		let sender = message.author.username;
		let messages = message.content.split(" ");
		let banReason = messages.splice(2).join(" ");
		let banning = message.mentions.members.first();
		console.log(banReason);
		let days = 0;
		if (messages[3]) {
			days = messages.content.splice(3).join(" ");
		}
		if (banning.user === bot.user) {
			console.log(`Ban attempted on bot by ${sender}`);
			return message.channel.send("Nice try. You can't ban bots nub! >:D");
		}
		if (banning == null)
			return message.channel.send("Look here. Banning requires me to know who it is and YOU WON'T MENTION THEM. HOW WOULD I KNOW IT'S WHO YOU WANT!");
		if (banning.hasPermission("ADMINISTRATOR"))
			return message.channel.send("I'm sorry, but that player has admin permissions");
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return message.channel.send("YOU NO KAN BAN MEMBAS!");
		if (!banning)
			return message.channel.send("You didn't say who!");
		if (!banReason)
			return message.channel.send("Please provide a reason to never see this person again (or maybe for a while) :3");
			message.guild.member(banning).ban({days, banReason});
			const banEmbed = new Discord.RichEmbed()
				.setAuthor(`${banning.user.username} was banned by ${sender}`, banning.user.displayAvatarURL)
				.addField("Ban Information:", "*User Banned*")
				.addField("Banned:", `${banning.user.tag}`)
				.addField("Moderator: ", `${message.author.tag}`)
				.addField("Reason:", `${banReason}`)
				.addField("Days:", days);
			message.channel.send(banEmbed);
			message.channel.send("Done!");
			message.mentions.users.first().send(banEmbed);
			break;
			//WARFRAME Game Commands
			//~~~~~~~~~~~~~~~~~~~~~~V~~~~~~~~~~~~~~~~~
		case "etime": //WIP
			const timeEmbed = new Discord.RichEmbed();
			var d = new Date();
			var HoursNow = d.getHours() % 12;
			var MinutesNow = d.getMinutes() % 60;
			var minCount = (HoursNow * 60) + (MinutesNow * 60);
			timeDisplay = `${HoursNow}:${MinutesNow}`;
			if (minCount % 150 < 100) { //150 mins is one day/night cycle. 100 min is 1 day
				timeEmbed.addField("Time in Cetus: **Day**", `Time to NIGHT: **${timeDisplay}**`);
			}else{
				timeEmbed.addField("Time in Cetus: **Night**", `Time to DAY: **${timeDisplay}**`);
			}
			return message.channel.send(timeEmbed);
			break;
		case "report": 
			try { 
			if (bot.user.username == message.mentions.users.first().username) {
				console.log(`Report attempted on bot by ${message.author.username}`);
				return message.channel.send("I'm sorry, but bot users cannot be reported");
			}
			//remove to not be able to report ADMINS
			/*if (message.mentions.members.first().hasPermission("ADMINISTRATOR")) {
				console.log(`Report made on ${message.mentions.users.first().username} by ${message.author.username}`);
				return message.channel.send(`Report cannot be made on ${message.mentions.users.first().username}. Has ADMIN permissions`);
			}*/
			} catch(err) {return message.channel.send("Error encountered");}
			if (!args[1]) {
				return message.channel.send("No one mentioned");
			}
			if (!args[2]) {
				return message.channel.send("Please submit a reason");
			}
			if (!fs.existsSync("./Reports")) {
				console.log("Report Folder does not exist, making it right now...");
				fs.mkdirSync("./Reports");
			}
			var fileName = `./Reports/${message.mentions.users.first().username}.json`;
			fs.exists(fileName, function(exists) {
				if (exists) {
					console.log("File against user exists, writing to file...");
					var file = require(fileName);
					file.report = file.report + `, ${message.content.split(" ").splice(2).join(" ")}`;
					file.reportCount = file.reportCount + 1;
					fs.writeFile(fileName, JSON.stringify(file, null, 2), function(err) {
						if (err) {
							console.log(err);
							return message.channel.send("Error encountered, please try again");
						}
						console.log(JSON.stringify(file, null, 2));
						console.log(`Writing to ${fileName}`);
					});
				}else{
					json = {
						report : args[2],
						reportCount : 1
					}
					json = JSON.stringify(json, null, 2);
					fs.writeFile(fileName, json, (err) => {
						if (!err) {
							console.log("File for user not found, creating one...");
							console.log(`Done, file made: ${fileName}`)
						}
					});
				}
				return message.channel.send("Thank you, report submitted");
			});
			break;
		default: //default case, used when an unknown command is given with the prefix
			message.channel.send("I don't know what to do with this ;-;");
			break;

	}
});

//bot login, REQUIRED
bot.login(TOKEN);