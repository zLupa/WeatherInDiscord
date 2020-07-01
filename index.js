require("dotenv").config();
require("better-logging")(console);
const config = require("./config.json");
const discordRPC = require("discord-rpc");
const clientId = "630919052423856170";
const axios = require("axios").default;
var URL = `http://api.openweathermap.org/data/2.5/weather?q=${config.city}&units=metric&lang=pt&APPID=${process.env.API_KEY}`;

const startTimestamp = new Date();

discordRPC.register(clientId);

const rpc = new discordRPC.Client({ transport: "ipc" });

function setActivity(description, temperature, icon) {
  rpc
    .setActivity({
      details: description,
      state: `Temperatura é ${temperature}°C`,
      startTimestamp,
      largeImageKey: icon,
      largeImageText: "Programa feito em nodeJS por zLupim.",
      instance: false,
    })
    console.info("The activity has sent successfully, see your Profile in Discord!")
}

rpc.on("ready", () => {
  console.info("Connected to Discord IPC!");

  function GetInfosAndSetToDiscord() {
    console.info("Getting the data from API.")
    axios
      .get(encodeURI(URL))
      .then((data) => {
        var weatherDescription = data.data.weather[0].description;
        var weatherTemperature = data.data.main.temp;
        var icon = data.data.weather[0].icon;
      
        console.info("The data was obtained, Sending Activity to Discord.");
        setActivity(weatherDescription, weatherTemperature, icon);
      })
      .catch((err) => {
        if (err.response.data) return console.error(err.response.data);
        console.error(err);
      });
  }

  GetInfosAndSetToDiscord();
  setInterval(GetInfosAndSetToDiscord, config.UpdateRPInMS);
});

rpc.login({ clientId }).catch(console.error);
