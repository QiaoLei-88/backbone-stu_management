<?php


$validateValue=$_REQUEST['fieldValue'];
$validateId=$_REQUEST['fieldId'];

/* RETURN VALUE */
$arrayToJs = array();
$arrayToJs[0] = $validateId;

//数据库连接检测
$con = mysql_connect("localhost:3306","root","");
if (!$con)
{
	die(json_encode(array('code' => mysql_error())));
}

mysql_select_db("stu_management", $con);

mysql_query("SET NAMES utf8"); 

$result = mysql_query("SELECT * FROM student WHERE stu_id='".$validateValue."'");
$row = mysql_fetch_array($result);

if($row){
	$arrayToJs[1] = false;			
	echo json_encode($arrayToJs);				
}
else{
	$arrayToJs[1] = true;
	echo json_encode($arrayToJs);		
}

mysql_close($con);

?>