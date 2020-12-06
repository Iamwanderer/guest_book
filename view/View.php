<?php

namespace view;

define('VIEWS_BASEDIR', dirname(__FILE__) . '/');

class View
{
    function fetchPartial($template, $params = [])
    {
        extract($params);
        ob_start();
        include VIEWS_BASEDIR . $template . '.php';
        return ob_get_clean();
    }

    function fetch($template, $params = [])
    {
        $content = $this->fetchPartial($template, $params);
        return $this->fetchPartial('layout', ['content' => $content]);
    }

    function render($template, $params = [])
    {
        echo $this->fetch($template, $params);
    }
}
