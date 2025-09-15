-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-09-2025 a las 05:32:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cooperativa_viviendas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL,
  `tipo_pago` enum('mensual','inicial','compensatorio') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id_pago`, `tipo_pago`, `monto`, `fecha`, `id_usuario`) VALUES
(1, 'inicial', 80000.00, '1111-11-11', 19),
(2, 'inicial', 80000.00, '1111-11-11', 19),
(3, 'inicial', 200000.00, '2025-10-14', 19),
(4, 'inicial', 200000.00, '2025-10-14', 19),
(5, 'compensatorio', 120000.00, '2024-12-20', 19),
(6, 'compensatorio', 120000.00, '2024-12-20', 19),
(7, 'compensatorio', 12345.00, '2021-12-25', 19),
(8, 'inicial', 69420.00, '1420-09-06', 19),
(9, 'mensual', 1234.00, '2022-09-15', 19),
(10, 'mensual', 420.00, '0001-01-01', 20),
(11, 'inicial', 1500.00, '2025-05-11', 19);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajo`
--

CREATE TABLE `trabajo` (
  `id_registro` int(11) NOT NULL,
  `semana` int(11) DEFAULT NULL,
  `horas_cumplidas` decimal(5,2) DEFAULT NULL,
  `fch_registro` date NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trabajo`
--

INSERT INTO `trabajo` (`id_registro`, `semana`, `horas_cumplidas`, `fch_registro`, `id_usuario`, `motivo`) VALUES
(3, 38, 30.00, '0000-00-00', 19, ''),
(4, 38, 30.00, '0000-00-00', 19, ''),
(5, 46, 30.00, '2025-11-14', 19, ''),
(6, 46, 30.00, '2025-11-14', 19, ''),
(7, 51, 120.00, '2021-12-25', 19, 'a'),
(8, 38, 22.00, '2025-09-15', 19, 'abc'),
(9, 37, 121.00, '2022-09-15', 19, 'prueba'),
(10, 37, 123.00, '2024-09-15', 20, 'prueba2'),
(11, 50, 20.00, '1212-12-12', 19, 'prueba3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_persona` varchar(20) DEFAULT NULL,
  `usuario_login` varchar(30) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email_cont` varchar(100) NOT NULL,
  `telefono_cont` varchar(20) DEFAULT NULL,
  `rol` enum('administrador','cooperativista') NOT NULL DEFAULT 'cooperativista',
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_persona`, `usuario_login`, `nombre`, `apellido`, `email_cont`, `telefono_cont`, `rol`, `contrasena`) VALUES
(10, NULL, 'nico1122', 'sebastian', 'vazquez', 'asd@g', '1234567', 'cooperativista', '$2y$10$QmskUzCV3laO05D2JbfAh./HKZOqAQpFqebecwYriihbIXdl7kof.'),
(12, NULL, 'sebaz', 'abc', 'def', 'n@m', NULL, 'cooperativista', '$2y$10$r0U0kdMfcDJcgadge2kRZ.AYu.l8yr0IjU3atpxtCSUypElRm/0Vy'),
(14, '123', 's', 'sebastian', 'v', 'asd@gm', NULL, 'cooperativista', '$2y$10$e6QPBxGWh7WGvm7EVoS1C.8.UYQeY35Lo2W2brlIc7mwTDMVuLmom'),
(16, '456', 'a', 'sebastian', 'vazquez', '123@a', '1234', 'cooperativista', '$2y$10$A5uTNjS3DRdqcz4FXiaV4OIQWp.XOXcYAsAMwfX3s8UiNcCnTC9f6'),
(19, '12345678', 'sebav', 'seba', 'vaz', 'a@abcdef', '1234567890', 'cooperativista', '$2y$10$T5XjevahD7q/bzxlcG1TT..XIuc0PdlyHWgg5GBPzBlglpXHzgj6m'),
(20, '1234', 'seba1122', 'seba', 'vaz', 'seba@v', '123', 'cooperativista', '$2y$10$UgUR4WRCS5K6mVJ8VLzxoOFKgvnkObj0IxZ4h4/msWRhxSlKMgSPS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vivienda`
--

CREATE TABLE `vivienda` (
  `id_vivienda` int(11) NOT NULL,
  `estado` enum('Planificación','Construcción','Terminada','Asignada') NOT NULL,
  `calle` varchar(50) DEFAULT NULL,
  `nro_puerta` varchar(8) DEFAULT NULL,
  `nro_apt` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pago_usuario` (`id_usuario`);

--
-- Indices de la tabla `trabajo`
--
ALTER TABLE `trabajo`
  ADD PRIMARY KEY (`id_registro`),
  ADD KEY `fk_trabajo_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario_login` (`usuario_login`),
  ADD UNIQUE KEY `uk_id_persona` (`id_persona`),
  ADD UNIQUE KEY `email_cont` (`email_cont`),
  ADD UNIQUE KEY `id_persona` (`id_persona`);

--
-- Indices de la tabla `vivienda`
--
ALTER TABLE `vivienda`
  ADD PRIMARY KEY (`id_vivienda`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `trabajo`
--
ALTER TABLE `trabajo`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `vivienda`
--
ALTER TABLE `vivienda`
  MODIFY `id_vivienda` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `fk_pago_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `trabajo`
--
ALTER TABLE `trabajo`
  ADD CONSTRAINT `fk_trabajo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
