import Link from "next/link";
import { useRouter } from "next/router";
import { useState, FormEvent } from "react";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="header">
      <Link href="/" className="header__logo">
        🤖 <span>AI</span> News Hub
      </Link>

      <form className="header__search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search AI news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <nav className="header__nav">
        <Link href="/">Home</Link>
        <Link href="/search?q=">Browse</Link>
        <Link href="/admin">Admin</Link>
      </nav>
    </header>
  );
}
