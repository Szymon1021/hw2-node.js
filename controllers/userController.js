const service = require('../service');

const registerUser = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const userData = { email, password, subscription };
    const { user, token } = await service.createUser(userData);
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginData = { email, password };
    const { user, token } = await service.loginUser(loginData);
    res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };