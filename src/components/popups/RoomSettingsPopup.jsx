import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Copy, Check, Trash2, Shield, Eye, RefreshCw, Clock } from "lucide-react";
import { getRoomMembers, updateUserRole, removeRoomUser } from "../../api/rooms/roomUsers";
import { updateRoomName, updatePrivateStatus } from "../../api/rooms/rooms";
import { regenerateInvite } from "../../api/invites";
import ConfirmPopup from "./ConfirmPopup";

const ROLE_VIEWER = 8;
const ROLE_EDITOR = 9;
const ROLE_OWNER  = 10;

const ROLE_LABEL = { [ROLE_VIEWER]: "Viewer", [ROLE_EDITOR]: "Editor", [ROLE_OWNER]: "Owner" };

const EXPIRY_OPTIONS = [
    { label: "1 hour",   hours: 1 },
    { label: "24 hours", hours: 24 },
    { label: "7 days",   hours: 24 * 7 },
    { label: "30 days",  hours: 24 * 30 },
    { label: "Never",    hours: null },
];

function RoleIcon({ role }) {
    if (role === ROLE_OWNER)  return <Shield size={14} className="text-[#77f298]" />;
    if (role === ROLE_EDITOR) return <Shield size={14} className="text-white/40" />;
    return <Eye size={14} className="text-white/30" />;
}

function formatExpiry(expiresAt) {
    if (!expiresAt) return "Never expires";
    const d = new Date(expiresAt);
    if (d < new Date()) return "Expired";
    return `Expires ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
}

export default function RoomSettingsPopup({ isOpen, onClose, roomId, roomName, isPrivate, inviteData: initialInviteData, currentUserId, userRole, onRoomDeleted, onRoomRenamed, onInviteRegenerated }) {
    const [tab, setTab] = useState("invite");
    const [name, setName] = useState(roomName);
    const [privateRoom, setPrivateRoom] = useState(isPrivate);
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmKick, setConfirmKick] = useState(null);
    const [saving, setSaving] = useState(false);
    const [inviteData, setInviteData] = useState(initialInviteData);
    const [selectedExpiry, setSelectedExpiry] = useState(null); // hours or null
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setName(roomName);
        setPrivateRoom(isPrivate);
        setInviteData(initialInviteData);
    }, [isOpen, roomName, isPrivate, initialInviteData]);

    useEffect(() => {
        if (!isOpen || tab !== "members") return;
        setLoadingMembers(true);
        getRoomMembers(roomId)
            .then(setMembers)
            .catch(console.error)
            .finally(() => setLoadingMembers(false));
    }, [isOpen, tab, roomId]);

    if (!isOpen) return null;

    const isExpired = inviteData?.expires_at && new Date(inviteData.expires_at) < new Date();
    const shareUrl = inviteData ? `${window.location.origin}/room/${inviteData.link}` : "";

    const handleCopyCode = () => {
        if (!inviteData || isExpired) return;
        navigator.clipboard.writeText(inviteData.link).then(() => {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        });
    };

    const handleCopyLink = () => {
        if (isExpired) return;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        });
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            const expiresAt = selectedExpiry != null
                ? new Date(Date.now() + selectedExpiry * 60 * 60 * 1000).toISOString()
                : null;
            const newInvite = await regenerateInvite(roomId, expiresAt);
            setInviteData(newInvite);
            onInviteRegenerated?.(newInvite);
        } catch (err) {
            console.error(err);
        } finally {
            setRegenerating(false);
        }
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            if (name.trim() !== roomName) {
                await updateRoomName(roomId, name.trim());
                onRoomRenamed?.(roomId, name.trim());
            }
            if (privateRoom !== isPrivate) {
                await updatePrivateStatus(roomId, privateRoom);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleRoleChange = async (uid, newRole) => {
        await updateUserRole(uid, roomId, Number(newRole));
        setMembers(prev => prev.map(m => m.UID === uid ? { ...m, role: Number(newRole) } : m));
    };

    const handleKick = async () => {
        if (!confirmKick) return;
        await removeRoomUser(confirmKick.uid, roomId);
        setMembers(prev => prev.filter(m => m.UID !== confirmKick.uid));
        setConfirmKick(null);
    };

    const isOwner = userRole === ROLE_OWNER;
    // Editors only see Invite; Owners see all tabs
    const TABS = [
        { id: "invite",  label: "Invite" },
        ...(isOwner ? [
            { id: "members", label: "Members" },
            { id: "general", label: "General" },
        ] : []),
    ];

    return createPortal(
        <>
        <div
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fade-in_150ms_ease-out]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-[#111211] rounded-2xl w-full max-w-md shadow-xl border border-white/10 animate-[slide-up_150ms_ease-out] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tab bar */}
                <div className="flex border-b border-white/10">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${tab === t.id ? 'text-[#77f298] border-b-2 border-[#77f298]' : 'text-white/40 hover:text-white/70'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* INVITE TAB */}
                    {tab === "invite" && (
                        <>
                            {/* Current invite code */}
                            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">Invite Code</p>
                            <button
                                onClick={handleCopyCode}
                                disabled={isExpired}
                                className={`w-full flex items-center justify-between gap-4 border rounded-xl px-5 py-4 transition-colors duration-150 group mb-1 ${isExpired ? 'bg-white/5 border-white/5 cursor-not-allowed opacity-50' : 'bg-white/5 border-white/10 hover:border-[#77f298]/50 cursor-pointer'}`}
                            >
                                <span className="text-[#77f298] text-2xl font-bold tracking-widest break-all text-left">
                                    {inviteData?.link ?? "—"}
                                </span>
                                <span className="shrink-0 text-white/40 group-hover:text-[#77f298] transition-colors">
                                    {copiedCode ? <Check size={18} /> : <Copy size={18} />}
                                </span>
                            </button>

                            {/* Expiry status */}
                            <div className={`flex items-center gap-1.5 mb-4 ml-1 text-xs ${isExpired ? 'text-red-400' : 'text-white/30'}`}>
                                <Clock size={12} />
                                {formatExpiry(inviteData?.expires_at)}
                            </div>

                            {/* Shareable link */}
                            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">Shareable Link</p>
                            <button
                                onClick={handleCopyLink}
                                disabled={isExpired}
                                className={`w-full flex items-center justify-between gap-4 border rounded-xl px-5 py-3 transition-colors duration-150 group mb-5 ${isExpired ? 'bg-white/5 border-white/5 cursor-not-allowed opacity-50' : 'bg-white/5 border-white/10 hover:border-[#77f298]/50 cursor-pointer'}`}
                            >
                                <span className="text-white/70 text-sm break-all text-left truncate">{shareUrl}</span>
                                <span className="shrink-0 text-white/40 group-hover:text-[#77f298] transition-colors">
                                    {copiedLink ? <Check size={18} /> : <Copy size={18} />}
                                </span>
                            </button>
                            {copiedCode && <p className="text-xs text-[#77f298] -mt-3 mb-3 ml-1">Copied!</p>}
                            {copiedLink && <p className="text-xs text-[#77f298] -mt-3 mb-3 ml-1">Copied!</p>}

                            {/* Regenerate section */}
                            <div className="border-t border-white/10 pt-4">
                                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3 ml-1">Regenerate Link</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {EXPIRY_OPTIONS.map(opt => (
                                        <button
                                            key={opt.label}
                                            onClick={() => setSelectedExpiry(opt.hours)}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${selectedExpiry === opt.hours ? 'bg-[#77f298] text-black' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-white/30">
                                        {selectedExpiry != null
                                            ? `New link expires in ${EXPIRY_OPTIONS.find(o => o.hours === selectedExpiry)?.label}`
                                            : "Select an expiry, then regenerate"}
                                    </p>
                                    <button
                                        onClick={handleRegenerate}
                                        disabled={selectedExpiry === undefined || regenerating}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
                                        {regenerating ? 'Generating…' : 'Regenerate'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end mt-5">
                                <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors cursor-pointer">
                                    Close
                                </button>
                            </div>
                        </>
                    )}

                    {/* MEMBERS TAB */}
                    {tab === "members" && (
                        <>
                            {loadingMembers ? (
                                <p className="text-white/40 text-sm text-center py-6">Loading members…</p>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                                    {members.map(m => {
                                        const isMe = m.UID === currentUserId;
                                        const displayName = m.users?.email ?? m.UID;
                                        return (
                                            <div key={m.UID} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                                                <RoleIcon role={m.role} />
                                                <span className="flex-1 text-sm text-white truncate">
                                                    {displayName}
                                                    {isMe && <span className="text-white/30 ml-1">(you)</span>}
                                                </span>
                                                {!isMe && (
                                                    <>
                                                        <select
                                                            value={m.role}
                                                            onChange={e => handleRoleChange(m.UID, e.target.value)}
                                                            className="bg-[#0C0A0A] border border-white/10 text-white text-xs rounded-lg px-2 py-1 cursor-pointer outline-none"
                                                        >
                                                            <option value={ROLE_VIEWER}>Viewer</option>
                                                            <option value={ROLE_EDITOR}>Editor</option>
                                                        </select>
                                                        <button
                                                            onClick={() => setConfirmKick({ uid: m.UID, name: displayName })}
                                                            className="p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                            aria-label="Remove member"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {isMe && (
                                                    <span className="text-xs text-white/30 px-2">{ROLE_LABEL[m.role]}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="flex justify-end mt-5">
                                <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors cursor-pointer">
                                    Close
                                </button>
                            </div>
                        </>
                    )}

                    {/* GENERAL TAB */}
                    {tab === "general" && (
                        <>
                            <label className="block text-white/40 text-xs font-semibold uppercase tracking-widest mb-1.5 ml-1">Room Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full rounded-lg bg-[#0C0A0A] border border-white/10 text-white placeholder-gray-500 px-3 py-2 text-sm outline-none focus:border-[#77f298]/60 transition-colors mb-4"
                            />

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-white font-medium">Private Room</p>
                                    <p className="text-xs text-white/40 mt-0.5">Only members can join via invite</p>
                                </div>
                                <button
                                    onClick={() => setPrivateRoom(p => !p)}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${privateRoom ? 'bg-[#77f298]' : 'bg-white/20'}`}
                                >
                                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${privateRoom ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={15} />
                                    Delete Room
                                </button>
                                <div className="flex gap-2">
                                    <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveGeneral}
                                        disabled={saving || !name.trim()}
                                        className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#77f298] text-black hover:bg-[#5ee07e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {saving ? "Saving…" : "Save"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        <ConfirmPopup
            isOpen={confirmDelete}
            title="Delete room?"
            message="This will permanently delete the room and remove all members. This cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => { setConfirmDelete(false); onClose(); onRoomDeleted?.(roomId); }}
            onCancel={() => setConfirmDelete(false)}
        />

        <ConfirmPopup
            isOpen={!!confirmKick}
            title={`Remove ${confirmKick?.name ?? "member"}?`}
            message="They will need to be re-invited to rejoin."
            confirmLabel="Remove"
            onConfirm={handleKick}
            onCancel={() => setConfirmKick(null)}
        />
        </>,
        document.body
    );
}
