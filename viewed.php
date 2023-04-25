<?php
//echo "Made it";
// Set your timezone!!
date_default_timezone_set('America/Chicago');
	    $time_date =date('Y-m-d H:i:s');
		
			$path = $_SERVER['DOCUMENT_ROOT'];
	$path .= "/Includes/db_Conx/index.php";
	include($path);  
		
			//$user_ip = getenv('REMOTE_ADDR');
		//$guestCurrentURL =  $_SERVER['REQUEST_URI']; 
		
		  $user_ip = clean_Input($db_conx, $_POST['ip']);
		  $guestCurrentURL = clean_Input($db_conx, $_POST['url']);
		  $refererURL = clean_Input($db_conx, $_POST['rURL']);

		$sqlx = "SELECT * FROM GuestLogTable WHERE guestIPAddress='$user_ip' LIMIT 1";
        $queryx = mysqli_query($db_conx, $sqlx);
	$rowx = mysqli_num_rows($queryx);
	//mysqli_close($db_conx);
		
		
		
		
	$geoPlugin = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));

	if($geoPlugin == null){
		
		    $ipApi = unserialize(file_get_contents('http://ip-api.com/php/'.$user_ip));

		
$currentRegionCode = $ipApi["region"];
$currentCity = $ipApi["city"];
$currentZipCode = $ipApi["zip"];
$currentLatitude = $ipApi["lat"];
$currentLongitude = $ipApi["lon"];
$currentCountry = $ipApi["country"];
$currentRegionName = $ipApi["regionName"];
$currentISP = $ipApi["isp"];
$currentISpOrg = $ipApi["org"];
$currentISpAS = $ipApi["as"];

		/*
		echo"
$currentRegionCode region<br>
$currentCity  city<br>
$currentZipCode  zip<br>
$currentLatitude lat<br>
$currentLongitude lon<br>
$currentCountry  country<br>
$currentRegionName  regionName<br>
$currentISP  isp<br>
$currentISpOrg  org<br>
$currentISpAS  as<br>
		";*/
			
	}else{
		
		$currentRegionName = $geoPlugin["geoplugin_regionName"];
$currentCity = $geoPlugin["geoplugin_city"];
$currentCountry = $geoPlugin["geoplugin_countryName"];
$currentLatitude = $geoPlugin["geoplugin_latitude"];
$currentLongitude = $geoPlugin["geoplugin_longitude"];
$currentRegionCodeName = $geoPlugin["geoplugin_region"];
$currentRegionCode = $geoPlugin["geoplugin_regionCode"];
$currentAreaCode = $geoPlugin["geoplugin_areaCode"];
$currentDMA = $geoPlugin["geoplugin_dmaCode"];
$currentCountryCode = $geoPlugin["geoplugin_countryCode"];
$currentCurrencySymbol = $geoPlugin["geoplugin_currencySymbol"];
$currentCurrencyCode = $geoPlugin["geoplugin_currencyCode"];
$currentCurrencyConverter = $geoPlugin["geoplugin_currencyConverter"];
$currentCurrencySymbolUTF8 = $geoPlugin["geoplugin_currencySymbol_UTF8"];
		


			    $ipApi = unserialize(file_get_contents('http://ip-api.com/php/'.$user_ip));

		

$currentZipCode = $ipApi["zip"];

	}
		
		
		if($rowx > 0 ){


			$sqlz = "UPDATE GuestLogTable SET guestCountry = '$currentCountry', guestState = '$currentRegionName', portfolioView = '$time_date' WHERE guestIPAddress='$user_ip' LIMIT 1";
            $queryz = mysqli_query($db_conx, $sqlz);
		if($queryz){
		//exit;
			echo "updated";
		}else{
						echo "Fail 1";

		}

		}else{
		$sqlq = "INSERT INTO GuestLogTable (guestIPAddress, guestFirstVisitDate, portfolioView, guestUpdateCounts, guestURL_Referral_1,guestCurrentURL,guestCountry,guestState) VALUES ('$user_ip','$time_date','$time_date','1','$refererURL','$guestCurrentURL','$currentCountry','$currentRegionName' )";
		$queryq = mysqli_query($db_conx, $sqlq);

			if($queryq){
		//exit;
			echo "updated";
		}else{
						echo "Fail 2 $sqlq";

		}
			
			
			
		}
		

		
		
		?>