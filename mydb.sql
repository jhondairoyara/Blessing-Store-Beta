-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mydb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cambio_direccion_entrega`
--

CREATE TABLE `cambio_direccion_entrega` (
  `Id_Direccion` int(11) NOT NULL,
  `Direccion_Envio` varchar(150) NOT NULL,
  `Id_Ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `Id_Carrito` int(11) NOT NULL,
  `Id_Usuario` int(11) NOT NULL,
  `Tiempo_Creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`Id_Carrito`, `Id_Usuario`, `Tiempo_Creacion`) VALUES
(1, 1, '2025-06-15 11:19:38'),
(2, 3, '2025-06-21 08:20:37'),
(3, 7, '2025-06-21 21:35:27'),
(4, 8, '2025-06-23 18:03:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `Id_Categoria` int(11) NOT NULL,
  `Nombre_Cat` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`Id_Categoria`, `Nombre_Cat`) VALUES
(1, 'Hombre'),
(2, 'Mujer'),
(3, 'Niños/as'),
(4, 'Bebes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `Id_Ciudad` int(11) NOT NULL,
  `Nom_Ciudad` varchar(100) NOT NULL,
  `Id_Departamento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`Id_Ciudad`, `Nom_Ciudad`, `Id_Departamento`) VALUES
(21, 'Leticia', 1),
(22, 'Medellín', 2),
(23, 'Arauca', 3),
(24, 'Barranquilla', 4),
(25, 'Cartagena', 5),
(26, 'Tunja', 6),
(27, 'Manizales', 7),
(28, 'Florencia', 8),
(29, 'Yopal', 9),
(30, 'Popayán', 10),
(31, 'Valledupar', 11),
(32, 'Quibdó', 12),
(33, 'Montería', 13),
(34, 'Bogotá', 14),
(35, 'San José del Guaviare', 15),
(36, 'Inírida', 16),
(37, 'Neiva', 17),
(38, 'Riohacha', 18),
(39, 'Santa Marta', 19),
(40, 'Villavicencio', 20),
(41, 'Pasto', 21),
(42, 'Cúcuta', 22),
(43, 'Mocoa', 23),
(44, 'Armenia', 24),
(45, 'Pereira', 25),
(46, 'San Andrés', 26),
(47, 'Bucaramanga', 27),
(48, 'Sincelejo', 28),
(49, 'Ibagué', 29),
(50, 'Cali', 30),
(51, 'Mitú', 31),
(52, 'Puerto Carreño', 32);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta`
--

CREATE TABLE `cuenta` (
  `Id_Cuenta` int(11) NOT NULL,
  `Id_Usuario` int(11) NOT NULL,
  `Correo_Electronico` varchar(100) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Fecha_Registro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `cuenta`
--

INSERT INTO `cuenta` (`Id_Cuenta`, `Id_Usuario`, `Correo_Electronico`, `Contraseña`, `Fecha_Registro`) VALUES
(1, 1, 'juan123@gmail.com', '$2b$10$uzPPJ93D7Q.n0c6If3kNTunUQtMFLPf9DIfcX6j9BdkdCBR4DrF0.', '2025-06-14 16:18:02'),
(2, 2, 'paula123@gmail.com', '$2b$10$0/Ii4mNnWvTF8JQNSR.sheqF7hg7pqdxI9rVJbxCIo5.esvrpZ4Vy', '2025-06-15 21:21:32'),
(3, 3, 'luis123@gmail.com', '$2b$10$rpuz2SXw.3YgRbbGf3Qis.f5O.Kf8ysNg93rWwjRfl/UYiSqllZIy', '2025-06-17 19:43:57'),
(4, 4, 'pablo123@gmail.com', '$2b$10$JvS/d8Bi52MKxRVZaT3oJucPPNLyceAPFXWdZtjnz1/qPdP0iK0w.', '2025-06-18 06:41:45'),
(5, 5, 'carlos123@gmail.com', '$2b$10$ejk45hkHjXEGqoHhrkzTK.vrqY1j9rGX6KWRZNCci9E7GBxRGmLPy', '2025-06-18 07:01:03'),
(6, 6, 'laura123@gmail.com', '$2b$10$a.6EmmZN5vI94mojyXQkJudjA0yLs2gnh1MD428moSM42kYa9nrH.', '2025-06-18 07:19:32'),
(7, 7, 'jhon123@gmail.com', '$2b$10$hEcDDY6Cs2.OqjJj2R27mO5qKjeY5j41kW1FGe10yC56D3p9tRB3a', '2025-06-21 21:35:01'),
(8, 8, 'paola123@gmail.com', '$2b$10$z44oP/vkehnFZxQtQ1Gh8OFkZANXoUf8xqiT/sKHW1VYk4duhcMh6', '2025-06-23 18:03:19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `Id_Departamento` int(11) NOT NULL,
  `Nom_Departamento` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `departamento`
--

INSERT INTO `departamento` (`Id_Departamento`, `Nom_Departamento`) VALUES
(1, 'Amazonas'),
(2, 'Antioquia'),
(3, 'Arauca'),
(4, 'Atlántico'),
(5, 'Bolívar'),
(6, 'Boyacá'),
(7, 'Caldas'),
(8, 'Caquetá'),
(9, 'Casanare'),
(10, 'Cauca'),
(11, 'Cesar'),
(12, 'Chocó'),
(13, 'Córdoba'),
(14, 'Cundinamarca'),
(15, 'Guaviare'),
(16, 'Guainía'),
(17, 'Huila'),
(18, 'La Guajira'),
(19, 'Magdalena'),
(20, 'Meta'),
(21, 'Nariño'),
(22, 'Norte de Santander'),
(23, 'Putumayo'),
(24, 'Quindío'),
(25, 'Risaralda'),
(26, 'San Andrés y Providencia'),
(27, 'Santander'),
(28, 'Sucre'),
(29, 'Tolima'),
(30, 'Valle del Cauca'),
(31, 'Vaupés'),
(32, 'Vichada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_carrito`
--

CREATE TABLE `detalles_carrito` (
  `Id_Carrito` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Cantidad` tinyint(4) NOT NULL,
  `Precio_Unitario_Al_Momento` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Id_Talla` int(11) NOT NULL,
  `Color_Seleccionado` varchar(50) NOT NULL,
  `Fecha_Adicion` timestamp NOT NULL DEFAULT current_timestamp(),
  `Fecha_Actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `detalles_carrito`
--

INSERT INTO `detalles_carrito` (`Id_Carrito`, `Id_Producto`, `Cantidad`, `Precio_Unitario_Al_Momento`, `Id_Talla`, `Color_Seleccionado`, `Fecha_Adicion`, `Fecha_Actualizacion`) VALUES
(3, 1, 1, 82650.00, 3, 'Khaki', '2025-06-22 02:36:49', '2025-06-22 02:36:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `Id_Detalle_Pedido` int(11) NOT NULL,
  `Id_Pedido` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Cantidad` tinyint(4) NOT NULL,
  `Precio_Unitario_Al_Momento` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envio`
--

CREATE TABLE `envio` (
  `Id_Envio` int(11) NOT NULL,
  `Id_Pedido` int(11) NOT NULL,
  `Id_Direccion` int(11) NOT NULL,
  `Fecha_Envio` date NOT NULL,
  `Fecha_Entrega` date NOT NULL,
  `Id_Estado_Envio` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_envio`
--

CREATE TABLE `estado_envio` (
  `Id_Estado_Envio` tinyint(4) NOT NULL,
  `Estado_Envio` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pago`
--

CREATE TABLE `estado_pago` (
  `Id_Estado_Pago` tinyint(4) NOT NULL,
  `Estado_Pago` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pedido`
--

CREATE TABLE `estado_pedido` (
  `Id_Estado_Pedido` tinyint(4) NOT NULL,
  `Nombre_Estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `Id_Favorito` int(11) NOT NULL,
  `Id_Usuario` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Fecha_Agregado` timestamp NOT NULL DEFAULT current_timestamp(),
  `Id_Talla` int(11) DEFAULT NULL,
  `Color_Seleccionado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`Id_Favorito`, `Id_Usuario`, `Id_Producto`, `Fecha_Agregado`, `Id_Talla`, `Color_Seleccionado`) VALUES
(46, 3, 2, '2025-06-23 15:20:14', 5, 'Negro'),
(47, 3, 19, '2025-06-23 17:16:00', 4, 'Azul'),
(48, 3, 2, '2025-06-23 17:16:29', 1, 'Azul');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `Id_Met_Pago` tinyint(4) NOT NULL,
  `Metodo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `Id_Pago` int(11) NOT NULL,
  `Id_Pedido` int(11) NOT NULL,
  `Id_Met_Pago` tinyint(4) NOT NULL,
  `Limite_Tiempo_Pago` datetime NOT NULL,
  `Tiempo_Pago` datetime NOT NULL,
  `Id_Estado_Pago` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `Id_Pedido` int(11) NOT NULL,
  `Id_Carrito` int(11) NOT NULL,
  `Tiempo_Pedido` datetime NOT NULL,
  `Id_Estado_Pedido` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `Id_Producto` int(11) NOT NULL,
  `Id_Categoria` int(11) NOT NULL,
  `Nombre_Producto` varchar(100) NOT NULL,
  `Descripcion` text NOT NULL,
  `Caracteristicas_Principales` text DEFAULT NULL,
  `Precio_Unitario` decimal(10,2) NOT NULL,
  `Porcentaje_Descuento` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`Id_Producto`, `Id_Categoria`, `Nombre_Producto`, `Descripcion`, `Caracteristicas_Principales`, `Precio_Unitario`, `Porcentaje_Descuento`) VALUES
(1, 1, 'Hoodie Buzo con cremallera Algodón Perchado 280Gr Seven One - Hombre', 'Buso fabricado en algodón perchado nacional PAT PRIMO tipo MONACO de 280gr con excelente calidad, ideal para todo momento.', 'Bolsillo frontal tipo canguro., Forro de capota y cordón multicolor., Costuras con pespunte., Algodón perchado de alta densidad.', 82650.00, 20.00),
(2, 1, 'Polo hamer con bolsillo - Hombre', 'Equipada con un bolsillo de tamaño perfecto en el frente, la Polo HAMER se convierte en el aliado principal para tener las cosas a la mano. Fabricadas en tela polialgodón y con todos los procesos de calidad, estamos orgullos de que éstas tipo polo son elaboradas 100% por manos Colombianas.', 'Elaborada en tela lacoste, Tipo de tela: 65% poliéster 35% algodón, Tipo de Manga: Corta, Tipo de Cierre: Botones, Silueta semi recta, Producto 100% Colombiano', 31900.00, 10.00),
(3, 1, 'Buzo de Algodón Bearcliff - Hombre', 'Disfruta de la comodidad y el estilo durante todo el año con esta prenda de vestir casual, ideal para cualquier ocasión. Confeccionada con una suave mezcla de algodón (60%) y poliéster (40%), ofrece una sensación agradable al tacto y una excelente durabilidad. Su diseño de manga larga y estilo versátil la convierten en una opción perfecta para usar en cualquier temporada, ya sea sola o como parte de un conjunto en capas. Ideal para quienes buscan un look relajado sin sacrificar estilo ni confort.', 'Material de vestuario: Algodón, Composición: 60%Algodón,40%Poliéster, Estilo de vestuario: Casual, Largo de mangas: Manga larga, Temporada: Toda temporada', 89990.00, 10.00),
(4, 1, 'Pijama manga corta de cuadros de algodón benetton - Hombre', 'Descubre el pijama de manga corta de cuadros de algodón de Benetton. Su diseño clásico y cómodo lo convierte en la opción ideal para tus noches de descanso. Perfecto para disfrutar de un estilo relajado en casa.', 'Condición del producto: Nuevo, Diseño: Cuadros, Modo de fabricación: Industrial, Componentes: Parte Superior + Parte Inferior', 119990.00, 10.00),
(5, 1, 'Camiseta manga corta algodón 100 - Hombre', 'Camiseta 100% algodón peinado, con excelente confección nacional y costura lateral que garantiza un ajuste cómodo para todos. Su tela de 160 g/m² es suave, fresca y no se encoge ni se estira. Ideal para cualquier clima y ocasión, sin etiquetas ni marquillas para mayor confort.', '100% algodón peinado, Costura lateral y horma adecuada para todos, Excelentes acabados y por sus rigurosos procesos de confección y control de calidad, A diferencia de otras camisetas en el mercado, no se encogen ni se estiran, Industria nacional. Hecha en Colombia 100%, Prenda versátil que puedes usar cómodamente en tu casa o fuera de ella, Material apto para todo tipo de clima, Textura suave y sensación fresca, Sin marcas, etiquetas o marquillas, Gramaje de la tela es de 160 g/m2', 30900.00, 10.00),
(6, 1, 'Camiseta manga corta algodón 75 - Hombre', 'Camiseta 75% algodón peinado, con excelente confección nacional y costura lateral que garantiza un ajuste cómodo para todos. Su tela de 160 g/m² es suave, fresca y no se encoge ni se estira. Ideal para cualquier clima y ocasión, sin etiquetas ni marquillas para mayor confort.', '75% algodón peinado, Costura lateral y horma adecuada para todos, Excelentes acabados y por sus rigurosos procesos de confección y control de calidad, A diferencia de otras camisetas en el mercado, no se encogen ni se estiran, Industria nacional. Hecha en Colombia 100%, Prenda versátil que puedes usar cómodamente en tu casa o fuera de ella, Material apto para todo tipo de clima, Textura suave y sensación fresca, Sin marcas, etiquetas o marquillas, Gramaje de la tela es de 160 g/m2', 25900.00, 10.00),
(7, 1, 'KOAJ Buzo con capota - Hombre', 'Buzo con capota para hombre en tono unicolor tiene puños y ruedo en rib, cordón para anudar, bolsillo delantero, diseño minimalista de skate en frente y un fit ligeramente ajustado. Deja que el estilo versátil de esta prenda complemente tu look, combínala con tu mejor jean Koaj y luce a la moda en todos tus planes.', 'Tipo: Buzo con capota, Género: Hombre, Fit: Slim fit (ajuste ligeramente entallado), Diseño: Unicolor con gráfico minimalista de skate al frente, Puños y ruedo en rib, Cordón ajustable en la capucha, Bolsillo delantero tipo canguro, Cierre: Sin cierre, Material del forro: Algodón, Estilo: Casual y versátil, ideal para combinar con jeans, Condición: Producto nuevo', 69900.00, 10.00),
(8, 1, 'Leo Jean silueta slim - Hombre', 'Este jean es el básico de todo armario. Es slim y cuenta con tiro medio, perilla y bolsillos funcionales con detalles desgastados de diseño en frente y posterior. Combínalo con nuestras camisas y camisetas y tendrás muchos looks increibles. Lavar a mano temperatura máxima 40°C. Lavar con colores similares. No usar blanqueador. No retorcer ni exprimir. Secado en tendedero en la sombra. No planchar. No limpieza en seco.', 'Tipo: Jeans, Género: Hombre, Fit: Slim (ajuste moderno y estilizado), Composición: 76% algodón, 22% poliéster, 2% elastano, Material principal: Algodón, País de origen: Colombia, Condición: Producto nuevo', 149990.00, 10.00),
(9, 2, 'Hoodie Buzo con cremallera Algodón Perchado 280Gr Seven One - Mujer', 'Buso fabricado en algodón perchado nacional PAT PRIMO tipo MONACO de 280gr con excelente calidad, ideal para todo momento.', 'Bolsillo frontal tipo canguro., Forro de capota y cordón multicolor., Costuras con pespunte., Algodón perchado de alta densidad.', 82650.00, 10.00),
(10, 2, 'Blusa manga larga - Mujer', 'Hermosa blusa manga larga con hombros altos, elaborada en licra, ideal para cualquier ocasión.', 'Tipo: Blusa de manga larga, Fit: Slim fit (ajuste ceñido al cuerpo), Composición: Licra (material principal: poliéster), Modelo: Blusa hombros anchos, Género: Mujer, País de origen: Colombia, Condición del producto: Nuevo', 38000.00, 10.00),
(11, 2, 'Vestido largo BASEMENT - Mujer', 'Este vestido largo de mujer de la marca Basement combina estilo y confort gracias a su confección en una mezcla de viscosa, nylon y spandex. Su diseño de fit ajustado realza la silueta, convirtiéndolo en una opción ideal para lucir elegante en cualquier temporada. Hecho en Colombia con materiales de calidad, es una prenda versátil que se adapta a múltiples ocasiones, desde eventos casuales hasta salidas más formales.', 'Tipo: Vestido largo para mujer, Fit: Ajustado, Composición: 68% rayon siro, 28% nylon, 4% spandex, Material principal: Viscosa, Marca: Basement, Temporada: Toda temporada, Hecho en: Colombia', 139990.00, 10.00),
(12, 2, 'Chaqueta acolchada University club - Mujer', 'Chaqueta acolchada para mujer de University Club, diseñada con un corte recto y confeccionada en 100% poliamida para brindar ligereza y protección. Su diseño con cuello alto, cierre de cremallera y mangas largas la convierte en una prenda exterior ideal para cualquier temporada. Perfecta para un look casual, esta chaqueta combina funcionalidad y estilo, adaptándose cómodamente a tu día a día.', 'Tipo: Chaqueta acolchada de mujer, Fit: Recto, Composición: 100% poliamida, Diseño: Acolchado con cuello alto, Tipo de cierre: Cremallera, Temporada: Toda temporada, Marca: University Club', 97990.00, 10.00),
(13, 2, 'Vestido corto Sybilla - Mujer', 'Descubre el vestido corto Sybilla, disponible en verde, blanco y beige. Diseñado para resaltar tu estilo, este vestido combina comodidad y sofisticación. Ideal para cualquier ocasión, su versatilidad te permitirá crear looks únicos y frescos. Dale un giro a tu guardarropa con esta prenda imprescindible.', 'Tipo: Vestido corto sin mangas, Fit: Recto, Composición: 100% viscosa, Diseño: Liso, Segmento: Juvenil, Temporada: Toda temporada, Hecho en: Colombia', 74990.00, 10.00),
(14, 2, 'Chaqueta con estampado de algodón SIXXTA x SYBILLA - Mujer', 'Chaqueta para mujer de la colección SIXXTA x SYBILLA, con un diseño estampado moderno y juvenil. Confeccionada en 100% algodón, ofrece un fit recto y cómodo, ideal para usar como prenda exterior durante cualquier temporada. Su cierre con botones y mangas largas le dan un toque versátil que combina estilo y funcionalidad. Hecha en Colombia con confección industrial de alta calidad.', 'Tipo: Chaqueta estampada para mujer, Fit: Recto, Composición: 100% algodón, Diseño: Estampado, con manga larga, Tipo de cierre: Botón, Temporada: Toda temporada, Marca: SIXXTA x SYBILLA', 175990.00, 10.00),
(15, 2, 'Pantalón wide leg tiro alto SIXXTA x SYBILLA - Mujer', 'Pantalón para mujer de la colección SIXXTA x SYBILLA, diseñado con corte wide leg y tiro alto, ideal para un look casual y moderno. Confeccionado en 100% acrílico, ofrece una textura liviana y una silueta amplia que brinda comodidad durante todo el día. Perfecto como prenda exterior para cualquier temporada, es una opción versátil para el guardarropa femenino contemporáneo. Hecho en Colombia con calidad industrial.', 'Tipo: Pantalón wide leg para mujer, Fit: Wide leg, tiro alto, Composición: 100% acrílico, Diseño: Liso, estilo casual, Temporada: Toda temporada, Marca: SIXXTA x SYBILLA, Hecho en: Colombia', 119990.00, 10.00),
(16, 2, 'Jean Wide leg tiro alto SIXXTA x SYBILLA - Mujer', 'Jean para mujer de la línea SIXXTA x SYBILLA, diseñado con un corte wide leg y tiro alto que ofrece una silueta moderna y favorecedora. Confeccionado en 100% algodón, proporciona una textura firme y cómoda, ideal para outfits casuales en cualquier temporada. Una prenda versátil hecha en Colombia, perfecta para quienes buscan estilo sin sacrificar confort.', 'Tipo: Jean wide leg para mujer, Fit: Wide leg, tiro alto, Composición: 100% algodón, Estilo: Casual, Temporada: Toda temporada, Marca: SIXXTA x SYBILLA, Hecho en: Colombia', 143990.00, 10.00),
(17, 2, 'Jean recto tiro alto SIXXTA x SYBILLA - Mujer', 'Jean para mujer de la colección SIXXTA x SYBILLA, con un diseño de corte recto y tiro alto, ideal para un estilo casual y atemporal. Confeccionado en 100% algodón, ofrece una textura resistente y cómoda para el uso diario. Hecho en Colombia, este jean es una prenda versátil que combina fácilmente con cualquier look y se adapta a todas las temporadas.', 'Tipo: Jean recto para mujer, Fit: Recto, tiro alto, Composición: 100% algodón, Estilo: Casual, Temporada: Toda temporada, Marca: SIXXTA x SYBILLA, Hecho en: Colombia', 135990.00, 10.00),
(18, 2, 'Leggings Nike - Mujer', 'Los leggings Nike Sportswear Essential Futura para mujer son una prenda cómoda y versátil, ideal para el uso diario o actividades deportivas de bajo impacto. Confeccionados en un tejido elástico que proporciona un ajuste ceñido y favorecedor, presentan un diseño de tiro alto para mayor cobertura y soporte. Llevan el icónico logo de Nike estampado en la parte inferior de la pierna izquierda, añadiendo un toque deportivo y reconocible. Son perfectos para combinar con camisetas, sudaderas o tops deportivos.', 'Tipo: Leggings para mujer, Composición: Tejido elástico (mezcla de algodón y spandex), Diseño: Tiro alto, ajuste ceñido, Logo: Estampado Nike en la pierna izquierda, Ideal para: Uso diario, actividades deportivas de bajo impacto, Marca: Nike, Temporada: Toda temporada', 435990.00, 10.00),
(19, 3, 'Camiseta FC Barcelona 2023/24 - Niño', 'Camiseta oficial del FC Barcelona 2023/24, versión local para niño. Esta prenda celebra los 30 años de historia del equipo femenino del Barça, con detalles exclusivos como el escudo con forma de diamante y estampado especial en las franjas. Ideal para pequeños fans del club, con diseño cómodo y tela de secado rápido.', 'Tipo: Camiseta deportiva, Modelo: FC Barcelona local 2023/24, Género: Niño, Fit: Regular, Composición: 100% poliéster, Tecnología: Tela con tecnología Dri-FIT, Condición: Nuevo, Temporada: 2023/24', 439950.00, 10.00),
(20, 3, 'Saco con logo GAP - Niño', 'Saco de niño marca GAP, ideal para toda temporada. Confeccionado con una mezcla de algodón y poliéster reciclado que brinda suavidad, resistencia y conciencia ecológica. Su diseño de manga larga con logo frontal clásico lo convierte en una prenda cómoda, versátil y moderna para el día a día.', 'Tipo: Saco de manga larga, Material: 77% algodón, 23% poliéster reciclado, Género: Niño, Fit: Regular, Marca: GAP, Modelo: 743962, Temporada: Toda temporada', 97990.00, 10.00),
(21, 3, 'Camisa manga larga de algodón Coniglio - Niños', 'Camisa para niño de la marca Coniglio, confeccionada en 100% algodón para brindar suavidad, frescura y comodidad durante todo el año. Con diseño liso, manga larga y cierre por botones, es una prenda casual ideal como prenda exterior para looks versátiles y frescos. Su confección industrial asegura durabilidad y buena presentación, perfecta para el día a día o eventos informales.', 'Tipo: Camisa casual para niño, Composición: 100% algodón, Diseño: Liso, con manga larga, Tipo de cierre: Botón, Marca: Coniglio, Temporada: Toda temporada', 79900.00, 10.00),
(22, 3, 'Short con roturas de algodón Yamp - Niñas', 'Shorts denim para niña de la marca Yamp, con diseño moderno y casual. Incluyen roturas decorativas que aportan un estilo urbano, ideal para combinar con camisetas o blusas ligeras. Confeccionados en 100% algodón para brindar frescura y comodidad durante todo el año. Fabricados en Bangladesh con estándares de confección industrial.', 'Tipo: Shorts, Diseño: Denim con roturas decorativas, Composición: 100% algodón, Tipo de cierre: Botón, Marca: Yamp, Temporada: Toda temporada, Hecho en: Bangladesh', 48990.00, 10.00),
(23, 4, 'Pack x3 body manga corta para bebé unisex Yamp - Bebés', 'Pack de 3 bodies unisex para bebé de la marca Yamp, confeccionados en suave algodón blanco, ideales para cualquier temporada. Con manga corta y cuello cómodo, son perfectos para mantener a tu bebé fresco y libre de restricciones. Su diseño básico los hace fáciles de combinar y esenciales en el guardarropa infantil.', 'Tipo: Body unisex, Presentación: Pack x3 unidades, Composición: 100% algodón, Manga: Corta, Género: Unisex, Marca: Yamp, Temporada: Toda temporada, Fabricación: Industrial', 29990.00, 10.00),
(24, 4, 'Camiseta con estampado manga corta algodón GAP - Bebés', 'Camiseta para bebé de la marca GAP, confeccionada en 100% algodón suave, ideal para brindar comodidad durante todo el día. Cuenta con un atractivo estampado y un diseño de manga corta en color vinotinto, perfecto para outfits casuales en cualquier temporada.', 'Tipo: Camiseta casual para bebé, Composición: 100% algodón, Fit: Regular fit, Diseño: Estampado, Color: Vinotinto, Manga: Corta, Cierre: Sin cierre, Marca: GAP, Temporada: Toda temporada', 49990.00, 10.00),
(25, 4, 'Camisa con capucha manga larga de algodón Yamp - Bebés', 'Camisa para bebé niño de la marca Yamp, confeccionada en suave algodón gris con diseño casual y funcional. Incorpora capucha y mangas largas para mayor abrigo y comodidad. Ideal para días frescos, es una prenda versátil perfecta para el uso diario.', 'Tipo: Camisa con capucha, Composición: 100% algodón, Fit: Regular fit, Mangas: Largas, Estilo: Casual, Prenda exterior ideal para entretiempo, Marca: Yamp, Temporada: Toda temporada', 54990.00, 10.00),
(26, 4, 'Camiseta con estampado manga corta algodón Yamp - Bebés', 'Camiseta para bebé niño de la marca Yamp, confeccionada en 100% algodón suave, ideal para brindar frescura y comodidad en el uso diario. Con diseño estampado, manga corta y práctico broche de cierre, es perfecta como prenda exterior en cualquier temporada. Hecha en Colombia con calidad industrial, esta prenda combina estilo de vestir con funcionalidad para los más pequeños.', 'Tipo: Camiseta, Composición: 100% algodón, Diseño: Estampado con manga corta, Tipo de cierre: Broche, Marca: Yamp, Temporada: Toda temporada, Hecho en: Colombia', 24990.00, 10.00),
(27, 4, 'Camisa de cuadros manga larga algodón Yamp - Bebes', 'Camisa para bebé niño de la marca Yamp, confeccionada en 100% algodón suave y respirable, ideal para mantener a tu pequeño cómodo en cualquier temporada. De manga larga y con un diseño clásico, es perfecta como prenda exterior para ocasiones especiales o el día a día. Hecha en China con calidad industrial y pensada para brindar confort y estilo desde los primeros meses.', 'Tipo: Camisa de manga larga, Composición: 100% algodón, Diseño: Clásico, ideal como prenda exterior, Temporada: Toda temporada, Marca: Yamp', 69990.00, 10.00),
(28, 4, 'Camisetas manga larga en pack con estampado de algodón Yamp - Bebes', 'Pack x2 camisetas manga larga para bebé niño de la marca Yamp, confeccionadas en 100% algodón, suaves al tacto y perfectas para el uso diario. Con diseño estampado, estilo casual y sin cierre, son ideales como prendas exteriores en cualquier temporada. Una opción cómoda, práctica y funcional para el guardarropa infantil. Hechas en China con calidad industrial.', 'Tipo: Camisetas manga larga para bebé niño, Composición: 100% algodón, Diseño: Estampado, estilo casual, Incluye: Pack de 2 unidades, Tipo de cierre: Sin cierre, Marca: Yamp, Temporada: Toda temporada', 59990.00, 10.00),
(29, 4, 'Suéter de rayas - Bebes', 'Suéter para niña con un diseño de rayas horizontales en tonos granate y rosa. Confeccionado con un tejido de punto suave y cómodo, ideal para mantener a las niñas abrigadas. Presenta un cuello redondo y mangas largas con un ligero ensanchamiento en los puños, así como un dobladillo acanalado. Perfecto para un look casual y acogedor.', 'Tipo: Suéter para niña, Diseño: Rayas horizontales, Cuello: Redondo, Mangas: Largas con puños ligeramente ensanchados, Material: Tejido de punto, Temporada: Toda temporada', 55990.00, 10.00),
(30, 4, 'Conjunto veraniego para niña bebé – vestido A-line + Sombrero - Bebes', 'Conjunto veraniego para niñas pequeñas que incluye un encantador vestido sin mangas con estampado floral y un delicado lazo decorativo, acompañado de un sombrero a juego. Confeccionado en algodón suave y fresco, su silueta tipo A ofrece comodidad y libertad de movimiento para los días cálidos. Perfecto para un look informal lleno de ternura y estilo.', 'Tipo: Vestido con sombrero para niña pequeña, Composición: 100% algodón, Diseño: Floral con lazo decorativo, Silueta: A-line (corte en forma de “A”), Mangas: Sin mangas, Estilo: Informal, ideal para verano, Incluye: 1 vestido + 1 sombrero', 59900.00, 10.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_imagenes`
--

CREATE TABLE `producto_imagenes` (
  `Id_Imagen` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Nombre_Archivo` varchar(255) NOT NULL,
  `Color_Asociado` varchar(50) DEFAULT NULL,
  `Orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `producto_imagenes`
--

INSERT INTO `producto_imagenes` (`Id_Imagen`, `Id_Producto`, `Nombre_Archivo`, `Color_Asociado`, `Orden`) VALUES
(4, 1, 'images/hombre/product-1_hombre_hoodie-buzo_gris-oscuro.png', 'Gris Oscuro', 1),
(5, 1, 'images/hombre/product-1_hombre_hoodie-buzo_khaki.png', 'Khaki', 1),
(6, 1, 'images/hombre/product-1_hombre_hoodie-buzo_negro.png', 'Negro', 1),
(7, 1, 'images/hombre/product-1_hombre_hoodie-buzo_verde.png', 'Verde', 1),
(8, 2, 'images/hombre/product-2_hombre_polo_hamer_bolsillo_azul.png', 'Azul', 1),
(9, 2, 'images/hombre/product-2_hombre_polo_hamer_bolsillo_blanco.png', 'Blanco', 1),
(10, 2, 'images/hombre/product-2_hombre_polo_hamer_bolsillo_negro.png', 'Negro', 1),
(11, 2, 'images/hombre/product-2_hombre_polo_hamer_bolsillo_vinotinto.png', 'Vinotinto', 1),
(12, 3, 'images/hombre/product-3_hombre_buzo-bearcliff_azul.png', 'Azul', 1),
(13, 3, 'images/hombre/product-3_hombre_buzo-bearcliff_negro.png', 'Negro', 1),
(14, 3, 'images/hombre/product-3_hombre_buzo-bearcliff_verde.png', 'Verde', 1),
(15, 4, 'images/hombre/product-4_hombre_pijama-manga-corta_gris-oscuro.png', 'Gris oscuro', 1),
(16, 4, 'images/hombre/product-4_hombre_pijama-manga-corta_navy.png', 'Navy', 1),
(17, 5, 'images/hombre/product-5_camiseta-manga-corta-1.0_negro.png', 'Negro', 1),
(18, 6, 'images/hombre/product-6_camiseta-manga-corta-2.0_beige.png', 'Beige', 1),
(19, 7, 'images/hombre/product-7_hombre_koaj-buzo-capota_azul.png', 'Azul', 1),
(20, 8, 'images/hombre/product-8_hombre_jeans-1.0_azul-claro.jpg', 'Azul claro', 1),
(21, 9, 'images/mujer/product-1_mujer_hoodie-buzo_blanco.png', 'Blanco', 1),
(22, 9, 'images/mujer/product-1_mujer_hoodie-buzo_morado.png', 'Morado', 1),
(23, 9, 'images/mujer/product-1_mujer_hoodie-buzo_rojo.png', 'Rojo', 1),
(24, 9, 'images/mujer/product-1_mujer_hoodie-buzo_rosado.png', 'Rosado', 1),
(25, 10, 'images/mujer/product-2_blusa-manga-larga-1.0_blanca.png', 'Blanco', 1),
(26, 10, 'images/mujer/product-2_blusa-manga-larga-1.0_rojo.png', 'Rojo', 1),
(27, 10, 'images/mujer/product-2_blusa-manga-larga-1.0_vinotinto.png', 'Vinotinto', 1),
(28, 11, 'images/mujer/product-3_mujer_vestido-largo-1.0_cafe.png', 'Café', 1),
(29, 11, 'images/mujer/product-3_mujer_vestido-largo-1.0_negro.png', 'Negro', 1),
(30, 12, 'images/mujer/product-4_mujer_chaqueta-acolchada-1.0_beige.png', 'Beige', 1),
(31, 12, 'images/mujer/product-4_mujer_chaqueta-acolchada-1.0_negro.png', 'Negro', 1),
(32, 12, 'images/mujer/product-4_mujer_chaqueta-acolchada-1.0_verde.png', 'Verde', 1),
(33, 13, 'images/mujer/product-5_mujer_vestido-corto-sybilla_beige.png', 'Beige', 1),
(34, 13, 'images/mujer/product-5_mujer_vestido-corto-sybilla_blanco.png', 'Blanco', 1),
(35, 13, 'images/mujer/product-5_mujer_vestido-corto-sybilla_verde.png', 'Verde', 1),
(36, 14, 'images/mujer/product-6_mujer_chaqueta-estampado-1.0_azul.png', 'Azul', 1),
(37, 15, 'images/mujer/product-7_mujer_pantalon-tiro-alto-1.0_verde-azul.png', 'Verde-Azul', 1),
(38, 16, 'images/mujer/product-8_mujer_jean-tiro-alto-1.0_azul.png', 'Azul', 1),
(39, 17, 'images/mujer/product-9_mujer_jean-tiro-alto-1.0_blanco.png', 'Blanco', 1),
(40, 17, 'images/mujer/product-9_mujer_jean-tiro-alto-1.0_verde.png', 'Verde', 1),
(41, 18, 'images/mujer/product-10_mujer_leggings-nike_negro.png', 'Negro', 1),
(42, 19, 'images/niños/product-1_niño_fc-barcelona-1.0_azul.png', 'Azul', 1),
(43, 20, 'images/niños/product-2_niño_saco-logo-1.0_azul-claro.png', 'Azul claro', 1),
(44, 21, 'images/niños/product-3_niños_camisa-manga-larga-1.0_beige.png', 'Beige', 1),
(45, 21, 'images/niños/product-3_niños_camisa-manga-larga-1.0_negro.png', 'Negro', 1),
(46, 21, 'images/niños/product-3_niños_camisa-manga-larga-1.0_vinotinto.png', 'Vinotinto', 1),
(47, 22, 'images/niñas/product-1_niña_short-roturas-1.0_azul-claro.png', 'Azul claro', 1),
(48, 22, 'images/niñas/product-1_niña_short-roturas-1.0_azul-medio.png', 'Azul medio', 1),
(49, 22, 'images/niñas/product-1_niña_short-roturas-1.0_negro.png', 'Negro', 1),
(50, 23, 'images/bebes/product-1_bebes_body-manga-corta_blanco.png', 'Blanco', 1),
(51, 24, 'images/bebes/product-2_bebes_camiseta-estampado-manga-corta-1.0_vinotinto.png', 'Vinotinto', 1),
(52, 25, 'images/bebes/product-3_bebes_camisa-capucha-manga-larga-1.0_denim.png', 'Denim', 1),
(53, 26, 'images/bebes/product-4_bebes_camiseta-estampado-manga-corta-2.0_blanco.png', 'Blanco', 1),
(54, 26, 'images/bebes/product-4_bebes_camiseta-estampado-manga-corta-2.0_crema.png', 'Crema', 1),
(55, 26, 'images/bebes/product-4_bebes_camiseta-estampado-manga-corta-2.0_negro.png', 'Negro', 1),
(56, 27, 'images/bebes/product-5_bebes_camisa-cuadros-manga-larga_azul.png', 'Azul', 1),
(57, 27, 'images/bebes/product-5_bebes_camisa-cuadros-manga-larga_beige.png', 'Beige', 1),
(58, 28, 'images/bebes/product-6_bebes_camiseta-manga-larga-2.0_gris-cafe.png', 'Gris - café', 1),
(59, 28, 'images/bebes/product-6_bebes_camiseta-manga-larga-2.0_gris-oscuro-blanco.png', 'Gris Oscuro - Blanco', 1),
(60, 29, 'images/bebes/product-7_bebes_sueter-rayas-1.0_blanco.png', 'Blanco', 1),
(61, 29, 'images/bebes/product-7_bebes_sueter-rayas-1.0_rojo.png', 'Rojo', 1),
(62, 30, 'images/bebes/product-8_bebes_conjunto-veraniego_rojo.png', 'Rojo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_tallas`
--

CREATE TABLE `producto_tallas` (
  `Id_Producto` int(11) NOT NULL,
  `Id_Tallas` int(11) NOT NULL,
  `Color_Variante` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Cantidad_Disponible` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto_tallas`
--

INSERT INTO `producto_tallas` (`Id_Producto`, `Id_Tallas`, `Color_Variante`, `Cantidad_Disponible`) VALUES
(1, 1, 'Gris Oscuro', 50),
(1, 1, 'Khaki', 10),
(1, 1, 'Negro', 30),
(1, 1, 'Verde', 30),
(1, 2, 'Gris Oscuro', 50),
(1, 2, 'Khaki', 10),
(1, 2, 'Negro', 30),
(1, 2, 'Verde', 30),
(1, 3, 'Gris Oscuro', 50),
(1, 3, 'Khaki', 10),
(1, 3, 'Negro', 30),
(1, 3, 'Verde', 30),
(1, 4, 'Gris Oscuro', 50),
(1, 4, 'Khaki', 10),
(1, 4, 'Negro', 30),
(1, 4, 'Verde', 30),
(1, 5, 'Gris Oscuro', 50),
(1, 5, 'Khaki', 10),
(1, 5, 'Negro', 30),
(1, 5, 'Verde', 30),
(2, 1, 'Azul', 35),
(2, 1, 'Blanco', 30),
(2, 1, 'Negro', 30),
(2, 1, 'Vinotinto', 30),
(2, 2, 'Azul', 30),
(2, 2, 'Blanco', 30),
(2, 2, 'Negro', 30),
(2, 2, 'Vinotinto', 30),
(2, 3, 'Azul', 30),
(2, 3, 'Blanco', 30),
(2, 3, 'Negro', 30),
(2, 3, 'Vinotinto', 30),
(2, 4, 'Azul', 30),
(2, 4, 'Blanco', 30),
(2, 4, 'Negro', 30),
(2, 4, 'Vinotinto', 30),
(2, 5, 'Azul', 30),
(2, 5, 'Blanco', 30),
(2, 5, 'Negro', 30),
(2, 5, 'Vinotinto', 30),
(3, 1, 'Azul', 60),
(3, 1, 'Negro', 60),
(3, 1, 'Verde', 60),
(3, 2, 'Azul', 60),
(3, 2, 'Negro', 60),
(3, 2, 'Verde', 60),
(3, 3, 'Azul', 60),
(3, 3, 'Negro', 60),
(3, 3, 'Verde', 60),
(3, 4, 'Azul', 60),
(3, 4, 'Negro', 60),
(3, 4, 'Verde', 60),
(3, 5, 'Azul', 60),
(3, 5, 'Negro', 60),
(3, 5, 'Verde', 60),
(4, 1, 'Gris oscuro', 70),
(4, 1, 'Navy', 70),
(4, 2, 'Gris oscuro', 70),
(4, 2, 'Navy', 70),
(4, 3, 'Gris oscuro', 70),
(4, 3, 'Navy', 70),
(4, 4, 'Gris oscuro', 70),
(4, 4, 'Navy', 70),
(4, 5, 'Gris oscuro', 70),
(4, 5, 'Navy', 70),
(5, 1, 'Negro', 10),
(5, 2, 'Negro', 10),
(5, 3, 'Negro', 40),
(5, 4, 'Negro', 50),
(5, 5, 'Negro', 70),
(6, 1, 'Beige', 35),
(6, 2, 'Beige', 35),
(6, 3, 'Beige', 35),
(6, 4, 'Beige', 35),
(7, 3, 'Azul', 35),
(7, 4, 'Azul', 35),
(7, 5, 'Azul', 19),
(8, 1, 'Azul claro', 25),
(8, 2, 'Azul claro', 25),
(8, 3, 'Azul claro', 25),
(8, 4, 'Azul claro', 25),
(8, 5, 'Azul claro', 25),
(9, 1, 'Blanco', 25),
(9, 1, 'Morado', 25),
(9, 2, 'Blanco', 25),
(9, 2, 'Morado', 25),
(9, 3, 'Blanco', 25),
(9, 3, 'Morado', 25),
(9, 3, 'Rojo', 10),
(9, 3, 'Rosado', 100),
(9, 4, 'Blanco', 25),
(9, 4, 'Morado', 25),
(9, 4, 'Rojo', 20),
(9, 4, 'Rosado', 200),
(9, 5, 'Blanco', 25),
(9, 5, 'Morado', 25),
(9, 5, 'Rojo', 30),
(9, 5, 'Rosado', 300),
(10, 3, 'Blanco', 25),
(10, 3, 'Rojo', 15),
(10, 4, 'Blanco', 25),
(10, 4, 'Rojo', 15),
(10, 4, 'Vinotinto', 15),
(10, 5, 'Blanco', 25),
(10, 5, 'Rojo', 75),
(10, 5, 'Vinotinto', 75),
(11, 1, 'Café', 15),
(11, 1, 'Negro', 15),
(11, 2, 'Café', 15),
(11, 2, 'Negro', 15),
(11, 3, 'Café', 15),
(11, 3, 'Negro', 15),
(11, 4, 'Café', 15),
(11, 4, 'Negro', 15),
(11, 5, 'Café', 15),
(11, 5, 'Negro', 15),
(12, 4, 'Beige', 15),
(12, 5, 'Beige', 15),
(12, 5, 'Negro', 15),
(12, 5, 'Verde', 15),
(13, 4, 'Beige', 15),
(13, 5, 'Blanco', 25),
(13, 5, 'Verde', 45),
(14, 1, 'Azul', 95),
(14, 2, 'Azul', 95),
(14, 3, 'Azul', 95),
(14, 4, 'Azul', 95),
(14, 5, 'Azul', 95),
(15, 1, 'Verde-Azul', 45),
(15, 2, 'Verde-Azul', 45),
(15, 3, 'Verde-Azul', 45),
(15, 4, 'Verde-Azul', 45),
(16, 1, 'Azul', 45),
(16, 2, 'Azul', 45),
(16, 3, 'Azul', 45),
(16, 4, 'Azul', 45),
(16, 5, 'Azul', 45),
(17, 1, 'Blanco', 25),
(17, 1, 'Verde', 45),
(17, 2, 'Blanco', 25),
(17, 2, 'Verde', 45),
(17, 3, 'Blanco', 25),
(17, 3, 'Verde', 45),
(17, 4, 'Blanco', 25),
(17, 4, 'Verde', 45),
(18, 1, 'Negro', 23),
(18, 2, 'Negro', 23),
(18, 3, 'Negro', 23),
(18, 4, 'Negro', 23),
(18, 5, 'Negro', 23),
(19, 3, 'Azul', 23),
(19, 4, 'Azul', 23),
(20, 1, 'Azul claro', 20),
(20, 3, 'Azul claro', 23),
(20, 4, 'Azul claro', 13),
(21, 1, 'Beige', 23),
(21, 1, 'Negro', 23),
(21, 1, 'Vinotinto', 23),
(21, 2, 'Beige', 23),
(21, 2, 'Negro', 23),
(21, 2, 'Vinotinto', 23),
(21, 3, 'Beige', 23),
(21, 3, 'Vinotinto', 23),
(21, 4, 'Beige', 23),
(21, 4, 'Vinotinto', 23),
(22, 1, 'Azul claro', 13),
(22, 1, 'Azul medio', 13),
(22, 1, 'Negro', 13),
(22, 2, 'Azul claro', 13),
(22, 2, 'Azul medio', 13),
(22, 2, 'Negro', 13),
(22, 3, 'Azul claro', 13),
(22, 4, 'Azul claro', 13),
(23, 7, 'Blanco', 90),
(23, 8, 'Blanco', 90),
(24, 9, 'Vinotinto', 90),
(24, 10, 'Vinotinto', 90),
(25, 2, 'Denim', 90),
(26, 9, 'Blanco', 90),
(26, 9, 'Crema', 90),
(26, 9, 'Negro', 90),
(26, 10, 'Blanco', 90),
(26, 10, 'Crema', 90),
(26, 10, 'Negro', 90),
(27, 8, 'Azul', 90),
(27, 8, 'Beige', 90),
(27, 9, 'Azul', 90),
(27, 9, 'Beige', 90),
(27, 10, 'Azul', 90),
(28, 8, 'Gris - café', 90),
(28, 8, 'Gris Oscuro - Blanco', 90),
(28, 9, 'Gris - café', 90),
(28, 9, 'Gris Oscuro - Blanco', 90),
(28, 10, 'Gris - café', 90),
(29, 8, 'Blanco', 50),
(29, 8, 'Rojo', 90),
(29, 9, 'Blanco', 80),
(29, 9, 'Rojo', 90),
(30, 8, 'Rojo', 13),
(30, 9, 'Rojo', 13),
(30, 10, 'Rojo', 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tallas`
--

CREATE TABLE `tallas` (
  `Id_Tallas` int(11) NOT NULL,
  `Nombres_Talla` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `tallas`
--

INSERT INTO `tallas` (`Id_Tallas`, `Nombres_Talla`) VALUES
(1, 'XS'),
(2, 'S'),
(3, 'M'),
(4, 'L'),
(5, 'XL'),
(6, 'XXL'),
(7, '6 meses'),
(8, '1 año'),
(9, '2 años'),
(10, '3 años'),
(11, 'Única');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id_Usuario` int(11) NOT NULL,
  `Nombres` varchar(50) NOT NULL,
  `Apellidos` varchar(50) NOT NULL,
  `Telefono` varchar(15) NOT NULL,
  `Direccion` varchar(150) NOT NULL,
  `Id_Ciudad` int(11) NOT NULL,
  `Fecha_Nacimiento` date NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id_Usuario`, `Nombres`, `Apellidos`, `Telefono`, `Direccion`, `Id_Ciudad`, `Fecha_Nacimiento`, `rol`) VALUES
(1, 'Juan David', 'Zapata Manrrique', '3178937890', 'Calle 1a #23-89', 27, '2000-01-01', 'admin'),
(2, 'Paula Andrea', 'Urriago Poveda', '3125467890', 'Calle 1a #12-56', 25, '1990-01-01', 'cliente'),
(3, 'Luis Carlos', 'López Manrique', '3202411506', 'Calle 1a #12-89', 27, '2000-11-15', 'cliente'),
(4, 'Pablo Alejandro', 'Montero Reyes', '3209896545', 'Calle 1a #12-78', 34, '2000-12-10', 'cliente'),
(5, 'Carlos Eduardo', 'Morales Jiménez', '3102108976', 'Calle 3a # 12-89', 25, '2005-11-11', 'cliente'),
(6, 'Laura Beatriz', 'Sánchez León', '3243456789', 'Calle 1a #45-98', 25, '1989-08-22', 'cliente'),
(7, 'Jhon Dairo', 'Yara Bermeo', '3175453486', 'Caller1a #23-19', 25, '2005-11-10', 'cliente'),
(8, 'Paola Andrea ', 'Torres Falla', '3208781245', 'Calle 1a #12-05', 22, '2005-11-11', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cambio_direccion_entrega`
--
ALTER TABLE `cambio_direccion_entrega`
  ADD PRIMARY KEY (`Id_Direccion`),
  ADD KEY `id_ciudad_idx` (`Id_Ciudad`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`Id_Carrito`),
  ADD KEY `Id_Usuarios_idx` (`Id_Usuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`Id_Categoria`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`Id_Ciudad`),
  ADD KEY `Id_Departamento_idx` (`Id_Departamento`);

--
-- Indices de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD PRIMARY KEY (`Id_Cuenta`),
  ADD KEY `Id_Usuario_idx` (`Id_Usuario`);

--
-- Indices de la tabla `departamento`
--
ALTER TABLE `departamento`
  ADD PRIMARY KEY (`Id_Departamento`);

--
-- Indices de la tabla `detalles_carrito`
--
ALTER TABLE `detalles_carrito`
  ADD PRIMARY KEY (`Id_Carrito`,`Id_Producto`,`Id_Talla`,`Color_Seleccionado`),
  ADD UNIQUE KEY `unique_cart_item` (`Id_Carrito`,`Id_Producto`,`Id_Talla`,`Color_Seleccionado`),
  ADD KEY `Id_Producto_idx` (`Id_Producto`),
  ADD KEY `fk_detalles_carrito_talla` (`Id_Talla`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`Id_Detalle_Pedido`),
  ADD KEY `fk_DetallesPedido_Pedido` (`Id_Pedido`),
  ADD KEY `fk_DetallesPedido_Producto` (`Id_Producto`);

--
-- Indices de la tabla `envio`
--
ALTER TABLE `envio`
  ADD PRIMARY KEY (`Id_Envio`),
  ADD KEY `Id_Pedido_idx` (`Id_Pedido`),
  ADD KEY `Id_Estado_Envio_idx` (`Id_Estado_Envio`),
  ADD KEY `Id_Direccion_idx` (`Id_Direccion`);

--
-- Indices de la tabla `estado_envio`
--
ALTER TABLE `estado_envio`
  ADD PRIMARY KEY (`Id_Estado_Envio`);

--
-- Indices de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  ADD PRIMARY KEY (`Id_Estado_Pago`);

--
-- Indices de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
  ADD PRIMARY KEY (`Id_Estado_Pedido`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`Id_Favorito`),
  ADD UNIQUE KEY `UX_Favoritos_UsuarioProductoVariante` (`Id_Usuario`,`Id_Producto`,`Id_Talla`,`Color_Seleccionado`),
  ADD KEY `fk_favoritos_producto` (`Id_Producto`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`Id_Met_Pago`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`Id_Pago`),
  ADD KEY `Id_Pedidos_idx` (`Id_Pedido`),
  ADD KEY `Id_Met_Pago_idx` (`Id_Met_Pago`),
  ADD KEY `Id_Estado_Pago_idx` (`Id_Estado_Pago`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`Id_Pedido`),
  ADD KEY `Id_Carrito_idx` (`Id_Carrito`),
  ADD KEY `Id_Estado_Pedido_idx` (`Id_Estado_Pedido`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`Id_Producto`),
  ADD KEY `Id_Categoria_idx` (`Id_Categoria`);

--
-- Indices de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD PRIMARY KEY (`Id_Imagen`),
  ADD KEY `fk_ProductoImagen_Producto` (`Id_Producto`);

--
-- Indices de la tabla `producto_tallas`
--
ALTER TABLE `producto_tallas`
  ADD UNIQUE KEY `uc_producto_talla_color` (`Id_Producto`,`Id_Tallas`,`Color_Variante`),
  ADD UNIQUE KEY `idx_producto_talla_color_unico` (`Id_Producto`,`Id_Tallas`,`Color_Variante`),
  ADD KEY `fk_ProductoTalla_Tallas` (`Id_Tallas`);

--
-- Indices de la tabla `tallas`
--
ALTER TABLE `tallas`
  ADD PRIMARY KEY (`Id_Tallas`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_Usuario`),
  ADD KEY `Id_Ciudad_idx` (`Id_Ciudad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cambio_direccion_entrega`
--
ALTER TABLE `cambio_direccion_entrega`
  MODIFY `Id_Direccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `Id_Carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `Id_Categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `Id_Ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  MODIFY `Id_Cuenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `Id_Departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `Id_Detalle_Pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `envio`
--
ALTER TABLE `envio`
  MODIFY `Id_Envio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_envio`
--
ALTER TABLE `estado_envio`
  MODIFY `Id_Estado_Envio` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  MODIFY `Id_Estado_Pago` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado_pedido`
--
ALTER TABLE `estado_pedido`
  MODIFY `Id_Estado_Pedido` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `Id_Favorito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `Id_Met_Pago` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `Id_Pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `Id_Pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `Id_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  MODIFY `Id_Imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `tallas`
--
ALTER TABLE `tallas`
  MODIFY `Id_Tallas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cambio_direccion_entrega`
--
ALTER TABLE `cambio_direccion_entrega`
  ADD CONSTRAINT `fk_CambioDireccion_Ciudad` FOREIGN KEY (`Id_Ciudad`) REFERENCES `ciudad` (`Id_Ciudad`);

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `fk_Carrito_Usuario` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`);

--
-- Filtros para la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `fk_Ciudad_Departamento` FOREIGN KEY (`Id_Departamento`) REFERENCES `departamento` (`Id_Departamento`);

--
-- Filtros para la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD CONSTRAINT `fk_Cuenta_Usuario` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`);

--
-- Filtros para la tabla `detalles_carrito`
--
ALTER TABLE `detalles_carrito`
  ADD CONSTRAINT `fk_DetallesCarrito_Carrito` FOREIGN KEY (`Id_Carrito`) REFERENCES `carrito` (`Id_Carrito`),
  ADD CONSTRAINT `fk_DetallesCarrito_Producto` FOREIGN KEY (`Id_Producto`) REFERENCES `producto` (`Id_Producto`),
  ADD CONSTRAINT `fk_detalles_carrito_talla` FOREIGN KEY (`Id_Talla`) REFERENCES `tallas` (`Id_Tallas`);

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `fk_DetallesPedido_Pedido` FOREIGN KEY (`Id_Pedido`) REFERENCES `pedido` (`Id_Pedido`),
  ADD CONSTRAINT `fk_DetallesPedido_Producto` FOREIGN KEY (`Id_Producto`) REFERENCES `producto` (`Id_Producto`);

--
-- Filtros para la tabla `envio`
--
ALTER TABLE `envio`
  ADD CONSTRAINT `fk_Envio_Direccion` FOREIGN KEY (`Id_Direccion`) REFERENCES `cambio_direccion_entrega` (`Id_Direccion`),
  ADD CONSTRAINT `fk_Envio_EstadoEnvio` FOREIGN KEY (`Id_Estado_Envio`) REFERENCES `estado_envio` (`Id_Estado_Envio`),
  ADD CONSTRAINT `fk_Envio_Pedido` FOREIGN KEY (`Id_Pedido`) REFERENCES `pedido` (`Id_Pedido`);

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favoritos_producto` FOREIGN KEY (`Id_Producto`) REFERENCES `producto` (`Id_Producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `fk_Pago_EstadoPago` FOREIGN KEY (`Id_Estado_Pago`) REFERENCES `estado_pago` (`Id_Estado_Pago`),
  ADD CONSTRAINT `fk_Pago_MetodoPago` FOREIGN KEY (`Id_Met_Pago`) REFERENCES `metodo_pago` (`Id_Met_Pago`),
  ADD CONSTRAINT `fk_Pago_Pedido` FOREIGN KEY (`Id_Pedido`) REFERENCES `pedido` (`Id_Pedido`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_Pedido_Carrito` FOREIGN KEY (`Id_Carrito`) REFERENCES `carrito` (`Id_Carrito`),
  ADD CONSTRAINT `fk_Pedido_EstadoPedido` FOREIGN KEY (`Id_Estado_Pedido`) REFERENCES `estado_pedido` (`Id_Estado_Pedido`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_Producto_Categoria` FOREIGN KEY (`Id_Categoria`) REFERENCES `categoria` (`Id_Categoria`);

--
-- Filtros para la tabla `producto_imagenes`
--
ALTER TABLE `producto_imagenes`
  ADD CONSTRAINT `fk_ProductoImagen_Producto` FOREIGN KEY (`Id_Producto`) REFERENCES `producto` (`Id_Producto`);

--
-- Filtros para la tabla `producto_tallas`
--
ALTER TABLE `producto_tallas`
  ADD CONSTRAINT `fk_ProductoTalla_Producto` FOREIGN KEY (`Id_Producto`) REFERENCES `producto` (`Id_Producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ProductoTalla_Tallas` FOREIGN KEY (`Id_Tallas`) REFERENCES `tallas` (`Id_Tallas`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_Usuario_Ciudad` FOREIGN KEY (`Id_Ciudad`) REFERENCES `ciudad` (`Id_Ciudad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
