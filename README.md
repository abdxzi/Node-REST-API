# Node-REST-API
A Simple Node+MySQL API For Library book managment.
It stores id,name,author,reviews of books in mysql database and manage the database using sequelize module.

## Installation

```bash
git clone https://github.com/zix00/Node-REST-API.git
npm install
```
To start nodeAPI run:

```bash
node nodeAPI.js
```

## Documentation

### API ENTRY POINTS

**1. /api/book**

| Method | API POINT         | Usage                       | parameters                           |
| ------ | ----------------- | --------------------------- | ------------------------------------ |
| GET    | /book             | Get all Books               |                                      |
| GET    | /book?authorID=x  | Get All Books of authorID x |                                      |
| GET    | /book?:id         | Get one Book                |                                      |
| POST   | /book             | Create Book                 | title*, author*, description, review |
| PUT    | /book/:id         | Update Book                 | title*, description*                 |
| DELETE | /book/:id         | Delete Book                 |                                      |

**2. /api/author**

| Method | API POINT         | Usage                       | parameters                           |
| ------ | ----------------- | --------------------------- | ------------------------------------ |
| GET    | /author           | Get all Authors             |                                      |
| GET    | /author?:id       | Get one Author              |                                      |
| POST   | /author           | Create Author               | author*                              |
| PUT    | /author/:id       | Update Author               | author*                              |
| DELETE | /author/:id       | Delete Author               |                                      |

**3. /api/review**

| Method | API POINT          | Usage                         | parameters                           |
| ------ | ------------------ | ----------------------------- | ------------------------------------ |
| GET    | /review            | Get all Reviews               |                                      |
| GET    | /review?bookID=x   | Get All Reviews of authorID x |                                      |
| GET    | /review?:id        | Get one Review                |                                      |
| POST   | /review            | Create Review                 | bookID*, review*                     |
| PUT    | /review/:id        | Update Review                 | review*                              |
| DELETE | /review/:id        | Delete Review                 |                                      |

\* mandatory parameters

### Error handling

On error api will return http error codes and error message. Example:

```json
{
    "message": "not found"
}
```

Note : request header must be ```Content-Type: application/x-www-form-urlencoded```

## License
[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)
