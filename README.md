# BLESSING STORE BETA

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) 
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) 
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) 
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) 
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) 
![Joi](https://img.shields.io/badge/Joi-007396?style=for-the-badge&logo=jest&logoColor=white) 
![Bcrypt.js](https://img.shields.io/badge/Bcrypt.js-004088?style=for-the-badge&logo=javascript&logoColor=white) 
![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white) 
![React Toastify](https://img.shields.io/badge/React%20Toastify-7B4AE2?style=for-the-badge&logo=react&logoColor=white) 
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) 
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) 
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) 
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) 
![VSCode](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7?style=for-the-badge&logo=visualstudiocode&logoColor=white) 
![XAMPP](https://img.shields.io/badge/XAMPP-FB7A24?style=for-the-badge&logo=xampp&logoColor=white) 
![Brave](https://img.shields.io/badge/Brave-FB542B?style=for-the-badge&logo=brave&logoColor=white)
 
---

## Descripción del proyecto

**Blessing Store** es una aplicación web de comercio electrónico (**e-commerce**) que permite a los usuarios explorar productos, agregarlos al carrito, marcar como favoritos y gestionar su perfil personal.  
La plataforma está construida con un enfoque **full stack** en el ecosistema JavaScript (Node.js + React).

![Captura de pantalla](./backend/public/images/img-01.png)


---

## ✨ Características

- **SPA** (Single Page Application) con **React 18**  
- **API RESTful** construida con **Express** + **Node.js**  
- Comunicación entre frontend y backend con **Axios**  
- Autenticación segura con **JWT** + middlewares de protección  
- Sistema de **Registro** e **Inicio de sesión**  
- **Favoritos** y **carrito de compras** persistente por usuario  
- **Rutas protegidas** para usuarios autenticados  
- Backend estructurado bajo el patrón **MVC** (Model - View - Controller)  
- Variables de entorno fácilmente configurables **(.env)**  

---

## 🛠️ Tecnologías utilizadas

### Backend

- **Node.js** + **Express.js**
- **MySQL** (conector mysql2)
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **dotenv** para configuración
- **joi** para validación
- **cookie-parser** y **cors**

### Frontend

- **React 18**
- **React Router DOM**
- **Axios** para consumo de API
- **React Toastify** para notificaciones
- **Vite** como herramienta de desarrollo
- **ESLint** como herramienta de linting

---

## 🏗️ Arquitectura del proyecto

El proyecto está estructurado en dos capas principales:

- **Backend (API RESTful)**: Sigue el patrón MVC.  
  Se compone de controladores, modelos, rutas y middlewares, permitiendo una gestión clara de la lógica de negocio.

- **Frontend (SPA)**: Basada en React + Vite.  
  Organizada en componentes reutilizables, páginas y contextos globales (Auth, Cart, Favorites).

---

## 📂 Estructura del proyecto

| Carpeta / Archivo  | Descripción                                       |
|--------------------|---------------------------------------------------|
| `/backend`         | API RESTful con Express, lógica de negocio (MVC)   |
| `/frontend`        | Aplicación React SPA (Single Page Application)    |
| `mydb.sql`         | Script de creación de la base de datos MySQL       |
| `README.md`        | Documentación del proyecto                         |

### **Backend:**  
Estructura modular siguiendo el patrón MVC:  
- Rutas  
- Controladores  
- Middlewares  
- Modelos

### **Frontend:**  
Estructura basada en:  
- Componentes reutilizables  
- Páginas dinámicas  
- Contextos globales (Context API)  
- Utilidades

---

##  ⚙️ Instalación y configuración

### Requisitos

- Contar con los recursos, tecnologias y herramientas mencionadas previamente.

### Instalación del Backend

```bash
cd backend
npm install
npm start
```

## Instalación Frontend

```bash
cd frontend
npm install
npm run dev
```
---

## 💾 Base de Datos

Importa el archivo `mydb.sql` en tu servidor MySQL.

Configura las credenciales en el archivo `.env` del backend.

---

## 💻 Uso del sistema

- Registro y autenticación de usuarios  
- Consulta de productos por categorías  
- Gestión de favoritos y carrito  
- Administración de perfil y pedidos  
- Navegación en páginas informativas

---

## ⚠️ Consideraciones

### Estado actual: Beta

- Aún sin panel de administración  

### Recomendaciones para producción: 

- Implementar HTTPS  
- Aplicar CORS más restrictivo  
- Almacenamiento de imágenes en la nube
---

##  📫 Contacto y créditos

Desarrollado por **Jhon Yara**  
Email: jhoncodecreator@gmail.com
