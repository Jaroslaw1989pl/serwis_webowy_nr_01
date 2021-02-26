//tablica symbolizujaca pola szachownicy
const board_tab = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"],
]

//zmienne przechowujace inforacje o wybranym kolorze pionków (player_1 = białe pionki, player_2 = czarne pionki)
var player = "player_1"; 

//zmienna przechowująca informacje o tym do kogo nalezy ruch (player_1 || player_2)
var player_move = "player_1"; 

//zmienne przechowujące index klikniętego pola 
var index_horizontal; //pola A-H
var index_vertical; //pola 1-8

//zmienne przechowujące informacje o polach
var current_field;
var left_field;
var right_field;
var previous_field;

//poczatkowe ustawienia gry
function defaultSettings()
{
    if(player == "player_1") boardSettings("red", "2", "blue", "1", "player_1");
    else if(player == "player_2") boardSettings( "blue", "1", "red", "2", "player_1");
}

//TYMCZASOWA!!! zmiana początkowych ustawień pionków na planszy
function sideSelection(radio_value)
{
    player = radio_value;

    if(player == "player_1") boardSettings("red", "2", "blue", "1", "player_1");
    else if(player == "player_2") boardSettings( "blue", "1", "red", "2", "player_1");
    
    console.log("radio value: " + player); //LOG
}

//poczatkowe ustawienia pionków na planszy
function boardSettings(color_1, value_1, color_2, value_2, whose_move)
{
    for(i=0; i<board_tab.length; i++)
    {
        for(j=0; j<board_tab[i].length; j++)
        {
            if(document.getElementById(board_tab[i][j]).value!="")
            {
                //ustawianie pionków na górze planszy
                if(i<3)
                {
                    document.getElementById(board_tab[i][j]).style.backgroundColor = color_1;
                    document.getElementById(board_tab[i][j]).value = value_1;
                    document.getElementById(board_tab[i][j]).disabled = true;
                }
                //ustawianie pól środkowych
                else if(i>3 && i<5) 
                {
                    document.getElementById(board_tab[i][j]).value = "0";
                    document.getElementById(board_tab[i][j]).disabled = true;
                }
                //ustawianie pionków na dole planszy
                else if(i>4 && i!=6)
                {
                    document.getElementById(board_tab[i][j]).style.backgroundColor = color_2;
                    document.getElementById(board_tab[i][j]).value = value_2;
                    document.getElementById(board_tab[i][j]).disabled = true;
                }	
            }			
        }
    }
    //przyznanie ruchu jednej ze stron
    player_move = whose_move;
}

//aktywacja ustawień początkowych gry
function startGame(id)
{			
    //sprawdzenie dostępnych pól umozliwiających ruch dla gracza rozpoczynającego partie (player_1)
    freePawnsActivation("1", "2");	

    document.getElementById(id).disabled = true;
    document.getElementById("white_pawns").disabled = true;
    document.getElementById("black_pawns").disabled = true;
}

//funkcja aktywująca pionki z możliwością ruchu
function freePawnsActivation(you, rival)
{
    console.log(player_move); //LOG
    for(i=0; i<board_tab.length; i++)
    {
        for(j=0; j<board_tab[i].length; j++)
        {
			//zmienna przechowujca obiekt, ktorym jest pole o danym indeksie
			var checked_field = document.getElementById(board_tab[i][j]);
			
			//deaktywacja pól pustych
            if(checked_field.value == "0") checked_field.disabled = true;
            //deaktywacja pól zajetych przez przeciwnika
            else if(checked_field.value == rival) checked_field.disabled = true;
            //aktywacja pól z możliwością ruchu
            else if(checked_field.value == you) 
            {
                if(player == player_move)
                {
                    if((document.getElementById(board_tab[i-1][j-1]) != null && document.getElementById(board_tab[i-1][j-1]).value=="0") || (document.getElementById(board_tab[i-1][j+1]) != null && document.getElementById(board_tab[i-1][j+1]).value=="0"))
                        checked_field.disabled = false;
                }
                else if(player != player_move)
                {
                    if((document.getElementById(board_tab[i+1][j+1]) != null && document.getElementById(board_tab[i+1][j+1]).value=="0") || (document.getElementById(board_tab[i+1][j-1]) != null && document.getElementById(board_tab[i+1][j-1]).value=="0"))
                        checked_field.disabled = false;
                }				
            }
        }
    }
}

//FUNKCJE AKTYWOWANE NAJECHANIEM NA ELEMENT
function pawnHighlightOn(id, value)
{
    if(document.getElementById(id).disabled == false)
        document.getElementById(id).style.border = "5px solid orange";
}

function pawnHighlightOff(id, value)
{
    if(document.getElementById(id).disabled == false)
        document.getElementById(id).style.border = "none";
}

function move(id, val, name)
{
	index_vertical = board_tab.length - Number(id.substr(1, 1));
	//warunek sprawdzajcy czy index został znaleziony		
    if(board_tab[index_vertical].indexOf(id)>-1) index_horizontal = board_tab[index_vertical].indexOf(id);
    
    current_field = document.getElementById(board_tab[index_vertical][index_horizontal]);
    if(player == player_move)
    {
        left_field = document.getElementById(board_tab[index_vertical-1][index_horizontal-1]);
        right_field = document.getElementById(board_tab[index_vertical-1][index_horizontal+1]);
    }
    else if(player != player_move)
    {
        left_field = document.getElementById(board_tab[index_vertical+1][index_horizontal+1]);
        right_field = document.getElementById(board_tab[index_vertical+1][index_horizontal-1]);
    }

    current_field.style.backgroundColor = "green";
    current_field.style.border = "none";
    
    //aktywacja pól pozwalajcych na ruch do przodu
    if((left_field != null && left_field.value=="0") || (right_field != null && right_field.value=="0"))
    {	
        if(right_field != null)
        {
            right_field.disabled = false;
            right_field.value="3";
            right_field.style.backgroundColor = "yellow";
            //previous_field=current_field;
        }
        
        if(left_field != null)
        {
            left_field.disabled = false;
            left_field.value="3";
            left_field.style.backgroundColor = "yellow";
            //previous_field=current_field;
        }        
    }

    //zmiana kolejnosci ruchu i sprawdzenie mozliwosci ruchu dla przeciwnika
    if(player_move == "player_1")
    {
        player_move = "player_2";
        freePawnsActivation("2", "1");
    }		
    else if(player_move == "player_2")
    {
        player_move = "player_1";
        freePawnsActivation("1", "2");
    }

    
    //przemieszczenie pionka
    /*if(current_field.value=="3")
    {
        current_field.value = "1";
        current_field.style.backgroundColor = "blue";
        previous_field.style.backgroundColor = "black";
        previous_field.value = "0";
        previous_field.disabled = true;
    }
    
    //alert(current_field.id);*/
}