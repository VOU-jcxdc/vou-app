enum Gender {
  FEMALE = 'female',
  MALE = 'male',
}

enum Role {
  ADMIN = 'admin',
  PLAYER = 'player',
}

enum StatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export { Gender, Role, StatusCode };
