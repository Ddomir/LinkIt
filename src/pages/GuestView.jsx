import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import Room from "../components/Room";
import { getColors } from "../api/colors";
import { LogIn } from "lucide-react";

export default function GuestView({ inviteCode, onLogin }) {
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "private" | "notfound"
  const [roomId, setRoomId] = useState(null);
  const [COLOR_OPTIONS, setColorOptions] = useState({});
  const hasResolved = useRef(false);

  useEffect(() => {
    if (hasResolved.current) return;
    hasResolved.current = true;

    const resolve = async () => {
      try {
        const { data: invite, error } = await supabase
          .from("invites")
          .select("room_id, expires_at, rooms(is_private)")
          .eq("link", inviteCode)
          .single();

        if (error || !invite) { setStatus("notfound"); return; }
        if (invite.expires_at && new Date(invite.expires_at) < new Date()) { setStatus("expired"); return; }
        if (invite.rooms?.is_private) { setStatus("private"); return; }

        setRoomId(invite.room_id);
        setStatus("ok");
      } catch {
        setStatus("notfound");
      }
    };

    const fetchColors = async () => {
      try {
        const data = await getColors();
        const colorMap = {};
        data.forEach(item => {
          colorMap[item.id] = { background: `linear-gradient(to right, ${item.left_hex}, ${item.right_hex})` };
        });
        setColorOptions(colorMap);
      } catch {}
    };

    resolve();
    fetchColors();
  }, [inviteCode]);

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex items-center justify-center app-bg">
        <p className="text-[#77f298] text-xl">Loading…</p>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 app-bg room-panel">
        <p className="text-white/60 text-xl">This invite link has expired.</p>
        <p className="text-white/30 text-sm">Ask the room owner for a new link.</p>
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 app-bg room-panel">
        <p className="text-white/60 text-xl">Room not found.</p>
        <button onClick={onLogin} className="px-6 py-2 rounded-full bg-[#77f298] text-black font-semibold hover:bg-[#5ee07e] transition-colors cursor-pointer">
          Log in
        </button>
      </div>
    );
  }

  if (status === "private") {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 app-bg room-panel">
        <p className="text-white/60 text-xl">This room is private.</p>
        <button onClick={onLogin} className="px-6 py-2 rounded-full bg-[#77f298] text-black font-semibold hover:bg-[#5ee07e] transition-colors cursor-pointer">
          Log in to join
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex" style={{ background: 'var(--surface)' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col surface h-full w-72 shrink-0">
        <div className="px-5 pt-4 pb-2">
          <h3 className="text-xl font-bold tracking-wide">Rooms</h3>
        </div>
        <div className="flex-1 overflow-auto px-3 py-1">
          <p className="text-sm text-white/40 px-2 py-2">Viewing as guest</p>
        </div>
        <div className="flex items-center justify-end px-5 py-4">
          <button
            onClick={onLogin}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors duration-150 cursor-pointer"
            aria-label="Log in"
            title="Log in"
          >
            <LogIn size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 surface border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="LinksIt" className="w-5 h-5" />
          <span className="text-[#77f298] font-bold tracking-tight">LinksIt</span>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors cursor-pointer"
          aria-label="Log in"
        >
          <LogIn size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 min-w-0 h-full overflow-hidden lg:rounded-l-2xl lg:mt-0 mt-13">
        <Room roomId={roomId} COLOR_OPTIONS={COLOR_OPTIONS} readOnly={true} />
      </div>
    </div>
  );
}
