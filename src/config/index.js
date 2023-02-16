const development = {
  mailServerUrl: "http://localhost:9999/sendMail",
  goLangServerUrl: "http://localhost:8080",
  nodeServerUrl: "http://localhost:9999",
  goLangMail: "http://localhost:8080/bookload"
};

const isProduction = () => process.env.NODE_ENV === "production"

const production = {
  mailServerUrl: "https://mail.freightdok.io/sendMail",
  goLangServerUrl: "https://go.freightdok.io",
  nodeServerUrl: "https://api.freightdok.io",
  goLangBookNow: "https://go.freightdok.io/bookload",
};

const getGoUrl = () => {
  if (isProduction()) {
    return production.goLangServerUrl;
  }
  return development.goLangServerUrl;
};


export const getMainNodeServerUrl = () => {
  if (isProduction()) {
    return production.nodeServerUrl;
  }
  return "http://localhost:5000";
}

const getBaseUrl = () => {
  if (isProduction()) {
    return production.nodeServerUrl;
  }
  return "http://localhost:5000";
};

const getBabylonianServerUrl = () => {
  if(isProduction()){
    return 'https://babylonian-gate.freightdok.io/'
  }
  return 'http://localhost:5800'
}

export { getBaseUrl, getGoUrl, development, production, getBabylonianServerUrl };
