const development = {
  mailServerUrl: "http://localhost:9999/sendMail",
  goLangServerUrl: "http://localhost:8080",
  nodeServerUrl: "http://localhost:9999",
  goLangMail: "http://localhost:8080/bookload"
};

const getGoUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return production.goLangServerUrl;
  }
  return development.goLangServerUrl;
};

const production = {
  mailServerUrl: "https://mail.freightdok.io/sendMail",
  goLangServerUrl: "https://go.freightdok.io",
  nodeServerUrl: "https://api.freightdok.io",
  goLangBookNow: "https://go.freightdok.io/bookload",
  chBidding: getGoUrl() + '/CHBidding'
};


export const getMainNodeServerUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return production.nodeServerUrl;
  }
  return "http://localhost:5000";
}

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return production.nodeServerUrl;
  }
  return "http://localhost:5000";
};

export { getBaseUrl, getGoUrl, development, production };
