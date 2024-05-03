const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    Name: String
})

class CategoryDAO {
    model = null

    createSchema = () => {
        this.model = mongoose.model("Category", schema)
    }

    create = async (category) => {
        return await this.model.create(category)
    }

    update = async (category) => {
        return await this.model.findOneAndUpdate({ _id: category._id }, { ...category }, {new: true});
    }

    getAll = async () => {
        return await this.model.find({})
    }

    getByName = async (name) => {
        return await this.model.findOne({ Name: name })
    }
}

module.exports = { categoryDAO: new CategoryDAO() }