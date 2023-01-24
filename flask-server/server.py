from flask import Flask, jsonify, request
import mysql.connector
import requests

app = Flask(__name__)

# API key for the league server
api_key = "RGAPI-9ba3c22b-f0ae-47fc-8dd4-7ba991f9836e"

# Members API route
@app.route("/members/<summoner_name>")
def members(summoner_name):
    # Connect to the MySQL server
    cnx = mysql.connector.connect(user='root', password='Clol1234', host='localhost', database='league_data')
    cursor = cnx.cursor()
    # Create the matches table if it doesn't exist
    table_create = '''CREATE TABLE IF NOT EXISTS matches (
        match_id VARCHAR(255),
        summoner_name VARCHAR(255),
        champion_name VARCHAR(255),
        kills INT,
        deaths INT,
        assists INT,
        total_minions_killed INT,
        item0 INT,
        item1 INT,
        item2 INT,
        item3 INT,
        item4 INT,
        item5 INT
        )'''
        
    cursor.execute(table_create)
    cnx.commit()
    
    region = "NA1"
    headers = {'X-Riot-Token': api_key}
    url = f'https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify(error=response.status_code)
    player_info = response.json()
    player_id = player_info['id']
    puu_id = player_info['puuid']


    player_data_solo = {"queueType": "none", "tier": "none", "rank": "0",
                        "summonerName": summoner_name, "leaguePoints": 0,
                        "wins": 0, "losses": 0, "veteran": False,
                        "inactive": False, "freshBlood": False, "hotStreak": False, "winrate" : 0, 'icon':player_info["profileIconId"],'level':player_info["summonerLevel"]}
    player_data_flex = {"queueType": "none", "tier": "none", "rank": "0",
                        "leaguePoints": 0,
                        "wins": 0, "losses": 0, "veteran": False,
                        "inactive": False, "freshBlood": False, "hotStreak": False, "winrate" : 0}

    url= f'https://{region}.api.riotgames.com/lol/league/v4/entries/by-summoner/{player_id}'
    headers = {'X-Riot-Token': api_key}
    player_response = requests.get(url, headers=headers)
    if player_response.status_code != 200:
        return jsonify(error=player_response.status_code)
    player = player_response.json()
    counter = 0
    for i in player:
      if ((i["queueType"] == "RANKED_SOLO_5x5") or (i["queueType"] == "RANKED_FLEX_SR")):
        queueType = i['queueType']
        tier = i["tier"]
        rank = i["rank"]
        summonerId = i["summonerId"]
        summonerName = i["summonerName"]
        leaguePoints = i["leaguePoints"]
        wins = i["wins"]
        losses = i["losses"]
        veteran = i["veteran"]
        inactive = i["inactive"]
        freshBlood = i["freshBlood"]
        hotStreak = i["hotStreak"]
        if 0 != i["losses"]:
          winrate = ((i["wins"]/(i["losses"]+i["wins"])) * 100)//1
        else:
            winrate = 100
        if(queueType == "RANKED_SOLO_5x5"):    
          player_data_solo = {"queueType": queueType, "tier": tier, "rank": rank,
                       "summonerName": summonerName, "leaguePoints": leaguePoints,
                        "wins": wins, "losses": losses, "veteran": veteran,
                        "inactive": inactive, "freshBlood": freshBlood, "hotStreak": hotStreak, "winrate" : winrate, 'icon':player_info["profileIconId"],'level':player_info["summonerLevel"]}
        elif(queueType == "RANKED_FLEX_SR"):    
          player_data_flex = {"queueType": queueType, "tier": tier, "rank": rank,
                        "leaguePoints": leaguePoints,
                        "wins": wins, "losses": losses, "veteran": veteran,
                        "inactive": inactive, "freshBlood": freshBlood, "hotStreak": hotStreak, "winrate" : winrate}
        conter += 1
    region = 'americas'
    url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puu_id}/ids?type=ranked&start=0&count=10'
    headers = {'X-Riot-Token': api_key}
    match_history_response = requests.get(url, headers=headers)
    if match_history_response.status_code != 200:
        return jsonify(error=match_history_response.status_code)
    match_history = match_history_response.json()
    select_match_id = "SELECT match_id FROM matches WHERE match_id = %s"
    match_data = []
    if match_history:
        for match in match_history:
            cursor.execute(select_match_id, (match,))
            cursor.fetchall()
            match_in_db = cursor.fetchone()
            if match_in_db is None:
                url = f'https://{region}.api.riotgames.com/lol/match/v5/matches/{match}'
                headers = {'X-Riot-Token': api_key}
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    match_s = response.json()
                    for match_single in match_s["info"]["participants"]:
                        summoner_name = match_single['summonerName']
                        champion_name = match_single['championName']
                        kills = match_single['kills']
                        deaths = match_single['deaths']
                        assists = match_single['assists']
                        total_minions_killed = match_single['totalMinionsKilled']
                        items = [match_single['item0'], match_single['item1'], match_single['item2'], match_single['item3'], match_single['item4'], match_single['item5']]
                        for i in range(len(items)-1):
                            for j in range(i+1,len(items)):
                                if items[i]<items[j]:
                                    items[i],items[j]=items[j],items[i]
                        item0 = items[0]
                        item1 = items[1]
                        item2 = items[2]
                        item3 = items[3]
                        item4 = items[4]
                        item5 = items[5]
                        if match_single['summonerId'] == player_id:
                            kda = (kills + assists) / deaths if deaths != 0 else (kills + assists)
                            farm = total_minions_killed
                        # Insert the match data into the MySQL table
                        cursor.execute("INSERT INTO matches (match_id, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5))
                        cnx.commit()
                        match_data.append((match, summoner_name, champion_name, kills, deaths, assists, total_minions_killed, item0, item1, item2, item3, item4, item5))
    cursor.close()
    cnx.close()

    return jsonify({"flex":player_data_flex,"player_data":player_data_solo, "matches": [{'match_id': match[0], 'summoner_name': match[1], 'champion_name': match[2], 'kills': match[3], 'deaths': match[4], 
        'assists': match[5], 'total_minions_killed': match[6], 'item0': match[7], 'item1': match[8], 'item2': match[9], 'item3': match[10], 
        'item4': match[11], 'item5': match[12]} for match in match_data]})

if __name__ == "__main__":
    app.run(debug=True)