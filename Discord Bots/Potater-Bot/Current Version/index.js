/**
 * This is the almost complete JavaScript code of the Discord bot, Potater-Bot.
 * All essential and private variables have been hidden in a non-uploaded file to avoid
 * falling in the wrong hands. These will work given that bot-settings.json
 *  have been provided in the same directory as the code for Potater-Bot.
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
const YouTube = require('discord-youtube-api') // used for music, WIP
const Queue = require('./queue.js').Queue
const ytdl = require('ytdl-core') // used for music, WIP
const TOKEN = botSettings.TOKEN; //login token, REQUIRED
var YOUTUBE_API_KEY = botSettings.YT_API_KEY // The API Key for YouTube
const PREFIX = "!"; //command trigger
const fs = require('fs'); //file creating method
const path = require('path')
var bot = new Discord.Client();
var repeater = "https://www.youtube.com/watch?v=Lkcvrxj0eLY"; // classical music
const commandsOnlyChannels = ['music-requests']
var serversQueues = {}

// This is the list of music requests that the bot has received
var fuzzy = require('fuzzyset.js')

var nicknames = fuzzy([], false)

//derp batman image
var bat = "https://vignette.wikia.nocookie.net/warframe/images/5/5f/Batman_derp_by_uchihirokilove-d59h7in.png/revision/latest?cb=20151020102248";
var att = new Discord.RichEmbed().addField("bats", ":3").setImage(bat);
var fortunes = [
	"Yes",
	"No",
	"Maybe",
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
	let today = new Date()
	if (botSettings['lastUpdate']['month'] - today.getMonth() != 0) {
		botSettings['lastUpdate'] = {
			'month': today.getMonth(),
			'day': today.getDate(),
			'year': today.getFullYear()
		}
		fs.writeFileSync('./bot-settings.json', JSON.stringify(botSettings, null, '\t'))
		console.log(`Monthly cleaning of Reports folder commencing...`)
		fs.exists('./Reports', (exists) => {
			if (exists) {
				fs.readdir('./Reports', (err, files) => {
					if (err) {
						console.log(err)
					}
					for (const file of files) {
						fs.unlink(path.join(__dirname + `/Reports`, file), err => {
							if (err) console.log(err)
						})
					}
					console.log(`Monthly cleaning complete!`)
				})
			}
		})
		// botSettings['lastUpdate'] = today.toJSON()
	}
	console.log("Ready");
	bot.guilds.forEach((guild)=>{
		serversQueues[guild.name] = {
			"queue": new Queue(),
			"loaded": false,
			"rep" : false,
			"repall":false,
			"curr":false,
			"last":null,
			'juke': fuzzy([], false)
		}
		if (!fs.existsSync(`./User Settings/${guild.name}`)) {
			fs.mkdir(`./User Settings/${guild.name}`, ()=>{
				console.log(`Server folder made for ${guild.name}`)
			})
		}
		if (!fs.existsSync(`./Playlists`)) {
			fs.mkdir(`./Playlists`, ()=>{
				console.log('Created folder for server')
			})
		}
		if (!fs.existsSync(`./Playlists/${guild.name}`)) {
			fs.mkdir(`./Playlists/${guild.name}`, ()=>{
				console.log('Created folder for server')
			})
		}
		if (!fs.existsSync(`./Reports`)) {
			fs.mkdir(`./Reports`, ()=>{
				console.log('Created folder for server')
			})
		}
		if (!fs.existsSync(`./Reports/${guild.name}`)) {
			fs.mkdir(`./Reports/${guild.name}`, ()=>{
				console.log('Created folder for server')
			})
		}
		if (!fs.existsSync(`./Requests`)) {
			fs.mkdir(`./Requests`, ()=>{
				console.log('Created folder for server')
			})
		}
		if (!fs.existsSync(`./Requests/${guild.name}`)) {
			fs.mkdir(`./Requests/${guild.name}`, ()=>{
				console.log('Created folder for server')
			})
		}
		if (!fs.existsSync(`./Requests/${guild.name}/Jukebox.json`)) {
			console.log("Jukebox.json doesn't exist, creating now")
			var jukes = {
				"Classical": {
					'url': "https://www.youtube.com/watch?v=Lkcvrxj0eLY",
					'duration': '2:42',
					'playCount': 1
				}
			}
			fs.writeFileSync(`./Requests/${guild.name}/Jukebox.json`, JSON.stringify(jukes, null, '\t'))
			serversQueues[message.guild.name]['juke'].add('Classical')
		}
	})
	console.log('did this once')
	// console.log(serversQueues)
});
//Greet a new member of the guild and set role to lowest role (French Fries)
bot.on("guildMemberAdd", function (member) {
	member.guild.channels.find("name", "pg-peeps").send(member.toString() + " Welcome to the squad! I am Potater-Bot, and you can interact with me using **" + PREFIX + "**!");

	member.addRole(member.guild.roles.find("name", "French Fries"));

});

if (!fs.existsSync('./User\ Settings')) {
	console.log(`User Settings folder doesn't exists, creating...`)
	fs.mkdir('./User\ Settings', ()=>{
		console.log('Folder created')
		var ndm = require('./nodemon.json')
		ndm.ignore.push(`./User Settings/`)
		fs.writeFile('./nodemon.json',
		JSON.stringify(ndm, null, '\t'),
			err=>{if (err) console.log(err)})
		})
}


bot.on("message", async function (message) {

	//Do nothing if message is sent by a bot
	if (message.author.equals(bot.user)) return;

	//Greet fellow human
	if (commandsOnlyChannels.includes(message.channel.name) && !message.content.startsWith(PREFIX)) {
		var old = await message.delete()
		return message.author.send(`Sorry, but this channel(**${message.channel.name}**) in **${message.member.guild.name}** does not allow chatting! Only commands are accepted there`).catch(()=>{console.log("Could not send info message")})
	}
	if (message.content.toLowerCase() == "hello") {
		message.channel.send(`Hi there! I'm ${bot.user.username} and you can interact with me using **${PREFIX}**! Use **!help** to see all the commands`).catch(()=>{console.log("Could not send welcome message")});
	}
	// Chat Logging System
	console.log(message.content);
	var filePath = `./Chat Logs/${message.guild.name}/${message.author.username}.json`;
	var log = `${message.createdAt} ${message.author.username} : ${message.content}`;
	console.log("trying to access file...");
	if (!fs.existsSync("./Chat Logs")) {
		console.log("dir does not exist, making now");
		fs.mkdirSync("./Chat Logs")
	}
	if (!fs.existsSync(`./Chat Logs/${message.guild.name}`)) {
		console.log("guild dir doesn't exist, creating...")
		fs.mkdirSync(`./Chat Logs/${message.guild.name}`)
	}

	var json = {
		ChatLog : [log]
	}
	json = JSON.stringify(json, null, "\t")
	if (fs.existsSync(filePath)) {
		var file = require(filePath)
		file.ChatLog.push(log)
		fs.writeFileSync(filePath, JSON.stringify(file, null, "\t"))
	}else{
		console.log("making file...")
		fs.writeFileSync(filePath, json)
	}

	// Music Info Logging System
	if (!fs.existsSync('./Requests')) {
		console.log("Requests folder doesn't exist, creating now")
		fs.mkdirSync('./Requests')
	}

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
			var totalPages = 3 // the number of help pages
			if ((!isNaN(args[1]) || !isNaN(args[2])) && (args[1] <= 0 || args[2] <= 0) ) {
				return message.channel.send("I'm sorry, but that number is not valid. Please try again").catch(()=>{message.reply("An error occurred")})
			}
			if (args[1] == undefined) {
				args[1] = '1'
			}
				if (args[1] == '1' || args[2] == '1') {
					comms
						.addField("ping", "Show your ping")
						.addField("info", "Show info about me :3")
						.addField("8ball", "Do you seek your future? Check it now!")
						.addField("embed", "Send a special kind of message!")
						.addField("senpai", "I will always notice you!!!!<3")
						.addField("game", "Request people to join you in the game! Mention them to exclude from invite.")
						.addField("how", "Get detailed instructions on how a certain command works!")
				}
				if (args[1] == '2' || args[2] == '2') {
					comms
						.addField('play', "Play some music!")
						.addField('skip', 'Skip the music')
						.addField('pause', 'Pause/Resume the music')
						.addField(`tracks`, `Shows the songs in queue`)
						.addField('save', 'Saves the current playlist as the user\'s playlist')
						.addField('load', 'Loads one of the user\'s playlist straight into the queue')
						.addField(`lists`, "Displays the playlists that the user has saved")
						.addField('loop', 'Toggles the loop')
						.addField('shuffle', 'Shuffles the music queue')
						.addField('loopall', 'Toggle the queue loop')
						.addField("dc", "Disconnects the bot from the current voice channel")
				}
				if (args[1] == '3' || args[2] == '3') {
					comms
						.addField('bnbr', "Read the BNBR Policy")
						.addField("report", "Report users for breaching the BNBR contract");
				}
				//Admin commands
			if (args[1] === "mod") {
					var mems = message.guild.members
					var mods = []
					console.log(mems)
					for (var [id, member] of mems) {
						if (member.hasPermission('ADMINISTRATOR') && !member.user.equals(bot.user)) {
							mods.push(member.user.username)
						}
					}
					comms.addField("Moderator Only:", `Mods are: ${String(mods)}`)
					.addField("kick", "Kicks user. Requires a reason!")
					.addField("ban", "Bans a user. Requires a reason after the name. Message deletion days are optional.")
					.setColor('ORANGE')
					.setThumbnail(bot.user.avatarURL);
			}else{
					comms.setColor('ORANGE')
					.setThumbnail(bot.user.avatarURL);
			}
			comms.footer = {
				text : `Showing page ${args[1]} of ${totalPages}`
			}
			console.log(comms);
			return message.channel.send("Hello! There are a multitude of commands available:", comms).catch(()=>{message.reply("An error occurred! Oops")});
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
				return message.channel.send(uEmbed).catch(()=>{message.reply("An error occurred")});
			}
				switch (args[1].toLowerCase()) {
				case "help":
					uEmbed.addField(`${PREFIX}help [rank]`, "Displays the help page, dummy");
					break;
				case "ping":
					uEmbed.addField(`${PREFIX}ping`, "Receive your ping in ms");
					break;
				case "loop":
					uEmbed.addField(`${PREFIX}loop`, "Toggles the looping on and off. Disconnecting the bot does not turn off the looping")
					break;
				case "shuffle":
					uEmbed.addField(`${PREFIX}shuffle`, "Shuffles the music queue")
					break;
				case "loopall":
					uEmbed.addField(`${PREFIX}loopall`, "Toggles the queue looping on and off. Turns off single song loop if on. Disconnecting the bot does not turn off the looping")
					break;
				case "dc":
					uEmbed.addField(`${PREFIX}dc`, "Disconnects the bot from the voice channel")
					break;
				case "info":
					uEmbed.addField(`${PREFIX}info`, "Receive the good stuff about me");
					break;
				case "8ball":
					uEmbed.addField(`${PREFIX}8ball [QUESTION]`, "Ask a question in order to receive an answer.");
					break;
				case "embed":
					uEmbed.addField(`${PREFIX}embed [TITLE] || [DESCRIPTION]`, "Sends an embedded message. Both the title and the description are optional");
					break;
				case "bnbr":
					uEmbed.addField(`${PREFIX}bnbr`, "Shows the BNBR contract")
				case "report":
					uEmbed.addField(`${PREFIX}report [MENTIONED PERSON] [REASON]`, "Report a person for breaching of the BNBR contract");
					break;
				case "senpai":
					uEmbed.addField(`${PREFIX}senpai`, "Become noticed by me :3");
					break;
				case "game":
					uEmbed.addField(`${PREFIX}game [EXCLUDE][EXCLUDE]...`, "Mention people to play with you. You must be in a voice channel **and** playing a game in order to use this commmand. Mention people after the command to exclude them");
					break;
				case "how":
					uEmbed.addField(`${PREFIX}how [COMMAND]`, "This is how you are viewing this dummy! Use this to see how to use some of the commands");
					break;
				case "kick":
					uEmbed.addField(`${PREFIX}kick [MENTIONED PERSON] [REASON]`, "Kick a person. They must be mentioned **and** a reason to do so must be given.");
					break;
				case "ban":
					uEmbed.addField(`${PREFIX}ban [MENTIONED PERSON] [REASON]`, "Ban the mentioned person from the server. They must be mentioned **and** a reason must be given.");
					break;
				case "play":
					uEmbed.addField(`${PREFIX}play [TITLE]`, "Plays the audio file of the given title")
					break;
				case "skip":
					uEmbed.addField(`${PREFIX}skip`, "Skips the music currently playing")
					break;
				case "pause":
					uEmbed.addField(`${PREFIX}pause`, "Pauses the currently playing music. If already paused, resumes the music")
					break;
				case "tracks":
					uEmbed.addField(`${PREFIX}tracks`, `Shows a list of the tracks that are currently playing and in queue`)
				default:
					uEmbed.addField("This command does not exist", "Try again");
					break;
				}
			message.channel.send(uEmbed).catch(()=>{message.reply("An error occurred")});
			break;
		case "ping":
		/**
		 * Command: PING
		 * @param: none
		 * Returns the ping of the message author.
		 */
			var pingOfUser = Date.now() - message.createdTimestamp
			message.channel.send(`Your ping is: **${pingOfUser}ms**`).catch(()=>{message.reply("An error occurred")});
			break;
		case "info":
		/**
		 * Command: INFO
		 * @param: none
		 * Returns information about the bot
		 */
			message.channel.send("I'm a handy little robo to help out HorselessDude :3").catch(()=>{message.reply("An error occurred")});
			break;
		case "8ball":
		/**
		 * Command: 8(eight)BALL
		 * @param: string
		 * Takes a string, preferably a question, and return a random answer from fortunes
		 * Returns a string
		 */
			if (args[1]) {//this and the following IF statements can be removed without worry
				var fort = fortunes[Math.floor(Math.random() * fortunes.length)];
				message.channel.send(fort).catch(()=>{message.reply("An error occurred")});
				if (fort === "BECAUSE I'M BATMAN")
					message.channel.send(att).catch(()=>{message.reply("An error occurred")});
				break;
			} else {
				message.channel.send("What? What am I supposed to predict?!").catch(()=>{message.reply("An error occurred")});
				break;
			}
		case "embed":
		/**
		 * Command: EMBED
		 * @param: none
		 * Returns an embedded message
		 */
			var mss = args3.split('||')
			var embed = new Discord.RichEmbed()
				.addField( mss[0] || "Helo, peeps", mss[1] || "Peep")
				.setThumbnail(message.author.avatarURL);
			message.channel.send(embed).catch(()=>{message.reply("An error occurred")});
			break;
		case "senpai":
		/**
		 * Command: SENPAI
		 * @param: none
		 * Returns a string with the author of the previous message mentioned
		 */
			message.channel.send(message.author.toString() + " always will, baby gurl B~)").catch(()=>{message.reply("An error occurred")});
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
				return message.channel.send("You must be in a voice channel to do this").catch(()=>{message.reply("An error occurred")});
			}else{
				voicers = message.member.voiceChannel.members.array();
			}
			if (message.member.presence.game == null) {
				return message.channel.send("You must be playing a game to do this").catch(()=>{message.reply("An error occurred")});
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
			return message.channel.send(gembed).catch(()=>{message.reply("An error occurred")});
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
				return message.channel.send("No one mentioned").catch(()=>{message.reply("An error occurred")});
			}else{
				if (message.mentions.members.first().hasPermission("ADMINISTRATOR")) {
					message.channel.send("You cannot spam admin! Get spammed yo!").catch(()=>{message.reply("An error occurred")});
					for (a = 0; a < 100; a++) {
						try {
							spammer.send("Get trashed. That person was an admin!");
							}
					catch (error) {
						console.log(e);
						message.channel.send("Nevermind, i got blocked ;-;").catch(()=>{message.reply("An error occurred")});
						return;
					}
				}
			}
				if (!message.content.split(" ").splice(2).join(" ")) {
					return message.channel.send("No message").catch(()=>{message.reply("An error occurred")});
				}else{
				var firstMention = message.mentions.users.first();
				for (s = 0; s < 100; s++)
					try{
						firstMention.send(message.content.split(" ").splice(2).join(" "));
					}catch(e) {
						console.log(e);
						message.channel.send('Nevermind, i got blocked ;-;');
						return;
					}
				}
			}
			break;
		case "kick":
		/**
		 * Command: KICK
		 * @param: User Mention,
		 *         String
		 * Takes a mentioned user and kicks the person out of the guild. A reason is required.
		 * Returns an embedded message detailing the kick. Kicked person Receives a direct 
		 * message(DM) of the embed as well
		*/
			let author = message.author.username;
			let messageArray = message.content.split(" ");
			let reason = messageArray.splice(2).join(" ");
			let toKick = message.guild.member(message.mentions.users.first());
			if (toKick == null)
				return message.channel.send("Please mention someone. Don't just write their name!").catch(()=>{message.reply("An error occurred")});
			if (toKick.user === bot.user) {
				console.log(`Kick attempted on bot by ${author}`);
				return message.channel.send("You can't kick bots!!").catch(()=>{message.reply("An error occurred")});
			}
			if (toKick.hasPermission("ADMINISTRATOR"))
				return message.channel.send("I'm sorry, but that player has admin permissions").catch(()=>{message.reply("An error occurred")});
			if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS"))
				return message.channel.send("NIEN! YOU NO HAVE PERMISSIONS!").catch(()=>{message.reply("An error occurred")});
			if (!reason) {
				return message.channel.send("You did not specify a reason!").catch(()=>{message.reply("An error occurred")});
			}
			const kickEmbed = new Discord.RichEmbed()
				.setAuthor(`${toKick.username} was kicked by ${author}`, toKick.displayAvatarURL)
				.addField("Kick Information:", "*User Kicked*")
				.addField("Kickee:", `${toKick.user.tag}`)
				.addField("Moderator: ", `${message.author.tag}`)
				.addField("Reason:", `${reason}`)
				.setColor('red');
			message.guild.member(toKick).kick(reason).then((member)=>{
				try{
					member.user.send(kickEmbed);
				}catch(e) {
					console.log(e)
					console.log("Couldn't send it")
				}
			}).catch((reason)=>console.log(reason));
			message.channel.send(kickEmbed).catch(()=>{message.reply("An error occurred")});
			message.channel.send("Done!").catch(()=>{message.reply("An error occurred")});
			break;
		// MUSIC COMMANDS
		// ------------------ V ---------------
		/**
		 * Command: PLAY
		 * @param: None | String
		 * Takes the given string and searches it on YouTube for the corresponding video.
		 * Play the audio file in a Voice Channel.
		 * @error If there is an error in which the bot connects and immediately leaves, reinstall
		 * the ytdl-core library to fix the problem
		 */
		case "play":
			console.log(serversQueues[message.guild.name]['juke'].values().length == 0)
			var fw = require(`./Requests/${message.guild.name}/Jukebox.json`)
			for (song in fw) {
				// console.log(fw)
				// console.log(song.length)
				// console.log(typeof song)
				serversQueues[message.guild.name]['juke'].add(song)
			}
			if (serversQueues[message.guild.name]['juke'].values().length == 0) {
				console.log("adding classical")
				serversQueues[message.guild.name]['juke'].add("Classical")
			}

			var voice = message.member.voiceChannel
			var played = message.channel
			var channels = message.member.guild.channels
			var w = []
			for (i = 0; i < channels.array().length; i++) {
				if (channels.array()[i].name.toLowerCase().includes('music')) {
					w.push(channels.array()[i])
				}
			}
			played = w.find((value)=>value.type == 'text' && value.name.includes('previous'))
			console.log(args.slice(1).join(' '))
			if (!voice){
				return message.channel.send('You need to be in a voice channel to play music!').catch(()=>{message.reply("An error occurred")});
			}
			// Enable to force uses to be in a certain music channel
			/* if (!voice.name.toLowerCase().includes("music")) {
				console.log(`Sending ${message.author.username} to the music channel...`)
				var vChat = w.find((value)=>value.type == 'voice')
				message.member.setVoiceChannel(vChat)
				voice = vChat
			} */
			const perms = voice.permissionsFor(message.client.user)
			if (!perms.has('CONNECT') || !perms.has('SPEAK')) {
				return message.channel.send("I need to be able to connect and speak in the voice channel for that!").catch(()=>{message.reply("An error occurred")})
			}
			if (serversQueues[message.guild.name]['loaded'] && args.slice(1).join(' ') == '') {
				// do not enqueue
			}else{
				serversQueues[message.guild.name]['queue'].enqueue(args.slice(1).join(' '))
			}
			if (serversQueues[message.guild.name]['curr']) {
				return message.channel.send(`There is currently a music begin played. Your request is currently **number ${serversQueues[message.guild.name]['queue'].size()}** on the waiting list`).catch(()=>{message.reply("An error occurred")})
			}
			var youtube = new YouTube(YOUTUBE_API_KEY)
			// serversQueues[message.guild.name]['queue'].enqueue(args.slice(1).join(' '))
			var nextToPlay = serversQueues[message.guild.name]['queue'].dequeue() || "music"
			var file = require(`./Requests/${message.guild.name}/Jukebox.json`)
			var videos = {}
			console.log('hereas')
			console.log(nextToPlay)
			var closest = serversQueues[message.guild.name]['juke'].get(nextToPlay)
			console.log('juke: ' + serversQueues[message.guild.name]['juke'].get(nextToPlay))
			// console.log(serversQueues[message.guild.name]['juke'].values())
			if (closest != null && closest[0][0] > 0.65) {
				var closest_name = closest[0][1]
				console.log(closest_name)
				videos = {
					[closest_name] : {
						"url" : file[closest_name]["url"],
						"duration" : file[closest_name]["duration"],
						"playCount" : file[closest_name]['playCount']
					}
				}
			}else{
				try{
					// console.log(serversQueues[message.guild.name]['juke'].values())
					var wait = {};
					if (nextToPlay.toLowerCase() != "Kileigh's Song".toLowerCase()) {
						try {
							wait = await youtube.searchVideos(nextToPlay + " lyrics")
						} catch (e) {
							console.log("error happened!")
							break;
						}
					}else{
						wait = {
							"url" : `./Requests/${message.guild.name}/Kileigh's Song.mp3`,
							"length" : "2:48"
						}
					}
						videos = {
							[nextToPlay]: {
								"url": wait.url,
								"duration": wait.length,
								'playCount' : 1
							}
						}
						console.log(videos)
						console.log(nextToPlay)
						serversQueues[message.guild.name]['juke'].add(nextToPlay)
						file[nextToPlay] = { "url": videos[nextToPlay]['url'], "duration": videos[nextToPlay]['duration'], 'playCount': 1 }
						fs.writeFileSync(`./Requests/${message.guild.name}/Jukebox.json`, JSON.stringify(file, null, '\t'))
				}catch(e) {
					console.log(e)
					return message.channel.send(`Woops! I can't search for music anymore... :(\nTry again tomorrow`).catch(()=>{message.reply("An error occurred")})
				}
			}

			console.log(videos)
			// console.log(serversQueues[message.guild.name]['juke'])
			/**
			 * Plays the video requested and any queued videos as well
			 * @param {Discord.VoiceChannel} channel the voice channel
			 * @param {YouTube.Video} vids the youtube video
			 * @param {Discord.TextChannel} sendChannel the original channel request was given on
			 * @param {Discord.TextChannel} errChannel the channel to send errors to
			 */
			var play_video = function(channel, vids, sendChannel, errChannel) {
				channel.join().then(connection=>{
					var name = Object.keys(vids)[0]
					console.log(vids)
					var stream = vids[name]['url']
					console.log(name.toLowerCase())
					console.log("Kileigh's Song".toLowerCase())
					console.log(name.toLowerCase() == "Kileigh's Song".toLowerCase())
					if (name.toLowerCase() != "Kileigh's Song".toLowerCase()) {
						stream = ytdl(vids[name]['url'], { filter: 'audioonly' })
					}
					const dispatcher = connection.playStream(stream || vids[name]['url'])
					dispatcher.setVolumeLogarithmic(0.30)
					console.log(`Currently playing ${name}(${vids[name]['duration']}) with a link of ${vids[name]['url']}`)
					serversQueues[message.guild.name]['curr'] = true
					serversQueues[message.guild.name]['last'] = name

					dispatcher.on('end', ()=>{
						dispatcher.removeAllListeners()
						fw[name]['playCount'] += 1
						fs.writeFile(`./Requests/${message.guild.name}/Jukebox.json`, JSON.stringify(fw, null, '\t'), ()=>console.log('edited playCount'))
						console.log(`Song done! Played for ${dispatcher.totalStreamTime}ms`)
						serversQueues[message.guild.name]['curr'] = false
						if (serversQueues[message.guild.name]['rep']) {
							return play_video(channel, vids, sendChannel, errChannel)
						}
						if (name.toLowerCase() != "Kileigh's Song".toLowerCase())
							sendChannel.send(`Did you like it? Here it is: ${vids[name]['url']}`).catch(()=>{message.reply("An error occurred")})
						console.log(serversQueues[message.guild.name]['queue'].isEmpty())
						console.log(serversQueues[message.guild.name]['queue'])
						if (serversQueues[message.guild.name]['queue'].isEmpty()) {
							serversQueues[message.guild.name]['loaded'] = false
							channel.leave()
							return
						}
						if (serversQueues[message.guild.name]['repall'] && !serversQueues[message.guild.name]['queue'].isEmpty()) {
							console.log("queueing")
							serversQueues[message.guild.name]['queue'].enqueue(name)
						}
						if (!serversQueues[message.guild.name]['queue'].isEmpty()) {
							var next = serversQueues[message.guild.name]['queue'].dequeue() || "music"
							var match = serversQueues[message.guild.name]['juke'].get(next)
							var next_video = null
							var f = require(`./Requests/${message.guild.name}/Jukebox.json`)
							if (match && match[0][0] > 0.65 && match[0][1] == "Kileigh's Song") {
								next_video = {
									[match[0][1]] : {
										"url" : `./Requests/${message.guild.name}/Kileigh's Song.mp3`,
										"duration" : "2:48",
										'playCount': f[match[0][1]]['playCount']
									}
								}
								return play_video(voice, next_video, played, message.channel)
							}
							if (match != null && match[0][0] > 0.65) {
								console.log(`Got here`)
								var closest_match = match[0][1]
								next_video = {
									[closest_match]: {
										"url": f[closest_match]['url'],
										"duration": f[closest_match]['duration'],
										'playCount' : f[closest_match]['playCount']
									}
								}
								console.log(match)
								console.log(next_video)
								console.log(`1. This is the video: ${closest_match}, ${f[closest_match]['duration']}, ${next_video[closest_match]['duration']}`)
								play_video(channel, next_video, sendChannel, errChannel)
							}else{
								try{
									youtube.searchVideos(next + " lyrics").then((video)=>{
										next_video = video
										serversQueues[message.guild.name]['juke'].add(next)
										var vi = {
											"url" : video.url,
											"duration" : video.length
										}
										f[next] = vi
										var ne = {
											[next] : {
												"url": video.url,
												"duration": video.length,
												'playCount' : 1
											}
										}
										fs.writeFileSync(`./Requests/${message.guild.name}/Jukebox.json`, JSON.stringify(file, null, '\t'))
										console.log(`2. This is the video: ${Object.keys(ne)[0]}(${ne[next]['duration']}), ${ne[next]['url']}`)
										play_video(channel, ne, sendChannel, errChannel)
									}).catch(err=>{console.log("error: " + err)})
								}catch(e) {
									console.log(e)
									return errChannel.send("Oh no! I can't search for new songs right now :(").catch(()=>{message.reply("An error occurred")})
								}
							}
						}
					})
				})
			}
			play_video(voice, videos, played, message.channel)
			break;
		/**
		 * Command: SKIP
		 * @param: None
		 * Skips the music if there is any playing.
		 */
		case "skip":
				var voice = message.member.voiceChannel
				if (!voice){
					return message.channel.send('You need to be in a voice channel to skip music!').catch(()=>{message.reply("An error occurred")})
				}
				const permiss = voice.permissionsFor(message.client.user)
				if (!permiss.has('CONNECT') || !permiss.has('SPEAK')) {
					return message.channel.send("I need to be able to connect and speak in voice channels for that!").catch(()=>{message.reply("An error occurred")})
				}
				try {
					if (!serversQueues[message.guild.name]['curr']) {
						throw new Error('No music playing')
					}
					// Uncomment to embarrass Kileigh
					// if (serversQueues[message.guild.name]['last'].toLowerCase() == "kileigh's song" && serversQueues[message.guild.name]['curr']) {
					// 	return message.channel.send("Sorry, this song has been marked unskippable. If you think this is an error, please contact an admin :)").catch(()=>message.reply("An error occurred"))
					// }
					voice.connection.dispatcher.end()
					return message.channel.send("Music skipped").catch(()=>{message.reply("An error occurred")})
				} catch(e) {
					console.log(e)
					return message.channel.send("There currently isn't any music playing!").catch(()=>{message.reply("An error occurred")})
				}
				break;
			/**
			 * Command: DC
			 * @param: None
			 * Disconnects the bot from the voice channel. Returns a message whether successful or not
			 */
			case "dc":
				var voice = message.member.voiceChannel
				if (voice == null) {
					return message.channel.send("Please enter the channel to ask me to leave!").catch(()=>{message.reply("An error occurred")})
				}
				for(var i = 0; i < voice.members.array().length; i++) {
					if (bot.user.username == voice.members.array()[i].user.username) {
						serversQueues[message.guild.name]['loaded'] = false
						serversQueues[message.guild.name]['queue'].clear()
						voice.connection.disconnect()
						return message.channel.send("Goodbye!").catch(()=>{message.reply("An error occurred")})
					}
				}
				return message.channel.send('You must be in the same voice channel to ask me to leave!').catch(()=>{message.reply("An error occurred")})
				break;
			/** WIP
			 * Command: PAUSE
			 * @param: None
			 * Pauses the music if there is any playing
			 */
		case "pause":
			var voice = message.member.voiceChannel
			if (!voice){
				return message.channel.send('You need to be in a voice channel to play music!').catch(()=>{message.reply("An error occurred")});
			}
			const permis = voice.permissionsFor(message.client.user)
			if (!permis.has('CONNECT') || !permis.has('SPEAK')) {
				return message.channel.send("I need to be able to connect and speak in voice channels for that!").catch(()=>{message.reply("An error occurred")})
			}
			try {
				let p = voice.connection.dispatcher.paused
				if (p) {
					voice.connection.dispatcher.resume()
					return message.channel.send('Successfully resumed the music').catch(()=>{message.reply("An error occurred")})
				}else{
					voice.connection.dispatcher.pause()
					return message.channel.send('Successfully paused the music').catch(()=>{message.reply("An error occurred")})
				}
			} catch(e) {
				console.log(e)
				return message.channel.send("There currently isn't any music to pause!").catch(()=>{message.reply("An error occurred")})
			}
		break;

		/**
		 * Command: SAVE
		 * @param: None || String
		 * Saves the current playlist for the user. Can take in a String, the name of
		 * the playlist. Nameless playlists append to the default one
		 */
		case "save":
			if (serversQueues[message.guild.name]['queue'].isEmpty() && !serversQueues[message.guild.name]['curr']) {
				return message.channel.send(`Nothing's playing!`).catch(()=>{message.reply("An error occurred")})
			}
			var newQueue = serversQueues[message.guild.name]['queue'].copy()
			newQueue.enqueue(serversQueues[message.guild.name]['last'])
			newQueue = newQueue.uniqueCopy()
			var playlist_name = args.slice(1).join(' ') || 'default'

			var filePath = `./Playlists/${message.guild.name}/${message.author.username}.json`;
			console.log("trying to access file...");

			if (!fs.existsSync(`./Playlists`)) {
				console.log(`Playlists folder doesn't exist, creating now`)
				fs.mkdirSync(`./Playlists`)
			}

			var json = {
				[playlist_name] : newQueue
			}
			json = JSON.stringify(json, null, "\t")

			if (!fs.existsSync(filePath)) {
				console.log(`User ${message.author.username} doesn't have a file, creating now`)
				fs.writeFileSync(filePath, json)
			}else{
				var file = require(filePath)
				console.log(file['default'])
				file[playlist_name] = newQueue
				fs.writeFileSync(filePath, JSON.stringify(file, null, "\t"))
			}

			return message.channel.send(`Current playlist saved under the name **${playlist_name}**!`).catch(()=>{message.reply("An error occurred")})
			// serversQueues[message.guild.name]['queue'].print()

		break;
		/**
		 * Command: LOAD
		 * @param: None || String
		 * Loads a user's playlist
		 */
		case "load":
			if (!fs.existsSync('./Playlists')) {
				console.log(`Playlist folder doesn't exist, creating now`)
				fs.mkdirSync('./Playlists')
				return message.channel.send(`There isn't a playlist for you! Create one now with **${PREFIX}save**`).catch(()=>{message.reply("An error occurred")})
			}

			if (!fs.existsSync(`./Playlists/${message.guild.name}/${message.author.username}.json`)) {
				console.log(`Playlist file for user doesn't exist`)
				return message.channel.send(`You haven't saved a playlist yet! Create one now with **${PREFIX}save**`).catch(()=>{message.reply("An error occurred")})
			}
			var play_name = args.slice(1).join(' ') || 'default'
			var file = require(`./Playlists/${message.guild.name}/${message.author.username}.json`)
			var plays = fuzzy([], false)
			for (item in file) {
				plays.add(item)
			}
			console.log(plays.get(play_name))
			if (plays.get(play_name) == null || plays.get(play_name)[0][0] < 0.50) {
				return message.channel.send(`I couldn't find a playlist **${play_name}**. You can see your playlists with the command **${PREFIX}lists**`).catch(()=>{message.reply("An error occurred")})
			}
			play_name = plays.get(play_name)[0][1]
			var names = ''
			serversQueues[message.guild.name]['queue'].clear()
			for (i = 0; i < file[play_name].length; i++) {
				serversQueues[message.guild.name]['queue'].enqueue(file[play_name][i])
				names += `${i + 1}) **${file[play_name][i]}**\n`
			}
			message.channel.send(`Congrats! You have queued a total of **${file[play_name].length}** songs from playlist **${play_name}**!`).catch(()=>{message.reply("An error occurred")})
			serversQueues[message.guild.name]['loaded'] = true
			return message.channel.send(names).catch(()=>{message.reply("An error occurred")})
		break;

		/**
		 * Command: SHUFFLE
		 * @param None
		 * Shuffles the current music queue
		 */
		case "shuffle":
			var tmpArray = [] // holds the string names of the songs
			if (serversQueues[message.guild.name]['curr']) {
				tmpArray.push(serversQueues[message.guild.name]['last'])
			}
			while (!serversQueues[message.guild.name]['queue'].isEmpty()) {
				tmpArray.push(serversQueues[message.guild.name]['queue'].dequeue())
			}
			for (let i = 0; i < tmpArray.length; i++) {
				let randPos = Math.floor((Math.random() * 100)) % tmpArray.length
				let randItem = tmpArray[randPos]
				tmpArray[randPos] = tmpArray[i]
				tmpArray[i] = randItem
			}
			while(tmpArray.length != 0) {
				serversQueues[message.guild.name]['queue'].enqueue(tmpArray.shift())
			}
			var voice = message.member.voiceChannel
			if (voice != null) {
				voice.connection.dispatcher.end()
			}
			return message.channel.send(`Shuffled music queue, see the new queue with **${PREFIX}tracks**`).catch(()=>{message.reply("An error has occurred")})
			break;

		/**
		 * Command: LOOP
		 * @param: None
		 * Loops the current song in the queue
		 */
		case "loop":
			if (!serversQueues[message.guild.name]['curr']) {
				return message.channel.send("There currently isn't any songs to repeat!").catch(()=>{message.reply("An error occurred")})
			}
			serversQueues[message.guild.name]['rep'] = !serversQueues[message.guild.name]['rep']
			console.log(`Looping?: ${serversQueues[message.guild.name]['rep']}`)
			return message.channel.send(serversQueues[message.guild.name]['rep'] ? "Looping current song!":"Looping turned off").catch(()=>{message.reply("An error occurred")})
		break;

		/**
		 * Command: LOOPALL
		 * @param: None
		 * Loops the entire queue
		 */
		case "loopall":
			if (!serversQueues[message.guild.name]['curr']) {
				return message.channel.send("There currently isn't any songs to repeat!").catch(()=>{message.reply("An error occurred")})
			}
			serversQueues[message.guild.name]['rep'] = false
			serversQueues[message.guild.name]['repall'] = !serversQueues[message.guild.name]['repall']
			console.log(`Looping queue?: ${serversQueues[message.guild.name]['repall']}`)
			return message.channel.send(serversQueues[message.guild.name]['repall'] ? "Looping entire queue!" : "Queue no longer looped!").catch(()=>{message.reply("An error occurred")})
		break;

		/**
		 * Command: LISTS
		 * @param: None
		 * Displays the playlists that the User has saved
		 */
		case "lists":
			if (!fs.existsSync('./Playlists')) {
				console.log(`Playlist folder doesn't exist, creating now`)
				fs.mkdirSync('./Playlists')
				return message.channel.send(`There isn't a playlist for you! Create one now with **${PREFIX}save**`).catch(()=>{message.reply("An error occurred")})
			}
			if (!fs.existsSync(`./Playlists/${message.guild.name}/${message.author.username}.json`)) {
				console.log(`Playlist file for user doesn't exist`)
				return message.channel.send(`You haven't saved a playlist yet! Create one now with **${PREFIX}save**`).catch(()=>{message.reply("An error occurred")})
			}
			var user_playlist = require(`./Playlists/${message.guild.name}/${message.author.username}.json`)
			var lists = ``
			var playlists = []
			for (name in user_playlist) {
				lists += `**${name}**\n`
				playlists.push(name.toLowerCase())
				for (i = 0; i < user_playlist[name].length;i++) {
					lists += `\t${user_playlist[name][i]}\n`
				}
			}
			return message.channel.send(`You currently have **${playlists.length}** ${playlists.length <= 1 ? "playlist":"playlists"}.\n${lists}`).catch(()=>{message.reply("An error occurred")})
		break;
		/**
		 * Command: TRACKS
		 * @param: None
		 * Shows the current list of songs playing
		 */
		case "tracks":
			var jb = require(`./Requests/${message.guild.name}/Jukebox.json`)
			var tracks = `${serversQueues[message.guild.name]['last'] != null ? serversQueues[message.guild.name]['last'] + ` (${jb[serversQueues[message.guild.name]['last']]['duration']}) ** ---> (currently playing)**${serversQueues[message.guild.name]['rep'] ? "_ Looping_": ""}\n` : ""}`
			if (!serversQueues[message.guild.name]['curr'] && serversQueues[message.guild.name]['queue'].isEmpty()) {
				return message.channel.send(`There currently isn't any songs playing.`).catch(()=>{message.reply("An error occurred")})
			}
			var cloned = serversQueues[message.guild.name]['queue'].copy()
			console.log(cloned)
			while(!cloned.isEmpty()) {
				var song = cloned.dequeue()
				console.log(song)
				if (song != null) {
					tracks += `${song}\n`
				}
			}
			console.log("got to here in tracks")
			return message.channel.send(`These are in the song queue:\n${serversQueues[message.guild.name]['repall'] ? "_Looping queue_\n":""}${tracks}${serversQueues[message.guild.name]['curr'] ? "\nThere are a total of **" + serversQueues[message.guild.name]['queue'].size() + " songs** waiting in queue" : `\nMusic has not started yet, tell me to play when you are ready`}`).catch(()=>{message.reply("An error occurred")})
		break;

		/**
		 * Command: DEL
		 * @param: None
		 * Deletes a playlist that the user has created
		 */
		case "del":
			var channel = message.channel
			if (channel.type != "dm") {
				message.author.send("Hello. You have requested to edit your song list and can do so here. Just run a command and we can start to work your lists :D").catch(()=>{message.reply("An error occurred")})
				return message.channel.send("In order to avoid spam, you can edit your song playlists in the DMs. Check yours for the one I sent you just now").catch(()=>{message.reply("An error occurred")})
			}
			if (!fs.existsSync(`./Playlists`)) {
				console.log("Playlists folder doesn't exist, creating...")
				fs.mkdirSync('./Playlists')
			}
			if (!fs.existsSync(`./Playlists/${message.guild.name}/${message.author.username}.json`)) {
				return message.author.send('You currently do not have any playlists to edit. Please add one in order to edit').catch(()=>{message.reply("An error occurred")})
			}
			message.author.send("Which playlist(s) would you like to edit?").catch(()=>{message.reply("An error occurred")})
			var user_playlist = require(`./Playlists/${message.guild.name}/${message.author.username}.json`)
			var lists = ``
			var playlists = []
			for (name in user_playlist) {
				lists += `**${name}**\n`
				playlists.push(name.toLowerCase())
				for (i = 0; i < user_playlist[name].length;i++) {
					lists += `\t${user_playlist[name][i]}\n`
				}
			}
			message.author.send(lists).catch(()=>{message.reply("An error occurred")})
			const collector = new Discord.MessageCollector(message.channel, m=>m.author.id === message.author.id, {time: 3000})
			// console.log(collector)
			var chosen = null
			collector.on('collect', message=>{
				console.log(`This is message: ${message}`)
				if (!playlists.includes(message.content.toLowerCase())) {
					return message.author.send(`That playlist does not exist`).catch(()=>{message.reply("An error occurred")})
				}
				console.log(playlists)
				console.log(playlists[message.content.trim()])
				console.log(playlists[message.content.toLowerCase().trim()])
				var pl = playlists.indexOf(message.content.trim()) || playlists.indexOf(message.content.toLowerCase().trim())
				chosen = message.content
				message.author.send(`Would you like to delete this playlist?\n**${playlists[pl]}**:\t${user_playlist[playlists[pl]]}`).catch(()=>{message.reply("An error occurred")})
				const coll2 = new Discord.MessageCollector(message.channel,m=>m.author.id === message.author.id, {time:5000})
				coll2.on('collect', message=>{
					if (message.content.toLowerCase().startsWith('y')) {
						console.log(`User wants to delete playlist`)
						delete user_playlist[chosen] || user_playlist[chosen.toLowerCase()]
						fs.writeFileSync(`./Playlists/${message.guild.name}/${message.author.username}.json`, JSON.stringify(user_playlist, null, '\t'))
						return message.author.send(`Playlist ${chosen} deleted! :)`).catch(()=>{message.reply("An error occurred")})
					}else{
						console.log(`Confirmation not given`)
						return message.author.send(`Confirmation not given for deletion`).catch(()=>{message.reply("An error occurred")})
					}
				})
			})
		break;
		case "nick": // !nick [ Mention | text ] [ Null | text ]
			var person = message.author.tag
			var holder = message.cleanContent.split(' ')
			holder.shift()
			var nickName = holder.join(' ')
			if (message.mentions.members.first()) {
				person = message.mentions.members.first().user.tag
				var s = message.cleanContent.split(' ')
				console.log(s)
				s = s.filter(value=>!value.includes(message.mentions.members.first().user.username))
				s.shift()
				nickName = s.join(' ')
			}
			console.log(person)
			console.log(nickName)

			if (fs.existsSync(`./User Settings/${message.guild.name}/nicknames.json`)) {
				var nicksFile = require(`./User Settings/${message.guild.name}/nicknames.json`)
				var users = []
				for (names in nicksFile) {
					for (i = 0; i < nicksFile[names].length; i++) {
						nicknames.add(nicksFile[names][i])
						users.push(names)
						console.log(nicksFile[names][i])
					}
				}

				var matches = nicknames.get(nickName)
				if (matches && matches[0][0] > 0.50) {
					for (names in nicksFile) {
						if (nicksFile[names].includes(matches[0][1])) {
							if (names != person) {
								return message.channel.send(`That nickname is already taken by ${names}!`)
							}else{
								return message.channel.send(`${person} already has that nickname!`)
							}
						}
					}
				}
				if (users.includes(person)) {
					nicksFile[person].push(nickName)
				}else{
					nicksFile[person] = [nickName]
				}
				fs.writeFileSync(`./User Settings/${message.guild.name}/nicknames.json`, JSON.stringify(nicksFile, null, '\t'))
				return message.channel.send(`Nickname **${nickName}** added to ${person}`)
			}else{
				var dat = {
					[person] : [nickName]
				}
				fs.writeFileSync(`./User Settings/${message.guild.name}/nicknames.json`, JSON.stringify(dat, null, '\t'))
				console.log("File nicknames created...")
			}

		break;

		case "ban":
		/**
		 * Command: BAN
		 * @param: User Mention,
		 *         String
		 * Takes a mentioned user and bans the person from the guild. A reason is required.
		 * Returns an embedded message detailing the ban. Banned person Receives a direct
		 * message(DM) of the embed as well
		*/
		let sender = message.author.username;
		let messages = message.content.split(" ");
		let banReason = messages.splice(2).join(" ");
		let banning = message.guild.member(message.mentions.members.first());
		console.log(banReason);
		let days = 1;
		if (banReason.split(" ")[banReason.split(" ").length - 1]) {
			let works = Number.isNaN(banReason.split(" ")[banReason.split(" ").length - 1])
			days = !works ? banReason.split(" ")[banReason.split(" ").length - 1] : 1;
		}
		if (banning == null)
			return message.channel.send("Look here. Banning requires me to know who it is and YOU WON'T MENTION THEM. HOW WOULD I KNOW IT'S WHO YOU WANT!").catch(()=>{message.reply("An error occurred")});
		if (banning.user === bot.user) {
			console.log(`Ban attempted on bot by ${sender}`);
			return message.channel.send("Nice try. You can't ban bots nub! >:D").catch(()=>{message.reply("An error occurred")});
		}
		if (banning.hasPermission("ADMINISTRATOR"))
			return message.channel.send("I'm sorry, but that player has admin permissions").catch(()=>{message.reply("An error occurred")});
		if (!message.member.hasPermission("BAN_MEMBERS"))
			return message.channel.send("YOU NO KAN BAN MEMBAS!").catch(()=>{message.reply("An error occurred")});
		if (!banReason)
			return message.channel.send("Please provide a reason to never see this person again (or maybe for a while) :3").catch(()=>{message.reply("An error occurred")})
			const banEmbed = new Discord.RichEmbed()
				.setAuthor(`${banning.user.username} was banned by ${sender}`, banning.user.displayAvatarURL)
				.addField("Ban Information:", "*User Banned*")
				.addField("Banned:", `${banning.user.tag}`)
				.addField("Moderator: ", `${message.author.tag}`)
				.addField("Reason:", `${banReason}`)
				.setColor('black')
				.addField("Days:", days);
			message.guild.member(banning).ban({days, banReason}).then(member=>{
				member.user.send(banEmbed).catch((e)=>console.log(e))
			});
			message.channel.send(banEmbed).catch(()=>{message.reply("An error occurred")});
			message.channel.send("Done!").catch(()=>{message.reply("An error occurred")});
			break;
		/**
		 * Command: BNBR
		 * @param: None
		 * Returns the BNBR Policy for the user to look at.
		 */
		case "bnbr":
			const bnbrEmbed = new Discord.RichEmbed();
			const rules = new Map();
			rules.set('No personal attacks.', 'There isn\'t a reason to hurt other people. That\'s just a terrible thing to do.')
			rules.set('Swearing is allowed, but keep it in check.', "Excessively swearing just goes and shows that you are a little child.")
			rules.set('No inappropriate names.', "You can freely change your name, but not everyone wants to receive messages from Hairy Buns.")
			rules.set('Hate speech is NEVER okay.', "Just no.")
			rules.set('Racism and ethnical slurs are moderated.', "As gamers, we all understand the occasional slip. But keep it occasional.")
			rules.set('A certain step of actions will be executed based on your violations.', "First strike is a warning. Second strike is a kick. Third is a temporary ban. Fourth is a permanent ban.")
			bnbrEmbed.setColor('RED')
			bnbrEmbed.setTitle("BNBR Policy")
			bnbrEmbed.setFooter("Those who violate the BNBR policy can be reported using !report")
			var numRule = 1
			for (var [policy, explanation] of rules) {
				bnbrEmbed.addField(`${numRule}. ${policy}`, explanation)
				numRule += 1
			}
			return message.channel.send(bnbrEmbed).catch(()=>{message.reply("An error occurred")})
			break;
		case "report":
			if (!args[1]) {
				return message.channel.send("No one mentioned").catch(()=>{message.reply("An error occurred")});
			}
			if (!args[2]) {
				return message.channel.send("Please submit a reason").catch(()=>{message.reply("An error occurred")});
			}
			try {
			if (bot.user.username == message.mentions.users.first().username) {
				console.log(`Report attempted on bot by ${message.author.username}`);
				return message.channel.send("I'm sorry, but bot users cannot be reported").catch(()=>{message.reply("An error occurred")});
			}
			//remove to not be able to report ADMINS
			/*if (message.mentions.members.first().hasPermission("ADMINISTRATOR")) {
				console.log(`Report made on ${message.mentions.users.first().username} by ${message.author.username}`);
				return message.channel.send(`Report cannot be made on ${message.mentions.users.first().username}. Has ADMIN permissions`).catch(()=>{message.reply("An error occurred")});
			}*/
			} catch(err) {console.log(err);return message.channel.send("Error encountered").catch(()=>{message.reply("An error occurred")});}
			if (!fs.existsSync("./Reports")) {
				console.log("Report Folder does not exist, making it right now...");
				fs.mkdirSync("./Reports");
			}
			var fileName = `./Reports/${message.guild.name}/${message.mentions.users.first().username}.json`;
			var counts = 1;
			fs.exists(fileName, function(exists) {
				if (exists) {
					console.log("File against user exists, writing to file...");
					var file = require(fileName);
					file.report.push(message.content.split(" ").splice(2).join(" "));
					file.reportCount = file.reportCount + 1;
					file.timeOuts = counts == 3 ? file.timeOuts + 1 : file.timeOuts
					file.bans = counts == 8 ? file.bans + 1 : file.bans
					counts = file.reportCount;
					fs.writeFile(fileName, JSON.stringify(file, null, 2), function(err) {
						if (err) {
							console.log(err);
							return message.channel.send("Error encountered, please try again").catch(()=>{message.reply("An error occurred")});
						}
						console.log(JSON.stringify(file, null, 2));
						console.log(`Writing to ${fileName}`);
					});
				}else{
					json = {
						report : [message.content.split(" ").splice(2).join(" ")],
						reportCount : 1,
						timeOuts : 0,
						bans : 0
					}
					json = JSON.stringify(json, null, 2);
					fs.writeFile(fileName, json, (err) => {
						if (!err) {
							console.log("File for user not found, creating one...");
							console.log(`Done, file made: ${fileName}`)
						}
					});
				}
				var mems = message.guild.members
				var mods = []
				console.log(mems)
				for (var [id, member] of mems) {
					if (member.hasPermission('ADMINISTRATOR') && !member.user.equals(bot.user)) {
						mods.push(member.user.username)
					}
				}
				try{
					message.mentions.users.first().send(`A report has been filed against you for breaching the BNBR Policy of **${message.guild.name}**. This is report number **${counts}**. If you believe that this is a mistake, please contact **${String(mods)}**\n\nReport: **${args.splice(2).join(' ')}**`).catch(()=>{message.reply("An error occurred")})
				}catch(e) {
					console.log("Couldn't send message to user")
				}
				var reported = message.mentions.users.first()
				if (counts == 3) {
					var all_roles = message.guild.roles.array()
					if (!all_roles.includes('time out')) {
						message.guild.createRole({name:'time out', color:'DARK_GREY', hoist:true, permissions:[]}, 'time out')
					}
					message.guild.member(reported).setRoles(['time out']).then(()=>{
						return message.channel.send(`User ${reported} has been set on a time out for now.`).catch(()=>{message.reply("An error occurred")})
					})
				}
				if (count == 5) {
					message.guild.member(reported).kick(message.content.split(" ").splice(2).join(" ")).then(()=>{
						message.channel.send(`Thank you for reporting ${reported.username}. Due to their obsessive breaching of the BNBR Policy, they have been kicked from the server.`).catch(()=>{message.reply("An error occurred")})
						return reported.send(`You have been kicked from the server for excessive breaches. You may join back but be warned.`).catch(()=>{message.reply("An error occurred")})
					})
				}
				if (count == 8) {
					let reasoning = `You have been reported 8 times for breaching the BNBR Policy and have been banned from the server. Please take this time to realize what went wrong with your life to be banned by a happy potato.`
					message.guild.member(reported).ban({days:3,reason:message.content.split(" ").splice(2).join(" ")}).then(()=>{
						message.channel.send(`Thank you for reporting this user. Proper actions have been taken`).catch(()=>{message.reply("An error occurred")})
						return reported.send(reasoning).catch(()=>{message.reply("An error occurred")})
					})

				}
				return message.channel.send("Thank you, report submitted").catch(()=>{message.reply("An error occurred")});
			});
			break;
		default: //default case, used when an unknown command is given with the prefix
			message.channel.send(`I don't know what to do with this ;-;\nTry using **${PREFIX}help** to see my commands`).catch(()=>{message.reply("An error occurred")});
			break;

	}
});

//bot login, REQUIRED
bot.login(TOKEN);