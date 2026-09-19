import { useState } from 'react';

function AuthorSearchForm({ onSearch, isLoading }) {
  const [author, setAuthor] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = author.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="d-flex gap-2 mb-3" onSubmit={handleSubmit} aria-label="Buscar planos por autor">
      <input
        type="text"
        className="form-control"
        placeholder="Nombre del autor"
        aria-label="Nombre del autor"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />
      <button type="submit" className="btn btn-primary" disabled={isLoading || !author.trim()}>
        {isLoading ? 'Buscando…' : 'Buscar'}
      </button>
    </form>
  );
}

export default AuthorSearchForm;
