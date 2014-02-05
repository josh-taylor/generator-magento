<?php

if (preg_match('#^/api/rest#', $_SERVER["REQUEST_URI"])) {
    $_SERVER["REQUEST_URI"] = 'api.php?type=rest';
} elseif (preg_match('#^/(media|skin|js)#', $_SERVER["REQUEST_URI"])) {
    return false;
} elseif (file_exists(".".$_SERVER["REQUEST_URI"]))  {
    return false;
} else {
    include_once 'index.php';
}
