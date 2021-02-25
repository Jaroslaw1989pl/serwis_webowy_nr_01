<?php

	//funkcja session start pozwala korzystać ze zmiennych globalnych
	session_start();
?>

<!DOCTYPE html>
<html lang="pl">
<head>
	<meta charset="utf-8" >
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
	<meta name="viewport" content="width=device-width,initial-scale=1.0" >
	
	<title>Logowania do serwisu Playfab</title>
</head>
<body>
	<main>
		<header></header>
		
		<article>
			<form action="logowanie.php" method="post">
				<label for="nazwa_uzytkownika">Nazwa użytkownika</label><br>
				<input type="text" id="nazwa_uzytkownika" name="nazwa_uzytkownika" placeholder="Nazwa użytkownika" ><br>
				<br>
				<label for="haslo_uzytkownika">Hasło</label><br>
				<input type="password" id="haslo_uzytkownika" name="haslo_uzytkownika" placeholder="Hasło" ><br>
				<br>
				<!--Opcja: "zapamietaj mnie"-->
				<input type="submit" value="ZALOGUJ SIĘ" ><br>
				<br>
				<!--Opcja: "odzyskiwanie hasła"-->
				<label>Nie masz jeszcze konta? 
					<a href="formularz_rejestracji.php">Zarejestruj się</a>
				</label>
			</form>
		</article>
	</main>
</body>
</html>