//tablica symbolizujaca pola szachownicy
var board_tab = [
    ["A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8"],
    ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7"],
    ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6"],
    ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5"],
    ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4"],
    ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3"],
    ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"],
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"],
]

//zmienne przechowujace inforacje o wybranym kolorze pionków (player_1 = białe pionki, player_2 = czarne pionki)
var player = "player_1"; 

//zmienna przechowująca informacje o tym do koGo nalezy ruch (player_1 || player_2)
var player_move = "player_1"; 

var white_pawn_num = 0;
var black_pawn_num = 0;
var initiation = false; //zmienna przechowująca informację o tym czy szachownica została juz zainicjalizowana
var turn_complete = false;

//zmienne przechowujące index klikniętego pola 
var index_horizontal; //pola A-H
var index_vertical; //pola 1-8

var current_pawn;
var previous_pawn;
var left_pawn;
var right_pawn;

/*------------------------------------------------SEKCJA PPRZYGOTOWAŃ DO GRY--------------------------------------------------------*/
//poczatkowe ustawienia gry
function defaultSettings()
{
    
}

//TYMCZASOWA!!! zmiana początkowych ustawień pionków na planszy za pomocą przycisków radio
function sideSelection(radio_value)
{
    player = radio_value;
	
	if(player == "player_1") boardGenerator(board_tab);
    else if(player == "player_2") 
    {
        board_tab.reverse();
        for(i=0; i<board_tab.length; i++)
            board_tab[i].reverse();

        boardGenerator(board_tab); 
    }
}

//aktywacja ustawień początkowych gry przyciskiem start
function startGame(id)
{			
    //sprawdzenie dostępnych pól umozliwiających ruch dla gracza rozpoczynającego partie (player_1)
    freePawnsActivation(player_move.substr(7, 1));	

    document.getElementById(id).disabled = true;
    document.getElementById("white_pawns").disabled = true;
    document.getElementById("black_pawns").disabled = true;
}

//poczatkowe ustawienia pionków na planszy
function boardGenerator(board_tab)
{    
	var board = "";
    
    for(i=-1; i<=board_tab.length; i++)
    {
        if(i==-1) board += '<div class="corner_square"></div>';
        else if(i>-1 && i<board_tab.length) board += '<div class="number_field">'+board_tab[i][0].substr(1, 1)+'</div>';
        else if(i==board_tab.length) board += '<div class="corner_square"></div>';

        for(j=0; j<board_tab.length; j++)
        {
            if(i==-1) board += '<div class="letter_field">'+board_tab[i+1][j].substr(0, 1)+'</div>'; 
            else if((i>-1 && i<board_tab.length) && (i+1)%2==1)
            {
                if(j%2==0) board += '<button id="'+board_tab[i][j]+'" class="field_white" disabled></button>';
                else if(j%2==1) board += '<button id="'+board_tab[i][j]+'" class="field_black" value="0" name="" disabled onclick="pawnInteraction(this.id, this.value, this.name)" onmousemove="pawnHighlightOn(this.id, this.value)" onmouseout="pawnHighlightOff(this.id, this.value)"></button>';
            }
            else if((i>-1 && i<board_tab.length) && (i+1)%2==0)
            {
                if(j%2==1) board += '<button id="'+board_tab[i][j]+'" class="field_white" disabled></button>';
                else if(j%2==0) board += '<button id="'+board_tab[i][j]+'" class="field_black" value="0" name="" disabled onclick="pawnInteraction(this.id, this.value, this.name)" onmousemove="pawnHighlightOn(this.id, this.value)" onmouseout="pawnHighlightOff(this.id, this.value)"></button>';
            }
            else if(i==board_tab.length) board += '<div class="letter_field">'+board_tab[i-1][j].substr(0, 1)+'</div>';          
        }

        if(i==-1) board += '<div class="corner_square"></div>';
        else if(i>-1 && i<board_tab.length) board += '<div class="number_field">'+board_tab[i][0].substr(1, 1)+'</div>';
        else if(i==board_tab.length) board += '<div class="corner_square"></div>';

        board += '<div style="clear: both;"></div>';
    }
	
	document.getElementById("board").innerHTML = board;
	
	if(player == "player_1") boardSettings("red", "2", "blue", "1", "player_1");
    else if(player == "player_2") boardSettings( "blue", "1", "red", "2", "player_1");

    document.getElementById("score_board").innerHTML = '<p>białe pionki: '+white_pawn_num+' | czarne pionki: '+black_pawn_num+'</p><br>';
}

function boardSettings(color_1, value_1, color_2, value_2, whose_move)
{
    

    for(i=0; i<board_tab.length; i++)
    {
        for(j=(i+1)%2; j<board_tab[i].length; j+=2)
        {
            //ustawianie pionków na górze planszy
            if(i<1)
            {
                document.getElementById(board_tab[i][j]).style.backgroundColor = color_1;
                document.getElementById(board_tab[i][j]).name = "pawn";
                document.getElementById(board_tab[i][j]).value = value_1;
                document.getElementById(board_tab[i][j]).disabled = true;
				//zliczanie ustawionych pionków
                if(initiation == false)
                {
                    if(player == "player_1") 
                    {
                        white_pawn_num = white_pawn_num;
                        black_pawn_num++;
                    }
                    else if(player == "player_2") 
                    {
                        white_pawn_num++;
                        black_pawn_num = black_pawn_num;
                    }
                }
            }
            //ustawianie pionków na dole planszy
            else if(i>6)
            {
                document.getElementById(board_tab[i][j]).style.backgroundColor = color_2;
        		document.getElementById(board_tab[i][j]).name = "pawn";
                document.getElementById(board_tab[i][j]).value = value_2;
                document.getElementById(board_tab[i][j]).disabled = true;
                //zliczanie ustawionych pionków
                if(initiation == false)
                {
                    if(player == "player_1") 
                    {
                        white_pawn_num++
                        black_pawn_num = black_pawn_num;
                    }
                    else if(player == "player_2") 
                    {
                        white_pawn_num = white_pawn_num;
                        black_pawn_num++;
                    }
                }
            }	 			
        }
    }
    initiation = true;
    //przyznanie ruchu jednej ze stron
    //player_move = whose_move;
}


/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^SEKCJA PPRZYGOTOWAŃ DO GRY^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
/*---------------------------------------------SEKCJA DZIAŁAŃ POMIĘDZY RUCHAMI------------------------------------------------------*/

//funkcja aktywująca pionki z możliwością ruchu
function freePawnsActivation(player_value)
{
	var num_of_captures = 0;
	var checked_pawns = 0; //zmienna informująca o tym ile pionków zostało sprawdzonych
	var captures_checked = false; //zmienna informująca o tym czy bicia zostały sprawdzone

    Activation_loop:
    for(i=0; i<board_tab.length; i++)
    { 
        for(j=(i+1)%2; j<board_tab[i].length; j+=2)
        {
            //deaktywacja pionków przeciwnika
            if(document.getElementById(board_tab[i][j]).value != player_value) 
                document.getElementById(board_tab[i][j]).disabled = true;
            //aktywacja pionków gracza z mozliwością bicia lub ruchu
            else if(document.getElementById(board_tab[i][j]).value == player_value) 
            {console.log(i+" "+j);
				//sprawdzanie mozliwości bicia
				if(captures_checked == false)
				{
					if(pawnCaptureDetection(i, j) > 0) 
					{
						document.getElementById(board_tab[i][j]).disabled = false;
						num_of_captures++;
                        checked_pawns++;
						console.log("bicie:"+document.getElementById(board_tab[i][j]).id);
						if(checked_pawns == ((player_value == "1") ? white_pawn_num : black_pawn_num))
						{
							captures_checked = true;
							i = 0;
							break;
						}
						else continue;
					}
					else if(pawnCaptureDetection(i, j) == 0) 
					{
						document.getElementById(board_tab[i][j]).disabled = true;
                        checked_pawns++;
						console.log("BRAK bicia:"+document.getElementById(board_tab[i][j]).id);
						if(checked_pawns == ((player_value == "1") ? white_pawn_num : black_pawn_num))
						{
							captures_checked = true;
							i = 0;
							continue Activation_loop;
						}
						else continue;
					}
				}
				
				//sprawdzanie możliwości ruchu bez bicia
				else if(captures_checked == true && num_of_captures == 0)
				{
					if(pawnMoveDetection(i, j) == true) 
                    {
                        console.log("ruch:"+document.getElementById(board_tab[i][j]).id);
                        document.getElementById(board_tab[i][j]).disabled = false;
                    }
					else if(pawnMoveDetection(i, j) == false) 
                    {
                        console.log("BRAK ruchu:"+document.getElementById(board_tab[i][j]).id);
                        document.getElementById(board_tab[i][j]).disabled = true;
                    }
				}
            }
        }
    }
	console.log("---------"+checked_pawns+"--------"+captures_checked);
}

//Funkcja sprawdzająca mozliwości ruchu pionka
function pawnMoveDetection(vertical, horizontal)
{
    if(player == player_move)
    {
        left_pawn = document.getElementById(board_tab[vertical-1][horizontal-1]);
        right_pawn = document.getElementById(board_tab[vertical-1][horizontal+1]);
        
        if((left_pawn != null && left_pawn.value == "0") || (right_pawn != null && right_pawn.value == "0")) 
            return true;
        else return false;
    }
    else if(player != player_move)
    {
        left_pawn = document.getElementById(board_tab[vertical+1][horizontal+1]);
        right_pawn = document.getElementById(board_tab[vertical+1][horizontal-1]);

        if((left_pawn != null && left_pawn.value == "0") || (right_pawn != null && right_pawn.value == "0")) 
            return true;
        else return false;
        
    }	
}
//Funkcja sprawdzająca mozliwości bicia przez pionek
function pawnCaptureDetection(vertical, horizontal)
{
	var rival_value = (player_move == "player_1") ? "2" : "1";

	for(a=vertical-1; a<=vertical+1; a+=2)
	{
		for(b=horizontal-1; b<=horizontal+1; b+=2)
		{
			if(a < 0 || a >= board_tab.length) continue;
            else
            {
                if(document.getElementById(board_tab[a][b]) == null) continue;
                else if(document.getElementById(board_tab[a][b]).value == rival_value) 
                { 
                    if(document.getElementById(board_tab[(vertical*(-1)+a+a)][(horizontal*(-1)+b+b)]) == null) continue;
                    else if(document.getElementById(board_tab[(vertical*(-1)+a+a)][(horizontal*(-1)+b+b)]).value == "0") return 1;
                }
            }
		}
	}
	return 0;
}

/*//Funkcja sprawdzająca mozliwości ruchu damy
function queenMoveDetection(checked_field)
{
    return 0;	
}
//Funkcja sprawdzająca mozliwości bicia przez damę
function queenCaptureDetection(checked_field)
{
    return 0;		
}
*/

/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^SEKCJA DZIAŁAŃ POMIĘDZY RUCHAMI^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
/*--------------------------------------------------SEKCJA RUCHÓW PIONKÓW-----------------------------------------------------------*/

//FUNKCJE AKTYWOWANE NAJECHANIEM NA ELEMENT
function pawnHighlightOn(id, value)
{
    if(document.getElementById(id).disabled == false) document.getElementById(id).style.border = "5px solid orange";
}

function pawnHighlightOff(id, value)
{
    if(document.getElementById(id).disabled == false) document.getElementById(id).style.border = "none";
}

function pawnInteraction(id, val, name)
{
    //Deaktywacja aktywnych pól po wybraniu innego pionka
    if(previous_pawn != null)
    {
        current_pawn.disabled = false;
        if(left_pawn != null) left_pawn.disabled = true;
        if(right_pawn != null) right_pawn.disabled = true;        
    }

    if(player == "player_1") index_vertical = board_tab.length - Number(id.substr(1, 1));
    else if(player == "player_2") index_vertical = Number(id.substr(1, 1))-1;
	index_horizontal = board_tab[index_vertical].indexOf(id);

    current_pawn = document.getElementById(id);
    current_pawn.style.border = "none";

    //Sprawdzenie czy wybrany został pionek czy puste pole
    if(val == "1" || val == "2")
    {
        previous_pawn = current_pawn;

        //Sprawdzenie czy to pionek czy dama?
        if(name == "pawn")
        {
            //Sprawdzenie czy pionek ma mozliwość bicia?
            if(pawnCaptureDetection(index_vertical, index_horizontal) == 0)
            {
                //aktywacja pól z możliwością ruchu
                if(player == player_move)
                {
                    left_pawn = document.getElementById(board_tab[index_vertical-1][index_horizontal-1]);
                    right_pawn = document.getElementById(board_tab[index_vertical-1][index_horizontal+1]);
                }
                else if(player != player_move)
                {
                    left_pawn = document.getElementById(board_tab[index_vertical+1][index_horizontal+1]);
                    right_pawn = document.getElementById(board_tab[index_vertical+1][index_horizontal-1]);  
                }

                if(left_pawn != null && left_pawn.value == "0") left_pawn.disabled = false;

                if(right_pawn != null && right_pawn.value == "0") right_pawn.disabled = false;
            }
            else if(pawnCaptureDetection(index_vertical, index_horizontal) > 0)
            {
                //aktywacja pól z możliwością bicia
                var rival_value = (player_move == "player_1") ? "2" : "1";

                for(a=index_vertical-1; a<=index_vertical+1; a+=2)
                {
                    for(b=index_horizontal-1; b<=index_horizontal+1; b+=2)
                    {
                        if(a < 0 || a >= board_tab.length) continue;
                        else
                        {
                            if(document.getElementById(board_tab[a][b]) == null) continue;
                            else if(document.getElementById(board_tab[a][b]).value == rival_value) 
                            { 
                                if(document.getElementById(board_tab[(index_vertical*(-1)+a+a)][(index_horizontal*(-1)+b+b)]) == null) continue;
                                else if(document.getElementById(board_tab[(index_vertical*(-1)+a+a)][(index_horizontal*(-1)+b+b)]).value == "0") 
                                    document.getElementById(board_tab[(index_vertical*(-1)+a+a)][(index_horizontal*(-1)+b+b)]).disabled = false;
                            }
                        }
                    }
                }
            }
        }
        else if(name == "queen")
        {
            //Sprawdzenie czy dama ma mozliwość bicia?
            if(queenCaptureDetection(current_pawn) == 0)
            {
                //aktywacja pól z możliwością ruchu
            }
            else if(queenCaptureDetection(current_pawn) > 0)
            {
                //!!!Funkcja aktywująca pola podczas bicia przez damę
            }
        }        
        current_pawn.disabled = true;
    }
    else if(val == "0")
    {
        current_pawn.style.backgroundColor = previous_pawn.style.backgroundColor;
        current_pawn.innerHTML = previous_pawn.innerHTML;
        current_pawn.value = previous_pawn.value;
        current_pawn.name = previous_pawn.name;

        previous_pawn.style.backgroundColor = "black";
        previous_pawn.innerHTML = "";
        previous_pawn.value = val;
        previous_pawn.name = name;

        turn_complete = true;
        previous_pawn = null;

        if(turn_complete == true && player_move == "player_1")
        {
            player_move = "player_2";
            turn_complete = false;
            freePawnsActivation("2");
        }		
        else if(turn_complete == true && player_move == "player_2")
        {
            player_move = "player_1";
            turn_complete = false;
            freePawnsActivation("1");
        }
        //wyswietlanie wyniku
        document.getElementById("score_board").innerHTML = '<p>białe pionki: '+white_pawn_num+' | czarne pionki: '+black_pawn_num+'</p><br>';
    }
}

/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^SEKCJA RUCHÓW PIONKÓW^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
/*--------------------------------------------------SEKCJA ??????????????-----------------------------------------------------------*/