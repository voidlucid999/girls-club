
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in Railway variables.");
  process.exit(1);
}

const ROLES = [
  { name: "Owner", color: 0xFF4F9A },
  { name: "Co Owner", color: 0xFF85B3 },
  { name: "Admin", color: 0xD98BCE },
  { name: "Staff", color: 0xF4A6C1 },
  { name: "Trial Moderator", color: 0xE6A8D7 },
  { name: "Moderator", color: 0xC7A0E8 },
  { name: "Trial Helper", color: 0xFFC6DE },
  { name: "Helper", color: 0xFFB6C8 },
  { name: "Trusted", color: 0xF6D78B },
  { name: "Member", color: 0xFFDDE8 },
  { name: "Bots", color: 0xC9C4FF },
];

const CHANNEL_LAYOUT = [
  {
    name: "୨୧ 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 ୨୧",
    channels: [
      ["・𝓻𝓾𝓵𝓮𝓼", "Please read the server rules."],
      ["・𝓪𝓷𝓷𝓸𝓾𝓷𝓬𝓮𝓶𝓮𝓷𝓽𝓼", "Server announcements."],
      ["・𝓲𝓷𝓽𝓻𝓸𝓭𝓾𝓬𝓽𝓲𝓸𝓷𝓼", "Introduce yourself."],
      ["・𝓻𝓸𝓵𝓮𝓼", "Your server roles."],
    ],
  },
  {
    name: "୨୧ 𝓣𝓱𝓮 𝓟𝓲𝓷𝓴 𝓟𝓪𝓻𝓵𝓸𝓻 ୨୧",
    channels: [
      ["・𝓰𝓮𝓷𝓮𝓻𝓪𝓵", "General chat."],
      ["・𝓰𝓲𝓻𝓵𝓼 𝓬𝓱𝓪𝓽", "Girls only chat."],
      ["・𝓼𝓮𝓵𝓯𝓲𝓮𝓼", "Share selfies."],
      ["・𝓹𝓲𝓬𝓽𝓾𝓻𝓮𝓼", "Share pictures."],
      ["・𝓼𝓹𝓪𝓶", "Spam and casual chat."],
      ["・𝓺𝓸𝓽𝓭", "Question of the day."],
    ],
  },
  {
    name: "୨୧ 𝓑𝓮𝓼𝓽𝓲𝓮 𝓣𝓲𝓶𝓮 ୨୧",
    channels: [
      ["・𝓶𝓮𝓶𝓮𝓼", "Funny memes."],
      ["・𝓿𝓮𝓷𝓽", "A place to let things out."],
      ["・𝓪𝓭𝓿𝓲𝓬𝓮", "Ask for advice."],
      ["・𝓺𝓾𝓮𝓼𝓽𝓲𝓸𝓷𝓼", "Ask the community."],
      ["・𝓫𝓸𝓽 𝓬𝓸𝓶𝓶𝓪𝓷𝓭𝓼", "Use bot commands."],
    ],
  },
  {
    name: "୨୧ 𝓥𝓸𝓲𝓬𝓮 𝓛𝓸𝓾𝓷𝓰𝓮 ୨୧",
    channels: [
      ["・𝓱𝓪𝓷𝓰𝓸𝓾𝓽", null, "voice"],
      ["・𝓰𝓲𝓻𝓵𝓼 𝓷𝓲𝓰𝓱𝓽", null, "voice"],
      ["・𝓶𝓾𝓼𝓲𝓬", null, "voice"],
    ],
  },
  {
    name: "୨୧ 𝓢𝓽𝓪𝓯𝓯 𝓡𝓸𝓸𝓶 ୨୧",
    private: true,
    channels: [
      ["・𝓼𝓽𝓪𝓯𝓯 𝓬𝓱𝓪𝓽", "Private staff chat."],
      ["・𝓼𝓽𝓪𝓯𝓯 𝓪𝓷𝓷𝓸𝓾𝓷𝓬𝓮𝓶𝓮𝓷𝓽𝓼", "Staff updates."],
      ["・𝓻𝓮𝓹𝓸𝓻𝓽𝓼", "Member reports."],
      ["・𝓶𝓸𝓭 𝓵𝓸𝓰𝓼", "Moderation logs."],
    ],
  },
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  new SlashCommandBuilder()
    .setName("setup-roles")
    .setDescription("Create missing pastel server roles.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  new SlashCommandBuilder()
    .setName("setup-channels")
    .setDescription("Create the preppy server categories and channels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  new SlashCommandBuilder()
    .setName("role-list")
    .setDescription("Display all server roles."),
].map(command => command.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  if (GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Guild slash commands registered.");
  } else {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("Global slash commands registered.");
  }
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const guild = interaction.guild;
  if (!guild) {
    return interaction.reply({
      content: "Use this command inside your server.",
      ephemeral: true,
    });
  }

  try {
    if (interaction.commandName === "setup-roles") {
      await interaction.deferReply({ ephemeral: true });

      const me = await guild.members.fetchMe();
      if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return interaction.editReply(
          "I need the Manage Roles permission."
        );
      }

      let created = 0;
      let existing = 0;

      for (const roleData of ROLES) {
        const found = guild.roles.cache.find(
          role => role.name === roleData.name
        );

        if (found) {
          existing++;
          continue;
        }

        await guild.roles.create({
          name: roleData.name,
          color: roleData.color,
          hoist: [
            "Owner", "Co Owner", "Admin", "Staff",
            "Moderator", "Trial Moderator", "Helper",
            "Trial Helper"
          ].includes(roleData.name),
          reason: "Preppy pastel role setup",
        });

        created++;
      }

      const embed = new EmbedBuilder()
        .setColor(0xFFB6D5)
        .setTitle("୨୧ ♡ Pretty Role Setup ♡ ୨୧")
        .setDescription(
          `Created **${created}** roles.\n` +
          `Already existed: **${existing}**\n\n` +
          "Pastel pink and lavender aesthetics."
        )
        .setFooter({ text: "୨୧ Lucid Dreams ୨୧" });

      return interaction.editReply({ embeds: [embed] });
    }

    if (interaction.commandName === "setup-channels") {
      await interaction.deferReply({ ephemeral: true });

      const me = await guild.members.fetchMe();
      if (!me.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.editReply(
          "I need the Manage Channels permission."
        );
      }

      let categoriesCreated = 0;
      let channelsCreated = 0;
      let skipped = 0;

      const staffRoles = guild.roles.cache.filter(role =>
        ["Owner", "Co Owner", "Admin", "Staff",
         "Moderator", "Trial Moderator", "Helper",
         "Trial Helper"].includes(role.name)
      );

      for (const section of CHANNEL_LAYOUT) {
        let category = guild.channels.cache.find(
          channel =>
            channel.type === ChannelType.GuildCategory &&
            channel.name === section.name
        );

        if (!category) {
          const overwrites = section.private
            ? [
                {
                  id: guild.roles.everyone.id,
                  deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                  id: me.id,
                  allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ManageChannels,
                  ],
                },
                ...staffRoles.map(role => ({
                  id: role.id,
                  allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                  ],
                })),
              ]
            : [];

          category = await guild.channels.create({
            name: section.name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: overwrites,
            reason: "Preppy server channel setup",
          });

          categoriesCreated++;
        }

        for (const item of section.channels) {
          const [name, topic, kind] = item;
          const type = kind === "voice"
            ? ChannelType.GuildVoice
            : ChannelType.GuildText;

          const found = guild.channels.cache.find(
            channel =>
              channel.parentId === category.id &&
              channel.name === name &&
              channel.type === type
          );

          if (found) {
            skipped++;
            continue;
          }

          const options = {
            name,
            type,
            parent: category.id,
            reason: "Preppy server channel setup",
          };

          if (topic && type === ChannelType.GuildText) {
            options.topic = topic;
          }

          await guild.channels.create(options);
          channelsCreated++;
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0xFFB6D5)
        .setTitle("୨୧ ♡ Pretty Channel Setup ♡ ୨୧")
        .setDescription(
          `Categories created: **${categoriesCreated}**\n` +
          `Channels created: **${channelsCreated}**\n` +
          `Already existed: **${skipped}**\n\n` +
          "Your preppy server layout is ready."
        )
        .setFooter({ text: "୨୧ Lucid Dreams ୨୧" });

      return interaction.editReply({ embeds: [embed] });
    }

    if (interaction.commandName === "role-list") {
      const roles = guild.roles.cache
        .filter(role => role.id !== guild.id)
        .sort((a, b) => b.position - a.position)
        .map(role => `୨୧ ${role.name}`)
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor(0xFFB6D5)
        .setTitle("୨୧ ♡ Your Pretty Server Roles ♡ ୨୧")
        .setDescription(roles || "No roles found.")
        .setFooter({ text: "୨୧ Lucid Dreams ୨୧" });

      return interaction.reply({ embeds: [embed] });
    }
  } catch (error) {
    console.error(error);

    const message =
      "Something went wrong. Check the Railway logs and make sure the bot has the required permissions.";

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: message }).catch(() => {});
    } else {
      await interaction.reply({
        content: message,
        ephemeral: true,
      }).catch(() => {});
    }
  }
});

(async () => {
  try {
    await registerCommands();
    await client.login(TOKEN);
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
})();
