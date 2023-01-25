import React, { useState, useEffect } from 'react'

import CHALLENGER from './rankimg/CHALLENGER.png'
import GRANDMASTER from './rankimg/GRANDMASTER.png'
import MASTER from './rankimg/MASTER.png'
import DIAMOND from './rankimg/DIAMOND.png'
import PLATINUM from './rankimg/PLATINUM.png'
import GOLD from './rankimg/GOLD.png'
import SILVER from './rankimg/SILVER.png'
import BRONZE from './rankimg/BRONZE.png'
import IRON from './rankimg/IRON.png'
import UNRANKED from './rankimg/UNRANKED.png'
import 'bulma/css/bulma.min.css';
import './App.css';
function App() {
  const [matches, setMatches] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [Flex, setFlex] = useState({});
  const [Main, setMain] = useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  const [summonerName, setSummonerName] = useState('');

  useEffect(() => {
    console.log(matches);
  }, [matches]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (summonerName) {
      fetch(`/members/${summonerName}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(data => {
          setPlayerData(data.player_data);
          setMain(data.main);
          setMatches(data.matches);
          setFlex(data.flex)
          console.log(matches);
        })
        .catch(error => {
          console.log(error);
          alert("Error fetching data");
        });
    }
  }
  const toggleExpand = matchId => {
    if (expandedRows.includes(matchId)) {
      setExpandedRows(expandedRows.filter(id => id !== matchId));
    } else {
      setExpandedRows([...expandedRows, matchId]);
    }
  }
  return (
    <div class="section">
      <div className="App">
        <form>
          <label>
            Summoner Name:
            <input type="text" value={summonerName} onChange={e => setSummonerName(e.target.value)} />
          </label>
          <button class="button is-info" type="submit" onClick={handleSubmit}>Get Player Info</button>
        </form>
        {matches.length > 0 ? (
          <div>
            <section class="hero is-dark">
              <div class="hero-body">
                <div class="columns is-centered">
                  <div class="column is-1">
                    <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${playerData.icon}.png`} alt="Player Icon"></img>
                    <br></br>
                    <div class="box has-background-dark has-text-white has-text-centered has-text-weight-normal">
                      Level {playerData.level}
                    </div>
                  </div>
                  <div class="column is-11">
                    <h1 class="title">{playerData.summonerName}</h1>
                  </div>
                </div>

              </div>
            </section>

            <p></p>
            <br></br>

            <div class="columns is-centered">

              <div class="column is-one-fourth">

                <div class="box has-background-dark has-text-white has-text-weight-normal">
                  <h1>Ranked Solo</h1>
                  <div class="section">
                    <div class="columns is-centered">
                      <div class="column is one-fourth">
                        {RenderImage()}
                      </div>
                      <div class="column is-two-fourths">
                        <b>{playerData.tier} {playerData.rank}</b>
                        <br></br>
                        {playerData.leaguePoints} LP
                      </div>
                      <div class="column is-one-fourth">
                        {playerData.wins}W {playerData.losses}L
                        <br></br>
                        Win Rate {playerData.winrate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div class="box has-background-dark has-text-white has-text-weight-normal">
                  <h1>Ranked Flex</h1>
                  {Flex.tier !== "none" &&
                    < div class="section">
                      <div class="columns is-centered">
                        <div class="column is one-fourth">
                          {RenderFlexImage()}
                        </div>
                        <div class="column is-two-fourths">
                          <b>{Flex.tier} {Flex.rank}</b>
                          <br></br>
                          {Flex.leaguePoints} LP
                        </div>
                        <div class="column is-one-fourth">
                          {Flex.wins}W {Flex.losses}L
                          <br></br>
                          Win Rate {Flex.winrate}%
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div class="box has-background-dark has-text-white has-text-weight-normal">
                  Top 5 Champions
                  <div class="columns is-centered">
                    <div class="column is-one-third">
                      Champion Name<br></br>
                      CS
                    </div>
                    <div class="column is-one-third">
                      : KDA<br></br>
                      Kills / Deaths / Assists
                    </div>
                    <div class="column is-one-third">
                      Win rate%<br></br>
                      NumGames Played
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-two-thirds">
                <div>
                  <h3>Match History:</h3>
                  <tbody>
   <div className="layout-container">
   {Main.map((match, index) => (
      <tr>
         
            <div className="rec">
            <div className="rec-left">
            <div className="champion-spells-runes-container">
   <div className="champion-container">
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${match.champion_name}.png`} alt="Champion Icon" />
   </div>
   <div className="spells-runes">
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/spell/${match.spell1}.png`} alt="Spell 1" />
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/spell/${match.spell2}.png`} alt="Spell 2" />
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/rune/${match.rune1}.png`} alt="Rune 1" />
      <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/rune/${match.rune2}.png`} alt="Rune 2" />
   </div>
   <div className="items-container">
      {match.item0 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item0}.png`} alt="Item 0" /> : null}
      {match.item1 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item1}.png`} alt="Item 1" /> : null}
      {match.item2 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item2}.png`} alt="Item 2" /> : null}
      {match.item3 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item3}.png`} alt="Item 3" /> : null}
      {match.item4 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item4}.png`} alt="Item 4" /> : null}
      {match.item5 !== 0 ? <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item5}.png`} alt="Item 5" /> : null}
   </div>
</div>
</div>
   <div className="rec-right">
      <div className="kda">
      <span className="kills">{match.kills}</span>/<span className="deaths">{match.deaths}</span>/<span className="assists">{match.assists}</span>
</div>
<div className="player-info">
   <div className="player-name">{match.summoner_name}</div>
   <img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${match.profile_icon_id}.png`} alt="Player Profile Icon" />
</div>
</div>
</div>

         
      </tr>
   ))}
   </div>
</tbody>
                

                </div>
              </div>

            </div>

          </div>
        ) : null}
      </div>
    </div >
  )
  function RenderImage() {
    if (playerData.queueType !== "RANKED_SOLO_5x5") {
      return <img src={UNRANKED} alt="Rank" />
    }
    switch (playerData.tier) {
      case 'CHALLENGER':
        return <img src={CHALLENGER} alt="Rank" />
      case 'GRANDMASTER':
        return <img src={GRANDMASTER} alt="Rank" />
      case 'MASTER':
        return <img src={MASTER} alt="Rank" />
      case 'DIAMOND':
        return <img src={DIAMOND} alt="Rank" />
      case 'PLATINUM':
        return <img src={PLATINUM} alt="Rank" />
      case 'GOLD':
        return <img src={GOLD} alt="Rank" />
      case 'SILVER':
        return <img src={SILVER} alt="Rank" />
      case 'BRONZE':
        return <img src={BRONZE} alt="Rank" />
      case 'IRON':
        return <img src={IRON} alt="Rank" />
      default:
        return <img src={UNRANKED} alt="Rank" />
    }
  }
  function RenderFlexImage() {
    if (Flex.queueType !== "RANKED_FLEX_SR") {
      return <img src={UNRANKED} alt="Rank" />
    }
    switch (Flex.tier) {
      case 'CHALLENGER':
        return <img src={CHALLENGER} alt="Rank" />
      case 'GRANDMASTER':
        return <img src={GRANDMASTER} alt="Rank" />
      case 'MASTER':
        return <img src={MASTER} alt="Rank" />
      case 'DIAMOND':
        return <img src={DIAMOND} alt="Rank" />
      case 'PLATINUM':
        return <img src={PLATINUM} alt="Rank" />
      case 'GOLD':
        return <img src={GOLD} alt="Rank" />
      case 'SILVER':
        return <img src={SILVER} alt="Rank" />
      case 'BRONZE':
        return <img src={BRONZE} alt="Rank" />
      case 'IRON':
        return <img src={IRON} alt="Rank" />
      default:
        return <img src={UNRANKED} alt="Rank" />
    }
  }
}

export default App;