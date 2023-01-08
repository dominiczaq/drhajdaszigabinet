const notifier = require("node-notifier");
var cron = require("node-cron");

const searchBeforeDate = new Date("2023-01-20");

async function main() {
  console.log("running at " + new Date().toLocaleString());
  try {
    const res = await fetch(
      "https://drhajdasz.igabinet.pl/eapi/auth/access_token",
      {
        headers: {
          accept: "application/json, application/x-www-form-urlencoded",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7",
          authorization: "Basic aWdhYmluZXQ6Tk9ULU5FRURFRA==",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie: "system=4896107ee7149d9e9a1136f93d45a37e",
          Referer: "https://drhajdasz.igabinet.pl/b/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: "scope=default&grant_type=client_credentials",
        method: "POST",
      }
    );
    const token = await res.json();
    const accessToken = token.access_token;

    const dataRes = await fetch(
      "https://drhajdasz.igabinet.pl/eapi/up/terms/days/2023/01/?lang=pol&product=1441981575&service=19&group=1",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pl;q=0.7",
          authorization: `Bearer ${accessToken}`,
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie: "system=4896107ee7149d9e9a1136f93d45a37e",
          Referer: "https://drhajdasz.igabinet.pl/b/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const data = await dataRes.json();
    console.log(data);
    if (data.data.length === 0) {
      return undefined;
    }
    const filteredDates = data.data.filter(
      (dates) => new Date(dates.date) < searchBeforeDate
    );
    console.log(filteredDates);
    if (filteredDates.length === 0) {
      return undefined;
    }
    // String
    notifier.notify({
      title: "Cos zminilo sie w outpucie z lekarza",
      message: JSON.stringify(data),
      wait: false,
    });
  } catch (e) {
    notifier.notify("Zepsute, sprawdz console.log");
    console.error(e);
  }
}

main();
cron.schedule("*/2 * * * *", main);
