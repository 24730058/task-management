const Task = require('../../models/task.model');


// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    if(req.query.status) {
        find.status = req.query.status;
    }

    // sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    };
    // end sort
    const tasks = await Task.find(find).sort(sort);

    res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    const taskId = req.params.id;

    const task = await Task.findOne({
        _id: taskId,
        deleted: false
    });
    console.log(task);
    console.log('ID:', taskId);
    res.json(task);
};