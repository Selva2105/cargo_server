class Apifeatures {
    constructor(query, queryStr) {
        // === this query will hold ModelName.find({}) === //
        this.query = query;

        // === this queryStr will hold req.query === //
        this.queryStr = queryStr;

        // === this queryObj will hold req.query shallow copy === //
        this.queryObj = { ...queryStr }

        // === this loop will remove the filters and give the query string alone === //
        const excludeFields = ['sort', 'page', 'limit', 'fields'];
        excludeFields.forEach((ele) => {
            delete this.queryObj[ele];
        });
    }

    filter() {
        // 1. to add $ infront of operators[gte,lte,eq,lt,gt] convert it to string add the $ symbol and again parse it to JSON obj
        let queryString = JSON.stringify(this.queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`);
        const finalQueryObj = JSON.parse(queryString);

        // 2. Convert this to a query
        this.query = this.query.find(finalQueryObj);

        return this;
    }

    sort() {
        // 3. Sort the result
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    limitFields() {
        // 4. Limit fields by fields name 
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        return this;
    }

    pagenate() {
        // 5. Paginating the result to convert string to number *1
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        // PAGE 1: 1 - 10[skip : 0]; 2 : 11 - 20[skip : 10]
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)

        // 6. If user ask the page which is not present throw the error
        // if (this.queryStr.page) {
        //     const parkingCount = await Parking.countDocuments();
        //     if (skip >= parkingCount) {
        //         const error = new CustomError('Page not found', 404);
        //         return next(error)
        //     }
        // }

        return this;
    }
}

module.exports = Apifeatures;