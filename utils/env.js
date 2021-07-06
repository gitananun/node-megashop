const useEnv = () => {
  if (process.env.APP_MODE !== 'production') require('dotenv').config();
};

module.exports = useEnv;
