<?php

return [
    'sort-(\w{4}-\w{3,4})/page([1-9][0-9]*$)' => 'site/index/$1,$2',
    'sort-(\w{4}-\w{3,4})' => 'site/index/$1,1',
    'page([1-9][0-9]*$)' => 'site/index/id-desc,$1',
    'add' => 'site/add-comment',
    'check' => 'site/check-email',
    'maker' => 'site/table-maker',
    '' => 'site/index/id-desc,1',
];
