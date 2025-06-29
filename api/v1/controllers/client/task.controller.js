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

    // Phân trang
    let limitItems = 4;
    let page = 1;

    if(req.query.page) {
        page = parseInt(req.query.page);
    }

    if(req.query.limit) {
        limitItems = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limitItems;
    // Hết Phân trang

    // Tìm kiếmAdd commentMore actions
    if(req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    // Hết Tìm kiếm
    const tasks = await Task
        .find(find)
        .limit(limitItems)
        .skip(skip)
        .sort(sort);
    

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