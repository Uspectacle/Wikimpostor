using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Manager : MonoBehaviour
{
    // Welcome Declaration
    public GameObject Welcome;

    // Pass Declaration
    public GameObject Pass;
    public Text passName;

    // Player Declaration
    public GameObject Player;
    public Text PlayerName;
    public Text PlayerArticle;
    public InputField EnterName;
    public InputField EnterArticle;
    public GameObject BoxName;
    public GameObject BoxArticle;
    public GameObject DoneName;
    public GameObject DoneArticle;
    bool isName;
    bool isArticle;
    public GameObject Done;

    // End Declaration
    public GameObject End;
    public GameObject[] Lines;
    public Text[] lineNames;
    public GameObject[] Minus;
    public GameObject Plus;
    public GameObject Play;

    // Card Declaration
    public GameObject Card;
    public Text ChosenArticle;
    public GameObject ExitButton;

    // Data Declaration
    string name1 = "";
    string name2 = "";
    string name3 = "";
    string name4 = "";
    string name5 = "";
    string article1 = "";
    string article2 = "";
    string article3 = "";
    string article4 = "";
    string article5 = "";

    // Management Declaration
    string state;
    int currentPlayer = 1;
    string currentName;
    string currentArticle;
    int numberPlayers = 0;
    int numberArticles = 0;



    // Usefull Functions
    void Activate(GameObject panel)
    {
        Welcome.SetActive(false);
        Card.SetActive(false);
        Pass.SetActive(false);
        End.SetActive(false);
        Player.SetActive(false);
        panel.SetActive(true);
    }
    string getName(int i)
    {
        if (i == 1)
        {
            return name1;
        }
        if (i == 2)
        {
            return name2;
        }
        if (i == 3)
        {
            return name3;
        }
        if (i == 4)
        {
            return name4;
        }
        if (i == 5)
        {
            return name5;
        }
        return "ERROR";
    }
    string getArticle(int i)
    {
        if (i == 1)
        {
            return article1;
        }
        if (i == 2)
        {
            return article2;
        }
        if (i == 3)
        {
            return article3;
        }
        if (i == 4)
        {
            return article4;
        }
        if (i == 5)
        {
            return article5;
        }
        return "ERROR";
    }
    void setName(int i, string name)
    {
        if (i == 1)
        {
            name1 = name;
        }
        if (i == 2)
        {
            name2 = name;
        }
        if (i == 3)
        {
            name3 = name;
        }
        if (i == 4)
        {
            name4 = name;
        }
        if (i == 5)
        {
            name5 = name;
        }
    }
    void setArticle(int i, string article)
    {
        if (i == 1)
        {
            article1 = article;
        }
        if (i == 2)
        {
            article2 = article;
        }
        if (i == 3)
        {
            article3 = article;
        }
        if (i == 4)
        {
            article4 = article;
        }
        if (i == 5)
        {
            article5 = article;
        }
    }
    void updateNumbers()
    {
        numberPlayers = 0;
        numberArticles = 0;

        for (int i = 1; i < 6; i++)
        {
            if (getName(i).Length > 0)
            {
                numberPlayers++;
            }
            if (getArticle(i).Length > 0)
            {
                numberArticles++;
            }
        }
    }
    void Swap(int i, int j)
    {
        string hand = getName(i);
        setName(i, getName(j));
        setName(j, hand);

        hand = getArticle(i);
        setArticle(i, getArticle(j));
        setArticle(j, hand);
    }
    void Sort()
    {
        for (int i = 1; i < 5; i++)
        {
            if (getName(i).Length == 0)
            {
                for (int j = i; j < 6; j++)
                {
                    if (getName(j).Length > 0)
                    {
                        Swap(i, j);
                        break;
                    }
                }
            }
        }
    }




    // Welcome
    void DoStart()
    {
        Activate(Welcome);
        state = "Welcome";
    }
    void Start()
    {
        state = "Start";
        updateNumbers();
        Sort();
    }

    public void Begin()
    {
        state = "Exit Welcome";
    }

    void DoExitWelcome()
    {
        state = "Done";
    }




    // Pass
    void DoDone()
    {
        if (numberPlayers < 2)
        {
            NewPlayer();
        }
        else
        {
            state = "Main";
        }
    }

    void DoAsk()
    {
        Activate(Pass);
        state = "Pass";

        passName.text = getName(currentPlayer);
        if (passName.text.Length == 0)
        {
            passName.text = "New Player";
        }
    }
    public void ItsMe()
    {
        state = "It's me";
    }





    // Player
    void DoItsMe()
    {
        Activate(Player);
        state = "Player";

        PlayerName.text = getName(currentPlayer);
        PlayerArticle.text = getArticle(currentPlayer);
        EnterName.Select();
        EnterName.text = getName(currentPlayer);
        EnterArticle.Select();
        EnterArticle.text = getArticle(currentPlayer);

        isName = getName(currentPlayer).Length > 0;
        isArticle = getArticle(currentPlayer).Length > 0;

        BoxName.SetActive(!isName);
        DoneName.SetActive(isName);
        BoxArticle.SetActive(!isArticle);
        DoneArticle.SetActive(isArticle);
    }
    public void ModifyName()
    {
        isName = false;
        BoxName.SetActive(true);
        DoneName.SetActive(false);
    }
    public void ModifyArticle()
    {
        isArticle = false;
        BoxArticle.SetActive(true);
        DoneArticle.SetActive(false);
    }
    public void ValidateName()
    {
        EnterName.Select();
        if (EnterName.text.Length > 0)
        {
            setName(currentPlayer, EnterName.text);
            PlayerName.text = EnterName.text;

            isName = true;
            BoxName.SetActive(false);
            DoneName.SetActive(true);
        }
    }
    public void ValidateArticle()
    {
        EnterArticle.Select();
        if (EnterArticle.text.Length > 0)
        {
            setArticle(currentPlayer, EnterArticle.text);
            PlayerArticle.text = EnterArticle.text;

            isArticle = true;
            BoxArticle.SetActive(false);
            DoneArticle.SetActive(true);
        }
    }
    void DoPlayer()
    {
        Done.SetActive(isArticle && isName);
    }
    public void DonePlayer()
    {
        state = "Done";

        updateNumbers();
        Sort();
    }




    // End
    void DoMain()
    {
        Activate(End);
        state = "End";
    }
    void DoEnd()
    {
        Plus.SetActive(numberPlayers < 5);
        for (int i = 0; i < 5; i++)
        {
            Lines[i].SetActive(numberPlayers > i);
            lineNames[i].text = getName(i + 1);
        }
        Play.SetActive((numberArticles == numberPlayers) && (numberPlayers > 1));

    }
    public void ModifyPlayer1()
    {
        ModifyPlayer(1);
    }
    public void ModifyPlayer2()
    {
        ModifyPlayer(2);
    }
    public void ModifyPlayer3()
    {
        ModifyPlayer(3);
    }
    public void ModifyPlayer4()
    {
        ModifyPlayer(4);
    }
    public void ModifyPlayer5()
    {
        ModifyPlayer(5);
    }
    public void ModifyPlayer(int i)
    {
        currentPlayer = i;
        state = "Ask";
    }
    public void NewPlayer()
    {
        currentPlayer = numberPlayers + 1;
        state = "Ask";
    }
    public void RemovePlayer1()
    {
        RemovePlayer(1);
    }
    public void RemovePlayer2()
    {
        RemovePlayer(2);
    }
    public void RemovePlayer3()
    {
        RemovePlayer(3);
    }
    public void RemovePlayer4()
    {
        RemovePlayer(4);
    }
    public void RemovePlayer5()
    {
        RemovePlayer(5);
    }
    public void RemovePlayer(int i)
    {
        setName(i, "");
        setArticle(i, "");
        updateNumbers();
        Sort();
    }
    public void Choose()
    {
        state = "Choose";
    }





    // Card
    public void DoChoose()
    {
        Activate(Card);
        state = "Card";

        int choice = Random.Range(1, numberPlayers + 1);
        ChosenArticle.text = getArticle(choice);
        setArticle(choice, "");
        updateNumbers();
    }
    public void Exit()
    {
        state = "Main";
    }





    // Update is called once per frame
    void Update()
    {
        if (state == "Start")
        {
            DoStart();
        }
        if (state == "Exit Welcome")
        {
            DoExitWelcome();
        }
        if (state == "Done")
        {
            DoDone();
        }
        if (state == "Ask")
        {
            DoAsk();
        }
        if (state == "Main")
        {
            DoMain();
        }
        if (state == "It's me")
        {
            DoItsMe();
        }
        if (state == "Player")
        {
            DoPlayer();
        }
        if (state == "End")
        {
            DoEnd();

        }
        if (state == "Choose")
        {
            DoChoose();

        }
    }
}



