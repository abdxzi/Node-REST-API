# Node-REST-API
A Simple Node+MySQL API For Library book managment.
It stores id,name,author,reviews of books in mysql database

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

### Usage
**1. To list all books**

```bash
/api/listBooks
```
output:
```
{
    "books": {
        "1": {
            "name": "book1",
            "author": "author1",
            "review": [
                "reviw1",
                "review2"
            ]
        },
        "2": {
            "name": "book2",
            "author": "author2",
            ...................
            ...................
     }
}
```

**2. Get details about a book**
```bash
/api/book/[bookId]
```
output:
```json
{
    "1": {
        "name": "book1",
        "author": "book2",
        "review": [
            "review1",
            "review2"
        ]
    }
}
```

**3. Add a book to the database**

_**PUT** request with following parameters_ :
  * **name**   - unique name for the book
  * **author** - author of the book
  * **review** - first review of the book (optional)

```bash
/api/addBook
```
Fails if book already exists


**4. Delete a book from database**

_**DELETE** request with **id** parameter_

```bash
/api/deleteBook/[bookId]
```

**5. Add a review for a book**

_**POST** request with following parameters_ :
  * **id**     - id of the book
  * **review** - review of the book

```bash
/api/addReview
```

**6. Edit details about a book**

_**POST** request with following parameters_ :
  * **id**       - id of the book
  * **property** - property of book to be changed. takes 'name','author','review' as values.
  * **newValue** - new value for the property
  * **reviewId** - index of specific review of a book (optional)
```bash
/api/editBook
```

### Error handling

On error api will return http error codes and error. Example:

```json
{
    "code": 404,
    "err": "not found"
}
```

Note : request header must be ```Content-Type: application/x-www-form-urlencoded```

## License
[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)