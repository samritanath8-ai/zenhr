<?php foreach(glob("config/*.php") as $c){try{$v=require $c;if(!is_array($v))echo "BAD: ".$c.PHP_EOL;}catch(Throwable $e){echo "ERROR in ".$c.": ".$e->getMessage().PHP_EOL;}}
