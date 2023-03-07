const  UserModel  = require("./userModel");

describe("UserModel", () => {
  beforeAll(() => {
    //return UserModel.constructor.createTable();
    
  });

  it("cria novo usuario", async () => {
    
    const userData = { nome: 'Fulano', cpf_cnpj: '12345678901', email: 'fulano1@example.com', senha: '123456' };

    const newUser = await UserModel.create(userData);
    //expect(newUser.id).toBeDefined();
    expect(newUser.nome).toBe(userData.nome);
    expect(newUser.email).toBe(userData.email);
    expect(newUser.cpf_cnpj).toBe(userData.cpf_cnpj);
    expect(newUser.senha).toBe(userData.senha);
  });

  it("consulta por email", async () => {
    const userData = { nome: 'Fulano', cpf_cnpj: '12345678901', email: 'fulano1@example.com', senha: '123456' };

    //const newUser = await UserModel.create(userData);
    //const foundUser = await UserModel.findByEmail(newUser.email);
    const foundUser = await UserModel.findByEmail('fulano1@example.com');
    
   // expect(foundUser.id).toBe(newUser.id);
    expect(foundUser.nome).toBe(userData.nome);
    expect(foundUser.email).toBe(userData.email);
    expect(foundUser.cpf_cnpj).toBe(userData.cpf_cnpj);
  });

  it(" email inexistente", async () => {
    const foundUser = await UserModel.findByEmail("nonexistent.user@example.com");
    expect(foundUser).toBeNull();
  });

  it("consulta por ID", async () => {
    const userData = { nome: 'Fulano', cpf_cnpj: '12345678903', email: 'fulano3@example.com', senha: '123456' };

    //const newUser = await UserModel.create(userData);
    const foundUser = await UserModel.findById(1);
   
    //expect(foundUser.id).toBe(newUser.id);
    expect(foundUser.nome).toBe(newUser.nome);
    expect(foundUser.email).toBe(newUser.email);
    expect(foundUser.cpf_cnpj).toBe(newUser.cpf_cnpj);
  });

  it("consulta nao existente  ID de usuario", async () => {
    const foundUser = await UserModel.findById(999);
    expect(foundUser).toBeNull();
  });
});
