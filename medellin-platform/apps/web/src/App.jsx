import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() {
    const email = prompt("Email for magic link:");
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for the sign-in link.");
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function fetchMe() {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMe(await res.json());
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Medellín Platform (Web)</h1>
      {!session ? (
        <button onClick={signIn}>Sign in (magic link)</button>
      ) : (
        <>
          <p>
            Signed in as <b>{session.user?.email}</b>
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchMe}>Call API /users/me</button>
            <button onClick={signOut}>Sign out</button>
          </div>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: 12,
              marginTop: 12,
            }}
          >
            {JSON.stringify(me, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
