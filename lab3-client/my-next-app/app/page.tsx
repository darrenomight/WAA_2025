import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <p>Welcome! Navigate to:</p>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/protected">Protected Page</Link></li>
      </ul>
    </div>
  );
}
