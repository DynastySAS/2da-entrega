-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-11-2025 a las 00:29:10
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
CREATE DATABASE IF NOT EXISTS `cooperativa_viviendas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cooperativa_viviendas`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL,
  `tipo_pago` enum('mensual','inicial','compensatorio') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` DATETIME NOT NULL DEFAULT current_timestamp(),
  `fecha_aprobado` date DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `estado` enum('solicitado','aprobado') NOT NULL DEFAULT 'solicitado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id_pago`, `tipo_pago`, `monto`, `fecha`, `fecha_aprobado`, `id_usuario`, `estado`) VALUES
(2, 'mensual', 80005.00, '2025-11-11', '2025-06-06', 19, 'aprobado'),
(3, 'inicial', 200000.00, '2025-10-14', '2025-09-30', 19, 'aprobado'),
(4, 'inicial', 200000.00, '2025-10-14', '2025-10-03', 19, 'aprobado'),
(5, 'compensatorio', 120000.00, '2024-12-20', '2025-09-30', 19, 'aprobado'),
(6, 'compensatorio', 120000.00, '2024-12-20', '2025-09-30', 19, 'aprobado'),
(7, 'compensatorio', 12345.00, '2021-12-25', '2025-10-03', 19, 'aprobado'),
(8, 'inicial', 69420.00, '2025-09-06', NULL, 19, 'aprobado'),
(9, 'mensual', 1234.00, '2022-09-15', '2025-09-30', 19, 'aprobado'),
(10, 'mensual', 420.00, '2025-01-01', '2025-09-30', 20, 'aprobado'),
(12, 'inicial', 200.00, '2025-09-22', NULL, 19, 'aprobado'),
(13, 'inicial', 123.00, '2025-09-29', '2025-09-30', 30, 'aprobado'),
(14, 'compensatorio', 2.00, '2025-09-29', '2025-09-30', 30, 'aprobado'),
(15, 'inicial', 123.00, '2025-09-29', NULL, 30, 'aprobado'),
(17, 'compensatorio', 500.00, '2025-10-03', '2025-10-03', 30, 'aprobado'),
(19, 'mensual', 200.00, '2025-10-19', NULL, 33, 'aprobado'),
(20, 'mensual', 5000.00, '2025-11-07', NULL, 33, 'aprobado'),
(21, 'compensatorio', 200.00, '2025-11-07', NULL, 33, 'aprobado'),
(22, 'mensual', 50000.00, '2025-11-07', NULL, 33, 'aprobado'),
(31, 'inicial', 200.00, '2025-11-07', NULL, 30, 'aprobado'),
(32, 'compensatorio', 200.00, '2025-11-07', NULL, 33, 'aprobado'),
(33, 'mensual', 123.00, '2025-11-07', NULL, 33, 'solicitado'),
(34, 'mensual', 1233.00, '2025-11-07', NULL, 33, 'solicitado'),
(35, 'mensual', 12334.00, '2025-11-07', NULL, 33, 'solicitado'),
(36, 'compensatorio', 123345.00, '2025-11-07', NULL, 33, 'solicitado'),
(37, 'compensatorio', 1233455.00, '2025-11-07', NULL, 33, 'solicitado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajo`
--

CREATE TABLE `trabajo` (
  `id_registro` int(11) NOT NULL,
  `semana` int(11) DEFAULT NULL,
  `horas_cumplidas` decimal(5,2) DEFAULT NULL,
  `fch_registro` DATETIME NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `trabajo`
--

INSERT INTO `trabajo` (`id_registro`, `semana`, `horas_cumplidas`, `fch_registro`, `id_usuario`, `motivo`) VALUES
(4, 38, 30.00, '2025-11-14', 19, ''),
(5, 46, 30.00, '2025-11-14', 19, ''),
(6, 46, 30.00, '2025-11-14', 19, ''),
(7, 51, 120.00, '2021-12-25', 19, 'a'),
(8, 38, 22.00, '2025-09-15', 19, 'abc'),
(9, 37, 121.00, '2022-09-15', 19, 'prueba'),
(10, 37, 123.00, '2024-09-15', 20, 'prueba2'),
(11, 50, 20.00, '2022-12-12', 19, 'prueba3'),
(12, 38, 22.00, '2025-09-21', 19, 'prueba3'),
(13, 1111, 123.00, '2025-09-29', 30, '1'),
(14, 1111, 100.00, '2025-09-29', 30, '2'),
(15, 1111, 2.00, '2025-09-29', 30, '3'),
(16, 1111, 22.00, '2025-10-07', 30, '123'),
(17, 2025, 22.00, '2025-10-19', 33, '1'),
(18, 2025, 21.00, '2025-11-03', 33, 'abcdefg'),
(19, 2025, 20.00, '2025-11-04', 33, 'a'),
(20, 2025, 200.00, '2025-11-04', 33, '1'),
(21, 2025, 199.00, '2025-11-04', 33, 'a'),
(22, 2025, 195.00, '2025-11-04', 33, 'b'),
(23, 45, 190.00, '2025-11-04', 33, 'c'),
(24, 45, 20.00, '2025-11-07', 33, '4312'),
(25, 45, 21.00, '2025-11-07', 33, '');

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
  `contrasena` varchar(255) NOT NULL,
  `estado` enum('solicitado','registrado') NOT NULL DEFAULT 'solicitado',
  `pago_inicial` enum('si','no') DEFAULT 'no',
  `estatus` enum('Al dia','Atrasado') DEFAULT 'Al dia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_persona`, `usuario_login`, `nombre`, `apellido`, `email_cont`, `telefono_cont`, `rol`, `contrasena`, `estado`, `pago_inicial`, `estatus`) VALUES
(12, '0', 'sebazsss', 'abc', 'def', 'n@m', '123', 'cooperativista', '$2y$10$r0U0kdMfcDJcgadge2kRZ.AYu.l8yr0IjU3atpxtCSUypElRm/0Vy', 'registrado', 'si', 'Al dia'),
(14, '123', 's', 'sebastian', 'v', 'asd@gm', NULL, 'cooperativista', '$2y$10$e6QPBxGWh7WGvm7EVoS1C.8.UYQeY35Lo2W2brlIc7mwTDMVuLmom', 'registrado', 'si', 'Al dia'),
(16, '456', 'a', 'sebastian', 'vazquez', '123@a', '1234', 'cooperativista', '$2y$10$A5uTNjS3DRdqcz4FXiaV4OIQWp.XOXcYAsAMwfX3s8UiNcCnTC9f6', 'registrado', 'si', 'Al dia'),
(19, '12345678', 'sebav', 'seba', 'vaz', 'a@abcde', '1234567890', 'cooperativista', '$2y$10$T5XjevahD7q/bzxlcG1TT..XIuc0PdlyHWgg5GBPzBlglpXHzgj6m', 'registrado', 'si', 'Al dia'),
(20, '1234', 'seba1122', 'seba', 'vaz', 'seba@v', '123', 'cooperativista', '$2y$10$UgUR4WRCS5K6mVJ8VLzxoOFKgvnkObj0IxZ4h4/msWRhxSlKMgSPS', 'registrado', 'si', 'Al dia'),
(22, NULL, 'admin1', 'admin', '1', 'admin@admin', NULL, 'administrador', '$2y$10$fK718ETYL/PRDEUWTvOUiurg20rarSgjG/Gh2Q9tcccIOvtrStqgW', 'registrado', 'si', 'Al dia'),
(29, '1', 'seba321', 'seba', 'vaz', 'seba@mvds', NULL, 'cooperativista', '$2y$10$6uITcOoQUV1JMIWdxy8VweAlGAOEGDnwH629r.MVEXZOWNGQ9tVQS', 'registrado', 'si', 'Al dia'),
(30, '2', '123', 'seba', 'vaz', 'ssss@vvvvv', '1234555555', 'cooperativista', '$2y$10$aFODCBfNBYLdpn/K0YcG7urPlMgtrKvctQhM16N1bi5kE/iGv1Nye', 'registrado', 'si', 'Al dia'),
(31, '3', 'seba1', 'seba', '1', 'seba@11', '1234566543', 'cooperativista', '$2y$10$PmwJgZm098CdyDZ5Ij8HZeh0PgfpvE.hL6pS3LZaDIYUJnXn.XRVG', 'registrado', 'si', 'Al dia'),
(33, '5', 'seba3', 'seba', 'seba', 'seba@9876', '1234', 'cooperativista', '$2y$10$Omcq11QtPuOnKmz.EEuRoOlW67OGAEyo0rh7TP2ZKHu3pOylIjU6G', 'registrado', 'si', 'Al dia'),
(34, '6', 'seba4', 'seba', 'seba', '1@1', NULL, 'cooperativista', '$2y$10$BSJWiuSapeDrrxtv7F5S.uGaLEM14nDkT7/VH/H1fmhmBA.hbugZO', 'solicitado', 'si', 'Al dia'),
(35, '7', 'seba5', 'seba', 'seba', '1@2', '1234', 'cooperativista', '$2y$10$y4aL6/haciguGb4J4lgMSuur2ycFW8KLsGfXVa9Bdu1jbnbhLwwpG', 'registrado', 'no', 'Al dia'),
(36, '8', 'seba6', 'seba', 'seba', '1@3', NULL, 'cooperativista', '$2y$10$KohlJ2ouNXlv0WzS5HxCX.rlNSN0RMNymqgecFZCdIieg.tzfhymO', 'registrado', 'no', 'Al dia'),
(37, '9', 'seba7', 'seba', 'seba', '2@3', NULL, 'cooperativista', '$2y$10$Vnavnf7rd5udfYW8dTZ0ZuIEkBWGYk0xDFuH4KFq7JtWz3wKhwsdK', 'registrado', 'no', 'Al dia');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vivienda`
--

CREATE TABLE `vivienda` (
  `id_vivienda` int(11) NOT NULL,
  `estado` enum('Planificación','Construcción','Terminada','Asignada') NOT NULL,
  `calle` varchar(50) DEFAULT NULL,
  `nro_puerta` varchar(8) DEFAULT NULL,
  `nro_apt` varchar(8) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vivienda`
--

INSERT INTO `vivienda` (`id_vivienda`, `estado`, `calle`, `nro_puerta`, `nro_apt`, `id_usuario`) VALUES
(1, 'Planificación', 'charrua', '2749', '0', 33);

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
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `trabajo`
--
ALTER TABLE `trabajo`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `vivienda`
--
ALTER TABLE `vivienda`
  MODIFY `id_vivienda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
