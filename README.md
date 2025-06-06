# PROYECT-BREAK-FULLBACKEND
Creacion de API para una Tienda de ropa
# 👕 Tienda de Ropa Online

Amason es una aplicación web construida con Node.js, Express y MongoDB que permite gestionar una tienda de ropa desde el lado del cliente y del administrador. Además, incluye una API REST, autenticación, subida de imágenes a Cloudinary, tests automáticos y documentación con Swagger.

---

## 🧩 Funcionalidades

- 📄 Vistas HTML dinámicas (SSR) para usuarios y administradores.
- 🛍️ Catálogo de productos filtrado por categoría.
- 🔐 Sistema de autenticación para acceder al dashboard.
- 🧾 API REST pública y privada (requiere autenticación).
- ☁️ Subida de imágenes a Cloudinary.
- 🧪 Tests con Jest y Supertest.
- 📚 Documentación Swagger.

---

## 📦 Instalación

1. Clona este repositorio:

```bash
git https://github.com/MFlor-PD/PROYECT-BREAK-FULLBACKEND
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env

MONGO_URI=
ADMIN_USER=
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🚀 Uso

Para iniciar la aplicación en desarrollo:

```bash
npm run dev
```

O en producción:

```bash
npm start
```

La aplicación se ejecutará en:  
👉 http://localhost:3000

---

## 🧑‍💼 Acceso al Dashboard (Rutas protegidas)

Para acceder al panel de administración:

1. Accede a `/login`.
2. Usa las credenciales definidas en `.env`:
   - **Usuario**: `ADMIN_USER`
   - **Contraseña**: `ADMIN_PASSWORD`

Una vez logueado podrás:
- Ver todos los productos
- Crear nuevos
- Editarlos o eliminarlos

---

## 📂 Estructura del Proyecto

```
├── config
│   └── db.js
│   └── cloudinary.js
├── controllers
│   ├── productController.js
|   ├── productApiControllers.js
│   └── authController.js
├── models
│   └── Product.js
├── routes
│   ├── productRoutes.js
|   ├── productApiRoutes.js
│   └── authRoutes.js
├── middlewares
|   ├── uploadMiddlewares.js
│   └── authMiddleware.js    
├── helpers
│   ├── baseHtml.js
|   ├── getEditProductForm.js
|   ├── getNavBar.js
│   ├── getProductCards.js
|   ├── getProductDetails.js
│   └── getProductForm.js
├── test
│   ├── productController.test.js
|   └──POST.test.js
├── docs
│   └── swagger.json
├── index.js
├── .env
└── README.md
```

---

## 🧠 API REST (Bonus)

Puedes acceder a la API en:

```
GET     /api/products
GET     /api/products/:id
POST    /api/products (auth)
PUT     /api/products/:id (auth)
DELETE  /api/products/:id (auth)
```

> Las rutas protegidas requieren autenticación básica.

---

## 🧪 Tests

Para ejecutar los tests automáticos:

```bash
npm test
```

Incluye pruebas unitarias y de integración para los controladores y rutas.

---

## 📚 Documentación Swagger (Bonus)

Una vez ejecutada la app, visita:

```
http://localhost:3000/api-docs
```

Ahí encontrarás toda la documentación interactiva de la API.

---

## 🛠️ Tecnologías Usadas

- Node.js
- Express
- MongoDB + Mongoose
- Cloudinary (subida de imágenes)
- HTML + CSS (SSR)
- Multer (upload middleware)
- Jest + Supertest (tests)
- Swagger (documentación de API)
- Dotenv (variables de entorno)

---

## 🧵 Autor

Desarrollado por [Florencia](https://github.com/MFlor-PD/PROYECT-BREAK-FULLBACKEND)
