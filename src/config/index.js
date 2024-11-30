const development = {
  mailServerUrl: process.env.REACT_APP_mailServerUrl,
  goLangServerUrl: process.env.REACT_APP_goLangServerUrl,
  nodeServerUrl: process.env.REACT_APP_nodeServerUrl,
  goLangMail: process.env.REACT_APP_goLangMail,
  mainServerUrl: process.env.REACT_APP_mainServerUrl
};

const isProduction = () => process.env.NODE_ENV === "production"

const production = {
  mailServerUrl: process.env.REACT_APP_mailServerUrl || "https://mail.freightdok.io/sendMail",
  goLangServerUrl: process.env.REACT_APP_goLangServerUrl || "https://go.freightdok.io",
  nodeServerUrl: process.env.REACT_APP_mainServerUrl || "https://api.freightdok.io",
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
  return development.mainServerUrl;
}

const getBaseUrl = () => {
  if (isProduction()) {
    return production.nodeServerUrl;
  }
  return development.mainServerUrl;
};

const getBabylonianServerUrl = () => {
  if(isProduction()){
    return 'https://babylonian-gate.freightdok.io/'
  }
  return 'http://localhost:5800'
}

export { getBaseUrl, getGoUrl, development, production, getBabylonianServerUrl };
