<?php

	//funkcja session start pozwala korzystać ze zmiennych globalnych
	session_start();
?>

<!DOCTYPE html>
<html labg="pl">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
	<meta name="viewport" content="width=device-width,initial-scale=1.0" >
	
	<title>Formularz rejestracji do serwisu webowego nr 01</title>
</head>
<body>
	<main>
		<header>
			<p>Masz już konto? <a href="formularz_logowania.php">Zaloguj się<a>
		</header>
		
		<article>
			<form action="rejestracja.php" method="post" >
				<label for="nazwa_uzytkownika">Nazwa użytkownika</label><br>
				<input type="text" id="nazwa_uzytkownika" name="nazwa_uzytkownika" placeholder="Nazwa użytkownika" maxlength="7" ><br>
				<br>
				<label for="email_uzytkownika">Adres e-mail użytkownika</label><br>
				<input type="e-mail" id="email_uzytkownika" name="email_uzytkownika" placeholder="Adres e-mail użytkownika" ><br>
				<br>
				<label for="haslo_uzytkownia_1">Hasło</label><br>
				<input type="password" id="haslo_uzytkownia_1" name="haslo_uzytkownia_1" placeholder="Hasło" ><br>
				<br>
				<label for="haslo_uzytkownia_2">Powtórz hasło</label><br>
				<input type="password" id="haslo_uzytkownia_2" name="haslo_uzytkownia_2" placeholder="Powtórz hasło" ><br>
				<br>
				<label for="checkbox_regulamin">
					<input type="checkbox" id="checkbox_regulamin" name="checkbox_regulamin">Akceptuję
				</label><a href="regulamin.php">regulamin<a><br>
				<br>
				<input type="submit" value="ZAREJESTRUJ SIĘ" >
			</form>
		</article>
	</main>
</body>
</html>