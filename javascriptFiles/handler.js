
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
AWS.config.update({ region: 'your-region' });
const tableName = 'CloudGPT'; //TABLE NAME IN DYNAMODB !!!

module.exports.registerUser = async (event) => {
  const { email, password } = JSON.parse(event.body);

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: tableName,
    Item: {
      email,
      password: hashedPassword,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (error) {
    console.error('Error registering user: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

module.exports.loginUser = async (event) => {
  const { email, password } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Key: {
      email,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    const passwordMatch = await bcrypt.compare(password, data.Item.password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful' }),
    };
  } catch (error) {
    console.error('Error logging in user: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
