const { Op } = require("sequelize");


module.exports = (model, options = {}) => async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = "", isDeleted } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const searchField = options.searchField || 'name';

    const searchCondition = search
      ? {
          [searchField]: {
            [Op.like]: `%${search}%`
          }
        }
      : {};

    const attributes = options.excludeFields
      ? { exclude: options.excludeFields }
      : undefined;

    if (isDeleted === undefined) {
      const [active, deleted] = await Promise.all([
        model.findAndCountAll({
          where: { ...searchCondition, isDeleted: false },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          attributes
        }),
        model.findAndCountAll({
          where: { ...searchCondition, isDeleted: true },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          attributes
        })
      ]);

      res.paginatedResults = {
        active: {
          total: active.count,
          currentPage: page,
          totalPages: Math.ceil(active.count / limit),
          data: active.rows
        },
        deleted: {
          total: deleted.count,
          currentPage: page,
          totalPages: Math.ceil(deleted.count / limit),
          data: deleted.rows
        }
      };

    } else {
      const boolDeleted = isDeleted === 'true';
      const { count, rows } = await model.findAndCountAll({
        where: { ...searchCondition, isDeleted: boolDeleted },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        attributes
      });

      res.paginatedResults = {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        data: rows
      };
    }

    next();
  } catch (error) {
    console.error('Pagination Middleware Error:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
