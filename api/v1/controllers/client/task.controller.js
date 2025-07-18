const Task = require('../../models/task.model');
const User = require('../../models/user.model');


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

    // Tìm kiếm
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

    res.json(task);
};

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;

        const status = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status
        });

        
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công",
        });
    }
    catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại",
        });
    }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids;
    const status = req.body.status;

    try {
        await Task.updateMany({
        _id: {
            $in: ids
        }
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công",
        });
    } catch (error) {

        res.json({
            code: 400,
            message: "Không hỗ trợ cập nhật trường này",
        });
    }

}


// [PATCH] /api/v1/tasks/create
module.exports.create = async (req, res) => {

    req.body.createdBy = req.user._id; 

    const task = new Task(req.body);

    try {
        await task.save();
 
        res.json({
            code: 200,
            message: "Tạo công việc thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi khi tạo công việc",
            error: error.message
        });
    }
}

// [PATCH] /api/v1/tasks/edit
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const taskData = req.body;
    try {
        await Task.updateOne(
            { _id: id },
            { $set: taskData }
        );

        res.json({
            code: 200,
            message: "Cập nhật công việc thành công",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi khi cập nhật công việc",
            error: error.message
        });
    }
}

// [DELETE] /api/v1/tasks/delete/
module.exports.delete = async (req, res) => {
    const ids = req.body.ids;

    try {
        await Task.updateOne({
            _id: {
                $in: ids
            }
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Xóa công việc thành công",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi khi xóa công việc",
            error: error.message
        });
    }
}