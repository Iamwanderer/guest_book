<?php

namespace controllers;

use \models\Comment;
use \view\View;

class SiteController
{
    public static function actionIndex($params)
    {
        $params = explode(',', $params);
        $sort = $params[0];
        $page = $params[1];
        $start = ($page - 1) * 10;

        $model = new Comment;
        $comments = $model->getComments($sort, $start);
        $count = $model->getCount();

        (new View)->render('default', [
            'comments' => $comments, 'count' => $count, 'page' => $page
        ]);
    }


    public static function actionCheckEmail()
    {
        $data = file_get_contents('php://input');
        $request = json_decode($data, true);
        echo (new Comment)->checkMail($request);
    }


    public static function actionAddComment()
    {
        $data = file_get_contents('php://input');
        $request = json_decode($data, true);
        (new Comment)->addComment($request);
    }

    
    public static function actionTableMaker()
    {
        (new Comment)->tableMaker();
        header('Location: /');
    }
}
