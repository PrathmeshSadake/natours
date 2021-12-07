class APIFeatues {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // Remove all above fields from queryObject
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advance filtering
    let queryStr = JSON.stringify(queryObj); //converted queryObj to string
    //replacing gte,gt,lte,lt with $gte, $gt, $lte, $lt for mongoose
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //converted queryStr to json
    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      // if there is multiple sort in query split them and store in array.
      const sortBy = this.queryStr.sort.split(',').join(' ');
      // console.log(sortBy); //['price','duration', etc.]
      this.query = this.query.sort(sortBy);
    } else {
      // if there is no sort in req.query then sort it by createdAt as default
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryStr.fields) {
      // Include only query fields in response. eg: name,duration,difficulty, etc
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude -v from response
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    // PAGINATION
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatues;
