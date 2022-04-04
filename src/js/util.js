import bcrypt from 'bcrypt';

// Hash Password
const generatePassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);

  console.log('hash', hash);

  return hash;
};

//compare password
const comparePassword = async (inputPw, dbPw) => {
  return await bcrypt.compare(inputPw, dbPw);
};

export { generatePassword, comparePassword };
