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

function App() {
  const [matches, setMatches] = useState({});
  const [playerData, setPlayerData] = useState({});
  const [Flex, setFlex] = useState({});
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-one-fourth">

                <div class="box has-background-dark has-text-white has-text-weight-normal">
                  <h1>Flex</h1>
                  <div class="section">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div class="column is-two-thirds">
          <div>
                  <h3>Match History:</h3>
            <table className="table is-bordered is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Match ID</th>
                <th>Summoner Name</th>
                <th>Champion Name</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>Assists</th>
                <th>Total Minions Killed</th>
                <th>Item 0</th>
                <th>Item 1</th>
                <th>Item 2</th>
                <th>Item 3</th>
                <th>Item 4</th>
                <th>Item 5</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => (
                <>
                  {index !== 0 && <div className="separator"></div>}
                  <tr key={match.match_id} onClick={() => toggleExpand(match.match_id)}>
                    <td>{match.match_id}</td>
                    {expandedRows.includes(match.match_id) ? (
                        <>
                          <td>{match.champion_name}</td>
                          <td>{match.kills}</td>
                          <td>{match.deaths}</td>
                          <td>{match.assists}</td>
                          <td>{match.total_minions_killed}</td>
                          {match.item0 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item0}.png`} alt="Item 0" /></td> : <td></td>}
                          {match.item1 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item1}.png`} alt="Item 1" /></td> : <td></td>}
                          {match.item2 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item2}.png`} alt="Item 2" /></td> : <td></td>}
                          {match.item3 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item3}.png`} alt="Item 3" /></td> : <td></td>}
                          {match.item4 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item4}.png`} alt="Item 4" /></td> : <td></td>}
                          {match.item5 !== 0 ? <td><img src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${match.item5}.png`} alt="Item 5" /></td> : <td></td>}
                        </>
                      ) : (
                            <td colSpan={7}>Click to expand</td>
                          )}
                    </tr>
                    <div className="separator"></div>
                  </>
                ))}
              </tbody>
            </table>
            </div>
              </div>
          </div>
        ) : (
            <div>Enter a summoner name to see player information</div>
          )}
      </div>
    </div>
  );
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