<?php

foreach ($comments as $elem) {

    $img = "";

    if ($elem['image']) {
        $img .= '<span class="img_wrap"><img class="" src="/webroot/img/';
        $img .= $elem['image'];
        $img .= '"></span>';
    }

    $authorPage = "";

    if ($elem['homepage']) {
        $authorPage .= '<a href="http://';
        $authorPage .= htmlentities($elem['homepage']);
        $authorPage .= '"><i class="material-icons home_page">link</i></a>';
    }

    $list = '<li><span class="user_info"><p>';
    $list .= htmlentities($elem['author']);
    $list .= '</p>';
    $list .= $authorPage;
    $list .= '<p>';
    $list .= $elem['created_at'];
    $list .= '</p></span><span class="feedback_text">';
    $list .= htmlentities($elem['text']);
    $list .= '</span>';
    $list .= $img;
    $list .= '</li>';

    echo $list;
}
