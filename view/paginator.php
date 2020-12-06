<?php

$perPage = 10;
$numPages = ceil($count / $perPage);

if ($numPages == 0) {
    $numPages = 1;
}

if ($page > 1) {
    $backLnk = '<li class="page_navigator"><a href="./';

    if ($page != 2) {                    //SEO
        $backLnk .= 'page';
        $backLnk .= ($page - 1);
    }

    $backLnk .= '">&#8592; </a></li>';
} else {
    $backLnk = '<li>&#8592; <span class="media_pc">&nbsp;</span></li>';
}

$paginatorList = $backLnk;

if ($page >= $numPages) {
    $forwardLnk = '<li><span class="media_pc">&nbsp;</span>&#8594;</li>';
} else {
    $forwardLnk = '<li class="page_navigator"><a href="./';
    $forwardLnk .= 'page';
    $forwardLnk .= ($page + 1);
    $forwardLnk .= '">&#8594;</a></li>';
}

for ($i = 1; $i <= $numPages; $i++) {
    if ($page != $i) {
        $paginator = '<li class="media_pc"><a href="./';

        if ($i != 1) {               //SEO
            $paginator .= 'page';
            $paginator .= $i;
        }

        $paginator .= '">';
        $paginator .= $i;
        $paginator .= '</a></li>';
    } else {
        $paginator = '<li><span class="current_page">';
        $paginator .= $i;
        $paginator .= '</span></li>';
    }
    $paginatorList .= $paginator;
}
$paginatorList .= $forwardLnk;

if (!$count) $paginatorList = "";
echo $paginatorList;
