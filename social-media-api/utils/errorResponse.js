//utils/errorResponse.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

MediaSourceHandle.exports = ErrorResponse;