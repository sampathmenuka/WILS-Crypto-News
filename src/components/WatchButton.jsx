import useWatchlist from '../hooks/useWatchlist';

// Star toggle for adding/removing a coin from the watchlist.
function WatchButton({ id, name, className = '' }) {
  const { isWatched, toggle } = useWatchlist();
  const active = isWatched(id);

  return (
    <button
      type="button"
      className={`watch-btn ${active ? 'active' : ''} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`}
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <i className={`fa-${active ? 'solid' : 'regular'} fa-star`}></i>
    </button>
  );
}

export default WatchButton;
