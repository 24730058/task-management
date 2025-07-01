const tasksRoute = require("./task.route");
const usersRoute = require("./user.route");

const loginAuth = require("../../../../validate/client/loginAuth.validate");


module.exports = (app) => {

  app.use("/api/v1/tasks", loginAuth.loginAuth,tasksRoute);

  app.use("/api/v1/users", usersRoute);

  
}