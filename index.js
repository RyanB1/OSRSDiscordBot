require("dotenv").config();
const Discord = require("discord.js");
const hiscores = require("osrs-json-hiscores");
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const fs = require("fs");
const expArr = fs.readFileSync("exp.txt", "utf-8").split("\n");

bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", (msg) => {
  const name = msg.content.slice(msg.content.indexOf(" ") + 1);
  if (msg.content.startsWith("$lookup")) {
    hiscores
      .getStats(name)
      .then((res) => {
        const base =
          0.25 *
          (res.main.skills.defence.level +
            res.main.skills.hitpoints.level +
            res.main.skills.prayer.level * 0.5);
        const melee =
          0.325 *
          (res.main.skills.attack.level + res.main.skills.strength.level);
        const range = 0.325 * (res.main.skills.ranged.level * 1.5);
        const mage = 0.325 * (res.main.skills.magic.level * 1.5);
        const final = base + Math.max(melee, range, mage);
        msg.reply(`${name} has a Combat Level of ${Math.floor(final)}.`);
      })
      .catch((err) => console.error(err));
  } else if(msg.content.startsWith("$help")){ 
    msg.reply("List of available commands:\n**Combat Level:**\n$lookup [RSN]\n\n**For Individual Skill Levels:**\n$[Skill Name] [RSN]\n**Example:** $attack player");
  } else if (msg.content[0] === "$") {
    const skill = msg.content.slice(1, msg.content.indexOf(" "));
    hiscores
      .getStats(name)
      .then((res) => {
        const lvl = res.main.skills[skill].level;
        console.log(parseInt(expArr[lvl]) - parseInt(res.main.skills[skill].xp));
        msg.reply(
          `${name} has a **${
            skill.charAt(0).toUpperCase() + skill.slice(1)
          }** Level of **${lvl}** with **${parseInt(expArr[lvl]) - parseInt(res.main.skills[skill].xp)}** experience left until level **${lvl+1}**.`
        );
      })
      .catch((err) => {
        console.error(err);
        msg.reply("Invalid Player Name or Command.");
      });
  }
});
