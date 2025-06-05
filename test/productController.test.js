jest.mock('../helpers/getEditProductForm', () => jest.fn(() => '<form>Formulario simulado</form>'));
jest.mock('../models/Product', () => {
  const mockSave = jest.fn();
  const mockProductConstructor = jest.fn(() => ({
    save: mockSave,
    _id: 'fakeid123', 
  }));

  mockProductConstructor.find = jest.fn();
  mockProductConstructor.findById = jest.fn();
  mockProductConstructor.findByIdAndUpdate = jest.fn();
  mockProductConstructor.findByIdAndDelete = jest.fn();
  mockProductConstructor.deleteMany = jest.fn();  

  return {
    Product: mockProductConstructor,
    sizes: ['S', 'M', 'L'],
    categories: ['Ropa', 'Accesorios'],
  };
});
jest.mock('../helpers/getEditProductForm', () => jest.fn());

const express  = require('express');
const request  = require('supertest');
const getEditProductForm  = require('../helpers/getEditProductForm');
const { Product, sizes, categories } = require('../models/Product');


const { 
showProducts,
showProductById,
showNewProduct,
createProduct,
showEditProduct,
updateProduct,
deleteProduct,
 } = require('../controllers/productController');
 
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  console.error.mockRestore();
});


 describe('GET /products', () => {
  const app = express();
  app.get('/products', showProducts);

  it('debería devolver una lista de productos', async () => {
    const mockProducts = [
      { name: 'Producto 1', category: 'Ropa' },
      { name: 'Producto 2', category: 'Accesorios' },
    ];
    Product.find.mockResolvedValue(mockProducts);

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(res.text).toContain('Productos');
    expect(res.text).toContain('Producto 1');
    expect(res.text).toContain('Producto 2');
  });

  it('debería manejar errores correctamente', async () => {
    Product.find.mockRejectedValue(new Error('Error de base de datos'));

    const res = await request(app).get('/products');

    expect(res.status).toBe(500);
    expect(res.text).toBe('Error al cargar productos');
  });
});


describe('GET /products/:productId', () => {
  const app = express();
  app.get('/products/:productId', showProductById);

  it('debería devolver un producto específico', async () => {
    const mockProduct = { _id: '123', name: 'Producto 1', category: 'Ropa' };
    Product.findById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/products/123');

    expect(res.status).toBe(200);
    expect(res.text).toContain('Producto 1');
  });

  it('debería devolver 404 si el producto no existe', async () => {
    Product.findById.mockResolvedValue(null);

    const res = await request(app).get('/products/999');

    expect(res.status).toBe(404);
    expect(res.text).toBe('Producto no encontrado');
  });

  it('debería manejar errores correctamente', async () => {
    Product.findById.mockRejectedValue(new Error('Error de base de datos'));

    const res = await request(app).get('/products/123');

    expect(res.status).toBe(500);
    expect(res.text).toBe('Error al cargar el producto');
  });
});


describe('PUT /dashboard/:productId', () => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.put('/dashboard/:productId', updateProduct);

  const productId = '123abc';

  it('debería actualizar un producto existente', async () => {
    const updatedProduct = {
  name: 'Producto actualizado',
  description: 'Descripción actualizada',
  category: 'Test actualizado',
  size: 'l',
  price: 150,
  image: ''  
};


    
    Product.findByIdAndUpdate.mockResolvedValue({
      _id: productId,
      ...updatedProduct
    });

    const res = await request(app)
      .put(`/dashboard/${productId}`)
      .send(updatedProduct);

    expect(res.status).toBe(302);  
    expect(res.headers.location).toBe('/dashboard');

    
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      expect.objectContaining(updatedProduct),
      { new: true }
    );
  });

  it('debería devolver 404 si el producto no existe', async () => {
    
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put(`/dashboard/${productId}`)
      .send({
        name: 'No existe',
        price: 10,
      });

    expect(res.status).toBe(404);
    expect(res.text).toBe('Producto no encontrado');
  });

  it('debería manejar errores correctamente', async () => {
    
    Product.findByIdAndUpdate.mockRejectedValue(new Error('Precio no válido'));

    const res = await request(app)
      .put(`/dashboard/${productId}`)
      .send({
        name: 'Error',
        price: 'no-numérico',
      });

    expect(res.status).toBe(400);
    expect(res.text).toBe('Precio no válido');
  });
});

describe('GET /new-product', () => {
   const app = express();
   const getProductForm = jest.fn(() => '<form></form>'); 
   app.get('/new-product', showNewProduct);
  it('debería devolver el formulario de nuevo producto', async () => {
    const res = await request(app).get('/new-product');

    expect(res.status).toBe(200);
    expect(res.text).toContain('<form');
    expect(res.text).toContain('name="category"');  
    expect(res.text).toContain('name="size"');      
  });
});



describe('showEditProduct', () => {
  const req = {
    params: { productId: '123' }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería enviar el formulario con el producto si existe', async () => {
    const product = {
      _id: '123',
      name: 'Producto Test',
      description: 'Descripción test',
      image: 'url',
      category: 'Accesorios',  // que coincida con categories
      size: 'm',              // que coincida con sizes
      price: 10
    };

    Product.findById = jest.fn().mockResolvedValue(product);
    getEditProductForm.mockReturnValueOnce('<form>Otro formulario</form>');

    await showEditProduct(req, res);

    expect(Product.findById).toHaveBeenCalledWith('123');
    expect(getEditProductForm).toHaveBeenCalledWith(product, categories, sizes);
   expect(res.send).toHaveBeenCalledWith('<form>Otro formulario</form>');

  });

  it('debería responder 404 si el producto no existe', async () => {
    Product.findById = jest.fn().mockResolvedValue(null);

    await showEditProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Producto no encontrado');
  });

  it('debería responder 500 ante un error', async () => {
    Product.findById = jest.fn().mockRejectedValue(new Error('Error DB'));

    await showEditProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error al cargar producto');
  });
});
