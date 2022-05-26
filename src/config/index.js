const production = {
  mailServerUrl: "https://mail.freightdok.io/sendMail",
  goLangServerUrl: "https://go.freightdok.io",
  nodeServerUrl: "https://api.freightdok.io",
  goLangMail: "https://go.freightdok.io/bookload"
};

const development = {
  mailServerUrl: "http://localhost:9999/sendMail",
  goLangServerUrl: "http://localhost:8080",
  nodeServerUrl: "http://localhost:5000",
  goLangMail: "http://localhost:8080/bookload"
};

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return production.nodeServerUrl;
  }
  return development.nodeServerUrl;
};

const getGoUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return production.goLangServerUrl;
  }
  return development.golangServerUrl;
};

export { getBaseUrl, getGoUrl, development, production };
