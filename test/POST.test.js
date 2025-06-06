const mockSave = jest.fn();

jest.mock('../models/Product', () => {
  const mockConstructor = jest.fn().mockImplementation(function () {
    this._id = 'fakeid123';
    this.save = mockSave;
    return this;
  });

  mockConstructor.findByIdAndDelete = jest.fn();
  mockConstructor.deleteMany = jest.fn();

  return {
    Product: mockConstructor,
    sizes: ['S', 'M', 'L'],
    categories: ['camisetas', 'pantalones', 'zapatillas', 'accesorios'],
    _mockSave: mockSave
  };
});

jest.mock('../helpers/getEditProductForm', () => jest.fn());

const { Product, sizes, categories, _mockSave } = require('../models/Product');
const { createProduct } = require('../controllers/productController');


jest.spyOn(console, 'error').mockImplementation(() => {});

describe('createProduct', () => {
  const baseReqBody = {
    name: 'Producto Test',
    description: 'Descripción test',
    category: 'camisetas',
    size: 'M',
    price: '100'
  };

  let req, res;

  function makeReqRes(overrides = {}) {
    return {
      req: {
        body: { ...baseReqBody, ...(overrides.body || {}) },
        file: overrides.file || { path: 'ruta/a/imagen.jpg' }
      },
      res: {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        redirect: jest.fn()
      }
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockSave.mockResolvedValue({ _id: 'fakeid123' });
  });

  it('debería crear un nuevo producto y redirigir al dashboard', async () => {
    ({ req, res } = makeReqRes());
    await createProduct(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/dashboard/fakeid123');
  });

  it('debería responder con error si la categoría no es válida', async () => {
    ({ req, res } = makeReqRes({ body: { category: 'Invalida' }, file: null }));
    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Categoría no válida');
  });

  it('debería responder con error si el talle no es válido', async () => {
    ({ req, res } = makeReqRes({ body: { size: 'xl' }, file: null }));
    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Talle no válido');
  });

  it('debería responder con error si el precio no es un número', async () => {
    ({ req, res } = makeReqRes({ body: { price: 'no-numérico' }, file: null }));
    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Precio no válido');
  });

  it('debería manejar errores al crear el producto', async () => {
    ({ req, res } = makeReqRes({ file: null }));

    const errorMockSave = jest.fn().mockRejectedValue(new Error('Error DB'));
    Product.mockImplementation(() => ({
      save: errorMockSave
    }));

    await createProduct(req, res);

    expect(errorMockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error al crear el producto');
  });
});


afterAll(() => {
  console.error.mockRestore();
});
