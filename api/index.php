<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/', 'getStudents');
$app->get('/:id',	'getStudent');
$app->post('/', 'addStudent');
$app->put('/:id', 'updateStudent');
$app->delete('/:id','deleteStudent');

$app->run();

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="";
	$dbname="stu_management";
	$options = array(
	    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
	); 
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass,$options);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getStudents(){
	$sql = "select * from student ORDER BY intended_time";
	try{
		$db = getConnection();
		$stmt = $db->query($sql);
		$student = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null ;
		echo json_encode($student); 
	}catch(PDOException $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getStudent($id) {
	$sql = "SELECT * FROM student WHERE stu_id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$student = $stmt->fetchObject();  
		$db = null;
		echo json_encode($student); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
} 
function addStudent() {

	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$student = json_decode($body);
	$sql = "INSERT INTO student (stu_id, name, sex, intended_time, score) VALUES (:stu_id, :name, :sex, :intended_time, :score)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->bindParam("stu_id", $student->stu_id); 
		$stmt->bindParam("name", $student->name);
		$stmt->bindParam("sex", $student->sex);
		$stmt->bindParam("intended_time", $student->intended_time);
		$stmt->bindParam("score", $student->score);
		$stmt->execute();
		$student->id = $db->lastInsertId();
		$db = null;
		echo json_encode($student); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


function updateStudent($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$student = json_decode($body);
	$sql = "UPDATE student SET stu_id=:stu_id,name=:name, sex=:sex, intended_time=:intended_time, score=:score WHERE stu_id=:stu_id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql); 
		$stmt->bindParam("stu_id", $student->stu_id); 
		$stmt->bindParam("name", $student->name);
		$stmt->bindParam("sex", $student->sex);
		$stmt->bindParam("intended_time", $student->intended_time);
		$stmt->bindParam("score", $student->score);
		$stmt->execute();
		$student->id = $db->lastInsertId();
		$db = null;
		echo json_encode($student);  
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}

}
function deleteStudent($id) {
	$sql = "DELETE FROM student WHERE stu_id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


?>