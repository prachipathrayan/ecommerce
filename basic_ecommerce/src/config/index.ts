import dotenv from 'dotenv';

const configObject = {
    environment: process.env.NODE_ENV,
    database: {
        mysql: {
            uri: process.env.MYSQL_URI_LOCAL || '',
            //uri:'mysql://root:1234@localhost:3306/ecommerce' || '',
        },
    },

};
// Todo Joi validation
const mysqlDbConfig = Object.freeze(configObject);

export default mysqlDbConfig;