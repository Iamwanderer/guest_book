<?php

define('ROOT', dirname(__FILE__));
require_once ( ROOT . '/config/connection.php');
require_once ( ROOT . '/config/loader.php');

use config\Router;


(new Router)->run();
