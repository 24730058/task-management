const tasksRoute = require("./task.route");
const usersRoute = require("./user.route");

module.exports = (app) => {

  app.use("/api/v1/tasks", tasksRoute);

  app.use("/api/v1/users", usersRoute);

  
}