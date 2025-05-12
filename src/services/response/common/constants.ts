export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const RESPONSE_MESSAGES = {
  BAD_REQUEST: 'Bad Request',
  NOT_FOUND: 'Not Found',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

export const HEADERS = {
  CONTENT: {
    JSON: { headerName: 'Content-Type', headerValue: 'application/json' },
    TEXT: { headerName: 'Content-Type', headerValue: 'text/plain' },
  },
};
