const config = require("./config/settings.json");
const today = new Date();
const now = new Date().toLocaleTimeString();
const hour = new Date().getHours();
const minute = new Date().getMinutes();

const Discord = require("discord.js");
const client = new Discord.Client();
const coincap = require('coincap-lib');


client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	if(command === "ping") {
		const m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
	}

	if(command === "rage") {
		var first = '(╯°□°）╯︵ ┬─┬';
		var second = '(╯°□°）╯︵ ┻━┻';
		var third = '( ノ゜-゜)ノ ┬─┬';
		var m = await message.channel.send(first);
		await sleep(0.75);
		m.edit(second);
		await sleep(0.75);
		m.edit(first);
		await sleep(0.75);
		m.edit(third);
	}

	if(command === "tax"){
		message.channel.send({embed: {
			"title":"Tax Help",
			"description":{"text":"Need help this tax season? Check out https://bitcoin.tax/."},
			"footer":{"text":"Please note that we are not affiliated with Bitcoin Tax and do not officially endorse their methods. We suggest consulting with your financial advisor before dealing with anything of real consequence."},
		}});
	}

	if(command === "info") {
		var user = client.user;
		var em = new Discord.RichEmbed();
		em.setTitle("Pibot Information");
		em.setColor(3447003);
		em.setThumbnail(user.displayAvatarURL);
		em.setDescription("Public cryptocurrency bot created by Pure Investments.\n\nIf you would like to invite me to your guild, please [click here](https://discordapp.com/api/oauth2/authorize?client_id=429661631736446987&permissions=268527622&scope=bot)!")
		em.addField("Owner","<@141323190411591680>",inline=true);
		em.addField("Author","<@225024818418810881>",inline=true);
		em.addField("Bot ID",user.id);
		message.channel.send(em);
	}

	if(command === "price") {
		coincap.coin(args[0].toUpperCase()).then(data => {
			var em = new Discord.RichEmbed();
			em.setTitle(`${data.display_name} - ${data.id}`);
			em.setColor(2187482);
			em.setThumbnail(`https://coincap.io/images/coins/${data.display_name}.png`);
			em.setFooter(text="Coin information from coincap.io",icon_url="https://cdn6.aptoide.com/imgs/6/5/c/65c7ced56adb1f1f7cb4ca7428407277_icon.png?w=256")
			em.addField("Rank",data.rank);
			em.addField("Price",`$${data.price}`);
			em.addField("volume",`Alt Volume: ${data.volumeAlt}\nBTC Volume: ${data.volumeBtc}\nTotal Volume: ${data.volumeTotal}`);
			message.channel.send(em);
		});
	}

	if(command === "history") {
		/**/
	}

	if(command === "top10") {
		coincap.front().then(data => {
			var em = new Discord.RichEmbed();
			var finalText = "";
			em.setTitle("Top 10");
			em.setColor("RANDOM");
			data.slice(0,10).forEach(function(datum) {
				if(datum["cap24hrChange"].toString().startsWith("-")) {
					var emoji = ":chart_with_downwards_trend:";
				} else {
					var emoji = ":chart_with_upwards_trend:";
				}
				finalText += `**${datum.long}** $${datum.price} :: *Market Cap* ${datum.cap24hrChange} ${emoji}\n`;
			})
			em.setDescription(finalText);
			message.channel.send(em);
		});
	}

});

client.login(config.token);
