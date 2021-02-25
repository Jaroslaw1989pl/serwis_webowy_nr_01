<?php
    //funkcja session start musi być dodana do każdego dokumentu korzystającego ze zmiennych globalnych
    session_start();
    
    //przetwarzanie formularza
    
    //warunek sprawdzający, czy formularz został przesłany (nastąpił submit) - jest ustawiona zmienna $_POST
    if(isset($_POST['email'])) //można wybrać jedną ze zmiennych podawanych w formularzu rejestracji
                               //można rozbudować warunek: if(isset($_POST['nickname']) && isset($_POST['email']) && isset($_POST['password']))
    {
        //walidacja formularza - instrukcje wykonywane, gdy nastapił submit formularza
        
        //1. ustanowienie zmiennej $poprawna_walidacja z wartością true 
        $poprawna_walidacja=true;
        
        //2. przeprowadzenie szeregu testów, których niespełnienie przestawi wartość zmiennej $poprawna_walidacja na false
        
        //sprawdzenie poprawności nazwy użytkownika (pobranie danych z formularza)
        $nick = $_POST['nickname'];
        //sprawdzenie długości nazwy użytkownika (min. 3 znaki, max. 20 znaków)
        if((strlen($nick))<3 || (strlen($nick)>20))
        {
            //instrukcje wykonywane, gdy nazwa użytkownika jest za krótka lub za długa
            $poprawna_walidacja=false;
            $_SESSION['e_nick']="Nazwa użytkownika musi posiadać od 3 do 20 znaków."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        //sprawdzenie czy nick nie zawiera innych znaków niż alfanumeryczne za pomocą funkcji ctype_alnum()
        if(ctype_alnum($nick)==false)
        {
            //instrukcje wykonywane, gdy nazwa użytkownika posiada niedozwolone znaki
            $poprawna_walidacja=false;
            $_SESSION['e_nick']="Nazwa użytkownika zawiera niedozwolone znaki."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        //sprawdzenie czy nazwa użytkownika nie jest zajęta
        
        
        //sprawdzenie poprawności adresu e-mail (pobranie danych z formularza)
        $email=$_POST['email'];
        //walidacja adresu email za pomozą funkcji filter_var(zmienna, filtr) usuwającej niedozwolone znaki
        $email_ok=filter_var($email,FILTER_SANITIZE_EMAIL);
        //test walidacyjny 
        if((filter_var($email_ok,FILTER_VALIDATE_EMAIL)==false) || ($email_ok!=$email))
        {
            //instrukcje wykonywane, gdy email jest niepoprawny
            $poprawna_walidacja=false;
            $_SESSION['e_email']="Adres e-mail jest niepoprawny."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        
        //sprawdzenie poprawności hasła (pobranie danych z formularza)
        $pass_1 = $_POST['password'];
        $pass_2 = $_POST['password_2'];
        //sprawdzenie długości hasła (od 8 do 20 znaków)
        if((strlen($pass_1))<8 || (strlen($pass_1))>20)
        {
            //instrukcje wykonywane, gdy hasło jest za krótkie lub za długie
            $poprawna_walidacja=false;
            $_SESSION['e_haslo']="Hasło musi posiadać od 8 do 20 znaków."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        //sprawdzenie zgodności haseł
        if($pass_1!=$pass_2)
        {
            //instrukcje wykonywane, gdy hasła nie są takie same
            $poprawna_walidacja=false;
            $_SESSION['e_haslo']="Podane hasła nie są takie same."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        //hashowanie hasła
        $pass_hash=password_hash($pass_1,PASSWORD_DEFAULT);
        
        //sprawdzenie akceptacji regulaminu
        if(!isset($_POST['checkbox_regulamin']))
        {
            //instrukcje wykonywane, gdy regulamin nie został zakceptowany
            $poprawna_walidacja=false;
            $_SESSION['e_regulamin']="Potwierdź akceptację regulaminu."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        
        //sprawdzenie CAPTCHA
        $secret_key="klucz_prywatny_wygenerowany_podczas_rejestracji_reCAPTCHA";
        //sprawdzenie odpowiedzi Google na poprawność weryfikacji CAPTCHA
        $weryfikacja_captcha=file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret_key.'&response='.$_POST['g-recaptcha-response']);
        $odpowiedz=json_decode($weryfikacja_captcha);
        //po zdekodowaniu nastepuje sprawdzenie czy weryfikacja się udała (true) czy nie (flase)
        if($odpowiedz->success==false) //alternatywnie if(!($odpowiedz->success))
        {
            //instrukcje wykonywane, gdy nie nastąpiło potwierdzenie reCAPTCHA
            $poprawna_walidacja=false;
            $_SESSION['e_captcha']="Potwierdź reCAPTCHA."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
        }
        
        //ustawienie zapamiętywania wprowadzonych do formularza danych - przydatne przy ponownej próbie po nieudanej rejestracji
        $_SESSION['formrej_nick']=$nick;
        $_SESSION['formrej_email']=$email;
        //$_SESSION['formrej_pass_1']=$pass_1;
        //$_SESSION['formrej_pass_2']=$pass_2;
        //zapamiętanie akceptacji regulaminu
        if(isset($_POST['regulamin'])) $_SESSION['formrej_regulamin']=true; //jeśli zmienna regulamin istnieje nadajemy nowej zmiennej formrej_regulamin wartość true
        
        //sprawdzenie, czy dane wprowadzone do formularza istnieją już w bazie danych
        //połączenie się z bazą danych...
        require_once "db_connect.php";
        mysqli_report(MYSQLI_REPORT_STRICT);//informowanie skryptu php aby zamiast ostrzeżeń na stronie wyrzucał wyjątki
        //... w ramach metody try catch
        try
        {
            $polaczenie=new mysqli($host, $db_user, $db_pass, $db_name);//zmienne zawarte w pliku dostępowym do bazy danych (db_connect.php)
                                                                          //znak @ nie jest konieczny w przypadku użycia metody try catch
            if($polaczenie->connect_errno!=0)
            {
                //instrukcje wykonywane w przypadku NIE UDANEJ próby połączenia z bazą danych
                throw new Exception(mysqli_connect_errno());
            }
            else
            {
                //instrukcje wykonywane w przypadku UDANEJ próby połączenia z bazą danych
                //zapytanie sprawdzające czy podana nazwa użytkownika już istnieje w bazie danych
                $rezultat_nick=$polaczenie->query("SELECT id FROM uzytkownicy WHERE nazwa_uzytkownika='$nick'");
                //zapytanie sprawdzające czy podany adres email już istnieje w bazie danych
                $rezultat_email=$polaczenie->query("SELECT id FROM uzytkownicy WHERE e_mail_uzytkownika='$email'"); 
                //warunek wyrzucający wyjątek jesli zapytanie do bazy danych bedzie nieudane
                if(!$rezultat_nick) throw new Exception($polaczenie->error);
                if(!$rezultat_email) throw new Exception($polaczenie->error);
                //pobranie liczby istniejących nazw użytkownika w bazie w przypadku udanej próby zapytania
                $liczba_nickow=$rezultat_nick->num_rows;
                if($liczba_nickow>0)
                {
                    //instrukcje wykonywane, gdy nazwa użytkownika istnieje w bazie danych
                    $poprawna_walidacja=false;
                    $_SESSION['e_nick']="Wybrana nazwa użytkownika jest już zajęta! Wybierz inną nazwę."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
                }   
                //pobranie liczby istniejących adresów email w bazie w przypadku udanej próby zapytania
                $liczba_emaili=$rezultat_email->num_rows;
                if($liczba_emaili>0)
                {
                    //instrukcje wykonywane, gdy adres email istnieje w bazie danych
                    $poprawna_walidacja=false;
                    $_SESSION['e_email']="Istnieje już konto przypisane do tego adresu e-mail."; //nazwa zmiennej informującej o błędzie: e_nazwa_pola_formularza
                }
                
                //sprawdzenie flagi po testach walidacyjnych - poprawności walidacji całego formularza
                if($poprawna_walidacja==true)
                {
                    //zapytanie INSERT dodające nowego użytkownika do bazy oraz 14 dni premium za rejestrację
                    if($polaczenie->query("INSERT INTO uzytkownicy VALUES (NULL, '$nick', '$email', '$pass_hash', now() + INTERWAL 14 DAY)"))
                    {
                        //instrukcja wykonywana w przypadku poprawnego wykonania zapytania do bazy danych i dodania nowego użytkownika
                        $_SESSION['udana_rejestracja']=true;
                        //przekierowanie do strony powitalnej po poprawnej rejestracji i zaproszenie do zalogowania się
                        header('Location: strona_powitalna.php');
                    }
                    else
                    {
                        //instrukcja wyrzucający wyjątek jesli zapytanie do bazy danych bedzie nieudane
                        throw new Exception($polaczenie->error);
                    }
                    
                    
                    //instrukcje wykonywane po poprawnej walidacji wszystkich danych
                    //echo "Poprawna walidacja!";
                    //funkcja exit() zatrzymuje dalsze wykonywanie kodu skryptu 
                    //exit(); 
                }
                
                //zamknięcie połączenia
                $polaczenie->close();
            }                                                                         
        }
        catch(Exception $e)
        {
            //informacja wyświetlana, gdy zostanie wyrzucony wyjątek
            echo '<span style="color:red";>Błąd serwera! Przepraszamy za niedogodności i prosimy o rejestrację w innym terminie!</span>';
            //dodanie informacji dla dewelopera o trości wyjątku zawartej w zmiennej $e (przed publikacją poniższą instrukcję należy zakomentować)
            echo '<br />Informacja dla dewelopera: '.$e;
        }
    }
    
?>
