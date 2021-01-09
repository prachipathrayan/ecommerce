const configObject = {
    secret: process.env.JWT_SECRET,
};
const jwtConfig = Object.freeze(configObject);

export default jwtConfig;
