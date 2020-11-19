/* Replace with your SQL commands */

DROP TABLE IF EXISTS `permission`;

CREATE TABLE `permission` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `permission_key` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-auth-item` (`permission_key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `permission` WRITE;

INSERT INTO `permission` VALUES (1,'manageUser','Manage users','{}','2019-11-12 11:47:09','2019-11-12 11:47:09'),(2,'manageStaff','Manage staffs','{}','2019-11-12 11:47:09','2019-11-12 11:47:09'),(3,'manageSetting','Manage settings','{}','2019-11-12 11:47:09','2019-11-21 10:27:14'),(4,'manageTodo','Manage todo','{}','2019-11-12 11:47:09','2019-11-24 11:42:44');

UNLOCK TABLES;

DROP TABLE IF EXISTS `setting`;

CREATE TABLE `setting` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `meta_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `meta_attribute` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `meta_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_public` tinyint(1) DEFAULT '1',
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-setting` (`meta_key`,`meta_type`,`is_public`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `setting` WRITE;
INSERT INTO `setting` VALUES (1,'test_setting1','Test Setting - Select','select','Select one of attributes','{\"list\":[{\"value\":\"Australia/Adelaide\",\"text\":\"Australia/Adelaide\"},{\"value\":\"Australia/Brisbane\",\"text\":\"Australia/Brisbane\"},{\"value\":\"Australia/Canberra\",\"text\":\"Australia/Canberra\"},{\"value\":\"Australia/Hobart\",\"text\":\"Australia/Hobart\"},{\"value\":\"Australia/Melbourne\",\"text\":\"Australia/Melbourne\"},{\"value\":\"Australia/Perth\",\"text\":\"Australia/Perth\"},{\"value\":\"Australia/Sydney\",\"text\":\"Australia/Sydney\"}]}','Australia/Melbourne',1,1,'2019-11-11 00:11:11','2019-11-24 04:58:51'),(2,'test_setting2','Test Setting - Number','number','Enter any number',NULL,'15',1,1,'2019-11-11 00:11:11','2019-11-11 00:11:11'),(3,'test_setting3','Test Setting - Text','text','Enter setting value',NULL,'value',1,1,'2019-11-11 00:11:11','2019-11-11 00:11:11');
UNLOCK TABLES;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_key_expired_at` timestamp NULL DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `registration_ip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `last_login_ip` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blocked_at` timestamp NULL DEFAULT NULL,
  `role` tinyint(2) DEFAULT '1',
  `enabled` tinyint(1) DEFAULT '1',
  `status` tinyint(2) DEFAULT '10',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx-user` (`username`,`auth_key`,`password_hash`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'admin','Admin','Doe',NULL,NULL,'$2a$10$omXNlezIToo8N1f4chezqekE2s7DMsK6dE.0Af.cRJQ0viwErkZOq',NULL,'admin@boilerplate.local','2019-10-05 13:33:22','127.0.0.1','2019-10-12 02:16:14','172.25.0.1',NULL,99,1,10,'2019-10-05 13:33:22','2019-10-17 12:33:05'),(2,'staff','Staff','Doe',NULL,NULL,'$2a$10$lpJCHDYU6Z13kg3Jy/c46eXlVIuL7n.EBBvFZYj14l0l/1sGG8Aem',NULL,'staff@boilerplate.local','2018-12-31 14:00:00','127.0.0.1','2019-11-13 22:49:37','172.31.0.1',NULL,50,1,10,'2019-10-13 02:47:23','2019-11-14 08:49:37'),(3,'user','User','Doe','7eb5bbfa-caac-4700-ba4a-8d26f24d8eb5','2019-10-17 02:34:43','$2a$10$DxbOVPqNY/ECEKxPrZ6u9O7Flc5z2iuaabJZy82MdEveCRByp3hJ.',NULL,'user@boilerplate.local','2019-11-05 11:52:52','172.22.0.1','2019-11-05 01:53:00','172.20.0.1',NULL,1,1,10,'2019-10-17 12:34:43','2019-11-05 11:53:00');
UNLOCK TABLES;

DROP TABLE IF EXISTS `permission_user`;

CREATE TABLE `permission_user` (
  `permission_id` bigint(11) NOT NULL,
  `user_id` bigint(11) NOT NULL,
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `index3` (`permission_id`,`user_id`),
  KEY `fk_permission_user_permission1_idx` (`permission_id`),
  KEY `fk_permission_user_user1_idx` (`user_id`),
  CONSTRAINT `fk_permission_user_permission1` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_permission_user_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `permission_user` WRITE;
INSERT INTO `permission_user` VALUES (1,2,'{}','2019-11-12 11:49:22'),(2,2,'{}','2019-11-12 11:49:22'),(3,2,'{}','2019-11-12 11:49:22'),(4,2,'{}','2019-11-12 11:49:22');
UNLOCK TABLES;

DROP TABLE IF EXISTS `todo`;

CREATE TABLE `todo` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `position` int(11) DEFAULT '999',
  `state` enum('pending','ongoing','completed','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_todo_user_idx` (`user_id`),
  KEY `idx-todo` (`id`,`status`,`state`,`position`,`user_id`),
  CONSTRAINT `fk_todo_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `todo` WRITE;
INSERT INTO `todo` VALUES (15,2,'My task 1',NULL,1,'pending',1,'2019-11-05 11:25:39','2019-11-24 11:57:58'),(16,2,'My task 2',NULL,2,'pending',1,'2019-11-05 11:25:41','2019-11-24 11:57:58'),(17,2,'My task 3',NULL,3,'pending',1,'2019-11-05 11:25:42','2019-11-24 11:57:58'),(18,2,'My task 4',NULL,4,'pending',1,'2019-11-05 11:25:43','2019-11-24 11:57:58'),(19,2,'My task 5',NULL,5,'pending',1,'2019-11-05 11:25:44','2019-11-24 11:57:58'),(20,2,'My task 6',NULL,1,'ongoing',1,'2019-11-05 11:25:49','2019-11-24 11:57:58'),(21,2,'My task 7',NULL,2,'ongoing',1,'2019-11-05 11:25:52','2019-11-24 11:57:58'),(22,2,'My task 8',NULL,1,'completed',1,'2019-11-05 11:28:09','2019-11-24 11:57:58'),(23,2,'My task 9',NULL,2,'completed',1,'2019-11-05 11:28:14','2019-11-24 11:57:58'),(24,2,'My task 10',NULL,3,'completed',1,'2019-11-05 11:28:18','2019-11-24 11:57:58'),(25,2,'My task 11',NULL,4,'completed',1,'2019-11-05 11:28:19','2019-11-24 11:57:58'),(26,2,'My task 12',NULL,1,'archived',1,'2019-11-05 11:28:23','2019-11-05 11:28:23'),(27,2,'My task 13',NULL,2,'archived',1,'2019-11-05 11:28:24','2019-11-05 11:28:24'),(28,3,'My user task 1',NULL,1,'pending',1,'2019-11-05 11:53:32','2019-11-24 11:57:58'),(29,3,'My user task 2',NULL,2,'pending',1,'2019-11-05 11:53:43','2019-11-24 11:57:58'),(30,3,'My user task 3',NULL,3,'pending',1,'2019-11-05 11:54:07','2019-11-24 11:57:58'),(31,3,'My user task 4',NULL,4,'pending',1,'2019-11-05 11:54:09','2019-11-24 11:57:58'),(32,3,'My user task 5',NULL,5,'pending',1,'2019-11-05 11:54:10','2019-11-24 11:57:58'),(33,3,'My user task 6',NULL,6,'pending',1,'2019-11-05 11:54:11','2019-11-24 11:57:58'),(34,3,'My user task 7',NULL,1,'ongoing',1,'2019-11-05 11:54:18','2019-11-24 11:57:58'),(35,3,'My user task 8',NULL,2,'ongoing',1,'2019-11-05 11:54:19','2019-11-24 11:57:58'),(36,3,'My user task 9',NULL,3,'ongoing',1,'2019-11-05 11:54:20','2019-11-24 11:57:58'),(37,3,'My user task 10',NULL,1,'completed',1,'2019-11-05 11:54:27','2019-11-24 11:57:58'),(38,3,'My user task 11',NULL,1,'archived',1,'2019-11-05 11:54:35','2019-11-05 11:54:35'),(39,3,'My user task 12',NULL,2,'archived',1,'2019-11-05 11:54:37','2019-11-05 11:54:37');
UNLOCK TABLES;
