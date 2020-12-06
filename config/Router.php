<?php

namespace config;

class Router
{
    private $routes;

    public function __construct()
    {
        $routesPath = ROOT . '/config/routes.php';
        $this->routes = include($routesPath);
    }

    function getURI()
    {
        if (!empty($_SERVER['REQUEST_URI'])) {
            return trim($_SERVER['REQUEST_URI'], '/');
        }
    }


    public function run()
    {
        $uri = $this->getURI();

        foreach ($this->routes as $pattern => $route) {

            if (preg_match("~$pattern~", $uri)) {

                $internalRoute = preg_replace("~$pattern~", $route, $uri);
                $segments = explode('/', $internalRoute);
                $controller = '\controllers\\' . ucfirst(array_shift($segments)) . 'Controller';

                $action = 'action' . ucfirst(array_shift($segments));
                $action = explode('-', $action);
                $camelPart = (isset($action[1])) ? ucfirst($action[1]) : "";
                $action = $action[0] . $camelPart;

                $params = $segments;

                $controllerFile = ROOT . $controller . '.php';

                if (file_exists($controllerFile)) {
                    include($controllerFile);
                }

                if (!is_callable(array($controller, $action))) {
                    header("HTTP/1.0 404 Not Found");
                    return;
                }

                call_user_func_array([$controller, $action], $params);
                exit;
            }
        }
    }
}
