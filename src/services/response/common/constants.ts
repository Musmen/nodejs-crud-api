export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

export const RESPONSE_MESSAGES = {
  BAD_REQUEST: 'Bad request',
  NOT_FOUND: 'Not found',
};

export const HEADERS = {
  CONTENT: {
    JSON: { headerName: 'Content-Type', headerValue: 'application/json' },
    TEXT: { headerName: 'Content-Type', headerValue: 'text/plain' },
  },
};
