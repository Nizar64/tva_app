-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 18 déc. 2025 à 08:02
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tableau_tva_user`
--

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

DROP TABLE IF EXISTS `produits`;
CREATE TABLE IF NOT EXISTS `produits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(100) NOT NULL,
  `prix_ht` decimal(10,2) NOT NULL,
  `tva` decimal(4,2) NOT NULL,
  `prix_ttc` decimal(10,2) NOT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `produits`
--

INSERT INTO `produits` (`id`, `libelle`, `prix_ht`, `tva`, `prix_ttc`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Clé USB', 10.00, 20.00, 12.00, 1, '2025-12-17 20:03:52', '2025-12-17 22:52:35'),
(2, 'Crayon', 2.00, 5.50, 2.11, 1, '2025-12-17 20:03:52', '2025-12-17 20:03:52'),
(3, 'Livre', 12.00, 5.50, 12.66, 2, '2025-12-17 20:03:52', '2025-12-17 20:03:52'),
(4, 'Stylo', 1.50, 20.00, 1.80, 2, '2025-12-17 20:03:52', '2025-12-17 20:03:52'),
(7, 'Laptop', 809.00, 20.00, 970.80, 3, '2025-12-17 21:48:22', '2025-12-17 22:51:41'),
(8, 'velo', 200.00, 20.00, 240.00, 4, '2025-12-18 07:53:41', '2025-12-18 07:53:41');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@tva.com', '$2y$10$6VG8MQCQH8yRnClbKsfZHeZh1P5ExupTVyu3H6PsMNJcIz4HtBhV2', 'admin', '2025-12-17 20:03:52', '2025-12-17 22:08:24'),
(2, 'user', 'user@tva.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '2025-12-17 20:03:52', '2025-12-17 20:03:52'),
(3, 'Nizar', 'nizar@gmail.com', '$2y$10$RPbpiMJWaPQ9dlYZWygdweOAuZxD.s82T3BhfuXGh9BpvJ6mgvp1u', 'user', '2025-12-17 20:25:34', '2025-12-17 20:25:34'),
(4, 'exqualibur', 'exaqualubur@gmail.com', '$2y$10$GvnMo1D7jg07vbdj2BMPEOSINfHCEWGTbFGs48Sey4B98S2z2CDpm', 'user', '2025-12-18 07:53:00', '2025-12-18 07:53:00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
