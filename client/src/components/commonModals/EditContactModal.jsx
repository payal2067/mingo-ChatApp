import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Pencil, User, Phone, X, Check } from "lucide-react";
import api from "../../config/api";

const EditContactModal = ({ open, onClose, friend, onContactUpdated }) => {
  const [contactName, setContactName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (friend) {
      setContactName(friend.displayName || friend.fullName || "");
    }
  }, [friend]);

  if (!open || !friend) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactName.trim()) {
      toast.error("Contact name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/user/edit-contact/${friend._id}`, {
        contactName: contactName.trim(),
      });

      const updatedName = res.data?.data?.displayName || contactName.trim();
      toast.success(res.data?.message || "Contact name updated!");

      if (onContactUpdated) {
        onContactUpdated({
          contactUserId: friend._id,
          displayName: updatedName,
        });
      }

      onClose();
    } catch (error) {
      console.error("Edit contact error:", error);
      const msg =
        error.response?.data?.message || "Failed to update contact name";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="card bg-base-100 shadow-2xl border border-base-content/10 max-w-md w-full relative overflow-hidden">
        {/* Top accent border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <button
          onClick={onClose}
          disabled={loading}
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-4 text-base-content/60 hover:text-base-content"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="card-body p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">
                Edit Contact Name
              </h3>
              <p className="text-xs text-base-content/60">
                Change how this person appears in your chats
              </p>
            </div>
          </div>

          {/* Contact summary badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/60 border border-base-content/5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
              {(friend.displayName || friend.fullName)?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1 text-xs space-y-0.5">
              <p className="font-semibold text-base-content truncate">
                Registered as: {friend.fullName}
              </p>
              {(friend.savedMobileNumber || friend.mobileNumber) && (
                <p className="text-base-content/60 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-emerald-500" /> +91{" "}
                  {friend.savedMobileNumber || friend.mobileNumber}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label pb-1">
                <span className="label-text font-semibold text-xs flex items-center gap-1.5 text-base-content/80">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  Custom Display Name
                </span>
              </label>
              <input
                type="text"
                autoFocus
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter new contact name"
                className="input input-bordered w-full text-sm font-medium focus:input-primary"
                required
              />
              <span className="text-[11px] text-base-content/50 mt-1 block">
                This name is private and only visible in your Mingo app
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn btn-ghost flex-1 text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !contactName.trim()}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white flex-1 text-sm rounded-xl gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Name
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;
