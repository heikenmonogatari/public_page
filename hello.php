
<?php 
	$name = ($_POST["name"]);
	$displayedName = ($_POST['displayedName']);

	$ids = array();

	foreach ($_POST['ids'] as $selectedOption) {
    	array_push($ids, ["id" => (int)$selectedOption, "name" => $_POST[$selectedOption]]);
	}

    $string = file_get_contents("./test.json");
	$json = json_decode($string, true);

	for ($i = 0; $i < count($json); $i++) {
		if ($json[$i]['name'] == $name) {
			$json[$i]['displayedName'] = $displayedName;
			$json[$i]['counting_site'] = $ids;
			break;
		}
		if ($i == count($json)-1) {
			array_push($json, ["name" => $name, "displayedName" => $displayedName, "counting_site" => $ids]);
		}
	}

	$fp = fopen('test.json', 'w');

	fwrite($fp, json_encode($json));
	fclose($fp);
?> 
