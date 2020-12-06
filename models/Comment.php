<?php

namespace Models;

use config\DB;


class Comment
{
    private static $pdo = null;

    public function __construct()
    {
        if (!self::$pdo) {
            self::$pdo = (new DB)::$pdo;
        }
    }


    public function getComments($sort, $start)
    {
        $whiteList = [
            "name-asc"  => "author",
            "name-desc" => "author DESC",
            "mail-asc" => "email",
            "mail-desc" => "email DESC",
            "data-asc" => "created_at"
        ];

        $sortQuery = "created_at DESC";

        if (array_key_exists($sort, $whiteList)) {
            $sortQuery = $whiteList[$sort];
        }

        $query = "SELECT `text`, `image`, `created_at`, `author`, `homepage`
                  FROM `comments`
                  ORDER BY " . $sortQuery . "
                  LIMIT ?,10
                  ";

        $stmt = self::$pdo->prepare($query);
        $stmt->execute([$start]);
        return $stmt->fetchAll();
    }


    public function getCount()
    {
        $query = "SELECT count(`id`) FROM `comments`";
        $stmt = self::$pdo->prepare($query);
        $stmt->execute();
        return $stmt->fetchColumn();
    }


    public function checkMail($request)
    {
        $data = mb_substr($request, 0, 70, 'UTF-8');

        $query = "SELECT count(`email`)
                  FROM `comments`
                  WHERE `email` = ? ";

        $stmt = self::$pdo->prepare($query);
        $stmt->execute([$data]);
        $totalRows = $stmt->fetchColumn();

        return $totalRows;
    }


    public function addComment($request)
    {
        function sanitizer($data, $filter, $length)
        {
            $result = mb_substr(trim($data), 0, $length, 'UTF-8');
            $result = filter_var($result, $filter);
            return $result;
        }

        $email = sanitizer($request['mail'], FILTER_VALIDATE_EMAIL, 100);
        $homepage = sanitizer($request['page'], FILTER_SANITIZE_URL, 100);
        $feedback = sanitizer($request['feedback'], FILTER_SANITIZE_STRING, 900);
        $name = sanitizer($request['name'], FILTER_SANITIZE_STRING, 100);
        $name = preg_replace('/[^ a-z\d]/ui', '', $name);

        $imageName = "";
        $image = $request['image'];

        if ($image) {
            $uploaddir = "./webroot/img/";
            $imageName .= time() . uniqid(rand()) . ".jpeg";
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $temp = imagecreatefromstring(base64_decode($image));
            imagejpeg($temp, $uploaddir . $imageName, 95);
            imagedestroy($temp);
        }

        $query = "INSERT INTO `comments` 
                  VALUES (
                    0, ?, ?, ?, ?, ?, NOW(), NOW() 
                  )";

        $stmt = self::$pdo->prepare($query);
        $stmt->execute([$feedback, $imageName, $name, $email, $homepage]);
    }


    public function tableMaker()
    {
        $query = "CREATE TABLE IF NOT EXISTS comments (
                  id INT(11) NOT NULL AUTO_INCREMENT,
                  text VARCHAR(1000) NOT NULL,
                  image TINYTEXT NOT NULL,
                  author CHAR(40) NOT NULL,
                  email CHAR(70) NOT NULL,
                  homepage TINYTEXT NOT NULL,
                  created_at DATETIME NOT NULL,
                  updated_at DATETIME NOT NULL,
                  PRIMARY KEY (id)
                  )";

        $stmt = self::$pdo->prepare($query);
        return $stmt->execute();
    }
}
