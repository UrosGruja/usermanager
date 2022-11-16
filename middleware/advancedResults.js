const User = require('../model/users');
const mongoose = require('mongoose');

const advancedResults = (model) => async (req, res, next) => {

    const user = await User.findById(req.user.id);
    const lon = user.destination.coordinates[0];
    const lat = user.destination.coordinates[1];

    let query;

    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = model.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');

        if (sortBy !== 'location') {
            query = query.sort(sortBy);

        } else if (sortBy === 'location') {
            query =  model.find({
                destination: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [lon, lat],
                        }
                    }
                }
            });
        }
        else {
            query = query.sort('-phoneNumber');
        }
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));


    query = query.skip(startIndex).limit(limit);


    const result = await query;


    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    if (req.query.desc == 1) {
        res.advancedResults = {
            success: true,
            count: result.length,
            pagination,
            data: result.reverse()
        }
    } else {
        res.advancedResults = {
            success: true,
            count: result.length,
            pagination,
            data: result
        }
    }
    next();
};

module.exports = advancedResults;

