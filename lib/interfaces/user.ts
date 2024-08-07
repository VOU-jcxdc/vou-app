interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  bucketId: string | null;
  createdOn: string;
  updatedOn: string;
  deletedOn: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  info: {
    id: string;
    gender: string;
    dob: string;
    accountId: string;
  };
}

export { User };
