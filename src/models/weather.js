const request = require('superagent');
const logger = require('server-side-tools').logger;
const { kelvinToFahrenheit } = require('server-side-tools').convert;

function getSingle (req) {
  if ((req.query.zip) && req.query.zip.length > 0) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/';
    const args = req.query.zip;
    let url = apiUrl;
    if (process.env.KL_OWM_API_KEY < 1) {
      logger.warn('openweathermap Key is missing, Please add an API key to the configuration file.');
      return "openweathermap Key is missing, Please add an API key to the configuration";
    }
    // if zipcode ?zip={zip},us (us only?)
    // if city / state use ?q=
    url = `${url}weather?zip=${args},us&appid=${process.env.KL_OWM_API_KEY}`;
    try {
      request.get(url).then((response) => {
        if (response.status === 200) {
          const json = response.body;
          if (typeof json.main === 'undefined') {
            logger.warn(`json.main === 'undefined'`);
            return 'Are you trying to make me crash?';
          } else {
            const returnstring = `Current temperature in ${json.name}, is ${kelvinToFahrenheit(json.main.temp)
            }°F, with a humidity of ${json.main.humidity
            }%, Current Weather is ${json.weather[0].description}`;
            return returnstring;
          }
        }
      });
    } catch (error) {
      logger.error(error);
      return 'Are you trying to make me crash?';
    }
  } else {
    return `Please use the endpoint with a get param of 'zip'. example https://meteorology.herokuapp.com/?zip=123`;
  }
}

module.exports = {getSingle}