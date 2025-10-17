// Simple mock news; could be replaced with real API later.
const MOCK_NEWS = [
  {id:1, title:'Bitcoin hits new monthly high', date:'2025-10-15', cat:'bitcoin', img:'Pictures/art1.jpg',
   summary:'BTC breaks resistance amid renewed institutional interest and ETF inflows.'},
  {id:2, title:'Ethereum upgrades advance scalability', date:'2025-10-14', cat:'ethereum', img:'Pictures/art1.jpg',
   summary:'Roadmap update highlights improvements to rollups and data availability.'},
  {id:3, title:'DeFi TVL climbs 12%', date:'2025-10-13', cat:'defi', img:'Pictures/art1.jpg',
   summary:'New protocols launch and yield strategies boost on-chain activity.'},
  {id:4, title:'Altcoin season indicators flash', date:'2025-10-12', cat:'altcoins', img:'Pictures/art1.jpg',
   summary:'Market breadth expands as mid-caps and gaming tokens rally.'},
  {id:5, title:'NFT volumes rebound', date:'2025-10-11', cat:'nfts', img:'Pictures/art1.jpg',
   summary:'Blue-chip collections see renewed demand; creators explore new formats.'}
];

(function(){
  const grid = document.getElementById('news-grid');
  const category = document.getElementById('category');

  function card(n){
    return `<article class="card" data-cat="${n.cat}">
      <img src="${n.img}" alt="${n.title}" />
      <div class="card-body">
        <div class="meta">${new Date(n.date).toLocaleDateString()}</div>
        <h3>${n.title}</h3>
        <p>${n.summary}</p>
        <a class="read-more" href="news.html#id-${n.id}">Read More →</a>
      </div>
    </article>`;
  }

  function render(){
    const val = (category?.value || 'all').toLowerCase();
    const items = MOCK_NEWS.filter(n => val === 'all' || n.cat === val);
    grid.innerHTML = items.map(card).join('');
  }

  if (category) category.addEventListener('change', render);
  render();
})();
