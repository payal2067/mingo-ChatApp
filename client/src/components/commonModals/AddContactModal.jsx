import React, { useState } from "react";
import toast from "react-hot-toast";
import { UserPlus, Phone, User, X, Check } from "lucide-react";
import api from "../../config/api";

const AddContactModal = ({ open, onClose, onContactAdded }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanNum = mobileNumber.replace(/\D/g, "");
    if (!cleanNum || cleanNum.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user/add-contact", {
        mobileNumber: cleanNum.slice(-10),
        contactName: contactName.trim() || undefined,
      });

      toast.success(res.data?.message || "Contact added successfully!");
      if (onContactAdded && res.data?.data) {
        onContactAdded(res.data.data);
      }
      setMobileNumber("");
      setContactName("");
      onClose();
    } catch (error) {
      console.error("Add contact error:", error);
      const msg =
        error.response?.data?.message ||
        "Could not add contact. Please make sure they are registered on Mingo.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="card bg-base-100 shadow-2xl border border-base-content/10 max-w-md w-full relative overflow-hidden">
        {/* Header decoration */}
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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-base-content">
                Save New Contact
              </h3>
              <p className="text-xs text-base-content/60">
                Add friend by their registered mobile number
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Mobile Number Input */}
            <div>
              <label className="label pb-1">
                <span className="label-text font-semibold text-xs flex items-center gap-1.5 text-base-content/80">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  Mobile Number (Required)
                </span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-base-content/50 pointer-events-none select-none">
                  +91
                </span>
                <input
                  type="tel"
                  autoFocus
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  className="input input-bordered w-full pl-12 pr-4 text-sm font-medium focus:input-primary"
                  required
                />
              </div>
              <span className="text-[11px] text-base-content/50 mt-1 block">
                The 10-digit number they registered on Mingo with
              </span>
            </div>

            {/* Contact Name Input */}
            <div>
              <label className="label pb-1">
                <span className="label-text font-semibold text-xs flex items-center gap-1.5 text-base-content/80">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  Contact Name (Optional)
                </span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rahul, Pooja"
                className="input input-bordered w-full text-sm font-medium focus:input-primary"
              />
              <span className="text-[11px] text-base-content/50 mt-1 block">
                Leave empty to use their registered Mingo name
              </span>
            </div>

            {/* Action buttons */}
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
                disabled={loading || mobileNumber.length < 10}
                className="btn bg-emerald-500 hover:bg-emerald-600 text-white flex-1 text-sm rounded-xl gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save Contact
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

export default AddContactModal;

